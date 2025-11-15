import { generatePageMetadata } from "@/lib/metadata";

export const metadata = generatePageMetadata({
  title: "Events",
  description:
    "Explore upcoming Bollywood club parties, Garba nights, and cultural events organized by Atrangi Eventz for Gujarati students across Ontario. Join us for unforgettable experiences.",
  path: "/events",
  keywords: [
    "gujarati events ontario",
    "bollywood parties ontario",
    "garba night ontario",
    "indian student events",
    "gujarati student organization",
    "cultural events ontario",
    "navratri events",
    "diwali celebration",
    "college events",
    "university parties",
  ],
});

export default function EventsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
