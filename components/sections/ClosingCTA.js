import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/data/site";

const ARROW = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path
      d="M1 7h11M7.5 2.5 12 7l-4.5 4.5"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Section 07 — Closing CTA (PRD 5.07).
 * Full-bleed espresso close with the last call to action, followed by the
 * minimal footer.
 */
export function ClosingCTA() {
  return (
    <section className="relative isolate overflow-hidden bg-espresso py-28 md:py-36 lg:py-44">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 size-[min(46rem,110vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-roasted/30 blur-3xl"
      />

      <div className="shell relative">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="label text-beige/60">See you at Smiljan</p>
          </Reveal>

          <Reveal delay={90}>
            <h2 className="mt-7 font-display text-[clamp(2.5rem,7.5vw,5rem)] leading-[0.98] font-light tracking-[-0.02em] text-balance text-cream">
              Cangkir berikutnya
              <br />
              <em className="italic text-beige">menunggu</em> di {site.location.area}.
            </h2>
          </Reveal>

          <Reveal delay={180}>
            <p className="mx-auto mt-7 max-w-xl text-[0.95rem] leading-relaxed text-cream/60">
              Datang apa adanya, atau cek dulu lokasinya di peta. Jam operasional
              resminya akan dipublikasikan setelah dikonfirmasi.
            </p>
          </Reveal>

          <Reveal delay={260}>
            <div className="mt-11 flex flex-wrap items-center justify-center gap-3">
              <Button
                href={site.location.mapsUrl}
                variant="onDark"
                size="lg"
                icon={ARROW}
                className="!bg-cream !text-espresso hover:!bg-beige"
              >
                Lihat Lokasi
              </Button>
              <Button href="#menu" variant="onDark" size="lg">
                Kembali ke Menu
              </Button>
            </div>
          </Reveal>
        </div>
      </div>

      <Footer />
    </section>
  );
}

/**
 * Footer (PRD 5.07) — brand, official social links and copyright.
 * Unverified social accounts are reported as text with no link styling, so
 * there is no control that looks active but does nothing (PRD 9).
 */
function Footer() {
  const { social } = site;

  const socials = [
    { label: "Instagram", href: social.instagram, display: social.instagramDisplay },
    { label: "Facebook", href: social.facebook, display: social.facebookDisplay },
    { label: "TikTok", href: social.tiktok, display: social.tiktokDisplay },
  ];

  return (
    <footer className="relative mt-24 border-t border-cream/12 pt-10 md:mt-32">
      <div className="shell flex flex-col gap-8 pb-10 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/brand/logo-smiljan.svg"
            alt={`${site.name} Coffee Shop`}
            width={152}
            height={30}
            className="h-4 w-[8.25rem] opacity-80 md:h-5 md:w-[9.5rem]"
          />
          <span className="label hidden text-beige/40 sm:inline">Coffee Shop</span>
        </div>

        <nav aria-label="Tautan sosial">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-3">
            {socials.map((item) => (
              <li key={item.label}>
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="label inline-flex min-h-11 items-center text-cream/70 transition-colors duration-300 hover:text-cream"
                  >
                    {item.label}
                  </a>
                ) : (
                  <span
                    className="label inline-flex min-h-11 cursor-not-allowed items-center text-cream/30"
                    title="Tautan resmi belum dikonfirmasi"
                  >
                    {item.label} — belum dikonfirmasi
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <p className="label text-beige/40">
          &copy; {new Date().getFullYear()} {site.name}. Seluruh hak dilindungi.
        </p>
      </div>
    </footer>
  );
}

export default ClosingCTA;
