import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { products, categories } from "@/data/products";
import { ChevronRight } from "lucide-react";
import { SEO } from "@/components/SEO";

const Home = () => {
  const featuredProducts = products.filter((p) => p.featured);
  const trendingProducts = products.slice(0, 8);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Jumia - Online Shopping for Electronics, Fashion & More"
        description="Shop online for electronics, fashion, home essentials and more at great prices. Fast delivery, secure payment, and amazing deals on Jumia."
        keywords="online shopping, electronics, laptops, gaming laptops, macbooks, ultrabooks, business laptops, Nigeria, Jumia"
        ogTitle="Jumia - Your Online Shopping Destination"
        ogDescription="Discover amazing deals on electronics, fashion, home essentials and more with fast delivery."
        ogType="website"
      />
      <section className="relative bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="inline-block bg-warning/20 text-warning px-4 py-1 rounded-full text-sm font-semibold mb-4">
              🔥 Limited Time Offer - Up to 30% OFF
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Premium Laptops for Every Need
            </h1>
            <p className="text-xl mb-8 text-primary-foreground/90">
              From Gaming Beasts to Business Machines - Find Your Perfect Laptop
            </p>
            <div className="flex gap-4">
              <Button asChild size="lg" variant="secondary" className="shadow-lg">
                <Link to="/products">
                  Browse All Laptops <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                <Link to="/products?category=gaming">
                  Gaming Laptops
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${category.id}`}
              className="group"
            >
              <div className="bg-card rounded-lg border p-6 text-center hover:shadow-lg hover:border-primary transition-all duration-300">
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-secondary py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Button variant="ghost" asChild>
              <Link to="/products">
                View All <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Trending Now</h2>
          <Button variant="ghost" asChild>
            <Link to="/products">
              View All <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
