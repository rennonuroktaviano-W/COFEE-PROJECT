import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";

/**
 * Display serif — editorial, high character (PRD 4.3). Fraunces' optical-size
 * and WONK axes give the headlines their distinctive shapes.
 * next/font self-hosts the files at build time, so there is no runtime request
 * to a third-party font host.
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
  variable: "--font-fraunces",
});

/** Neutral sans for body copy and small labels. */
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

/** Production origin — override per environment. */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://smiljan.coffee";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${site.name} — Coffee Shop Klasik di ${site.location.area}`,
    template: `%s — ${site.name}`,
  },
  description: site.shortDescription,
  applicationName: site.name,
  keywords: [
    "coffee shop Cipete",
    "kafe Cipete",
    "coffee shop Jakarta Selatan",
    "kopi klasik",
    site.name,
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE_URL,
    siteName: site.name,
    title: `${site.name} — Coffee Shop Klasik di ${site.location.area}`,
    description: site.shortDescription,
    images: [
      {
        url: "/placeholders/hero-cup-poster.svg",
        width: 900,
        height: 900,
        alt: `${site.name} — cangkir kopi`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Coffee Shop Klasik di ${site.location.area}`,
    description: site.shortDescription,
    images: ["/placeholders/hero-cup-poster.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: "/icon.svg",
  },
  formatDetection: { telephone: false },
};

/**
 * Structured data limited to facts already confirmed (PRD 12). The address,
 * opening hours and contact details are deliberately omitted rather than
 * guessed, and can be added once the client supplies them.
 */
export const viewport = {
  themeColor: "#241711",
  colorScheme: "light",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CafeOrCoffeeShop",
  name: site.name,
  url: SITE_URL,
  description: site.shortDescription,
  image: `${SITE_URL}/placeholders/hero-cup-poster.svg`,
  address: {
    "@type": "PostalAddress",
    addressLocality: site.location.area,
    // Street address intentionally omitted: not yet confirmed by the client.
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${fraunces.variable} ${inter.variable}`}>
      <head>
        {/* Marks the document as JS-capable so scroll-reveal styles only apply
            once JavaScript can actually un-hide the content. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="grain bg-cream text-espresso antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[70] focus:rounded-full focus:bg-espresso focus:px-5 focus:py-3 focus:text-cream"
        >
          Lewati ke konten utama
        </a>
        {children}
      </body>
    </html>
  );
}
