import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SEO } from "@/components/SEO";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <SEO
          title="Shopping Cart - Jumia"
          description="View and manage items in your shopping cart"
          keywords="shopping cart, checkout, online shopping"
        />
        <div className="text-center max-w-sm mx-auto">
          <ShoppingBag className="h-16 w-16 sm:h-24 sm:w-24 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6 text-sm sm:text-base">
            Add some products to get started
          </p>
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link to="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`Shopping Cart (${cart.length} items) - Jumia`}
        description="Review your shopping cart and proceed to checkout"
        keywords="shopping cart, checkout, online shopping"
      />
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-7xl">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            {cart.map((item) => (
              <Card key={item.id} className="p-3 sm:p-4 overflow-hidden">
                <div className="flex gap-3 items-start">
                  {/* Product Image */}
                  <Link to={`/product/${item.id}`} className="shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded border"
                      loading="lazy"
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0 space-y-2">
                    {/* Product Name and Delete Button */}
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        to={`/product/${item.id}`}
                        className="font-medium hover:text-primary transition-colors text-sm sm:text-base line-clamp-2 leading-tight"
                        title={item.name}
                      >
                        {item.name}
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="text-destructive hover:text-destructive shrink-0 h-7 w-7 sm:h-8 sm:w-8 p-0"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                    
                    {/* Brand */}
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                      {item.brand}
                    </p>
                    
                    {/* Price and Quantity Controls */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <p className="text-base sm:text-lg font-bold text-primary whitespace-nowrap">
                          ₦{item.price.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground sm:hidden">
                          Each
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 sm:w-10 text-center font-semibold text-sm bg-muted rounded px-1 py-1">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Total Price for this item (mobile only) */}
                    <div className="sm:hidden pt-1 border-t">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Subtotal:</span>
                        <span className="font-semibold">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop Subtotal */}
                <div className="hidden sm:flex justify-end mt-3 pt-3 border-t">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Item Total: </span>
                    <span className="font-semibold">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-4 sm:p-6 lg:sticky lg:top-24">
              <h2 className="text-lg sm:text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-sm sm:text-base">
                  <span className="text-muted-foreground">Subtotal ({cart.reduce((total, item) => total + item.quantity, 0)} items)</span>
                  <span className="font-semibold">
                    ₦{getCartTotal().toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm sm:text-base">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span className="font-semibold text-green-600">₦2,500</span>
                </div>
                <div className="border-t pt-3 flex justify-between items-center text-base sm:text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary text-lg sm:text-xl">
                    ₦{(getCartTotal() + 2500).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <Button asChild className="w-full" size="lg">
                  <Link to="/checkout">Proceed to Checkout</Link>
                </Button>

                <Button variant="outline" asChild className="w-full">
                  <Link to="/products">Continue Shopping</Link>
                </Button>
              </div>

              {/* Mobile-specific delivery info */}
              <div className="mt-4 p-3 bg-muted rounded-lg sm:hidden">
                <p className="text-xs text-muted-foreground">
                  🚚 Free delivery on orders above ₦50,000
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Mobile-specific additional info */}
        <div className="mt-6 sm:hidden">
          <Card className="p-4">
            <h3 className="font-semibold mb-2 text-sm">Delivery Information</h3>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• Standard delivery: 2-5 business days</li>
              <li>• Express delivery available at checkout</li>
              <li>• Free delivery on orders above ₦50,000</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;