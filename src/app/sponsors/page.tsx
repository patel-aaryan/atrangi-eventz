import {
  HeroSection,
  CurrentSponsorsSection,
  ContactCTASection,
} from "@/components/sponsors";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export default function SponsorsPage() {
  return (
    <section className="relative overflow-hidden pt-8">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-pink-500/20" />
      </div>

      <HeroSection fadeInUp={fadeInUp} staggerContainer={staggerContainer} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CurrentSponsorsSection
          fadeInUp={fadeInUp}
          staggerContainer={staggerContainer}
        />
        <ContactCTASection fadeInUp={fadeInUp} />
      </div>
    </section>
  );
}
