"use client";

import { motion, Variants } from "framer-motion";
import { Calendar, Music, Users } from "lucide-react";

interface AboutSectionProps {
  fadeInUp: Variants;
  staggerContainer: Variants;
}

const features = [
  {
    icon: Users,
    title: "Community Building",
    description:
      "Connecting Gujarati students across Ontario and creating lasting friendships.",
  },
  {
    icon: Music,
    title: "Cultural Celebrations",
    description:
      "Hosting vibrant Bollywood parties and traditional Garba nights throughout the year.",
  },
  {
    icon: Calendar,
    title: "Regular Events",
    description:
      "Organizing exciting events that showcase the richness of our culture and heritage.",
  },
];

export function AboutSection({
  fadeInUp,
  staggerContainer,
}: AboutSectionProps) {
  return (
    <section id="about" className="py-24 bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="space-y-16"
        >
          <motion.div variants={fadeInUp} className="text-center space-y-4">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold">
              About{" "}
              <span className="bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
                Atrangi Eventz
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              We&apos;re a vibrant student organization dedicated to celebrating
              Gujarati culture and bringing together students across Ontario
              through unforgettable experiences.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="p-8 rounded-2xl bg-background/50 backdrop-blur border border-border hover:border-primary/50 transition-colors group"
              >
                <feature.icon className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
