"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";
import { Mail, Send, MapPin } from "lucide-react";
import { siteConfig } from "@/lib/metadata";

export function Footer() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const email = process.env.NEXT_PUBLIC_EMAIL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission - replace with actual API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitStatus("success");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setSubmitStatus("idle"), 3000);
    } catch {
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const socialLinks = [
    {
      name: "Instagram",
      icon: FaInstagram,
      href: siteConfig.links.instagram,
      color: "hover:text-pink-500",
    },
    {
      name: "YouTube",
      icon: FaYoutube,
      href: siteConfig.links.youtube,
      color: "hover:text-red-600",
    },
    {
      name: "TikTok",
      icon: FaTiktok,
      href: siteConfig.links.tiktok,
      color: "hover:text-foreground",
    },
  ];

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

              {/* Social Links */}
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 rounded-full bg-background border border-border ${social.color} transition-all hover:scale-110`}
                    aria-label={social.name}
                  >
                    <social.icon className="w-5 h-5" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Links & Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Quick Links */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link
                      href="/"
                      className="hover:text-foreground transition-colors"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/events"
                      className="hover:text-foreground transition-colors"
                    >
                      Events
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/sponsors"
                      className="hover:text-foreground transition-colors"
                    >
                      Sponsors
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>Ontario, Canada</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    <a
                      href="mailto:contact@atrangieventz.com"
                      className="hover:text-foreground transition-colors"
                    >
                      {email}
                    </a>
                  </div>
                </div>
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <Input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Textarea
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="resize-none min-h-32"
                />
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
                disabled={isSubmitting}
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

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} Atrangi Eventz. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
