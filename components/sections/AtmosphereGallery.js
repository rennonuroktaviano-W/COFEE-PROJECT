import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { PlaceholderNotice } from "@/components/ui/PlaceholderNotice";
import { gallery } from "@/data/gallery";

/**
 * Section 04 — The Space / Atmosphere (PRD 5.04).
 * Asymmetric collage rather than a uniform grid, so the layout reads as
 * editorial. Mobile falls back to a single column; the horizontal scroll rail
 * is desktop-only and never becomes the sole way to reach an item.
 */
export function AtmosphereGallery() {
  return (
    <section
      id="space"
      className="relative scroll-mt-20 overflow-hidden bg-cream-deep/45 py-24 md:py-32 lg:py-40"
    >
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal>
              <SectionLabel index>The Space</SectionLabel>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-6 font-display text-[clamp(2.25rem,6vw,4rem)] leading-[1.02] font-light tracking-[-0.02em] text-balance text-espresso">
                Ruang yang
                <br />
                <em className="italic text-roasted">bercerita</em> pada detailnya.
              </h2>
            </Reveal>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <Reveal delay={160}>
              <p className="text-[0.95rem] leading-relaxed text-espresso/65">
                Kayu gelap, keramik, kaca, dan cahaya yang masuk pelan. Seluruh interior
                Smiljan dibangun agar obrolan tidak perlu terasa formal.
              </p>
            </Reveal>
          </div>
        </div>

        <Reveal delay={200} className="mt-10">
          <PlaceholderNotice>
            Seluruh visual di bagian ini masih placeholder artwork. Foto asli menunggu
            lisensi penggunaan.
          </PlaceholderNotice>
        </Reveal>
      </div>

      {/* Mobile / tablet: stacked asymmetric collage */}
      <div className="shell mt-14 lg:hidden">
        <ul className="grid grid-cols-2 gap-4">
          {gallery.map((item, index) => (
            <li
              key={item.id}
              className={index % 3 === 0 ? "col-span-2" : "col-span-1"}
            >
              <Reveal delay={index * 70} variant="mask">
                <GalleryFigure item={item} sizes="(min-width: 640px) 50vw, 100vw" />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>

      {/* Desktop: horizontal editorial rail */}
      <div className="mt-16 hidden lg:block">
        <ul className="flex items-end gap-7 overflow-x-auto px-[max(2.5rem,calc((100vw-90rem)/2+4rem))] pb-6 [scrollbar-width:thin]">
          {gallery.map((item, index) => (
            <li
              key={item.id}
              className="shrink-0"
              style={{ width: item.width === 5 ? "24rem" : "19rem" }}
            >
              <Reveal delay={index * 80} variant="mask">
                <GalleryFigure item={item} sizes="24rem" />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function GalleryFigure({ item, sizes }) {
  return (
    <figure className="group">
      <div
        className="overflow-hidden bg-beige/40"
        style={{ aspectRatio: `${item.width} / ${item.height}` }}
      >
        <Image
          src={item.src}
          alt={item.alt}
          width={item.width * 160}
          height={item.height * 160}
          sizes={sizes}
          className="size-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05] motion-reduce:transform-none motion-reduce:transition-none"
        />
      </div>
      <figcaption className="mt-4 flex items-baseline justify-between gap-4">
        <span className="font-display text-lg text-espresso">{item.caption}</span>
        <span className="label text-espresso/35">{item.note}</span>
      </figcaption>
    </figure>
  );
}

export default AtmosphereGallery;
