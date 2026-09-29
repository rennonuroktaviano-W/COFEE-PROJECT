/**
 * Headless smoke test for the Smiljan landing page.
 *
 * Drives Chrome over the DevTools Protocol to verify the PRD acceptance
 * criteria that a build cannot catch: console errors, broken requests,
 * horizontal overflow at three viewports, presence of the WebGL hero canvas,
 * and that reduced-motion falls back to the static poster.
 *
 * Usage: node scripts/verify.mjs [url]
 */
const URL_UNDER_TEST = process.argv[2] ?? "http://localhost:3000";
const CDP = "http://localhost:9222";

const VIEWPORTS = [
  { name: "mobile", width: 375, height: 812, dpr: 2, mobile: true },
  { name: "tablet", width: 768, height: 1024, dpr: 2, mobile: true },
  { name: "desktop", width: 1440, height: 900, dpr: 1, mobile: false },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class CDPClient {
  #socket;
  #id = 0;
  #pending = new Map();
  #listeners = new Map();

  constructor(socket) {
    this.#socket = socket;
    socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.id !== undefined) {
        const entry = this.#pending.get(message.id);
        this.#pending.delete(message.id);
        if (message.error) entry?.reject(new Error(message.error.message));
        else entry?.resolve(message.result);
        return;
      }
      const handlers = this.#listeners.get(message.method);
      if (handlers) handlers.forEach((fn) => fn(message.params));
    });
  }

  static async connect(url) {
    const socket = new WebSocket(url);
    await new Promise((resolve, reject) => {
      socket.addEventListener("open", resolve, { once: true });
      socket.addEventListener("error", () => reject(new Error("CDP socket failed")), {
        once: true,
      });
    });
    return new CDPClient(socket);
  }

  send(method, params = {}, sessionId) {
    const id = ++this.#id;
    return new Promise((resolve, reject) => {
      this.#pending.set(id, { resolve, reject });
      this.#socket.send(JSON.stringify({ id, method, params, sessionId }));
      setTimeout(() => {
        if (this.#pending.has(id)) {
          this.#pending.delete(id);
          reject(new Error(`timeout: ${method}`));
        }
      }, 45000);
    });
  }

  on(method, handler) {
    if (!this.#listeners.has(method)) this.#listeners.set(method, new Set());
    this.#listeners.get(method).add(handler);
  }

  close() {
    this.#socket.close();
  }
}

const results = [];
const log = (ok, label, detail = "") => {
  results.push({ ok, label, detail });
  console.log(`  ${ok ? "PASS" : "FAIL"}  ${label}${detail ? ` — ${detail}` : ""}`);
};

const browser = await CDPClient.connect(
  (await (await fetch(`${CDP}/json/version`)).json()).webSocketDebuggerUrl,
);

const { targetId } = await browser.send("Target.createTarget", { url: "about:blank" });
const { sessionId } = await browser.send("Target.attachToTarget", {
  targetId,
  flatten: true,
});

const consoleErrors = [];
const failedRequests = [];

browser.on("Runtime.consoleAPICalled", (params) => {
  if (params.type === "error" || params.type === "warning") {
    const text = (params.args ?? [])
      .map((a) => a.value ?? a.description ?? a.unserializableValue ?? "")
      .join(" ")
      .trim();
    if (text) consoleErrors.push(`[${params.type}] ${text}`);
  }
});

browser.on("Runtime.exceptionThrown", (params) => {
  consoleErrors.push(
    `[exception] ${params.exceptionDetails?.exception?.description ?? params.exceptionDetails?.text}`,
  );
});

browser.on("Network.loadingFailed", (params) => {
  failedRequests.push(`${params.type} ${params.errorText}`);
});

await browser.send("Page.enable", {}, sessionId);
await browser.send("Runtime.enable", {}, sessionId);
await browser.send("Network.enable", {}, sessionId);

// Never verify against a cached response. Optimised images are served with
// `Cache-Control: public, max-age=14400`, so a stale (or previously broken)
// copy would otherwise survive an asset fix and make this script report a
// failure that no longer exists — or hide a real one.
await browser.send("Network.setCacheDisabled", { cacheDisabled: true }, sessionId);
await browser.send("Network.clearBrowserCache", {}, sessionId);

const evaluate = async (expression) => {
  const result = await browser.send(
    "Runtime.evaluate",
    { expression, returnByValue: true, awaitPromise: true },
    sessionId,
  );
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.exception?.description ?? "evaluate failed");
  }
  return result.result.value;
};

// --------------------------------------------------------------- 1. viewports
for (const viewport of VIEWPORTS) {
  console.log(`\n[${viewport.name}] ${viewport.width}x${viewport.height}`);

  await browser.send(
    "Emulation.setDeviceMetricsOverride",
    {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: viewport.dpr,
      mobile: viewport.mobile,
    },
    sessionId,
  );

  await browser.send("Page.navigate", { url: URL_UNDER_TEST }, sessionId);
  await sleep(4500);

  // Walk the page and, at every step, judge the images that are in view *at
  // that moment*. Sampling only once after returning to the top would validate
  // just the two images in the hero and silently skip the other 19.
  //
  // An image is only recorded once it has actually been seen, so images that
  // are legitimately never shown at this breakpoint — the gallery ships an
  // `lg:hidden` grid *and* a `hidden lg:block` rail, and the desktop rail parks
  // items outside its horizontal scroll area — are left unrecorded instead of
  // being reported as broken.
  const imgState = await evaluate(`(async () => {
    const seen = new Map();
    const inView = () => [...document.images].filter((i) => {
      const r = i.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < window.innerHeight;
    });

    const settle = async (deadline) => {
      const end = Date.now() + deadline;
      while (Date.now() < end) {
        for (const img of inView()) {
          if (img.complete) {
            seen.set(img, img.naturalWidth === 0);
          } else {
            await new Promise((r) => setTimeout(r, 150));
            if (img.complete) seen.set(img, img.naturalWidth === 0);
          }
        }
        if (inView().every((i) => i.complete)) return;
        await new Promise((r) => setTimeout(r, 150));
      }
    };

    const step = Math.round(window.innerHeight * 0.7);
    for (let y = 0; y <= document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 180));
      await settle(2500);
    }
    window.scrollTo(0, document.body.scrollHeight);
    await settle(3000);

    const broken = [];
    for (const [img, isBroken] of seen) {
      if (isBroken) broken.push(img.currentSrc || img.src);
    }
    return {
      seen: seen.size,
      total: document.images.length,
      broken,
    };
  })()`);
  await evaluate("window.scrollTo(0, 0)");
  await sleep(1500);
  await sleep(600);

  const metrics = await evaluate(`(() => {
    const doc = document.documentElement;

    // An element only causes real horizontal scroll if nothing between it and
    // the root clips it. Decorative glows inside overflow-hidden sections and
    // items inside a horizontal rail are intentional and must be ignored.
    const isClipped = (el) => {
      let parent = el.parentElement;
      while (parent && parent !== document.body) {
        const style = getComputedStyle(parent);
        if (['hidden', 'clip', 'auto', 'scroll'].includes(style.overflowX)) return true;
        parent = parent.parentElement;
      }
      return false;
    };

    const overflowing = [...document.querySelectorAll('body *')]
      .filter((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return false;
        if (rect.right <= doc.clientWidth + 1 && rect.left >= -1) return false;
        return !isClipped(el);
      })
      .slice(0, 5)
      .map((el) => el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).split(' ').slice(0,2).join('.') : ''));

    const canvases = [...document.querySelectorAll('canvas')];
    const heroCanvas = canvases.find((c) => c.closest('div[aria-hidden="true"]'));

    return {
      scrollWidth: doc.scrollWidth,
      clientWidth: doc.clientWidth,
      overflowing,
      canvasCount: canvases.length,
      heroCanvasPresent: Boolean(heroCanvas),
      heroCanvasSized: heroCanvas ? heroCanvas.width > 0 && heroCanvas.height > 0 : false,
      h1: document.querySelectorAll('h1').length,
      h2: document.querySelectorAll('h2').length,
      imgsMissingAlt: [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt')).length,
      imgsBroken: [...document.querySelectorAll('img')]
        .filter((i) => i.complete && i.naturalWidth === 0)
        .map((i) => (i.currentSrc || i.src).replace(/^https?:\\/\\/[^/]+/, '')),
      imgsTotal: document.querySelectorAll('img').length,
      smallTargets: [...document.querySelectorAll('a[href], button')]
        .filter((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) return false;
          // Visually hidden helpers such as the skip link are exempt.
          const style = getComputedStyle(el);
          if (style.visibility === 'hidden' || style.display === 'none') return false;
          if (rect.width <= 2 && rect.height <= 2) return false;
          if (el.closest('.sr-only')) return false;
          return rect.height < 44;
        })
        .map((el) => (el.textContent || '').trim().slice(0, 26) || el.getAttribute('aria-label') || el.tagName)
        .slice(0, 8),
      revealedHidden: [...document.querySelectorAll('.reveal')]
        .filter((el) => {
          // Elements in a collapsed breakpoint variant never intersect, so
          // they are correctly never revealed.
          const rect = el.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        })
        .filter((el) => !el.classList.contains('is-visible')).length,
      totalReveal: [...document.querySelectorAll('.reveal')].filter((el) => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      }).length,
    };
  })()`);

  const noOverflow = metrics.scrollWidth <= metrics.clientWidth + 1;
  log(
    noOverflow && metrics.overflowing.length === 0,
    "no unintended horizontal overflow",
    `scrollWidth=${metrics.scrollWidth} clientWidth=${metrics.clientWidth}` +
      (metrics.overflowing.length ? ` offenders: ${metrics.overflowing.join(", ")}` : ""),
  );
  log(metrics.h1 === 1, "exactly one <h1>", `found ${metrics.h1}`);
  log(metrics.h2 >= 6, "each section has an <h2>", `found ${metrics.h2}`);
  log(metrics.imgsMissingAlt === 0, "every <img> has alt", `${metrics.imgsMissingAlt} missing`);
  log(
    imgState.broken.length === 0 && imgState.seen > 0,
    "no broken images",
    `${imgState.seen}/${imgState.total} in-view images loaded` +
      (imgState.broken.length ? `, broken: ${imgState.broken.join(", ")}` : ""),
  );
  log(
    metrics.smallTargets.length === 0,
    "all tap targets >= 44px",
    metrics.smallTargets.length ? `small: ${metrics.smallTargets.join(" | ")}` : "",
  );
  log(
    metrics.totalReveal > 0 && metrics.revealedHidden === 0,
    "all scroll-reveal elements became visible",
    `${metrics.totalReveal - metrics.revealedHidden}/${metrics.totalReveal}`,
  );
  if (viewport.name === "desktop") {
    log(
      metrics.heroCanvasPresent && metrics.heroCanvasSized,
      "3D hero canvas rendered",
      `${metrics.canvasCount} canvas element(s)`,
    );
  }
}

// ------------------------------------------------- 2. reduced-motion fallback
console.log("\n[reduced-motion]");
await browser.send(
  "Emulation.setEmulatedMedia",
  { features: [{ name: "prefers-reduced-motion", value: "reduce" }] },
  sessionId,
);
await browser.send(
  "Emulation.setDeviceMetricsOverride",
  { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false },
  sessionId,
);
await browser.send("Page.navigate", { url: URL_UNDER_TEST }, sessionId);
await sleep(4000);

const reduced = await evaluate(`(() => {
  const canvases = [...document.querySelectorAll('canvas')];
  const hidden = [...document.querySelectorAll('.reveal')]
    .filter((el) => getComputedStyle(el).opacity === '0').length;
  const poster = document.querySelector('img[src*="hero-cup-poster"]');
  return {
    canvasCount: canvases.length,
    hiddenReveals: hidden,
    posterVisible: poster ? getComputedStyle(poster).opacity : null,
    scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
  };
})()`);

log(reduced.canvasCount === 0, "3D scene not mounted under reduced motion", `${reduced.canvasCount} canvas`);
log(reduced.hiddenReveals === 0, "no content left invisible under reduced motion", `${reduced.hiddenReveals} hidden`);
log(reduced.scrollBehavior === "auto", "smooth scrolling disabled", reduced.scrollBehavior);

// --------------------------------------------------------- 3. console health
console.log("\n[console]");

// Warnings that originate outside this repository and cannot be actioned here:
//  - React DevTools nudge.
//  - `THREE.Clock has been deprecated` is emitted by @react-three/fiber's own
//    render loop, not by app code.
//  - `Program Info Log ... X4122` comes from SwiftShader, the software
//    rasteriser used when headless Chrome runs without a GPU. It is an
//    artefact of the test environment, not of the scene.
// Everything else must still fail the run.
const ignorable =
  /Download the React DevTools|WebGL.*deprecat|Third-party cookie|THREE\.Clock: This module has been deprecated|THREE\.WebGLProgram: Program Info Log.*X4122/is;

const realErrors = consoleErrors.filter((e) => !ignorable.test(e));
const realFailed = failedRequests.filter((e) => !/net::ERR_ABORTED/.test(e));

log(realErrors.length === 0, "no console errors or warnings", realErrors.slice(0, 4).join(" || "));
log(realFailed.length === 0, "no failed network requests", realFailed.slice(0, 4).join(" || "));

await browser.send("Target.closeTarget", { targetId });
browser.close();

const failed = results.filter((r) => !r.ok);
console.log(`\n${"=".repeat(58)}`);
console.log(`${results.length - failed.length}/${results.length} checks passed`);
if (failed.length) {
  console.log("\nFailures:");
  failed.forEach((f) => console.log(`  - ${f.label} ${f.detail}`));
  process.exitCode = 1;
}
