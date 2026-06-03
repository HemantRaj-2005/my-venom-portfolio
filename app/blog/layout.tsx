import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Stark Ledger | Technical Blog by Hemant Raj",
  description: "Read technical blog articles, system design guides, and programming notes by Hemant Raj. Tutorials on Data Structures and Algorithms (DSA), React, Django, Machine Learning, and Competitive Programming.",
  keywords: [
    "Technical Blog",
    "Programming Blog",
    "Engineering Blog",
    "Data Structures Tutorial",
    "Algorithms Tutorial",
    "System Design Tutorial",
    "React Tutorial",
    "Django Tutorial",
    "Machine Learning Tutorial",
    "Competitive Programming Guide",
    "Coding Interview Guide",
    "Software Engineering Guide",
    "Web Development Guide",
    "Programming Notes",
    "Developer Notes",
    "Computer Science Notes"
  ],
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "The Stark Ledger | Technical Blog by Hemant Raj",
    description: "Read technical tutorials and engineering articles by Hemant Raj.",
    url: "/blog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Stark Ledger | Technical Blog by Hemant Raj",
    description: "Read technical tutorials and engineering articles by Hemant Raj.",
  }
};

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
