import { DM_Sans, Manrope } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata = {
  metadataBase: new URL("https://smart-postbox.vercel.app/"), 
  title: "EmptyLess — Never Visit an Empty Mailbox Again",
  description:
    "Smart IoT sensors and dynamic routing for Latvijas Pasts to cut fuel, courier hours, and CO₂ emissions.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "EmptyLess",
    title: "EmptyLess — Smart Mailbox Routing",
    description:
      "Route couriers only to full mailboxes instead of blind schedules. Less fuel, saved driver hours, and lower CO₂.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "EmptyLess — Smart IoT routing for postal networks",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EmptyLess — Smart Mailbox Routing",
    description:
      "Route couriers only to full mailboxes instead of blind schedules. Less fuel, saved driver hours, and lower CO₂.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${manrope.variable}`}>
      <body className="bg-slate-50 font-sans antialiased">{children}</body>
    </html>
  );
}
