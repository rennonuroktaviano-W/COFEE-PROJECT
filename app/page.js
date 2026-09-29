import { Masthead } from "@/components/layout/Masthead";
import { HeroSection } from "@/components/sections/HeroSection";
import { BrandStatement } from "@/components/sections/BrandStatement";
import { SignatureMenu } from "@/components/sections/SignatureMenu";
import { AtmosphereGallery } from "@/components/sections/AtmosphereGallery";
import { CoffeeRitual } from "@/components/sections/CoffeeRitual";
import { VisitSection } from "@/components/sections/VisitSection";
import { ClosingCTA } from "@/components/sections/ClosingCTA";

/**
 * Smiljan landing page composition (PRD 5).
 * Frontend only — no backend, database, auth, CMS, ordering or booking.
 */
export default function Home() {
  return (
    <>
      <Masthead />
      <main id="main">
        <HeroSection />
        <BrandStatement />
        <SignatureMenu />
        <AtmosphereGallery />
        <CoffeeRitual />
        <VisitSection />
        <ClosingCTA />
      </main>
    </>
  );
}
