import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("paystack");
  const [deliveryOption, setDeliveryOption] = useState("doorstep");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;

    const subtotal = getCartTotal();
    const deliveryFee = 2500;
    const totalAmount = subtotal + deliveryFee;

    try {
      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_name: `${firstName} ${lastName}`,
          customer_email: email,
          customer_phone: phone,
          customer_address: address,
          city: city,
          state: state,
          subtotal: subtotal,
          delivery_fee: deliveryFee,
          total_amount: totalAmount,
          delivery_option: deliveryOption,
          payment_method: paymentMethod,
          payment_status: paymentMethod === "cash_on_delivery" ? "pending" : "pending",
          status: "pending",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cart.map((item) => ({
        order_id: orderData.id,
        product_id: item.id,
        product_name: item.name,
        product_image: item.image,
        product_brand: item.brand || "",
        product_category: item.category || "",
        unit_price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
        total: item.price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      toast.success("Order placed successfully!", {
        description: `Order #${orderData.order_number} - You will receive a confirmation email shortly.`,
      });

      clearCart();
      navigate("/");
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to place order", {
        description: "Please try again or contact support.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <>
      <SEO
        title="Checkout - Jumia"
        description="Complete your order securely with multiple payment options"
        keywords="checkout, payment, secure shopping, online payment"
      />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">Billing Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" name="firstName" required />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" name="lastName" required />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" required />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" name="phone" type="tel" required />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address">Street Address</Label>
                      <Input id="address" name="address" required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input id="city" name="city" required />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input id="state" name="state" required />
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">Delivery Option</h2>
                  <RadioGroup value={deliveryOption} onValueChange={setDeliveryOption}>
                    <div className="flex items-center space-x-2 p-3 border rounded hover:bg-secondary">
                      <RadioGroupItem value="doorstep" id="doorstep" />
                      <Label htmlFor="doorstep" className="cursor-pointer flex-1">
                        Doorstep Delivery (₦2,500)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded hover:bg-secondary">
                      <RadioGroupItem value="pickup" id="pickup" />
                      <Label htmlFor="pickup" className="cursor-pointer flex-1">
                        Store Pickup (Free)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded hover:bg-secondary">
                      <RadioGroupItem value="express" id="express" />
                      <Label htmlFor="express" className="cursor-pointer flex-1">
                        Express Delivery (₦5,000)
                      </Label>
                    </div>
                  </RadioGroup>
                </Card>

                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2 p-3 border rounded hover:bg-secondary">
                      <RadioGroupItem value="paystack" id="paystack" />
                      <Label htmlFor="paystack" className="cursor-pointer flex-1">
                        Paystack (Card, Bank Transfer)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded hover:bg-secondary">
                      <RadioGroupItem value="cash_on_delivery" id="cash" />
                      <Label htmlFor="cash" className="cursor-pointer flex-1">
                        Cash on Delivery
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded hover:bg-secondary">
                      <RadioGroupItem value="bank_transfer" id="bank" />
                      <Label htmlFor="bank" className="cursor-pointer flex-1">
                        Bank Transfer
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded hover:bg-secondary">
                      <RadioGroupItem value="whatsapp" id="whatsapp" />
                      <Label htmlFor="whatsapp" className="cursor-pointer flex-1">
                        WhatsApp Order (Pay Later)
                      </Label>
                    </div>
                  </RadioGroup>
                </Card>

                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Processing..." : `Place Order - ₦${(getCartTotal() + 2500).toLocaleString()}`}
                </Button>
              </form>
            </div>

            <div>
              <Card className="p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.name} x {item.quantity}
                      </span>
                      <span className="font-semibold">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">
                      ₦{getCartTotal().toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span className="font-semibold">₦2,500</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">
                      ₦{(getCartTotal() + 2500).toLocaleString()}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
