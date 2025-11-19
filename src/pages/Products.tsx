import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductCard } from "@/components/ProductCard";
import { products, categories } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";
import { SEO } from "@/components/SEO";

const Products = () => {
  const [searchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [priceRange, setPriceRange] = useState([0, 4000000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedRAM, setSelectedRAM] = useState<string[]>([]);
  const [selectedStorage, setSelectedStorage] = useState<string[]>([]);
  const [selectedProcessor, setSelectedProcessor] = useState<string[]>([]);
  const [screenSize, setScreenSize] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("featured");

  const brands = [...new Set(products.map((p) => p.brand))];
  const ramOptions = ["8GB", "16GB", "32GB", "36GB"];
  const storageOptions = ["256GB", "512GB", "1TB"];
  const processorTypes = ["Intel", "AMD", "Apple"];
  const screenSizes = ["13-14 inches", "15-16 inches", "17+ inches"];

  const searchQuery = searchParams.get("search");
  const categoryParam = searchParams.get("category");

  useEffect(() => {
    let filtered = [...products];

    const searchQuery = searchParams.get("search");
    const categoryParam = searchParams.get("category");

    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.specs?.processor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.specs?.ram?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) => selectedCategories.includes(p.category));
    }

    if (selectedBrands.length > 0) {
      filtered = filtered.filter((p) => selectedBrands.includes(p.brand));
    }

    if (selectedRAM.length > 0) {
      filtered = filtered.filter((p) => 
        selectedRAM.some(ram => p.specs?.ram?.includes(ram))
      );
    }

    if (selectedStorage.length > 0) {
      filtered = filtered.filter((p) =>
        selectedStorage.some(storage => p.specs?.storage?.includes(storage))
      );
    }

    if (selectedProcessor.length > 0) {
      filtered = filtered.filter((p) =>
        selectedProcessor.some(proc => p.specs?.processor?.includes(proc))
      );
    }

    if (screenSize.length > 0) {
      filtered = filtered.filter((p) => {
        const size = parseFloat(p.specs?.screenSize || "0");
        return screenSize.some(range => {
          if (range === "13-14 inches") return size >= 13 && size <= 14;
          if (range === "15-16 inches") return size >= 15 && size <= 16;
          if (range === "17+ inches") return size >= 17;
          return false;
        });
      });
    }

    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    filtered = filtered.filter((p) => p.rating >= minRating);

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    setFilteredProducts(filtered);
  }, [searchParams, selectedCategories, selectedBrands, selectedRAM, selectedStorage, 
      selectedProcessor, screenSize, priceRange, minRating, sortBy]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const toggleRAM = (ram: string) => {
    setSelectedRAM((prev) =>
      prev.includes(ram) ? prev.filter((r) => r !== ram) : [...prev, ram]
    );
  };

  const toggleStorage = (storage: string) => {
    setSelectedStorage((prev) =>
      prev.includes(storage) ? prev.filter((s) => s !== storage) : [...prev, storage]
    );
  };

  const toggleProcessor = (processor: string) => {
    setSelectedProcessor((prev) =>
      prev.includes(processor) ? prev.filter((p) => p !== processor) : [...prev, processor]
    );
  };

  const toggleScreenSize = (size: string) => {
    setScreenSize((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${searchQuery ? `Search: ${searchQuery} - ` : categoryParam ? `${categories.find(c => c.id === categoryParam)?.name || "Products"} - ` : ""}Laptops & Electronics | Jumia`}
        description={`Browse our wide selection of ${categoryParam ? categories.find(c => c.id === categoryParam)?.name.toLowerCase() : "laptops"} with advanced filters. Find the perfect laptop for gaming, business, or everyday use.`}
        keywords={`laptops, ${categoryParam || "electronics"}, online shopping, ${brands.join(", ")}, Nigeria`}
        ogTitle={`Shop ${categoryParam ? categories.find(c => c.id === categoryParam)?.name : "Laptops"} Online`}
        ogDescription="Find the best deals on laptops with advanced filtering options. Fast delivery across Nigeria."
      />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 space-y-6">
            <div className="bg-card rounded-lg border p-4">
              <h3 className="font-semibold mb-4 flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Categories</h4>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={category.id}
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={() => toggleCategory(category.id)}
                        />
                        <Label
                          htmlFor={category.id}
                          className="text-sm cursor-pointer"
                        >
                          {category.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Price Range</h4>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={4000000}
                    step={50000}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>₦{priceRange[0].toLocaleString()}</span>
                    <span>₦{priceRange[1].toLocaleString()}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">RAM</h4>
                  <div className="space-y-2">
                    {ramOptions.map((ram) => (
                      <div key={ram} className="flex items-center space-x-2">
                        <Checkbox
                          id={`ram-${ram}`}
                          checked={selectedRAM.includes(ram)}
                          onCheckedChange={() => toggleRAM(ram)}
                        />
                        <Label htmlFor={`ram-${ram}`} className="text-sm cursor-pointer">
                          {ram}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Storage</h4>
                  <div className="space-y-2">
                    {storageOptions.map((storage) => (
                      <div key={storage} className="flex items-center space-x-2">
                        <Checkbox
                          id={`storage-${storage}`}
                          checked={selectedStorage.includes(storage)}
                          onCheckedChange={() => toggleStorage(storage)}
                        />
                        <Label htmlFor={`storage-${storage}`} className="text-sm cursor-pointer">
                          {storage}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Processor Type</h4>
                  <div className="space-y-2">
                    {processorTypes.map((proc) => (
                      <div key={proc} className="flex items-center space-x-2">
                        <Checkbox
                          id={`proc-${proc}`}
                          checked={selectedProcessor.includes(proc)}
                          onCheckedChange={() => toggleProcessor(proc)}
                        />
                        <Label htmlFor={`proc-${proc}`} className="text-sm cursor-pointer">
                          {proc}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Screen Size</h4>
                  <div className="space-y-2">
                    {screenSizes.map((size) => (
                      <div key={size} className="flex items-center space-x-2">
                        <Checkbox
                          id={`screen-${size}`}
                          checked={screenSize.includes(size)}
                          onCheckedChange={() => toggleScreenSize(size)}
                        />
                        <Label htmlFor={`screen-${size}`} className="text-sm cursor-pointer">
                          {size}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Brands</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {brands.map((brand) => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox
                          id={brand}
                          checked={selectedBrands.includes(brand)}
                          onCheckedChange={() => toggleBrand(brand)}
                        />
                        <Label htmlFor={brand} className="text-sm cursor-pointer">
                          {brand}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Minimum Rating</h4>
                  <Select
                    value={minRating.toString()}
                    onValueChange={(value) => setMinRating(Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">All Ratings</SelectItem>
                      <SelectItem value="4">4+ Stars</SelectItem>
                      <SelectItem value="4.5">4.5+ Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSelectedCategories([]);
                    setSelectedBrands([]);
                    setSelectedRAM([]);
                    setSelectedStorage([]);
                    setSelectedProcessor([]);
                    setScreenSize([]);
                    setPriceRange([0, 4000000]);
                    setMinRating(0);
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                {filteredProducts.length} products found
              </p>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="name">Name: A to Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">No products found</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Try adjusting your filters
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
