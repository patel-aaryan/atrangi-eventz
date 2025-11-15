"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const navItems = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/#about" },
  { name: "Events", href: "/events" },
  { name: "Sponsors", href: "/sponsors" },
];

export function Navbar() {
  return (
    <nav className="sticky top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
                Atrangi Eventz
              </span>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden md:flex items-center space-x-4"
          >
            <DesktopNav />
          </motion.div>
          <div className="md:hidden">
            <MobileNav />
          </div>
        </div>
      </div>
    </nav>
  );
}

function DesktopNav() {
  return (
    <>
      <NavigationMenu>
        <NavigationMenuList>
          {navItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
            >
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  asChild
                >
                  <Link href={item.href}>{item.name}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </motion.div>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Button
          asChild
          className="bg-gradient-to-r from-primary to-pink-500 hover:opacity-90"
        >
          <Link href="/tickets">Get Tickets</Link>
        </Button>
      </motion.div>
    </>
  );
}

function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Toggle menu">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="text-left">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
              Atrangi Eventz
            </span>
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="text-foreground/80 hover:text-foreground transition-colors font-medium"
            >
              <Button
                variant="ghost"
                className="w-full justify-start text-base"
              >
                {item.name}
              </Button>
            </Link>
          ))}
          <Button
            asChild
            className="w-full bg-gradient-to-r from-primary to-pink-500 hover:opacity-90 mt-4"
          >
            <Link href="/tickets" onClick={() => setIsOpen(false)}>
              Get Tickets
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
