"use client";

import { motion, Variants } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

interface CurrentSponsorsSectionProps {
  fadeInUp: Variants;
  staggerContainer: Variants;
}

export function CurrentSponsorsSection({
  fadeInUp,
  staggerContainer,
}: Readonly<CurrentSponsorsSectionProps>) {
  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      variants={staggerContainer}
      className="mb-20"
    >
      <motion.div variants={fadeInUp} className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
          Our{" "}
          <span className="bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
            Partners
          </span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We&apos;re grateful to work with amazing partners who believe in our
          mission.
        </p>
      </motion.div>
      <motion.div variants={fadeInUp}>
        <Card className="bg-background/50 backdrop-blur">
          <CardContent className="p-12 text-center">
            <p className="text-xl text-muted-foreground">
              Our sponsor showcase will be updated soon. We&apos;re actively
              seeking partnerships for our upcoming events.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
