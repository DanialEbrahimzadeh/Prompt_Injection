import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Prompt Injection Lab — Cybersecurity Workshop",
  description:
    "An interactive cybersecurity sandbox for learning prompt injection attacks. Developed by Danial Ebrahimzadeh for educational purposes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full antialiased" style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
