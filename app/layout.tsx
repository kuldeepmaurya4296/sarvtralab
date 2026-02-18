import { OrganizationSchema } from "@/components/seo/StructuredData";
import { Plus_Jakarta_Sans, Space_Grotesk, Cinzel, Great_Vibes } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { constructMetadata } from "@/lib/seo";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: 'swap',
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: 'swap',
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-great-vibes",
  display: 'swap',
});

export const metadata = constructMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${plusJakartaSans.variable} ${spaceGrotesk.variable} ${cinzel.variable} ${greatVibes.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <OrganizationSchema />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
