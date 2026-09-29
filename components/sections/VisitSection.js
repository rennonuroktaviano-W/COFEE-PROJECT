import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { PlaceholderNotice } from "@/components/ui/PlaceholderNotice";
import { site } from "@/data/site";

const MAP_ARROW = (
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
 * Section 06 — Visit Smiljan (PRD 5.06).
 * Only verified facts are rendered as values. The address and opening hours are
 * still unconfirmed, so they show an explicit placeholder instead of invented
 * information, while the directions button is a real, working Google Maps
 * search link.
 */
export function VisitSection() {
  const { location, hours, contact } = site;

  return (
    <section id="visit" className="relative scroll-mt-20 overflow-hidden bg-cream py-24 md:py-32 lg:py-40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -bottom-24 size-[34rem] rounded-full bg-beige/50 blur-3xl"
      />

      <div className="shell relative">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionLabel index>Visit Smiljan</SectionLabel>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-6 font-display text-[clamp(2.25rem,6vw,4rem)] leading-[1.02] font-light tracking-[-0.02em] text-balance text-espresso">
                Datang,
                <br />
                <em className="italic text-roasted">duduk</em> sebentar.
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-7 max-w-md text-[0.95rem] leading-relaxed text-espresso/65">
                Smiljan berada di {location.area}. Alamat lengkap, jam operasional, dan
                kontak resmi belum dikonfirmasi, sehingga belum ditampilkan di sini.
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="mt-9">
                <Button href={location.mapsUrl} size="lg" icon={MAP_ARROW}>
                  Petunjuk Arah
                </Button>
                <p className="label mt-4 text-espresso/35">
                  Membuka Google Maps — &ldquo;{location.mapsQuery}&rdquo;
                </p>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal delay={200}>
              <div className="border border-espresso/12 bg-cream/70 p-7 backdrop-blur-sm md:p-9">
                <h3 className="font-display text-2xl text-espresso">Informasi kunjungan</h3>

                <dl className="mt-7 divide-y divide-espresso/10">
                  <InfoRow label="Wilayah">{location.area}</InfoRow>

                  <InfoRow label="Alamat lengkap" pending={!location.verified}>
                    {location.addressLines
                      ? location.addressLines.join(", ")
                      : location.addressDisplay}
                  </InfoRow>

                  <InfoRow label="Jam operasional" pending={!hours.verified}>
                    {hours.entries
                      ? hours.entries.map((entry) => (
                          <span key={entry.days} className="block">
                            {entry.days} — {entry.time}
                          </span>
                        ))
                      : hours.display}
                  </InfoRow>

                  <InfoRow label="Kontak" pending={!contact.verified}>
                    {contact.phone ? (
                      <a
                        href={`tel:${contact.phone.replace(/\s/g, "")}`}
                        className="underline underline-offset-4 transition-colors hover:text-roasted"
                      >
                        {contact.phoneDisplay}
                      </a>
                    ) : (
                      contact.phoneDisplay
                    )}
                  </InfoRow>
                </dl>

                <div className="mt-7">
                  <PlaceholderNotice>
                    Alamat, jam, dan kontak masih menunggu konfirmasi resmi. Arahkan
                    pengguna lewat tombol Petunjuk Arah di samping.
                  </PlaceholderNotice>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoRow({ label, children, pending = false }) {
  return (
    <div className="grid gap-1.5 py-4 sm:grid-cols-9 sm:gap-4">
      <dt className="label text-espresso/40 sm:col-span-3">{label}</dt>
      <dd
        className={`text-[0.95rem] leading-relaxed sm:col-span-6 ${
          pending ? "italic text-olive" : "text-espresso"
        }`}
      >
        {children}
      </dd>
    </div>
  );
}

export default VisitSection;
