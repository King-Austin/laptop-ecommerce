export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  canonical?: string;
}

export const defaultSEO: SEOConfig = {
  title: "Jumia - Online Shopping for Electronics, Fashion & More",
  description: "Shop online for electronics, fashion, home essentials and more at great prices. Fast delivery, secure payment, and amazing deals on Jumia.",
  keywords: "online shopping, electronics, laptops, fashion, home essentials, Nigeria, Jumia",
  ogType: "website",
  twitterCard: "summary_large_image",
};

export const updateMetaTags = (config: SEOConfig) => {
  // Update title
  document.title = config.title;

  // Update or create meta tags
  const metaTags = [
    { name: "description", content: config.description },
    { name: "keywords", content: config.keywords || defaultSEO.keywords },
    { property: "og:title", content: config.ogTitle || config.title },
    { property: "og:description", content: config.ogDescription || config.description },
    { property: "og:type", content: config.ogType || defaultSEO.ogType },
    { property: "og:url", content: window.location.href },
    { name: "twitter:card", content: config.twitterCard || defaultSEO.twitterCard },
    { name: "twitter:title", content: config.ogTitle || config.title },
    { name: "twitter:description", content: config.ogDescription || config.description },
  ];

  if (config.ogImage) {
    metaTags.push({ property: "og:image", content: config.ogImage });
    metaTags.push({ name: "twitter:image", content: config.ogImage });
  }

  metaTags.forEach(({ name, property, content }) => {
    const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
    let element = document.querySelector(selector);

    if (!element) {
      element = document.createElement("meta");
      if (name) element.setAttribute("name", name);
      if (property) element.setAttribute("property", property);
      document.head.appendChild(element);
    }

    element.setAttribute("content", content || "");
  });

  // Update canonical link
  const canonical = config.canonical || window.location.href;
  let linkElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!linkElement) {
    linkElement = document.createElement("link");
    linkElement.rel = "canonical";
    document.head.appendChild(linkElement);
  }
  linkElement.href = canonical;
};

export const generateProductStructuredData = (product: {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  brand: string;
  rating: number;
  reviews: number;
  inStock: boolean;
}) => {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: product.image,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    offers: {
      "@type": "Offer",
      url: `${window.location.origin}/product/${product.id}`,
      priceCurrency: "NGN",
      price: product.price,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviews,
    },
  };
};

export const injectStructuredData = (data: object) => {
  const scriptId = "structured-data";
  let script = document.getElementById(scriptId);

  if (script) {
    script.remove();
  }

  script = document.createElement("script");
  script.id = scriptId;
  script.type = "application/ld+json";
  script.text = JSON.stringify(data);
  document.head.appendChild(script);
};

export const removeStructuredData = () => {
  const script = document.getElementById("structured-data");
  if (script) {
    script.remove();
  }
};
