import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Package, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/SEO";
import { ImageUploader } from "@/components/ImageUploader";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface Product {
  id?: string;
  name: string;
  price: number;
  original_price?: number;
  image: string;
  images: string[];
  description: string;
  category: string;
  brand: string;
  rating: number;
  reviews: number;
  in_stock: boolean;
  stock_quantity?: number;
  low_stock_threshold?: number;
  featured: boolean;
  processor?: string;
  processor_generation?: string;
  ram?: string;
  storage?: string;
  storage_type?: string;
  gpu?: string;
  display?: string;
  display_resolution?: string;
  refresh_rate?: string;
  battery?: string;
  screen_size?: string;
  os?: string;
}

const AdminDashboard = () => {
  const { signOut, user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Product>({
    name: "",
    price: 0,
    image: "",
    images: [],
    description: "",
    category: "gaming",
    brand: "",
    rating: 0,
    reviews: 0,
    in_stock: true,
    featured: false,
  });
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      // Error handled in signOut function
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch products", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate image URLs
      const imagesToValidate = imageUrls.length > 0 ? imageUrls : [formData.image];
      for (const imgUrl of imagesToValidate) {
        try {
          const url = new URL(imgUrl);
          if (!['http:', 'https:'].includes(url.protocol)) {
            toast.error("Only HTTP and HTTPS URLs are allowed for images");
            return;
          }
        } catch (error) {
          toast.error("Invalid image URL format");
          return;
        }
      }

      const productData = {
        ...formData,
        images: imageUrls.length > 0 ? imageUrls : [formData.image],
      };

      if (editingProduct?.id) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProduct.id);

        if (error) throw error;
        toast.success("Product updated successfully!");
      } else {
        const { error } = await supabase
          .from("products")
          .insert([productData]);

        if (error) throw error;
        toast.success("Product created successfully!");
      }

      setIsDialogOpen(false);
      resetForm();
      fetchProducts();
    } catch (error: any) {
      toast.error("Failed to save product", {
        description: error.message,
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Product deleted successfully!");
      fetchProducts();
    } catch (error: any) {
      toast.error("Failed to delete product", {
        description: error.message,
      });
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      original_price: product.original_price,
      image: product.image,
      images: product.images || [],
      description: product.description,
      category: product.category,
      brand: product.brand,
      rating: product.rating,
      reviews: product.reviews,
      in_stock: product.in_stock,
      featured: product.featured,
      processor: product.processor,
      ram: product.ram,
      storage: product.storage,
      gpu: product.gpu,
      display: product.display,
      battery: product.battery,
      screen_size: product.screen_size,
    });
    setImageUrls(product.images || [product.image]);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      price: 0,
      image: "",
      images: [],
      description: "",
      category: "gaming",
      brand: "",
      rating: 0,
      reviews: 0,
      in_stock: true,
      featured: false,
    });
    setImageUrls([]);
  };

  const handleImagesChange = (urls: string[]) => {
    setImageUrls(urls);
    // Set first image as main product image
    if (urls.length > 0) {
      setFormData({ ...formData, image: urls[0], images: urls });
    } else {
      setFormData({ ...formData, image: "", images: [] });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Admin Dashboard - Manage Products | Jumia"
        description="Manage laptop inventory, add new products, and update product details"
        keywords="admin, dashboard, product management"
      />
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Product Management</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Manage your laptop inventory
            </p>
            {user && (
              <p className="text-xs text-muted-foreground mt-1">
                Logged in as: {user.email}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/admin/orders" className="flex-1 sm:flex-none">
              <Button variant="outline" className="w-full sm:w-auto">
                <Package className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">View Orders</span>
                <span className="sm:hidden">Orders</span>
              </Button>
            </Link>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm} className="flex-1 sm:flex-none">
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Add Product</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingProduct ? "Edit Product" : "Add New Product"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="brand">Brand *</Label>
                      <Input
                        id="brand"
                        value={formData.brand}
                        onChange={(e) =>
                          setFormData({ ...formData, brand: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price">Price (₦) *</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: Number(e.target.value) })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="originalPrice">Original Price (₦)</Label>
                      <Input
                        id="originalPrice"
                        type="number"
                        value={formData.original_price || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            original_price: e.target.value ? Number(e.target.value) : undefined,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          setFormData({ ...formData, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gaming">Gaming Laptops</SelectItem>
                          <SelectItem value="ultrabook">Ultrabooks</SelectItem>
                          <SelectItem value="macbook">MacBooks</SelectItem>
                          <SelectItem value="business">Business Laptops</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rating">Rating</Label>
                      <Input
                        id="rating"
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        value={formData.rating}
                        onChange={(e) =>
                          setFormData({ ...formData, rating: Number(e.target.value) })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reviews">Reviews Count</Label>
                      <Input
                        id="reviews"
                        type="number"
                        value={formData.reviews}
                        onChange={(e) =>
                          setFormData({ ...formData, reviews: Number(e.target.value) })
                        }
                      />
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="inStock"
                          checked={formData.in_stock}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, in_stock: checked as boolean })
                          }
                        />
                        <Label htmlFor="inStock">In Stock</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="featured"
                          checked={formData.featured}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, featured: checked as boolean })
                          }
                        />
                        <Label htmlFor="featured">Featured</Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stockQuantity">Current Stock Level</Label>
                      <Input
                        id="stockQuantity"
                        type="number"
                        min="0"
                        placeholder="e.g., 50"
                        value={formData.stock_quantity || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, stock_quantity: e.target.value ? Number(e.target.value) : undefined })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lowStockThreshold">Low Stock Alert Threshold</Label>
                      <Input
                        id="lowStockThreshold"
                        type="number"
                        min="0"
                        placeholder="e.g., 10"
                        value={formData.low_stock_threshold || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, low_stock_threshold: e.target.value ? Number(e.target.value) : undefined })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      required
                      rows={3}
                    />
                  </div>

                  <ImageUploader
                    images={imageUrls}
                    onImagesChange={handleImagesChange}
                    maxImages={4}
                  />

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Technical Specifications</CardTitle>
                      <p className="text-sm text-muted-foreground">Detailed laptop specifications for better customer information</p>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="processor">Processor (CPU) *</Label>
                        <Input
                          id="processor"
                          placeholder="e.g., Intel Core i7-1360P"
                          value={formData.processor || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, processor: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="processorGeneration">Processor Generation</Label>
                        <Input
                          id="processorGeneration"
                          placeholder="e.g., 13th Gen"
                          value={formData.processor_generation || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, processor_generation: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="ram">RAM *</Label>
                        <Input
                          id="ram"
                          placeholder="e.g., 16GB DDR5"
                          value={formData.ram || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, ram: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="storage">Storage *</Label>
                        <Input
                          id="storage"
                          placeholder="e.g., 512GB"
                          value={formData.storage || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, storage: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="storageType">Storage Type</Label>
                        <Select
                          value={formData.storage_type || ""}
                          onValueChange={(value) =>
                            setFormData({ ...formData, storage_type: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SSD">SSD</SelectItem>
                            <SelectItem value="HDD">HDD</SelectItem>
                            <SelectItem value="Hybrid">Hybrid (SSD + HDD)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gpu">Graphics Card (GPU) *</Label>
                        <Input
                          id="gpu"
                          placeholder="e.g., NVIDIA RTX 4060 6GB"
                          value={formData.gpu || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, gpu: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="display">Display Size *</Label>
                        <Input
                          id="display"
                          placeholder="e.g., 15.6 inch FHD"
                          value={formData.display || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, display: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="displayResolution">Display Resolution</Label>
                        <Input
                          id="displayResolution"
                          placeholder="e.g., 1920x1080 (FHD)"
                          value={formData.display_resolution || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, display_resolution: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="refreshRate">Refresh Rate</Label>
                        <Input
                          id="refreshRate"
                          placeholder="e.g., 144Hz"
                          value={formData.refresh_rate || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, refresh_rate: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="os">Operating System *</Label>
                        <Input
                          id="os"
                          placeholder="e.g., Windows 11 Pro"
                          value={formData.os || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, os: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="battery">Battery</Label>
                        <Input
                          id="battery"
                          placeholder="e.g., 90Wh Li-ion"
                          value={formData.battery || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, battery: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="screenSize">Screen Size (inches)</Label>
                        <Input
                          id="screenSize"
                          placeholder="e.g., 15.6"
                          value={formData.screen_size || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, screen_size: e.target.value })
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingProduct ? "Update Product" : "Create Product"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            <Button variant="ghost" onClick={handleSignOut} className="flex-1 sm:flex-none">
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Sign Out</span>
              <span className="sm:hidden">Logout</span>
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16 sm:w-20">Image</TableHead>
                  <TableHead className="min-w-[150px]">Name</TableHead>
                  <TableHead className="hidden md:table-cell">Brand</TableHead>
                  <TableHead className="hidden lg:table-cell">Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="hidden sm:table-cell">Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No products found. Add your first product to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="max-w-[200px]">
                          <p className="truncate">{product.name}</p>
                          <p className="text-xs text-muted-foreground md:hidden">
                            {product.brand}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{product.brand}</TableCell>
                      <TableCell className="hidden lg:table-cell capitalize">{product.category}</TableCell>
                      <TableCell className="font-semibold whitespace-nowrap">
                        ₦{product.price.toLocaleString()}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span
                          className={`inline-flex px-2 py-1 text-xs rounded whitespace-nowrap ${product.in_stock
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                            }`}
                        >
                          {product.in_stock ? "In Stock" : "Out"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(product)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(product.id!)}
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
