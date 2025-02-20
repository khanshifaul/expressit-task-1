import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Create Your Online Store | ExpressitBD Store Setup",
  description:
    "Launch your e-commerce store in minutes with ExpressitBD. Set up your domain, configure location & currency, and start selling online. Quick and easy store creation process.",
  keywords: [
    "create online store",
    "e-commerce setup",
    "domain registration",
    "Bangladesh online store",
    "store configuration",
    "start selling online",
    "BDT currency store",
    "Fashion e-commerce",
    "ExpressitBD store creation",
  ],
  openGraph: {
    title: "Launch Your Online Store with ExpressitBD",
    description:
      "Complete your store setup in 5 simple steps. Choose domain, configure settings, and start your e-commerce journey today!",
    url: "/store/create",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Create Your Professional Online Store | ExpressitBD",
    description:
      "Set up your e-commerce presence with our intuitive store creation wizard. Custom domain, BDT support, and instant deployment.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased bg-white text-black`}>{children}</body>
    </html>
  );
}
