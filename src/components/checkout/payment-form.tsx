"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Lock, ShieldCheck, ChevronLeft } from "lucide-react";
import type { PaymentFormData } from "@/types/checkout";
import {
  EXPIRY_DATE_REGEX,
  CARD_NUMBER_MAX_LENGTH,
  CARD_EXPIRY_MAX_LENGTH,
  CARD_CVC_MAX_LENGTH,
} from "@/constants/checkout";

interface PaymentFormProps {
  onSubmit: (formData: PaymentFormData) => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

export function PaymentForm({
  onSubmit,
  onBack,
  isSubmitting = false,
}: PaymentFormProps) {
  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    cardName: "",
    billingZip: "",
    agreeToTerms: false,
    subscribeToNewsletter: false,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof PaymentFormData, string>>
  >({});

  const handleInputChange = (
    field: keyof PaymentFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PaymentFormData, string>> = {};

    // Payment validation
    if (!formData.cardNumber) {
      newErrors.cardNumber = "Card number is required";
    } else if (formData.cardNumber.replace(/\s/g, "").length < 13) {
      newErrors.cardNumber = "Invalid card number";
    }

    if (!formData.cardExpiry) {
      newErrors.cardExpiry = "Expiry date is required";
    } else if (!EXPIRY_DATE_REGEX.test(formData.cardExpiry)) {
      newErrors.cardExpiry = "Invalid format (MM/YY)";
    }

    if (!formData.cardCvc) {
      newErrors.cardCvc = "CVC is required";
    } else if (formData.cardCvc.length < 3) {
      newErrors.cardCvc = "Invalid CVC";
    }

    if (!formData.cardName) newErrors.cardName = "Cardholder name is required";
    if (!formData.billingZip) newErrors.billingZip = "Billing ZIP is required";

    // Terms
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  // Format card number with spaces
  const handleCardNumberChange = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    handleInputChange("cardNumber", formatted.slice(0, CARD_NUMBER_MAX_LENGTH));
  };

  // Format expiry date
  const handleExpiryChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      handleInputChange(
        "cardExpiry",
        `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`
      );
    } else {
      handleInputChange("cardExpiry", cleaned);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Payment Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Information
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter your payment details to complete your purchase
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">
              Card Number <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="cardNumber"
                value={formData.cardNumber}
                onChange={(e) => handleCardNumberChange(e.target.value)}
                placeholder="1234 5678 9012 3456"
                maxLength={CARD_NUMBER_MAX_LENGTH}
                className={errors.cardNumber ? "border-destructive" : ""}
              />
              <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            </div>
            {errors.cardNumber && (
              <p className="text-sm text-destructive">{errors.cardNumber}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cardExpiry">
                Expiry Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="cardExpiry"
                value={formData.cardExpiry}
                onChange={(e) => handleExpiryChange(e.target.value)}
                placeholder="MM/YY"
                maxLength={CARD_EXPIRY_MAX_LENGTH}
                className={errors.cardExpiry ? "border-destructive" : ""}
              />
              {errors.cardExpiry && (
                <p className="text-sm text-destructive">{errors.cardExpiry}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardCvc">
                CVC <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="cardCvc"
                  value={formData.cardCvc}
                  onChange={(e) =>
                    handleInputChange(
                      "cardCvc",
                      e.target.value
                        .replace(/\D/g, "")
                        .slice(0, CARD_CVC_MAX_LENGTH)
                    )
                  }
                  placeholder="123"
                  maxLength={CARD_CVC_MAX_LENGTH}
                  className={errors.cardCvc ? "border-destructive" : ""}
                />
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
              {errors.cardCvc && (
                <p className="text-sm text-destructive">{errors.cardCvc}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardName">
              Cardholder Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="cardName"
              value={formData.cardName}
              onChange={(e) => handleInputChange("cardName", e.target.value)}
              placeholder="John Doe"
              className={errors.cardName ? "border-destructive" : ""}
            />
            {errors.cardName && (
              <p className="text-sm text-destructive">{errors.cardName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="billingZip">
              Billing ZIP Code <span className="text-destructive">*</span>
            </Label>
            <Input
              id="billingZip"
              value={formData.billingZip}
              onChange={(e) => handleInputChange("billingZip", e.target.value)}
              placeholder="12345"
              className={errors.billingZip ? "border-destructive" : ""}
            />
            {errors.billingZip && (
              <p className="text-sm text-destructive">{errors.billingZip}</p>
            )}
          </div>

          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            <span>Your payment information is encrypted and secure</span>
          </div>
        </CardContent>
      </Card>

      {/* Terms and Conditions */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) =>
                  handleInputChange("agreeToTerms", checked as boolean)
                }
                className={errors.agreeToTerms ? "border-destructive" : ""}
              />
              <Label
                htmlFor="terms"
                className="text-sm font-normal cursor-pointer leading-relaxed"
              >
                I agree to the{" "}
                <a href="/terms" className="text-primary hover:underline">
                  Terms & Conditions
                </a>{" "}
                and{" "}
                <a
                  href="/refund-policy"
                  className="text-primary hover:underline"
                >
                  Refund Policy
                </a>
                <span className="text-destructive"> *</span>
              </Label>
            </div>
            {errors.agreeToTerms && (
              <p className="text-sm text-destructive ml-6">
                {errors.agreeToTerms}
              </p>
            )}

            <div className="flex items-start space-x-2">
              <Checkbox
                id="newsletter"
                checked={formData.subscribeToNewsletter}
                onCheckedChange={(checked) =>
                  handleInputChange("subscribeToNewsletter", checked as boolean)
                }
              />
              <Label
                htmlFor="newsletter"
                className="text-sm font-normal cursor-pointer leading-relaxed"
              >
                Send me updates about future events and exclusive offers
              </Label>
            </div>
          </div>

          <Separator />

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={onBack}
              className="flex-1"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Back to Attendee Info
            </Button>

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-primary to-pink-500 hover:opacity-90"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                <>
                  <Lock className="w-5 h-5 mr-2" />
                  Complete Purchase
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            By completing this purchase, you agree to receive tickets via email
            and SMS
          </p>
        </CardContent>
      </Card>
    </motion.form>
  );
}
