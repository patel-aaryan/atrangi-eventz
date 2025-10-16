"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Handshake, TrendingUp, Users, Award, Mail } from "lucide-react";
import Link from "next/link";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
};

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

export default function SponsorsPage() {
  return (
    <section className="relative overflow-hidden pt-8">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-pink-500/20" />
      </div>

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

        {/* Sponsor Benefits */}
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
            {[
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
                description:
                  "Support meaningful cultural events and student initiatives.",
              },
              {
                icon: Handshake,
                title: "Partnership Benefits",
                description:
                  "Customized packages tailored to your marketing objectives.",
              },
            ].map((benefit, index) => (
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

        {/* Current Sponsors Section */}
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
              We&apos;re grateful to work with amazing partners who believe in
              our mission.
            </p>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="p-12 rounded-2xl bg-background/50 backdrop-blur border border-border text-center"
          >
            <p className="text-xl text-muted-foreground">
              Our sponsor showcase will be updated soon. We&apos;re actively
              seeking partnerships for our upcoming events.
            </p>
          </motion.div>
        </motion.div>

        {/* Sponsorship Tiers */}
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
              <motion.div
                key={index}
                variants={fadeInUp}
                className={`p-8 rounded-2xl border-2 ${
                  pkg.featured
                    ? "border-primary bg-primary/5"
                    : "border-border bg-background/50"
                } backdrop-blur relative overflow-hidden flex flex-col`}
              >
                {pkg.featured && (
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                    Popular
                  </div>
                )}
                <div
                  className={`inline-block px-4 py-2 rounded-lg bg-gradient-to-r ${pkg.color} text-white font-bold text-lg mb-6`}
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
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center p-12 mb-8 rounded-3xl bg-gradient-to-br from-primary/10 via-background to-pink-500/10 border border-border"
        >
          <Mail className="w-16 h-16 text-primary mx-auto mb-6" />
          <h3 className="text-3xl font-bold mb-4">Interested in Sponsoring?</h3>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            We&apos;d love to discuss how we can create a mutually beneficial
            partnership. Reach out to learn more about our sponsorship
            opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-primary to-pink-500 hover:opacity-90"
            >
              <Link href="/#contact">Contact Us</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/events">View Our Events</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
