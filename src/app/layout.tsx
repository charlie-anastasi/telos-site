import type { Metadata } from "next";
import { Marcellus, PT_Serif } from "next/font/google";
import { FooterSections } from "@/components/FooterSections";
import { Header } from "@/components/Header";
import { site } from "@/content/site";
import "./globals.css";

const heading = Marcellus({ weight: "400", subsets: ["latin"], variable: "--font-heading" });
const body = PT_Serif({ weight: ["400", "700"], style: ["normal", "italic"], subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s — ${site.name}` },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    siteName: site.logoAlt,
    type: "website",
    images: [{ url: "/images/telos-logo-transparent.png", width: 652, height: 884 }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-US" className={`${heading.variable} ${body.variable}`}>
      <body>
        <div className="site">
          <Header />
          <main id="page">{children}</main>
          <footer>
            <FooterSections />
          </footer>
        </div>
      </body>
    </html>
  );
}
