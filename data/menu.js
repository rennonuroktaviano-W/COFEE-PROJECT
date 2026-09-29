/**
 * Signature coffee data (PRD 5.03).
 *
 * PRD 12 explicitly forbids inventing menu items or prices, so every
 * unconfirmed field is `null`. Each item carries a `fallbackName` /
 * `fallbackDescription` used purely to keep the editorial layout composed
 * while the card is clearly badged as unverified.
 *
 * To publish: fill in `name`, `description`, `price` and `image.src` with
 * the official data, then flip `verified` to true. The "belum diverifikasi"
 * notice disappears automatically.
 */

const PLACEHOLDER_DESCRIPTION =
  "Deskripsi singkat item ini akan diisi setelah data menu resmi dikonfirmasi.";

export const menu = [
  {
    id: "signature-01",
    name: null,
    fallbackName: "Item Unggulan 01",
    description: null,
    fallbackDescription: PLACEHOLDER_DESCRIPTION,
    /** Rupiah, integer. null until the client confirms pricing. */
    price: null,
    image: {
      src: "/placeholders/drink-01.svg",
      alt: "Placeholder editorial visual untuk item menu unggulan pertama Smiljan",
    },
    verified: false,
  },
  {
    id: "signature-02",
    name: null,
    fallbackName: "Item Unggulan 02",
    description: null,
    fallbackDescription: PLACEHOLDER_DESCRIPTION,
    price: null,
    image: {
      src: "/placeholders/drink-02.svg",
      alt: "Placeholder editorial visual untuk item menu unggulan kedua Smiljan",
    },
    verified: false,
  },
  {
    id: "signature-03",
    name: null,
    fallbackName: "Item Unggulan 03",
    description: null,
    fallbackDescription: PLACEHOLDER_DESCRIPTION,
    price: null,
    image: {
      src: "/placeholders/drink-03.svg",
      alt: "Placeholder editorial visual untuk item menu unggulan ketiga Smiljan",
    },
    verified: false,
  },
  {
    id: "signature-04",
    name: null,
    fallbackName: "Item Unggulan 04",
    description: null,
    fallbackDescription: PLACEHOLDER_DESCRIPTION,
    price: null,
    image: {
      src: "/placeholders/drink-04.svg",
      alt: "Placeholder editorial visual untuk item menu unggulan keempat Smiljan",
    },
    verified: false,
  },
];

/** True while at least one item is still missing official data. */
export function hasUnverifiedItems(items = menu) {
  return items.some((item) => !item.verified);
}

/** Formats a confirmed price, or returns an explicit unconfirmed label. */
export function formatPrice(price) {
  if (typeof price !== "number" || Number.isNaN(price)) {
    return "Harga belum dikonfirmasi";
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

export default menu;
