import type { Metadata, Viewport } from "next";
import { Charmonman, IBM_Plex_Mono, Noto_Serif_Thai, Sarabun } from "next/font/google";
import { ListenedProvider } from "@/components/ListenedProvider";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SITE_AUTHOR, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const display = Charmonman({
  weight: ["400", "700"],
  subsets: ["thai", "latin"],
  variable: "--font-display",
});

const serif = Noto_Serif_Thai({
  weight: ["500", "600", "700"],
  subsets: ["thai", "latin"],
  variable: "--font-serif",
});

const sans = Sarabun({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  variable: "--font-sans",
});

const mono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#120d09",
};

export const metadata: Metadata = {
  title: {
    default: "ห้องเก็บผี",
    template: "%s · ห้องเก็บผี",
  },
  description:
    "เรื่องผีที่ปองฟังแล้วเลือกมาให้เพื่อนพี่น้อง กดเปิดคลิปต้นฉบับบน YouTube ได้เลย",
  metadataBase: new URL(SITE_URL),
  authors: [{ name: SITE_AUTHOR.name, url: SITE_AUTHOR.github }],
  creator: SITE_AUTHOR.name,
  alternates: { canonical: "/" },
  openGraph: {
    title: SITE_NAME,
    description: "เรื่องผีที่ปองฟังแล้วเลือกมาให้ ไม่ต้องสุ่มคลิปเอง",
    siteName: SITE_NAME,
    url: SITE_URL,
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: "เรื่องผีที่ปองฟังแล้วเลือกมาให้ ไม่ต้องสุ่มคลิปเอง",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="th"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${serif.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="relative flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-ember focus:px-4 focus:py-2 focus:text-night"
        >
          ข้ามไปเนื้อหา
        </a>
        <ListenedProvider>
          <SiteHeader />
          <main id="main" className="relative z-10 flex-1">
            {children}
          </main>
          <SiteFooter />
        </ListenedProvider>
      </body>
    </html>
  );
}
