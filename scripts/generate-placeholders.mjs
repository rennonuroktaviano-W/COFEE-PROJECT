/**
 * Generates the local placeholder artwork used by the Smiljan landing page.
 *
 * These are stand-ins for licensed photography (PRD 12). They are produced from
 * code so the repository stays self-contained and nothing depends on a remote
 * image URL. Replace the files in /public/placeholders with real photos when the
 * client releases them — no component changes required.
 *
 * Run: node scripts/generate-placeholders.mjs
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "placeholders");

/** Palette mirrors app/globals.css (PRD 4.2). */
const C = {
  espresso: "#241711",
  roasted: "#5A3828",
  cream: "#F2E9D8",
  beige: "#D8C4A5",
  olive: "#77745A",
};

const DEFS = `
  <defs>
    <linearGradient id="warm" x1="0" y1="0" x2="0.7" y2="1">
      <stop offset="0" stop-color="#3B2617"/>
      <stop offset="0.55" stop-color="${C.roasted}"/>
      <stop offset="1" stop-color="${C.espresso}"/>
    </linearGradient>
    <linearGradient id="light" x1="0.1" y1="0" x2="0.9" y2="1">
      <stop offset="0" stop-color="#F7EEDF"/>
      <stop offset="0.5" stop-color="${C.beige}"/>
      <stop offset="1" stop-color="#B99C74"/>
    </linearGradient>
    <linearGradient id="deep" x1="0" y1="0" x2="0.6" y2="1">
      <stop offset="0" stop-color="#1C110B"/>
      <stop offset="1" stop-color="#0D0705"/>
    </linearGradient>
    <radialGradient id="pool" cx="0.38" cy="0.3" r="0.75">
      <stop offset="0" stop-color="#FFE8C2" stop-opacity="0.6"/>
      <stop offset="0.45" stop-color="${C.beige}" stop-opacity="0.2"/>
      <stop offset="1" stop-color="${C.espresso}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="poolDark" cx="0.55" cy="0.28" r="0.7">
      <stop offset="0" stop-color="#E8CFA6" stop-opacity="0.34"/>
      <stop offset="1" stop-color="${C.espresso}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="crema" cx="0.38" cy="0.3" r="0.8">
      <stop offset="0" stop-color="#5A3319"/>
      <stop offset="0.65" stop-color="#2C160C"/>
      <stop offset="1" stop-color="#150A05"/>
    </radialGradient>
    <radialGradient id="shadow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#160C06" stop-opacity="0.5"/>
      <stop offset="1" stop-color="#160C06" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0"/>
      <stop offset="0.5" stop-color="#FFFFFF" stop-opacity="0.5"/>
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
    <filter id="blur" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="16"/>
    </filter>
    <filter id="soft" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="6"/>
    </filter>
  </defs>`;

/**
 * Inset hairline border.
 *
 * NOTE: only one `width`/`height` pair may appear per element. Emitting the
 * element size and the inset size as two separate attributes produces invalid
 * XML, and browsers silently refuse to render such an SVG in an <img>.
 */
const frame = (w, h) =>
  `<rect fill="none" stroke="${C.cream}" stroke-opacity="0.16" stroke-width="2" x="22" y="22" width="${w - 44}" height="${h - 44}"/>`;

const grain = (w, h, opacity = 0.13) =>
  `<rect width="${w}" height="${h}" filter="url(#grain)" opacity="${opacity}" style="mix-blend-mode:overlay"/>`;

/** A single coffee bean with its crease. */
function bean(x, y, rot = 0, scale = 1) {
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${scale})">
      <ellipse rx="30" ry="20" fill="#3B2114"/>
      <ellipse rx="30" ry="20" fill="none" stroke="#5A3828" stroke-opacity="0.5" stroke-width="1.5"/>
      <path d="M-19 3c9-9 29-9 38 0" fill="none" stroke="#150A05" stroke-width="5" stroke-linecap="round"/>
    </g>`;
}

/** Warm steam wisps. */
function steam(cx, top, spread = 1) {
  return `<g fill="none" stroke="#FFFFFF" stroke-opacity="0.34" stroke-width="14"
      stroke-linecap="round" filter="url(#soft)">
      <path d="M${cx - 60 * spread} ${top + 70}c-20-28 16-46 0-74"/>
      <path d="M${cx} ${top + 58}c-22-30 18-50 0-80"/>
      <path d="M${cx + 60 * spread} ${top + 70}c-20-28 16-46 0-74"/>
    </g>`;
}

function doc({ name, width, height, title, desc, body }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-labelledby="t">
  <title id="t">${title}</title>
  <desc>${desc}</desc>
  ${DEFS}
  ${body}
  ${grain(width, height)}
  ${frame(width, height)}
</svg>
`;
}

/* ------------------------------------------------------------------ drinks */

const drinks = [
  {
    name: "drink-01",
    title: "Placeholder menu item 01",
    desc: "Placeholder artwork — view atas cangkir kopi di atas piring.",
    body: `
  <rect width="800" height="1000" fill="url(#warm)"/>
  <rect width="800" height="1000" fill="url(#pool)"/>
  <circle cx="400" cy="530" r="300" fill="url(#shadow)" filter="url(#blur)"/>
  <circle cx="400" cy="520" r="268" fill="${C.cream}" opacity="0.14"/>
  <circle cx="400" cy="520" r="268" fill="none" stroke="${C.cream}" stroke-opacity="0.3" stroke-width="2"/>
  <circle cx="400" cy="520" r="212" fill="url(#crema)"/>
  <circle cx="400" cy="520" r="212" fill="none" stroke="#8A5528" stroke-width="8" opacity="0.6"/>
  <circle cx="400" cy="520" r="170" fill="#22120A" opacity="0.55"/>
  <ellipse cx="344" cy="470" rx="82" ry="26" fill="#C79A5C" opacity="0.2"/>
  <ellipse cx="452" cy="574" rx="30" ry="9" fill="#E0B47A" opacity="0.22"/>
  <path d="M250 380a212 212 0 0 1 120-116" fill="none" stroke="${C.cream}" stroke-opacity="0.35" stroke-width="7" stroke-linecap="round"/>
  ${bean(690, 800, 18, 0.9)}
  ${bean(140, 862, -12, 0.85)}`,
  },
  {
    name: "drink-02",
    title: "Placeholder menu item 02",
    desc: "Placeholder artwork — cangkir kaca tinggi dengan lapisan kopi.",
    body: `
  <rect width="800" height="1000" fill="url(#light)"/>
  <rect width="800" height="1000" fill="url(#pool)" opacity="0.5"/>
  <ellipse cx="400" cy="800" rx="220" ry="44" fill="url(#shadow)" filter="url(#blur)"/>
  ${steam(400, 250)}
  <path d="M300 320h200l-22 470a26 26 0 0 1-26 24h-104a26 26 0 0 1-26-24z" fill="${C.cream}" opacity="0.55"/>
  <path d="M308 470h184l-14 320a26 26 0 0 1-26 24h-104a26 26 0 0 1-26-24z" fill="url(#crema)"/>
  <path d="M308 470h184l-3 66H311z" fill="#8A5528" opacity="0.5"/>
  <path d="M330 360c8 130 14 300 20 430" fill="none" stroke="#FFFFFF" stroke-opacity="0.5" stroke-width="16" stroke-linecap="round"/>
  <ellipse cx="400" cy="320" rx="100" ry="20" fill="#F7EEDF" opacity="0.85"/>
  <ellipse cx="400" cy="322" rx="80" ry="14" fill="#2C160C"/>
  ${bean(648, 872, 24, 0.9)}
  ${bean(160, 830, -20, 0.85)}`,
  },
  {
    name: "drink-03",
    title: "Placeholder menu item 03",
    desc: "Placeholder artwork — mangkuk keramik berisi biji kopi.",
    body: `
  <rect width="800" height="1000" fill="url(#deep)"/>
  <rect width="800" height="1000" fill="url(#poolDark)"/>
  <ellipse cx="400" cy="740" rx="300" ry="70" fill="url(#shadow)" filter="url(#blur)"/>
  <ellipse cx="400" cy="600" rx="286" ry="150" fill="#E4D4B8"/>
  <ellipse cx="400" cy="584" rx="286" ry="150" fill="#F2E9D8"/>
  <ellipse cx="400" cy="592" rx="216" ry="108" fill="#CDB794"/>
  <ellipse cx="400" cy="602" rx="200" ry="98" fill="#B49B78" opacity="0.7"/>
  ${bean(340, 560, 8)}
  ${bean(452, 610, -16, 0.95)}
  ${bean(410, 528, 26, 0.9)}
  ${bean(500, 566, -4, 0.86)}
  ${bean(300, 622, 34, 0.8)}
  <path d="M180 520a286 150 0 0 1 130-118" fill="none" stroke="#FFFFFF" stroke-opacity="0.5" stroke-width="16" stroke-linecap="round"/>`,
  },
  {
    name: "drink-04",
    title: "Placeholder menu item 04",
    desc: "Placeholder artwork — cangkir dengan pegangan di samping.",
    body: `
  <rect width="800" height="1000" fill="url(#warm)"/>
  <rect width="800" height="1000" fill="url(#pool)"/>
  <ellipse cx="400" cy="712" rx="270" ry="52" fill="url(#shadow)" filter="url(#blur)"/>
  ${steam(392, 250)}
  <path d="M506 400c62 4 64 92-8 106" fill="none" stroke="#E4D4B8" stroke-width="26" stroke-linecap="round"/>
  <path d="M232 372c9 96 24 190 62 226 32 30 92 30 124 0 38-36 53-130 62-226z" fill="#F2E9D8"/>
  <path d="M256 388c7 84 20 168 52 200 12 12 26 17 40 19-28-22-43-86-48-219z" fill="url(#sheen)" opacity="0.55"/>
  <ellipse cx="356" cy="372" rx="124" ry="28" fill="#FFFBF4"/>
  <ellipse cx="356" cy="374" rx="100" ry="20" fill="url(#crema)"/>
  <ellipse cx="356" cy="374" rx="100" ry="20" fill="none" stroke="#8A5528" stroke-width="6" opacity="0.65"/>
  <ellipse cx="330" cy="368" rx="44" ry="10" fill="#C08A4E" opacity="0.22"/>
  <ellipse cx="400" cy="700" rx="238" ry="46" fill="#E8DCC6"/>
  <ellipse cx="400" cy="692" rx="238" ry="46" fill="#F4EADB"/>
  <ellipse cx="400" cy="690" rx="112" ry="24" fill="#A98F6D" opacity="0.3"/>
  ${bean(676, 748, 16, 0.9)}
  ${bean(128, 786, -14, 0.85)}`,
  },
];

/* ------------------------------------------------------------- atmosphere */

const atmosphere = [
  {
    name: "atmosphere-window-light",
    width: 800,
    height: 1000,
    title: "Placeholder suasana — cahaya jendela",
    desc: "Placeholder artwork — berkas cahaya sore yang masuk melalui jendela kedai.",
    body: `
  <rect width="800" height="1000" fill="url(#warm)"/>
  <g opacity="0.5">
    <path d="M40 1000 300 0h150L190 1000z" fill="#FFE3B4" opacity="0.28" filter="url(#blur)"/>
    <path d="M300 1000 540 0h120L420 1000z" fill="#FFEFCC" opacity="0.2" filter="url(#blur)"/>
    <path d="M560 1000 760 0h70L630 1000z" fill="#FFE3B4" opacity="0.15" filter="url(#blur)"/>
  </g>
  <g stroke="${C.cream}" stroke-opacity="0.24" stroke-width="3" fill="none">
    <rect x="150" y="90" width="500" height="620" rx="8"/>
    <path d="M400 90v620M150 400h500"/>
  </g>
  <rect x="150" y="90" width="500" height="620" rx="8" fill="#FFE3B4" opacity="0.07"/>
  <rect y="712" width="800" height="288" fill="#160C06" opacity="0.55"/>
  <rect y="712" width="800" height="5" fill="${C.beige}" opacity="0.3"/>
  <ellipse cx="420" cy="790" rx="300" ry="46" fill="url(#shadow)" filter="url(#blur)"/>
  <circle cx="600" cy="792" r="46" fill="#1A0F08" opacity="0.7"/>
  <rect x="520" y="770" width="160" height="14" rx="7" fill="#1A0F08" opacity="0.6"/>`,
  },
  {
    name: "atmosphere-bar-counter",
    width: 1000,
    height: 800,
    title: "Placeholder suasana — bar",
    desc: "Placeholder artwork — bar kayu dengan deretan cangkir dan botol.",
    body: `
  <rect width="1000" height="800" fill="url(#deep)"/>
  <rect width="1000" height="800" fill="url(#poolDark)"/>
  <g opacity="0.65">
    <rect x="70" y="120" width="18" height="300" rx="9" fill="#2A1A10"/>
    <rect x="150" y="90" width="18" height="330" rx="9" fill="#2A1A10"/>
    <rect x="230" y="140" width="18" height="280" rx="9" fill="#2A1A10"/>
    <rect x="760" y="110" width="18" height="310" rx="9" fill="#2A1A10"/>
    <rect x="840" y="150" width="18" height="270" rx="9" fill="#2A1A10"/>
  </g>
  <rect x="0" y="500" width="1000" height="300" fill="#3A2517"/>
  <rect x="0" y="500" width="1000" height="14" fill="#6A4A2E" opacity="0.7"/>
  <g fill="none" stroke="${C.cream}" stroke-opacity="0.3" stroke-width="3">
    <path d="M0 560h1000M0 640h1000M0 720h1000"/>
  </g>
  <g fill="#F2E9D8" opacity="0.9">
    <path d="M170 420h76l-8 74a20 20 0 0 1-20 18h-20a20 20 0 0 1-20-18z"/>
    <ellipse cx="208" cy="420" rx="38" ry="9" fill="#8A5528"/>
    <path d="M420 430h70l-7 64a20 20 0 0 1-20 18h-16a20 20 0 0 1-20-18z"/>
    <ellipse cx="455" cy="430" rx="35" ry="8" fill="#8A5528"/>
    <path d="M660 415h80l-8 80a20 20 0 0 1-20 18h-24a20 20 0 0 1-20-18z"/>
    <ellipse cx="700" cy="415" rx="40" ry="9" fill="#8A5528"/>
  </g>
  <g stroke="#F2E9D8" stroke-opacity="0.4" stroke-width="6" fill="none" stroke-linecap="round">
    <path d="M250 448c30 3 32 44-2 50"/>
    <path d="M494 456c28 3 30 38-2 44"/>
  </g>
  <ellipse cx="500" cy="516" rx="420" ry="34" fill="url(#shadow)" filter="url(#blur)"/>`,
  },
  {
    name: "atmosphere-ceramic",
    width: 800,
    height: 1000,
    title: "Placeholder suasana — keramik",
    desc: "Placeholder artwork — detail tekstur keramik dan garis bahan.",
    body: `
  <rect width="800" height="1000" fill="url(#light)"/>
  <rect width="800" height="1000" fill="url(#pool)" opacity="0.6"/>
  <circle cx="400" cy="500" r="330" fill="#E8DCC6"/>
  <circle cx="400" cy="500" r="330" fill="none" stroke="${C.roasted}" stroke-opacity="0.18" stroke-width="2"/>
  <circle cx="400" cy="500" r="262" fill="#F4EADB"/>
  <circle cx="400" cy="500" r="200" fill="url(#crema)"/>
  <circle cx="400" cy="500" r="200" fill="none" stroke="#8A5528" stroke-width="9" opacity="0.5"/>
  <ellipse cx="322" cy="424" rx="96" ry="30" fill="#C79A5C" opacity="0.24"/>
  <path d="M240 330a330 330 0 0 1 150-140" fill="none" stroke="#FFFFFF" stroke-opacity="0.55" stroke-width="20" stroke-linecap="round"/>
  <g stroke="${C.roasted}" stroke-opacity="0.22" stroke-width="2" fill="none">
    <path d="M70 760 250 900M250 760 430 900M430 760 610 900M610 760 790 900"/>
  </g>
  ${bean(660, 858, 12, 0.9)}`,
  },
  {
    name: "atmosphere-steam",
    width: 1000,
    height: 800,
    title: "Placeholder suasana — uap",
    desc: "Placeholder artwork — uap panas yang naik dari permukaan kopi.",
    body: `
  <rect width="1000" height="800" fill="url(#deep)"/>
  <rect width="1000" height="800" fill="url(#poolDark)"/>
  <ellipse cx="500" cy="740" rx="420" ry="90" fill="#1A0F08" opacity="0.75"/>
  <ellipse cx="500" cy="720" rx="300" ry="80" fill="url(#crema)"/>
  <ellipse cx="500" cy="720" rx="300" ry="80" fill="none" stroke="#8A5528" stroke-width="10" opacity="0.45"/>
  <ellipse cx="420" cy="688" rx="120" ry="32" fill="#C08A4E" opacity="0.18"/>
  <g fill="none" stroke="#FFFFFF" stroke-linecap="round" filter="url(#soft)">
    <path d="M400 640c-40-70 40-120 0-200" stroke-opacity="0.32" stroke-width="26"/>
    <path d="M500 620c-44-78 44-132 0-220" stroke-opacity="0.4" stroke-width="30"/>
    <path d="M600 640c-40-70 40-120 0-200" stroke-opacity="0.28" stroke-width="24"/>
    <path d="M300 660c-32-56 32-96 0-160" stroke-opacity="0.2" stroke-width="18"/>
  </g>`,
  },
  {
    name: "atmosphere-wood-grain",
    width: 800,
    height: 1000,
    title: "Placeholder suasana — kayu",
    desc: "Placeholder artwork — tekstur kayu gelap dan permukaan brushed metal.",
    body: `
  <rect width="800" height="1000" fill="url(#warm)"/>
  <g stroke="${C.espresso}" stroke-opacity="0.35" stroke-width="3" fill="none">
    <path d="M40 0c60 180-40 320 20 500s-50 330 10 500"/>
    <path d="M180 0c50 200-40 330 16 520s-46 320 12 480"/>
    <path d="M320 0c58 190-38 330 18 510s-48 330 10 490"/>
    <path d="M470 0c46 210-42 340 14 530s-44 310 14 470"/>
    <path d="M610 0c60 180-40 320 20 500s-50 330 10 500"/>
    <path d="M750 0c40 200-40 330 14 520s-44 320 12 480"/>
  </g>
  <g stroke="#8A5F3C" stroke-opacity="0.3" stroke-width="2" fill="none">
    <path d="M110 0c70 190-30 330 30 510s-40 320 20 490"/>
    <path d="M400 0c54 200-36 340 20 520s-46 320 16 480"/>
    <path d="M690 0c58 190-38 330 18 510s-48 330 10 490"/>
  </g>
  <rect x="0" y="0" width="800" height="1000" fill="url(#pool)" opacity="0.7"/>
  <g opacity="0.9">
    <rect x="90" y="640" width="620" height="26" rx="13" fill="#8C8A7C"/>
    <rect x="90" y="640" width="620" height="9" rx="4.5" fill="#C9C7B8" opacity="0.7"/>
    <ellipse cx="400" cy="720" rx="300" ry="60" fill="url(#shadow)" filter="url(#blur)"/>
  </g>`,
  },
];

/* ------------------------------------------------------------------ craft */

const craft = [
  {
    name: "craft-beans",
    title: "Placeholder proses — biji kopi",
    desc: "Placeholder artwork — biji kopi terpilih yang tersebar di atas permukaan.",
    body: `
  <rect width="1024" height="576" fill="url(#warm)"/>
  <rect width="1024" height="576" fill="url(#pool)"/>
  <g>
    ${bean(210, 240, -18, 1.5)}
    ${bean(420, 170, 12, 1.7)}
    ${bean(640, 260, -6, 1.55)}
    ${bean(840, 190, 24, 1.45)}
    ${bean(320, 400, 8, 1.6)}
    ${bean(560, 420, -22, 1.5)}
    ${bean(780, 400, 16, 1.35)}
    ${bean(110, 400, 30, 1.25)}
  </g>
  <ellipse cx="512" cy="520" rx="440" ry="40" fill="url(#shadow)" filter="url(#blur)"/>`,
  },
  {
    name: "craft-grinder",
    title: "Placeholder proses — penggilingan",
    desc: "Placeholder artwork — grinder manual dengan pegangan krepis dan partikel kopi.",
    body: `
  <rect width="1024" height="576" fill="url(#deep)"/>
  <rect width="1024" height="576" fill="url(#poolDark)"/>
  <g stroke="#6A4A2E" stroke-width="10" stroke-linecap="round" fill="none">
    <path d="M512 300V150"/>
    <path d="M512 150h120"/>
  </g>
  <circle cx="648" cy="150" r="20" fill="#8C7454"/>
  <path d="M436 300h152l-18 150a24 24 0 0 1-24 20h-68a24 24 0 0 1-24-20z" fill="#3A2517"/>
  <path d="M436 300h152l-4 34H440z" fill="#6A4A2E" opacity="0.7"/>
  <path d="M588 360c40 6 42 62-2 70" fill="none" stroke="#3A2517" stroke-width="14" stroke-linecap="round"/>
  <path d="M460 320c8 60 12 110 18 140" fill="none" stroke="#FFFFFF" stroke-opacity="0.22" stroke-width="14" stroke-linecap="round"/>
  <g fill="#3B2114">
    <circle cx="470" cy="510" r="9"/>
    <circle cx="520" cy="536" r="7"/>
    <circle cx="566" cy="504" r="8"/>
    <circle cx="612" cy="530" r="6"/>
    <circle cx="440" cy="540" r="6"/>
  </g>
  <ellipse cx="512" cy="548" rx="360" ry="28" fill="url(#shadow)" filter="url(#blur)"/>`,
  },
  {
    name: "craft-brew",
    title: "Placeholder proses — extraction",
    desc: "Placeholder artwork — corong dripper dengan tetesan kopi yang jatuh.",
    body: `
  <rect width="1024" height="576" fill="url(#light)"/>
  <rect width="1024" height="576" fill="url(#pool)" opacity="0.6"/>
  <path d="M400 120h224l-96 170h-32z" fill="#2A1A10" opacity="0.9"/>
  <path d="M430 140h164l-72 128h-20z" fill="#6A4A2E" opacity="0.55"/>
  <rect x="368" y="108" width="288" height="20" rx="10" fill="#3A2517"/>
  <path d="M496 300h32l24 150h-80z" fill="#1A0F08" opacity="0.22"/>
  <g fill="#3B2114">
    <circle cx="512" cy="470" r="9"/>
    <circle cx="512" cy="500" r="7"/>
  </g>
  <path d="M400 452h224l-30 84a30 30 0 0 1-28 20h-108a30 30 0 0 1-28-20z" fill="#F2E9D8" opacity="0.92"/>
  <path d="M410 500h204l-8 26a30 30 0 0 1-28 20H446a30 30 0 0 1-28-20z" fill="url(#crema)"/>
  <ellipse cx="512" cy="452" rx="112" ry="16" fill="#F7EEDF"/>
  <path d="M410 462c14 46 22 74 26 92" fill="none" stroke="#FFFFFF" stroke-opacity="0.5" stroke-width="14" stroke-linecap="round"/>
  <ellipse cx="512" cy="562" rx="300" ry="24" fill="url(#shadow)" filter="url(#blur)"/>`,
  },
  {
    name: "craft-serve",
    title: "Placeholder proses — penyajian",
    desc: "Placeholder artwork — kopi yang disajikan di atas cangkir keramik.",
    body: `
  <rect width="1024" height="576" fill="url(#warm)"/>
  <rect width="1024" height="576" fill="url(#pool)"/>
  ${steam(500, 40)}
  <path d="M624 268c54 4 56 80-6 92" fill="none" stroke="#E4D4B8" stroke-width="22" stroke-linecap="round"/>
  <path d="M380 244c8 84 21 164 54 196 28 26 78 26 106 0 33-32 46-112 54-196z" fill="#F2E9D8"/>
  <path d="M402 258c6 74 18 146 44 174 10 10 22 14 34 16-24-20-37-76-41-190z" fill="url(#sheen)" opacity="0.5"/>
  <ellipse cx="488" cy="244" rx="108" ry="24" fill="#FFFBF4"/>
  <ellipse cx="488" cy="246" rx="88" ry="17" fill="url(#crema)"/>
  <ellipse cx="488" cy="246" rx="88" ry="17" fill="none" stroke="#8A5528" stroke-width="6" opacity="0.6"/>
  <ellipse cx="464" cy="241" rx="38" ry="9" fill="#C08A4E" opacity="0.22"/>
  <ellipse cx="500" cy="470" rx="212" ry="40" fill="#E8DCC6"/>
  <ellipse cx="500" cy="464" rx="212" ry="40" fill="#F4EADB"/>
  <ellipse cx="500" cy="462" rx="100" ry="20" fill="#A98F6D" opacity="0.3"/>
  ${bean(790, 500, 16, 0.85)}
  ${bean(210, 512, -14, 0.8)}
  <ellipse cx="500" cy="524" rx="380" ry="30" fill="url(#shadow)" filter="url(#blur)"/>`,
  },
];

/* --------------------------------------------------------------- validate */

/**
 * Duplicate attribute names are fatal for SVG: the file is not well-formed XML
 * and browsers silently refuse to render it inside an <img>, which previously
 * made every generated placeholder fail to decode. Catch that here so a bad
 * template fails the build instead of shipping a blank hero.
 */
function assertWellFormed(label, svg) {
  const problems = [];

  for (const [tag] of svg.matchAll(/<[a-zA-Z][^>]*>/g)) {
    const attrs = [...tag.matchAll(/\s([a-zA-Z][\w:-]*)\s*=/g)].map((m) => m[1]);

    for (const dupe of new Set(attrs.filter((n, i) => attrs.indexOf(n) !== i))) {
      problems.push(`${label}: duplicate attribute "${dupe}" in ${tag.trim()}`);
    }

    for (const m of tag.matchAll(/\s[a-zA-Z][\w:-]*\s*=\s*([^\s"'`=<>])/g)) {
      problems.push(`${label}: unquoted attribute value ${JSON.stringify(m[1])} in ${tag.trim()}`);
    }
  }

  if (problems.length > 0) {
    throw new Error(`Invalid SVG:\n  ${problems.join("\n  ")}`);
  }
}

/* ----------------------------------------------------------------- output */

const files = [
  ...drinks.map((d) => ({
    file: `${d.name}.svg`,
    svg: doc({
      name: d.name,
      width: 800,
      height: 1000,
      title: d.title,
      desc: d.desc,
      body: d.body,
    }),
  })),
  ...atmosphere.map((a) => ({
    file: `${a.name}.svg`,
    svg: doc({
      name: a.name,
      width: a.width,
      height: a.height,
      title: a.title,
      desc: a.desc,
      body: a.body,
    }),
  })),
  ...craft.map((c) => ({
    file: `${c.name}.svg`,
    svg: doc({
      name: c.name,
      width: 1024,
      height: 576,
      title: c.title,
      desc: c.desc,
      body: c.body,
    }),
  })),
];

await mkdir(OUT_DIR, { recursive: true });

for (const { file, svg } of files) {
  assertWellFormed(file, svg);
  await writeFile(join(OUT_DIR, file), svg, "utf8");
}

// The hand-written 3D fallback lives in the same directory but is not
// generated, so validate it here too.
const posterFile = join(OUT_DIR, "hero-cup-poster.svg");
assertWellFormed("hero-cup-poster.svg", await readFile(posterFile, "utf8"));

console.log(`Generated ${files.length} placeholder SVGs in public/placeholders/`);
console.log("Validated all placeholder SVGs for duplicate attributes.");
