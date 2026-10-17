import type { Metadata, Viewport } from "next";
import { Sora, Inter, JetBrains_Mono, Syne, Mona_Sans, Bricolage_Grotesque, Monoton, Black_Ops_One, Cinzel } from "next/font/google";
import { profile } from "@/lib/data";
import { ChatWidget } from "@/components/chat/ChatWidget";
import "./globals.css";

const display = Sora({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-display-loaded", display: "swap" });
const body = Inter({ subsets: ["latin"], variable: "--font-body-loaded", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono-loaded", display: "swap" });
// Hero font loader (Controls the font loaded for "GANATHE VIVEK"):
const hero = Syne({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-hero-loaded", display: "swap" });
const heroSecondary = Cinzel({ subsets: ["latin"], weight: ["400","700","800", "900"], variable: "--font-hero-secondary-loaded", display: "swap" });
const title = `${profile.firstName} ${profile.lastName} — ${profile.role}`;
const description =
  "Full Stack AI Engineer building production GenAI: NL2SQL reporting, RAG-powered conversational agents and full-stack products with React, Next.js, Node.js, LangChain and vector search.";

export const metadata: Metadata = {
  // Set NEXT_PUBLIC_SITE_URL to your deployed domain so social previews resolve.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title,
  description,
  authors: [{ name: `${profile.firstName} ${profile.lastName}` }],
  keywords: ["Full Stack Developer", "AI Engineer", "GenAI", "RAG", "LangChain", "Next.js", "React", "Node.js", "Hyderabad"],
  openGraph: { title, description, type: "profile", images: ["/vivek-portrait-hd.png"] },
  twitter: { card: "summary", title, description },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#040915",
  colorScheme: "dark",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: `${profile.firstName} ${profile.lastName}`,
  jobTitle: profile.role,
  email: `mailto:${profile.email}`,
  address: { "@type": "PostalAddress", addressLocality: "Hyderabad", addressCountry: "IN" },
  worksFor: { "@type": "Organization", name: "Zithara.AI" },
  alumniOf: "St. Mary's Engineering College",
  sameAs: Object.values(profile.links),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable} ${hero.variable} ${heroSecondary.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
        <ChatWidget />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      </body>
    </html>
  );
}
