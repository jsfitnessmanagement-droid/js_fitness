import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "JS Fitness Gym Sohna | Best Gym in Sohna, Gurugram",
    template: "%s | JS Fitness Sohna",
  },
  description:
    "JS Fitness is the best gym in Sohna, Gurugram, Haryana. Premium equipment, certified trainers, personalized diet plans, and a friendly community. Call +91 98130 41892.",
  keywords: [
    "gym in Sohna",
    "best gym in Sohna",
    "Sohna gym",
    "fitness center Sohna",
    "personal trainer Sohna",
  ],
  authors: [{ name: "JS Fitness Sohna" }],
  creator: "JS Fitness",
  publisher: "JS Fitness Sohna",
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  metadataBase: new URL("https://jsfitness.in"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "JS Fitness — Best Gym in Sohna, Gurugram",
    description:
      "Premium gym with modern equipment, certified trainers, and personalized diet plans. Join our community in Sohna today.",
    url: "https://jsfitness.in",
    siteName: "JS Fitness Sohna",
    images: [
      {
        url: "https://jsfitness.in/images/gym-exterior.jpg",
        width: 1200,
        height: 630,
        alt: "JS Fitness Gym - Exterior",
      },
      {
        url: "https://jsfitness.in/images/hero-bg.jpg",
        width: 1200,
        height: 630,
        alt: "JS Fitness Interior",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JS Fitness — Best Gym in Sohna",
    description:
      "Premium gym with certified trainers and personalized plans in Sohna, Gurugram.",
    images: ["https://jsfitness.in/images/gym-exterior.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {},
  category: "fitness",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Gym",
  name: "JS Fitness Gym",
  alternateName: "JS Fitness Sohna",
  description:
    "JS Fitness is the best gym in Sohna, Gurugram with premium equipment, certified personal trainers, customized diet plans, cardio and strength zones.",
  url: "https://jsfitness.in",
  telephone: ["+919813041892", "+918397940001"],
  email: "support@jsfitness.in",
  image: [
    "https://jsfitness.in/images/gym-exterior.jpg",
    "https://jsfitness.in/images/hero-bg.jpg",
    "https://jsfitness.in/images/gym-interior-weights.jpg",
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Chungi No. 1, Near Bal Bharti School",
    addressLocality: "Sohna",
    addressRegion: "Haryana",
    postalCode: "122103",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 28.246473,
    longitude: 77.0543781,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <meta name="geo.region" content="IN-HR" />
        <meta name="geo.placename" content="Sohna, Gurugram, Haryana" />
        <meta name="geo.position" content="28.246473;77.0543781" />
        <meta name="ICBM" content="28.246473, 77.0543781" />
        <meta httpEquiv="content-language" content="en-IN" />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col antialiased`}>
        <Script
          id="json-ld-structured-data"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}

