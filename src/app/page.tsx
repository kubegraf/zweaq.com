import { Hero } from '@/components/sections/Hero';
import { ProductStatement } from '@/components/sections/ProductStatement';
import { InteractiveDemo } from '@/components/sections/InteractiveDemo';
import { NotAHealthRing } from '@/components/sections/NotAHealthRing';
import { PhoneDisappears } from '@/components/sections/PhoneDisappears';
import { AiSection } from '@/components/sections/AiSection';
import { VaultSection } from '@/components/sections/VaultSection';
import { DriveSection } from '@/components/sections/DriveSection';
import { IdentitySection } from '@/components/sections/IdentitySection';
import { NfcSection } from '@/components/sections/NfcSection';
import { DisplaySection } from '@/components/sections/DisplaySection';
import { GesturesSection } from '@/components/sections/GesturesSection';
import { HapticsSection } from '@/components/sections/HapticsSection';
import { SensorsSection } from '@/components/sections/SensorsSection';
import { SecuritySection } from '@/components/sections/SecuritySection';
import { OfflineSection } from '@/components/sections/OfflineSection';
import { EcosystemSection } from '@/components/sections/EcosystemSection';
import { TechnologySection } from '@/components/sections/TechnologySection';
import { VariantsSection } from '@/components/sections/VariantsSection';
import { PricingSection } from '@/components/sections/PricingSection';
import { ComparisonSection } from '@/components/sections/ComparisonSection';
import { DockSection } from '@/components/sections/DockSection';
import { RoadmapSection } from '@/components/sections/RoadmapSection';
import { FaqSection } from '@/components/sections/FaqSection';
import { WaitlistSection } from '@/components/sections/WaitlistSection';
import { productSchema, faqSchema } from '@/lib/schema';

/**
 * Homepage.
 *
 * Order matters and is deliberate: state the category, prove it is a different
 * category, then let someone touch it, then argue, then explain, then price it,
 * then ask. The interactive demo sits early because a visitor who has operated
 * the product reads the rest of the page differently.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <ProductStatement />
      <InteractiveDemo />
      <NotAHealthRing />
      <PhoneDisappears />
      <AiSection />
      <VaultSection />
      <DriveSection />
      <IdentitySection />
      <NfcSection />
      <DisplaySection />
      <GesturesSection />
      <HapticsSection />
      <SensorsSection />
      <SecuritySection />
      <OfflineSection />
      <EcosystemSection />
      <TechnologySection />
      <VariantsSection />
      <PricingSection />
      <ComparisonSection />
      <DockSection />
      <RoadmapSection />
      <FaqSection />
      <WaitlistSection />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema()) }}
      />
    </>
  );
}
