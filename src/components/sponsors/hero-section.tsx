"use client";

import { motion, Variants } from "framer-motion";

interface HeroSectionProps {
  fadeInUp: Variants;
  staggerContainer: Variants;
}

export function HeroSection({
  fadeInUp,
  staggerContainer,
}: Readonly<HeroSectionProps>) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial="initial"
        animate="animate"
        variants={staggerContainer}
        className="text-center space-y-6 mb-16"
      >
        <motion.div variants={fadeInUp}>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight">
            <span className="block bg-gradient-to-r from-primary via-pink-500 to-purple-500 bg-clip-text text-transparent">
              Our Sponsors
            </span>
          </h1>
        </motion.div>

        <motion.p
          variants={fadeInUp}
          className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto"
        >
          Atrangi Eventz is made possible by the generous support of our
          partners and sponsors who share our vision of celebrating Gujarati
          culture and bringing students together.
        </motion.p>
      </motion.div>
    </div>
  );
}
