import type { Metadata, Viewport } from "next";
import CopyGuard from "@/components/ui/CopyGuard";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import MobileMenu from "@/components/layout/MobileMenu";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tatva Creatives | Concept, packaging, print and paper engineering",
  description: "Tatva is a creative solutions partner in Navi Mumbai for concept development, packaging design, print promotion, paper engineering and end-to-end execution.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({ children, modal }: { children: React.ReactNode; modal: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Hanken+Grotesk:wght@400;500;600&family=Archivo:wdth,wght@76,900&display=swap"
          precedence="default"
        />
        {children}
        {modal}
        <MobileMenu />
        <WhatsAppButton />
        <CopyGuard />
      </body>
    </html>
  );
}
