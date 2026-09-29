import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { HeroScene } from "@/components/3d/HeroScene";
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
 * Section 01 — Hero / First Impression (PRD 5.01).
 * Asymmetric editorial composition: type on the left, 3D focal point right.
 * The scene sits behind the type on small screens so the headline is never
 * covered (PRD 8 — "objek 3D tidak menutupi konten").
 */
export function HeroSection() {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden bg-cream pt-28 pb-16 md:pt-36 md:pb-24 lg:min-h-[92svh] lg:pt-40"
    >
      {/* Warm light wash behind the scene */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-[-18%] size-[min(46rem,90vw)] rounded-full bg-beige/45 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-10%] left-[-10%] size-[28rem] rounded-full bg-roasted/8 blur-3xl"
      />

      <div className="shell relative">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
          {/* ---------------------------------------------------------- Copy */}
          <div className="relative z-10 lg:col-span-6 xl:col-span-5">
            <SectionLabel index>Since the daily ritual</SectionLabel>

            <h1 className="mt-6 font-display text-[clamp(2.75rem,10vw,5.25rem)] leading-[0.95] font-light tracking-[-0.02em] text-balance text-espresso">
              A timeless
              <br />
              <em className="font-normal italic text-roasted">coffee</em> ritual.
            </h1>

            <p className="mt-7 max-w-[34rem] text-[0.975rem] leading-relaxed text-espresso/70 md:text-base">
              Smiljan adalah coffee shop klasik di {site.location.area}. Kami menyajikan
              kopi dengan ritme yang tenang, tanpa terburu-buru dan tanpa gimmik.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button href="#menu" size="lg" icon={ARROW}>
                Jelajahi Menu
              </Button>
              <Button href="#visit" variant="secondary" size="lg">
                Temukan Kami
              </Button>
            </div>

            <dl className="mt-12 grid max-w-md grid-cols-2 gap-x-6 gap-y-6 border-t border-espresso/12 pt-7">
              <div>
                <dt className="label text-espresso/45">Wilayah</dt>
                <dd className="mt-1.5 font-display text-lg text-espresso">
                  {site.location.area}
                </dd>
              </div>
              <div>
                <dt className="label text-espresso/45">Suasana</dt>
                <dd className="mt-1.5 font-display text-lg text-espresso">
                  Klasik &amp; hangat
                </dd>
              </div>
            </dl>
          </div>

          {/* --------------------------------------------------- 3D focal point */}
          <div className="relative lg:col-span-6 lg:col-start-7 xl:col-span-6 xl:col-start-7">
            <HeroScene />
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-5 hidden justify-center lg:flex"
      >
        <span className="label flex items-center gap-3 text-espresso/35">
          Gulir
          <span className="block h-px w-10 bg-current" />
        </span>
      </div>
    </section>
  );
}

export default HeroSection;
