"use client";

import { useEffect } from 'react';

interface LocalBusinessSchemaProps {
  name: string;
  description: string;
  url: string;
  telephone: string[];
  email: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo: {
    latitude: number;
    longitude: number;
  };
  openingHours?: string;
  priceRange?: string;
  images?: string[];
}

export default function LocalBusinessSchema(props: LocalBusinessSchemaProps) {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      ...props,
      image: props.images || [],
      address: {
        "@type": "PostalAddress",
        ...props.address
      },
      geo: {
        "@type": "GeoCoordinates",
        ...props.geo
      }
    };

    // Create or update the script tag
    let script = document.getElementById('local-business-schema') as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = 'local-business-schema';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema);

    return () => {
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [props]);

  return null;
}
