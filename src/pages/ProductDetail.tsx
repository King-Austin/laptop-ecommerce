import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { products, productReviews } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { Star, ShoppingCart, Minus, Plus, ChevronLeft, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { OrderForm } from "@/components/OrderForm";
import { SEO } from "@/components/SEO";
import { ImageCarousel } from "@/components/ImageCarousel";
import { generateProductStructuredData, injectStructuredData, removeStructuredData } from "@/lib/seo";
import { extractProductId } from "@/lib/slugify";

const ProductDetail = () => {
  const { id } = useParams();
  // Extract the actual product ID from the slug
  const productId = extractProductId(id || "");
  const product = products.find((p) => p.id === productId);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      const structuredData = generateProductStructuredData(product);
      injectStructuredData(structuredData);
    }

    return () => {
      removeStructuredData();
    };
  }, [product]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Button asChild>
          <Link to="/products">Back to Products</Link>
        </Button>
      </div>
    );
  }

  const reviews = productReviews.filter((r) => r.productId === product.id);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success(`Added ${quantity} item(s) to cart!`);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${product.name} - ₦${product.price.toLocaleString()} | Jumia`}
        description={product.description}
        keywords={`${product.brand}, ${product.category}, laptop, ${product.specs?.processor || ""}, ${product.specs?.ram || ""}, buy online, Nigeria`}
        ogTitle={product.name}
        ogDescription={product.description}
        ogImage={product.image}
        ogType="product"
      />
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/products">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <ImageCarousel images={product.images} productName={product.name} />
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(product.rating)
                        ? "fill-primary text-primary"
                        : "text-muted-foreground"
                        }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground ml-2">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
              {product.inStock ? (
                <Badge className="bg-success">In Stock</Badge>
              ) : (
                <Badge variant="secondary">Out of Stock</Badge>
              )}
            </div>

            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-4xl font-bold text-primary">
                ₦{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    ₦{product.originalPrice.toLocaleString()}
                  </span>
                  <Badge variant="destructive">-{discount}%</Badge>
                </>
              )}
            </div>

            <p className="text-muted-foreground mb-6 leading-relaxed">
              {product.description}
            </p>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-4">
                <span className="font-semibold">Brand:</span>
                <span className="text-muted-foreground">{product.brand}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold">Category:</span>
                <span className="text-muted-foreground">{product.category}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <span className="font-semibold">Quantity:</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 border-green-300"
                onClick={() => {
                  const message = encodeURIComponent(`Hi! I'm interested in the ${product.name}. Is this available?`);
                  window.open(`https://wa.me/2349134846838?text=${message}`, '_blank');
                }}
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Chat on WhatsApp
              </Button>
            </div>
          </div>
        </div>

        {/* Technical Specifications - Prominently Displayed */}
        {product.specs && (
          <div className="mt-12 bg-card rounded-lg border p-6">
            <h2 className="text-2xl font-bold mb-6">Technical Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.specs.processor && (
                <div className="flex justify-between border-b pb-3">
                  <span className="font-semibold">Processor:</span>
                  <span className="text-muted-foreground">{product.specs.processor}</span>
                </div>
              )}
              {product.specs.ram && (
                <div className="flex justify-between border-b pb-3">
                  <span className="font-semibold">RAM:</span>
                  <span className="text-muted-foreground">{product.specs.ram}</span>
                </div>
              )}
              {product.specs.storage && (
                <div className="flex justify-between border-b pb-3">
                  <span className="font-semibold">Storage:</span>
                  <span className="text-muted-foreground">{product.specs.storage}</span>
                </div>
              )}
              {product.specs.gpu && (
                <div className="flex justify-between border-b pb-3">
                  <span className="font-semibold">Graphics:</span>
                  <span className="text-muted-foreground">{product.specs.gpu}</span>
                </div>
              )}
              {product.specs.display && (
                <div className="flex justify-between border-b pb-3">
                  <span className="font-semibold">Display:</span>
                  <span className="text-muted-foreground">{product.specs.display}</span>
                </div>
              )}
              {product.specs.refreshRate && (
                <div className="flex justify-between border-b pb-3">
                  <span className="font-semibold">Refresh Rate:</span>
                  <span className="text-muted-foreground">{product.specs.refreshRate}</span>
                </div>
              )}
              {product.specs.os && (
                <div className="flex justify-between border-b pb-3">
                  <span className="font-semibold">Operating System:</span>
                  <span className="text-muted-foreground">{product.specs.os}</span>
                </div>
              )}
              {product.specs.battery && (
                <div className="flex justify-between border-b pb-3">
                  <span className="font-semibold">Battery:</span>
                  <span className="text-muted-foreground">{product.specs.battery}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <OrderForm product={product} />

        {reviews.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-card rounded-lg border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-semibold">{review.userName}</p>
                      <p className="text-sm text-muted-foreground">{review.date}</p>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < review.rating
                            ? "fill-primary text-primary"
                            : "text-muted-foreground"
                            }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
