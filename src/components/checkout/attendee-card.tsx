"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User, Mail } from "lucide-react";
import type { AttendeeInfo } from "@/types/checkout";

interface AttendeeCardProps {
  attendee: AttendeeInfo;
  index: number;
  errors: Partial<Record<keyof AttendeeInfo, string>>;
  onChange: (field: keyof AttendeeInfo, value: string) => void;
}

export function AttendeeCard({
  attendee,
  index,
  errors,
  onChange,
}: Readonly<AttendeeCardProps>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="w-5 h-5" />
              Attendee {index + 1}
            </CardTitle>
            <Badge variant="outline">{attendee.ticketName}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`firstName-${attendee.ticketId}`}>
                First Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id={`firstName-${attendee.ticketId}`}
                value={attendee.firstName}
                onChange={(e) => onChange("firstName", e.target.value)}
                placeholder="John"
                className={errors.firstName ? "border-destructive" : ""}
              />
              {errors.firstName && (
                <p className="text-sm text-destructive">{errors.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`lastName-${attendee.ticketId}`}>
                Last Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id={`lastName-${attendee.ticketId}`}
                value={attendee.lastName}
                onChange={(e) => onChange("lastName", e.target.value)}
                placeholder="Doe"
                className={errors.lastName ? "border-destructive" : ""}
              />
              {errors.lastName && (
                <p className="text-sm text-destructive">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`email-${attendee.ticketId}`}>
              Email Address <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id={`email-${attendee.ticketId}`}
                type="email"
                value={attendee.email}
                onChange={(e) => onChange("email", e.target.value)}
                placeholder="john.doe@example.com"
                className={errors.email ? "border-destructive" : ""}
              />
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Each attendee will receive their own ticket
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
