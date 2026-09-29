import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { PlaceholderNotice } from "@/components/ui/PlaceholderNotice";
import { ritual } from "@/data/craft";

/**
 * Section 05 — Craft / Coffee Ritual (PRD 5.05).
 * Storytelling beats of the brewing process with supporting detail art.
 * Motion is limited to a gentle scroll reveal plus a low-key bean drift so the
 * section supports the narrative instead of decorating it.
 */
export function CoffeeRitual() {
  return (
    <section id="craft" className="relative scroll-mt-20 bg-espresso py-24 md:py-32 lg:py-40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cream/15 to-transparent"
      />

      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <Reveal>
              <SectionLabel tone="light" index>
                Craft
              </SectionLabel>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-6 font-display text-[clamp(2.25rem,6vw,4rem)] leading-[1.02] font-light tracking-[-0.02em] text-balance text-cream">
                Yang terjadi
                <br />
                <em className="italic text-beige">sebelum</em> secangkir terhidang.
              </h2>
            </Reveal>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <Reveal delay={160}>
              <p className="text-[0.95rem] leading-relaxed text-cream/60">
                Empat langkah sederhana yang kami ulang setiap hari. Bukan rahasia —
                hanya konsistensi.
              </p>
            </Reveal>
          </div>
        </div>

        <Reveal delay={200} className="mt-10">
          <PlaceholderNotice tone="light">
            Ilustrasi proses pada bagian ini masih placeholder artwork.
          </PlaceholderNotice>
        </Reveal>

        <ol className="mt-16 space-y-px lg:mt-24">
          {ritual.steps.map((step, index) => (
            <li key={step.id}>
              <Reveal delay={index * 70}>
                <article className="group grid gap-6 border-t border-cream/12 py-9 transition-colors duration-500 hover:border-cream/30 md:grid-cols-12 md:gap-8 md:py-11">
                  <p className="label text-beige/45 md:col-span-1">{step.index}</p>

                  <div className="md:col-span-4">
                    <h3 className="font-display text-2xl leading-snug text-cream md:text-[1.75rem]">
                      {step.title}
                    </h3>
                    <p className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-cream/55">
                      {step.body}
                    </p>
                  </div>

                  <div className="md:col-span-6 md:col-start-7">
                    <div className="relative aspect-[16/9] overflow-hidden bg-roasted/25">
                      <Image
                        src={step.visual.src}
                        alt={step.visual.alt}
                        width={1024}
                        height={576}
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="size-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] motion-reduce:transform-none motion-reduce:transition-none"
                      />
                    </div>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default CoffeeRitual;
