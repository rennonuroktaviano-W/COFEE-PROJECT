/**
 * Brand, location and link data for Smiljan.
 *
 * IMPORTANT — PRD section 12 forbids inventing business facts.
 * Every field that has not been verified with the client is `null` and
 * flagged with `verified: false`. The UI is responsible for rendering an
 * explicit "belum dikonfirmasi" state instead of a fabricated value.
 * To publish the site, replace the nulls below with the official details.
 */

export const site = {
  name: "Smiljan",
  wordmark: "SMILJAN",
  category: "Coffee Shop",
  /**
   * Temporary brand copy (PRD 12 allows placeholder copy while the official
   * brand story is still being prepared). Replace with official copy when ready.
   */
  tagline: "A timeless coffee ritual.",
  description:
    "Smiljan adalah coffee shop klasik di Cipete. Suasana hangat, ritme yang tenang, dan kopi yang dibuat tanpa terburu-buru.",
  shortDescription:
    "Coffee shop klasik di Cipete. Kedai hangat untuk minum kopi dengan ritme yang tenang.",

  // ---------------------------------------------------------------- location
  location: {
    area: "Cipete, Jakarta Selatan",
    /** Full street address — not supplied by the client yet. */
    addressLines: null,
    addressDisplay: "Alamat lengkap menunggu konfirmasi",
    /**
     * A Google Maps *search* link. This is deliberately a query rather than a
     * fabricated pin, so it resolves correctly without inventing an address.
     */
    mapsQuery: "Smiljan Coffee Shop Cipete Jakarta Selatan",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Smiljan%20Coffee%20Shop%20Cipete%20Jakarta%20Selatan",
    verified: false,
  },

  // ------------------------------------------------------------------- hours
  hours: {
    display: "Jam operasional menunggu konfirmasi",
    /** e.g. [{ days: "Senin – Jumat", time: "08.00 – 22.00" }] */
    entries: null,
    verified: false,
  },

  // ----------------------------------------------------------------- contact
  contact: {
    phone: null,
    phoneDisplay: "Nomor kontak belum tersedia",
    whatsapp: null,
    email: null,
    verified: false,
  },

  // ------------------------------------------------------------------ social
  /**
   * Only verified, official accounts may be rendered as links. Unverified
   * entries must stay `null` so the footer can show an honest notice
   * instead of a button that looks clickable but does nothing (PRD 9).
   */
  social: {
    instagram: null,
    instagramDisplay: "@smiljan — menunggu verifikasi",
    facebook: null,
    tiktok: null,
    x: null,
    verified: false,
  },
};

/** Anchor targets used by the masthead and the hero CTAs. */
export const navSections = [
  { id: "menu", label: "Menu" },
  { id: "space", label: "Suasana" },
  { id: "craft", label: "Ritual" },
  { id: "visit", label: "Kunjungi" },
];

/** Social links that are confirmed and safe to render as anchors. */
export function getVerifiedSocialLinks() {
  const entries = [
    { key: "instagram", label: "Instagram", href: site.social.instagram },
    { key: "facebook", label: "Facebook", href: site.social.facebook },
    { key: "tiktok", label: "TikTok", href: site.social.tiktok },
    { key: "x", label: "X", href: site.social.x },
  ];
  return entries.filter((entry) => Boolean(entry.href));
}

export default site;
