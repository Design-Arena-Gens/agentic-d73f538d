import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gold Ideas - Daily Analysis",
  description: "Daily gold price analysis and trading ideas",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="container">
          <h1>Gold Ideas</h1>
          <p className="muted">Daily gold price analysis and trading ideas</p>
        </header>
        <main className="container">{children}</main>
        <footer className="container footer">Built with Next.js ? Data: Yahoo Finance</footer>
      </body>
    </html>
  );
}
