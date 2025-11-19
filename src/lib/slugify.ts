/**
 * Generates a URL-friendly slug from product name
 * Example: "Dell Latitude 5420 i5 8GB" -> "dell-latitude-5420-i5-8gb"
 */
export const slugify = (text: string): string => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')        // Replace spaces with -
        .replace(/[^\w\-]+/g, '')    // Remove all non-word chars except hyphens
        .replace(/\-\-+/g, '-')      // Replace multiple - with single -
        .replace(/^-+/, '')          // Trim - from start of text
        .replace(/-+$/, '');         // Trim - from end of text
};

/**
 * Generates a full product URL with slug and ID
 * Format: /product/{slug}-{id}
 * Example: /product/dell-latitude-5420-i5-8gb-256gb-2
 */
export const generateProductUrl = (productName: string, productId: string): string => {
    const slug = slugify(productName);
    return `/product/${slug}-${productId}`;
};

/**
 * Extracts product ID from URL slug
 * Supports both formats:
 * - /product/{slug}-{id} (new format)
 * - /product/{id} (backward compatibility)
 */
export const extractProductId = (slugOrId: string): string => {
    // If it's just a number, return it (backward compatibility)
    if (/^\d+$/.test(slugOrId)) {
        return slugOrId;
    }

    // Extract ID from slug format: "dell-latitude-5420-i5-8gb-2" -> "2"
    const parts = slugOrId.split('-');
    const lastPart = parts[parts.length - 1];

    // Check if last part is a number (our ID)
    if (/^\d+$/.test(lastPart)) {
        return lastPart;
    }

    // Fallback: return the whole string
    return slugOrId;
};

/**
 * Generates SEO-friendly breadcrumb from product slug
 * Example: "dell-latitude-5420-i5-8gb-2" -> "Dell Latitude 5420 i5 8GB"
 */
export const slugToTitle = (slug: string): string => {
    // Remove the ID from the end
    const parts = slug.split('-');
    const withoutId = parts.slice(0, -1);

    return withoutId
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};
