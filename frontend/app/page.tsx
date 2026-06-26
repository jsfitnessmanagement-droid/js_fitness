import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import GallerySection from '@/components/GallerySection';
import AboutSection from '@/components/AboutSection';
import BmiCalculator from '@/components/BmiCalculator';
import PricingSection from '@/components/PricingSection';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import SEO from '@/components/SEO';
import LocalBusinessSchema from '@/components/LocalBusinessSchema';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JS Fitness — Best Gym in Sohna',
  description:
    'JS Fitness Sohna offers premium equipment, certified trainers, and personalized diet plans. Join 500+ members and transform your body.',
  openGraph: {
    title: 'JS Fitness — Best Gym in Sohna, Gurugram',
    description:
      'Premium gym with modern equipment, certified trainers, and personalized plans. Visit JS Fitness in Sohna.',
    url: 'https://jsfitness.in',
    images: [
      {
        url: 'https://jsfitness.in/images/gym-exterior.jpg',
        width: 1200,
        height: 630,
        alt: 'JS Fitness Exterior',
      },
    ],
    siteName: 'JS Fitness Sohna',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JS Fitness — Best Gym in Sohna',
    description:
      'Premium gym with certified trainers and personalized plans in Sohna, Gurugram.',
    images: ['https://jsfitness.in/images/gym-exterior.jpg'],
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900">
      <SEO 
        title="Best Gym in Sohna, Gurugram"
        description="JS Fitness Sohna offers premium equipment, certified trainers, and personalized diet plans. Join 500+ members and transform your body."
        keywords={['gym in Sohna', 'best gym in Sohna', 'fitness center Sohna', 'personal trainer Sohna']}
        canonical="https://jsfitness.in"
      />
      <LocalBusinessSchema
        name="JS Fitness Gym"
        description="JS Fitness is the best gym in Sohna, Gurugram with premium equipment, certified personal trainers, customized diet plans, cardio and strength zones."
        url="https://jsfitness.in"
        telephone={["+919813041892", "+918397940001"]}
        email="support@jsfitness.in"
        address={{
          streetAddress: "Chungi No. 1, Near Bal Bharti School",
          addressLocality: "Sohna",
          addressRegion: "Haryana",
          postalCode: "122103",
          addressCountry: "IN"
        }}
        geo={{
          latitude: 28.246473,
          longitude: 77.0543781
        }}
        openingHours="Mo-Su 06:00-22:00"
        priceRange="₹₹"
        images={[
          "https://jsfitness.in/images/gym-exterior.jpg",
          "https://jsfitness.in/images/hero-bg.jpg",
          "https://jsfitness.in/images/gym-interior-weights.jpg"
        ]}
      />
      <Navbar />
      <HeroSection />
      <GallerySection />
      <AboutSection />
      <BmiCalculator />
      <PricingSection />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
