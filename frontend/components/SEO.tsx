"use client";

import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: string;
  noindex?: boolean;
  canonical?: string;
}

export default function SEO({
  title,
  description,
  keywords,
  ogImage,
  ogType = 'website',
  noindex = false,
  canonical
}: SEOProps) {
  const siteName = 'JS Fitness Sohna';
  const defaultTitle = `${title ? `${title} | ` : ''}${siteName}`;
  const defaultDescription = description || 
    'JS Fitness is the best gym in Sohna, Gurugram, Haryana. Premium equipment, certified trainers, personalized diet plans, and a friendly community.';
  const defaultImage = ogImage || 'https://jsfitness.com/images/gym-exterior.jpg';
  const defaultKeywords = keywords || [
    'gym in Sohna',
    'best gym in Sohna',
    'Sohna gym',
    'fitness center Sohna',
    'personal trainer Sohna',
    'gym membership Sohna',
    'fitness classes Sohna'
  ];

  return (
    <Helmet>
      <title>{defaultTitle}</title>
      <meta name="description" content={defaultDescription} />
      <meta name="keywords" content={defaultKeywords.join(', ')} />
      
      {canonical && <link rel="canonical" href={canonical} />}
      
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:title" content={defaultTitle} />
      <meta property="og:description" content={defaultDescription} />
      <meta property="og:image" content={defaultImage} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={defaultTitle} />
      <meta name="twitter:description" content={defaultDescription} />
      <meta name="twitter:image" content={defaultImage} />
    </Helmet>
  );
}
