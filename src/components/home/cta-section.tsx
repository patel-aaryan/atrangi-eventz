"use client";

import { motion, Variants } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaInstagram, FaYoutube } from "react-icons/fa";
import Link from "next/link";
import { siteConfig } from "@/lib/metadata";

interface CTASectionProps {
  fadeInUp: Variants;
}

export function CTASection({ fadeInUp }: CTASectionProps) {
  return (
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
        >
          <Card className="bg-background/50 backdrop-blur">
            <CardContent className="text-center space-y-8 p-12">
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
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
