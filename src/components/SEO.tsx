import { useEffect } from "react";
import { updateMetaTags, SEOConfig } from "@/lib/seo";

// SEO component for managing page metadata
interface SEOProps extends SEOConfig {}

export const SEO = (props: SEOProps) => {
  useEffect(() => {
    updateMetaTags(props);

    // Cleanup on unmount
    return () => {
      // Reset to default on unmount
      updateMetaTags({
        title: "Jumia - Online Shopping for Electronics, Fashion & More",
        description: "Shop online for electronics, fashion, home essentials and more at great prices. Fast delivery, secure payment, and amazing deals on Jumia.",
      });
    };
  }, [props]);

  return null;
};
