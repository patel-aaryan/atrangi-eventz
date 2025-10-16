"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, Music, Sparkles, Users } from "lucide-react";
import { FaInstagram, FaYoutube } from "react-icons/fa";
import Link from "next/link";
import { siteConfig } from "@/lib/metadata";
import { EVENTS } from "@/lib/constants";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-pink-500/20" />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="text-center space-y-8"
          >
            <motion.div variants={fadeInUp} className="space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="inline-block"
              >
                <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
              </motion.div>
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
                <span className="block bg-gradient-to-r from-primary via-pink-500 to-purple-500 bg-clip-text text-transparent">
                  Atrangi Eventz
                </span>
              </h1>
              <p className="text-xl sm:text-2xl md:text-3xl text-muted-foreground font-medium">
                Student Organization
              </p>
            </motion.div>

            <motion.p
              variants={fadeInUp}
              className="text-lg sm:text-xl md:text-2xl text-foreground/80 max-w-3xl mx-auto leading-relaxed"
            >
              Uniting Gujarati Students of Ontario with exciting{" "}
              <span className="text-primary font-semibold">
                Bollywood club parties
              </span>
              ,{" "}
              <span className="text-pink-500 font-semibold">
                vibrant garba events
              </span>
              {", "}and much more!
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button
                asChild
                size="lg"
                className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-pink-500 hover:opacity-90"
              >
                <Link href="#events">Explore Events</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-2"
              >
                <Link href="#about">Learn More</Link>
              </Button>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="flex gap-6 justify-center items-center pt-8"
            >
              <Link
                href={siteConfig.links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/60 hover:text-foreground transition-colors"
              >
                <FaInstagram className="w-6 h-6" />
              </Link>
              <Link
                href={siteConfig.links.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/60 hover:text-foreground transition-colors"
              >
                <FaYoutube className="w-6 h-6" />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-foreground/20 rounded-full flex justify-center pt-2"
          >
            <motion.div className="w-1.5 h-1.5 bg-foreground/40 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
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
                We&apos;re a vibrant student organization dedicated to
                celebrating Gujarati culture and bringing together students
                across Ontario through unforgettable experiences.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-8"
            >
              {[
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
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="p-8 rounded-2xl bg-background/50 backdrop-blur border border-border hover:border-primary/50 transition-colors group"
                >
                  <feature.icon className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-2xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-24">
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
                Our{" "}
                <span className="bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
                  Events
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
                From energetic Bollywood club nights to traditional Garba
                celebrations, we bring the best of Gujarati culture to life.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              className="grid md:grid-cols-2 gap-8"
            >
              {EVENTS.map((event, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.03 }}
                  className="relative p-8 rounded-2xl bg-background/50 backdrop-blur border border-border overflow-hidden group cursor-pointer"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${event.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}
                  />
                  <div className="relative z-10">
                    <div className="text-5xl mb-4">{event.emoji}</div>
                    <h3 className="text-2xl font-semibold mb-3">
                      {event.title}
                    </h3>
                    <p className="text-muted-foreground">{event.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeInUp} className="text-center">
              <Button
                asChild
                size="lg"
                className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-pink-500 hover:opacity-90"
              >
                <Link href="#contact">Get Event Updates</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="contact"
        className="py-24 bg-gradient-to-br from-primary/10 via-background to-pink-500/10"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center space-y-8 p-12 rounded-3xl bg-background/50 backdrop-blur border border-border"
          >
            <h2 className="text-4xl sm:text-5xl font-bold">
              Join the{" "}
              <span className="bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
                Atrangi
              </span>{" "}
              Family
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground">
              Don&apos;t miss out on our upcoming events! Follow us on social
              media for the latest updates, event announcements, and exclusive
              content.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-pink-500 hover:opacity-90"
              >
                <Link
                  href={siteConfig.links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram className="w-5 h-5 mr-2" />
                  Follow on Instagram
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-2"
              >
                <Link
                  href={siteConfig.links.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaYoutube className="w-5 h-5 mr-2" />
                  Subscribe on YouTube
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sponsors Anchor */}
      <div id="sponsors" className="h-1" />
    </div>
  );
}
