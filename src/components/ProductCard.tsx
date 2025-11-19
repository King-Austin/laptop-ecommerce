import { Link } from "react-router-dom";
import { ShoppingCart, Star, Heart, Eye, Cpu, HardDrive, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { useState } from "react";
import { generateProductUrl } from "@/lib/slugify";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast.success("Added to cart!", {
      description: product.name,
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist", {
      description: product.name,
    });
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const specs = product.specs || {};
  const productUrl = generateProductUrl(product.name, product.id);

  return (
    <Link to={productUrl}>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={`${product.name} - ${product.brand} laptop with ${specs.processor || "latest processor"} and ${specs.ram || "high-performance RAM"}`}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
            loading="lazy"
          />

          {/* Action buttons overlay */}
          <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0"
              onClick={handleWishlist}
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
              <Eye className="h-4 w-4" />
            </Button>
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discount > 0 && (
              <Badge className="bg-red-500 text-white">-{discount}%</Badge>
            )}
            {product.featured && (
              <Badge className="bg-blue-500 text-white">Featured</Badge>
            )}
            {product.condition && product.condition !== 'new' && (
              <Badge className="bg-orange-500 text-white capitalize">{product.condition}</Badge>
            )}
          </div>

          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge className="bg-gray-600 text-white text-sm">Out of Stock</Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          {/* Brand and Category */}
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="text-xs">
              {product.brand}
            </Badge>
            <span className="text-xs text-muted-foreground capitalize">
              {product.category.replace('-', ' ')}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Key Specs - Most Important for Laptops */}
          <div className="space-y-1 mb-3 text-xs text-muted-foreground">
            {specs.processor && (
              <div className="flex items-center gap-1">
                <Cpu className="h-3 w-3" />
                <span className="truncate">{specs.processor}</span>
              </div>
            )}
            {specs.ram && (
              <div className="flex items-center gap-1">
                <HardDrive className="h-3 w-3" />
                <span>{specs.ram} RAM</span>
                {specs.storage && <span>• {specs.storage}</span>}
              </div>
            )}
            {specs.display && (
              <div className="flex items-center gap-1">
                <Monitor className="h-3 w-3" />
                <span className="truncate">{specs.display}</span>
              </div>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${i < Math.floor(product.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground"
                    }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {product.rating} ({product.reviews})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-bold text-primary">
              ₦{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ₦{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Stock info for low stock */}
          {product.stockQuantity && product.stockQuantity < 5 && product.inStock && (
            <div className="text-xs text-orange-600 mb-2">
              Only {product.stockQuantity} left in stock!
            </div>
          )}

          {/* Action Button */}
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-full group-hover:shadow-md transition-shadow"
            size="sm"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
};
