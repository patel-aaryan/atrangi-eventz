"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Phone } from "lucide-react";
import type { ContactInfo } from "@/types/checkout";

interface ContactFormProps {
  data: ContactInfo;
  errors: Partial<Record<keyof ContactInfo, string>>;
  onChange: (field: keyof ContactInfo, value: string) => void;
}

export function ContactForm({ data, errors, onChange }: ContactFormProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Mail className="w-5 h-5" />
          Contact Information
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          We&apos;ll send tickets and updates to this email
        </p>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 overflow-auto">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">
              First Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="firstName"
              value={data.firstName}
              onChange={(e) => onChange("firstName", e.target.value)}
              placeholder="John"
              className={errors.firstName ? "border-destructive" : ""}
            />
            {errors.firstName && (
              <p className="text-sm text-destructive">{errors.firstName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">
              Last Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="lastName"
              value={data.lastName}
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
          <Label htmlFor="email">
            Email Address <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="john.doe@example.com"
            className={errors.email ? "border-destructive" : ""}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmEmail">
            Confirm Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="confirmEmail"
            type="email"
            value={data.confirmEmail}
            onChange={(e) => onChange("confirmEmail", e.target.value)}
            placeholder="john.doe@example.com"
            className={errors.confirmEmail ? "border-destructive" : ""}
          />
          {errors.confirmEmail && (
            <p className="text-sm text-destructive">{errors.confirmEmail}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">
            Phone Number <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Input
              id="phone"
              type="tel"
              value={data.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              placeholder="(555) 123-4567"
              className={errors.phone ? "border-destructive" : ""}
            />
            <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone}</p>
          )}
          <p className="text-xs text-muted-foreground">
            For important event updates and ticket verification
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
