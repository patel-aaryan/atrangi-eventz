"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";
import { Mail, Send } from "lucide-react";
import { siteConfig } from "@/lib/metadata";
import { usePathname } from "next/navigation";
import { submitContactForm } from "@/lib/api/contact";
import {
  contactFormSchema,
  type ContactFormInput,
} from "@/lib/validation/contact";

export function Footer() {
  const pathname = usePathname();
  const routesToHideFooter = ["/checkout", "/payment"];
  const hideFooter = routesToHideFooter.includes(pathname);

  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: ContactFormInput) => {
    try {
      await submitContactForm(data);
      setSubmitStatus("success");
      reset();
      setTimeout(() => setSubmitStatus("idle"), 3000);
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 3000);
    }
  };

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/#about" },
    { name: "Upcoming Events", href: "/upcoming-events" },
    { name: "Past Events", href: "/past-events" },
    { name: "Sponsors", href: "/sponsors" },
  ];

  const socialLinks = [
    {
      name: "Instagram",
      icon: FaInstagram,
      href: siteConfig.links.instagram,
      handle: "@atrangieventz",
      color: "hover:text-pink-500",
    },
    {
      name: "YouTube",
      icon: FaYoutube,
      href: siteConfig.links.youtube,
      handle: "@atrangieventz",
      color: "hover:text-red-600",
    },
    {
      name: "TikTok",
      icon: FaTiktok,
      href: siteConfig.links.tiktok,
      handle: "@atrangieventz",
      color: "hover:text-foreground",
    },
  ];

  if (hideFooter) return null;

  return (
    <footer className="bg-card/50 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Info & Links Section */}
          <div className="space-y-8">
            {/* Brand */}
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent mb-4">
                Atrangi Eventz
              </h2>
              <p className="text-muted-foreground mb-6">
                Uniting Gujarati Students of Ontario through vibrant cultural
                experiences, exciting events, and lasting connections.
              </p>

              {/* Quick Links */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {quickLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="hover:text-foreground transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Social Links & Contact */}
              <div className="grid grid-cols-2 gap-4">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-4 py-3 rounded-full bg-background border border-border ${social.color} transition-all hover:scale-105 text-sm text-muted-foreground hover:text-foreground`}
                    aria-label={social.name}
                  >
                    <social.icon className="w-5 h-5" />
                    <span>{social.handle}</span>
                  </Link>
                ))}
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center gap-2 px-4 py-3 rounded-full bg-background border border-border transition-all hover:scale-105 text-sm text-muted-foreground hover:text-primary"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                  <span>{siteConfig.email}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form Section */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Mail className="w-6 h-6 text-primary" />
              <h3 className="text-2xl font-bold">Get In Touch</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              Have questions or want to collaborate? We&apos;d love to hear from
              you!
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Input
                    type="text"
                    placeholder="Your Name"
                    {...register("name")}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Your Email"
                    {...register("email")}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <Textarea
                  placeholder="Your Message"
                  {...register("message")}
                  rows={6}
                  className={`resize-none min-h-32 ${errors.message ? "border-red-500" : ""}`}
                />
                {errors.message && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.message.message}
                  </p>
                )}
              </div>

              {submitStatus === "success" && (
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/50 text-green-600 dark:text-green-400 text-sm">
                  Message sent successfully! We&apos;ll get back to you soon.
                </div>
              )}

              {submitStatus === "error" && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-600 dark:text-red-400 text-sm">
                  Something went wrong. Please try again.
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting || !isValid}
                className="w-full sm:w-auto bg-gradient-to-r from-primary to-pink-500 hover:opacity-90"
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
}
