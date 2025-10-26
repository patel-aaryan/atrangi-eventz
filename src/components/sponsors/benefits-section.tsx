"use client";

import { motion, Variants } from "framer-motion";
import { Handshake, TrendingUp, Users, Award } from "lucide-react";

interface BenefitsSectionProps {
  fadeInUp: Variants;
  staggerContainer: Variants;
}

const benefits = [
  {
    icon: Users,
    title: "Community Reach",
    description:
      "Access to 500+ engaged Gujarati students across Ontario universities.",
  },
  {
    icon: TrendingUp,
    title: "Brand Visibility",
    description:
      "Featured placement at events and across our social media platforms.",
  },
  {
    icon: Award,
    title: "Cultural Impact",
    description: "Support meaningful cultural events and student initiatives.",
  },
  {
    icon: Handshake,
    title: "Partnership Benefits",
    description: "Customized packages tailored to your marketing objectives.",
  },
];

export function BenefitsSection({
  fadeInUp,
  staggerContainer,
}: BenefitsSectionProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="mb-20"
    >
      <motion.div variants={fadeInUp} className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
          Why{" "}
          <span className="bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
            Partner With Us?
          </span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Join us in creating memorable experiences while reaching a vibrant
          community of students across Ontario.
        </p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            variants={fadeInUp}
            className="p-6 rounded-xl bg-background/50 backdrop-blur border border-border hover:border-primary/50 transition-colors text-center"
          >
            <benefit.icon className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
            <p className="text-sm text-muted-foreground">
              {benefit.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
