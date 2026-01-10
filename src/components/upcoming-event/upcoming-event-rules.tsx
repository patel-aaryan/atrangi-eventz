"use client";

import { motion } from "framer-motion";
import { Shield, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { UpcomingEventItem } from "@/types/event";

interface UpcomingEventRulesProps {
  readonly event: UpcomingEventItem;
}

export function UpcomingEventRules({ event }: UpcomingEventRulesProps) {
  // Default event rules - can be customized per event later
  const eventRules = [
    {
      icon: CheckCircle,
      title: "Valid ID Required",
      description:
        "Please bring a valid government-issued ID for entry verification.",
    },
    {
      icon: Clock,
      title: "Arrive Early",
      description:
        "Doors open 30 minutes before the event start time. Please arrive early to avoid delays.",
    },
    {
      icon: Shield,
      title: "Respect Everyone",
      description:
        "We maintain a zero-tolerance policy for harassment, discrimination, or disruptive behavior.",
    },
    {
      icon: AlertCircle,
      title: "No Outside Food or Drinks",
      description:
        "Outside food and beverages are not permitted. Refreshments will be available at the venue.",
    },
  ];

  // Important information
  const importantInfo = [
    "Tickets are non-refundable and non-transferable.",
    "Event schedule and lineup are subject to change.",
    "Photography and videography may occur during the event.",
    "Lost or stolen tickets cannot be replaced.",
  ];

  return (
    <motion.section
      id="rules"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-purple-500/10">
          <Shield className="w-6 h-6 text-purple-500" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold">
          Event Rules & Guidelines
        </h2>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {eventRules.map((rule, index) => {
          const Icon = rule.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-2 h-full hover:border-primary transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">{rule.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {rule.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Important Information */}
      <Alert className="border-2 border-yellow-500/50 bg-yellow-500/10">
        <AlertCircle className="h-5 w-5 text-yellow-500" />
        <AlertDescription className="ml-2">
          <h3 className="font-semibold text-lg mb-3">Important Information</h3>
          <ul className="space-y-2">
            {importantInfo.map((info, index) => (
              <li key={index} className="text-sm flex items-start gap-2">
                <span className="text-yellow-500 mt-0.5">•</span>
                <span>{info}</span>
              </li>
            ))}
          </ul>
        </AlertDescription>
      </Alert>

      {/* Contact Information */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            If you have any questions or concerns about the event, please
            don&apos;t hesitate to reach out to us. We&apos;re here to help
            ensure you have the best experience possible!
          </p>
        </CardContent>
      </Card>
    </motion.section>
  );
}
