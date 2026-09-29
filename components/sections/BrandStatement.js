import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ritual } from "@/data/craft";

/**
 * Section 02 — Brand Statement (PRD 5.02).
 * A quiet typographic transition on the espresso ground, separating the light
 * hero from the light menu section that follows.
 */
export function BrandStatement() {
  return (
    <section className="relative isolate overflow-hidden bg-espresso py-24 md:py-32 lg:py-40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 size-[min(52rem,120vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-roasted/25 blur-3xl"
      />

      <div className="shell relative">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3">
            <Reveal>
              <SectionLabel tone="light" index>
                Our Philosophy
              </SectionLabel>
            </Reveal>
          </div>

          <div className="lg:col-span-9">
            <Reveal delay={80}>
              <h2 className="font-display text-[clamp(1.75rem,4.6vw,3.5rem)] leading-[1.14] font-light tracking-[-0.015em] text-balance text-cream">
                Kami percaya kopi yang baik tidak perlu buru-buru. Ia perlu
                {" "}
                <em className="italic text-beige">kesabaran</em>, proporsi yang tepat, dan
                waktu agar rasa itu terungkap pelan-pelan sampai terasa jelas.
              </h2>
            </Reveal>

            <Reveal delay={200}>
              <p className="mt-10 max-w-2xl text-[0.975rem] leading-relaxed text-cream/60 md:text-base">
                {ritual.intro}
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-cream/12 pt-8">
                {["Biji pilihan", "Ritme konsisten", "Suasana hangat"].map((item) => (
                  <p key={item} className="label flex items-center gap-2.5 text-cream/55">
                    <span
                      aria-hidden="true"
                      className="block size-1 rounded-full bg-olive"
                    />
                    {item}
                  </p>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BrandStatement;
