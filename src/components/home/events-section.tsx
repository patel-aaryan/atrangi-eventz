"use client";

import { motion, Variants } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { EVENTS } from "@/constants/events";

interface EventsSectionProps {
  fadeInUp: Variants;
  staggerContainer: Variants;
}

export function EventsSection({
  fadeInUp,
  staggerContainer,
}: Readonly<EventsSectionProps>) {
  return (
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
                className="h-full"
              >
                <Card className="h-full relative overflow-hidden group cursor-pointer bg-background/50 backdrop-blur transition-colors">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${event.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}
                  />
                  <CardContent className="relative z-10 p-8">
                    <div className="text-5xl mb-4">{event.emoji}</div>
                    <h3 className="text-2xl font-semibold mb-3">
                      {event.title}
                    </h3>
                    <p className="text-muted-foreground">{event.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
