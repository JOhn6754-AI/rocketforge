import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RocketForge • Educational Rocket Simulator",
  description: "Build and simulate rockets to understand propulsion, the rocket equation, and real spaceflight engineering.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-zinc-950 text-white">
        {children}
      </body>
    </html>
  );
}
