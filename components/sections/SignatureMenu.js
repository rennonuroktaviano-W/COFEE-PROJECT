import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { PlaceholderNotice } from "@/components/ui/PlaceholderNotice";
import { formatPrice, hasUnverifiedItems, menu } from "@/data/menu";
import { site } from "@/data/site";

/**
 * Section 03 — Signature Coffee (PRD 5.03).
 * Editorial cards. Unconfirmed items render their fallback label plus an
 * explicit "belum diverifikasi" badge rather than a fabricated name or price,
 * and the price line reads "Harga belum dikonfirmasi" instead of a number.
 */
export function SignatureMenu() {
  const showNotice = hasUnverifiedItems();

  return (
    <section id="menu" className="relative scroll-mt-20 bg-cream py-24 md:py-32 lg:py-40">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal>
              <SectionLabel index>Signature</SectionLabel>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-6 font-display text-[clamp(2.25rem,6vw,4rem)] leading-[1.02] font-light tracking-[-0.02em] text-balance text-espresso">
                Menu unggulan,
                <br />
                <em className="italic text-roasted">pilihan tetap</em> kami.
              </h2>
            </Reveal>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <Reveal delay={160}>
              <p className="text-[0.95rem] leading-relaxed text-espresso/65">
                Daftar menu dan harga resmi Smiljan belum dikonfirmasi. Selama data
                belum tersedia, kartu di bawah memakai placeholder yang jelas.
              </p>
            </Reveal>
          </div>
        </div>

        {showNotice ? (
          <Reveal delay={200} className="mt-10">
            <PlaceholderNotice>
              Konten menu belum diverifikasi — ganti nilai di{" "}
              <code className="font-sans tracking-normal text-espresso/70">data/menu.js</code>{" "}
              untuk dipublikasikan.
            </PlaceholderNotice>
          </Reveal>
        ) : null}

        <ul className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4 lg:gap-x-7">
          {menu.map((item, index) => (
            <li key={item.id}>
              <Reveal delay={index * 90}>
                <MenuCard item={item} />
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal delay={120}>
          <p className="mt-14 max-w-2xl border-t border-espresso/12 pt-7 text-sm leading-relaxed text-espresso/55">
            Ingin melihat pilihan lengkap? Daftar resmi akan dipublikasikan di sini setelah
            dikonfirmasi oleh {site.name}.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function MenuCard({ item }) {
  const displayName = item.name ?? item.fallbackName;
  const displayDescription = item.description ?? item.fallbackDescription;

  return (
    <article className="group">
      <div className="relative aspect-[4/5] overflow-hidden bg-beige/40">
        <Image
          src={item.image.src}
          alt={item.image.alt}
          width={640}
          height={800}
          sizes="(min-width: 1280px) 22vw, (min-width: 640px) 45vw, 92vw"
          className="size-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] motion-reduce:transform-none motion-reduce:transition-none"
        />
        <span className="label absolute top-4 left-4 rounded-full bg-cream/90 px-3 py-1.5 text-espresso/70">
          {String(indexLabel(item)).padStart(2, "0")}
        </span>
      </div>

      <div className="mt-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl leading-snug text-espresso">{displayName}</h3>
          {item.verified ? null : (
            <span
              className="label mt-1 shrink-0 rounded-full border border-olive/40 px-2.5 py-1 text-olive"
              title="Data belum dikonfirmasi"
            >
              Placeholder
            </span>
          )}
        </div>

        <p className="mt-2.5 text-sm leading-relaxed text-espresso/60">{displayDescription}</p>

        <p
          className={`mt-4 text-sm ${
            item.price === null ? "italic text-olive" : "text-espresso"
          }`}
        >
          {formatPrice(item.price)}
        </p>
      </div>
    </article>
  );
}

function indexLabel(item) {
  return menu.findIndex((entry) => entry.id === item.id) + 1;
}

export default SignatureMenu;
