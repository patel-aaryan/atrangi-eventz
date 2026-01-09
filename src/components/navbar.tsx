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
  NavigationMenuTrigger,
  NavigationMenuContent,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, Calendar, CalendarCheck } from "lucide-react";

const navItems = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/#about" },
  {
    name: "Events",
    dropdown: [
      {
        name: "Past Events",
        href: "/past-events",
        description: "Relive our amazing past events",
        icon: Calendar,
      },
      {
        name: "Upcoming Events",
        href: "/upcoming-events",
        description: "Check out what's coming next",
        icon: CalendarCheck,
      },
    ],
  },
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
                {"dropdown" in item && item.dropdown ? (
                  <>
                    <NavigationMenuTrigger>{item.name}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[280px] gap-2 p-3">
                        {item.dropdown.map((dropdownItem) => {
                          const Icon = dropdownItem.icon;
                          return (
                            <li key={dropdownItem.name}>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={dropdownItem.href}
                                  className="block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-all hover:bg-gradient-to-r hover:from-primary/10 hover:to-pink-500/10 hover:shadow-md focus:bg-gradient-to-r focus:from-primary/10 focus:to-pink-500/10 border border-transparent hover:border-primary/20 group"
                                >
                                  <div className="flex items-center gap-2.5">
                                    {Icon && (
                                      <div className="p-1.5 rounded-md bg-gradient-to-br from-primary/20 to-pink-500/20 group-hover:from-primary/30 group-hover:to-pink-500/30 transition-all">
                                        <Icon className="h-4 w-4 text-primary" />
                                      </div>
                                    )}
                                    <div>
                                      <div className="text-sm font-semibold leading-none mb-1 group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-pink-500 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                                        {dropdownItem.name}
                                      </div>
                                      <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                                        {dropdownItem.description}
                                      </p>
                                    </div>
                                  </div>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          );
                        })}
                      </ul>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle()}
                    asChild
                  >
                    <Link href={item.href}>{item.name}</Link>
                  </NavigationMenuLink>
                )}
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
          {navItems.map((item) =>
            "dropdown" in item && item.dropdown ? (
              <div key={item.name} className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-muted-foreground px-4">
                  {item.name}
                </span>
                {item.dropdown.map((dropdownItem) => {
                  const Icon = dropdownItem.icon;
                  return (
                    <Link
                      key={dropdownItem.name}
                      href={dropdownItem.href}
                      onClick={() => setIsOpen(false)}
                      className="text-foreground/80 hover:text-foreground transition-colors font-medium"
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-base pl-6 gap-3"
                      >
                        {Icon && (
                          <div className="p-1.5 rounded-md bg-gradient-to-br from-primary/20 to-pink-500/20">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                        )}
                        <div className="flex flex-col items-start">
                          <span className="font-medium">
                            {dropdownItem.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {dropdownItem.description}
                          </span>
                        </div>
                      </Button>
                    </Link>
                  );
                })}
              </div>
            ) : (
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
            )
          )}
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
