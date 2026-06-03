import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stark-Tech Code Marketplace | Developer Tools & SaaS Templates",
  description: "Acquire production-grade SaaS templates, developer tools, custom UI kits, and APIs built by Hemant Raj. Pre-engineered code assets for rapid deployment and startup acceleration.",
  keywords: [
    "SaaS Template",
    "UI Kit",
    "AI Tool",
    "API",
    "Full Stack",
    "Developer Tools",
    "Code Marketplace",
    "Buy SaaS Boilerplate",
    "Next.js Template",
    "React Template",
    "Django Boilerplate"
  ],
  alternates: {
    canonical: "/marketplace",
  },
  openGraph: {
    title: "Stark-Tech Code Marketplace | Developer Tools & SaaS Templates",
    description: "Acquire high-quality developer tools and SaaS templates built by Hemant Raj.",
    url: "/marketplace",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stark-Tech Code Marketplace | Developer Tools & SaaS Templates",
    description: "Acquire high-quality developer tools and SaaS templates built by Hemant Raj.",
  }
};

export default function MarketplaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
