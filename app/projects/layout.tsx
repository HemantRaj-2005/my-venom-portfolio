import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hemant Raj Projects | AI Engineering & Full Stack Software Dossier",
  description: "Explore the software engineering projects, AI powered web applications, and developer tools built by Hemant Raj. Inspect system architecture designs, backend APIs, and open-source codebases.",
  keywords: [
    "Hemant Raj Projects",
    "Hemant Raj Software Projects",
    "Hemant Raj AI Projects",
    "Software Engineering Projects",
    "AI Powered Web Applications",
    "Full Stack Developer Projects",
    "Machine Learning Projects Portfolio",
    "Open Source Developer Portfolio",
    "Best Full Stack Developer Portfolio"
  ],
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Hemant Raj Projects | AI Engineering & Full Stack Software Dossier",
    description: "Explore high-performance software projects and AI tools engineered by Hemant Raj.",
    url: "/projects",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hemant Raj Projects | AI Engineering & Full Stack Software Dossier",
    description: "Explore high-performance software projects and AI tools engineered by Hemant Raj.",
  }
};

export default function ProjectsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
