import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Poppins, Nunito_Sans } from "next/font/google";
import { SiteNav } from "@/components/SiteNav";
import { CatAgent } from "@/components/cat/CatAgent";
import { CursorFollower } from "@/components/motion/CursorFollower";
import "./globals.css";

const display = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const body = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Xiuer Gu — UX / Interaction Design",
  description:
    "Interaction designer, frontend-capable, AI-native. Selected work and case studies.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${display.variable} ${body.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('theme');
                  var theme = 'dark';
                  if (saved) {
                    theme = saved;
                  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
                    theme = 'light';
                  }
                  if (theme === 'light') {
                    document.documentElement.classList.add('light');
                    document.documentElement.setAttribute('data-theme', 'light');
                  } else {
                    document.documentElement.classList.remove('light');
                    document.documentElement.setAttribute('data-theme', 'dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <CursorFollower />
        <SiteNav />
        <main>{children}</main>
        <CatAgent />
        <footer className="border-t border-line px-6 py-12 md:px-10">
          <div className="mx-auto flex max-w-5xl flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <p className="font-mono text-xs text-mist">
              © {new Date().getFullYear()} Xiuer Gu
            </p>
            <p className="font-mono text-xs text-mist">
              Built with Next.js, Tailwind &amp; Motion
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
