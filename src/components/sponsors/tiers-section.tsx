"use client";

import { motion, Variants } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface TiersSectionProps {
  fadeInUp: Variants;
  staggerContainer: Variants;
}

const sponsorshipTiers = [
  {
    tier: "Bronze",
    color: "from-orange-600 to-orange-400",
    features: [
      "Logo on event materials",
      "Social media mentions",
      "Event thank you",
      "Digital presence",
    ],
  },
  {
    tier: "Silver",
    color: "from-gray-400 to-gray-200",
    features: [
      "All Bronze benefits",
      "Featured logo placement",
      "Stage acknowledgment",
      "Booth space available",
      "Newsletter feature",
    ],
    featured: true,
  },
  {
    tier: "Gold",
    color: "from-yellow-600 to-yellow-400",
    features: [
      "All Silver benefits",
      "Title sponsor rights",
      "Premium booth space",
      "Speaking opportunity",
      "VIP event access",
      "Year-long partnership",
    ],
  },
];

export function TiersSection({
  fadeInUp,
  staggerContainer,
}: TiersSectionProps) {
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
          Sponsorship{" "}
          <span className="bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
            Packages
          </span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose a package that aligns with your goals and budget.
        </p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        className="grid md:grid-cols-3 gap-8"
      >
        {sponsorshipTiers.map((pkg, index) => (
          <motion.div key={index} variants={fadeInUp} className="h-full">
            <Card
              className={`h-full ${
                pkg.featured
                  ? "border-2 border-primary bg-primary/5"
                  : "border-2 bg-background/50"
              } backdrop-blur relative overflow-hidden flex flex-col`}
            >
              {pkg.featured && (
                <Badge className="absolute top-4 right-4">Popular</Badge>
              )}
              <CardContent className="p-8 flex flex-col h-full">
                <div
                  className={`inline-block px-4 py-2 rounded-lg bg-gradient-to-r ${pkg.color} text-white font-bold text-lg mb-6 self-start`}
                >
                  {pkg.tier}
                </div>
                <ul className="space-y-3 mb-8 flex-grow">
                  {pkg.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-sm text-foreground/80"
                    >
                      <span className="text-primary text-lg">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={pkg.featured ? "default" : "outline"}
                  className="w-full"
                  asChild
                >
                  <Link href="#contact">Get Started</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
