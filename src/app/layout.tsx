import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { UpcomingEventBanner } from "@/components/upcoming-event-banner";
import { generateSEOMetadata } from "@/lib/metadata";
import { AuthProvider } from "@/providers/auth-provider";
import { QueryProvider } from "@/providers/query-provider";
import { ReduxProvider } from "@/providers/redux-provider";
import { TicketProvider } from "@/contexts/ticket-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = generateSEOMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <QueryProvider>
            <AuthProvider>
              <TicketProvider>
                <Navbar />
                <UpcomingEventBanner />
                <main>{children}</main>
                <Footer />
              </TicketProvider>
            </AuthProvider>
          </QueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
