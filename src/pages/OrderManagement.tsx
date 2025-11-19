import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
    Package,
    Truck,
    CheckCircle,
    XCircle,
    Clock,
    Search,
    Eye,
    Filter,
    TrendingUp,
    DollarSign,
    ShoppingCart,
    AlertCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/SEO";

interface Order {
    id: string;
    order_number: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    customer_address: string;
    city: string;
    state: string;
    subtotal: number;
    delivery_fee: number;
    total_amount: number;
    delivery_option: string;
    payment_method: string;
    payment_status: string;
    status: string;
    tracking_number?: string;
    admin_notes?: string;
    created_at: string;
    updated_at: string;
}

interface OrderItem {
    id: string;
    product_name: string;
    product_image: string;
    product_brand?: string;
    unit_price: number;
    quantity: number;
    total: number;
}

interface OrderStats {
    total_orders: number;
    pending_orders: number;
    confirmed_orders: number;
    shipped_orders: number;
    delivered_orders: number;
    cancelled_orders: number;
    total_revenue: number;
    today_orders: number;
    today_revenue: number;
}

const OrderManagement = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [stats, setStats] = useState<OrderStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    useEffect(() => {
        fetchOrders();
        fetchStats();
    }, []);

    useEffect(() => {
        filterOrders();
    }, [searchTerm, statusFilter, orders]);

    const fetchOrders = async () => {
        try {
            const { data, error } = await supabase
                .from("orders")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (error) {
            console.error("Error fetching orders:", error);
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const { data, error } = await supabase.rpc("get_order_statistics");

            if (error) throw error;
            if (data && data.length > 0) {
                setStats(data[0]);
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    const fetchOrderItems = async (orderId: string) => {
        try {
            const { data, error } = await supabase
                .from("order_items")
                .select("*")
                .eq("order_id", orderId);

            if (error) throw error;
            setOrderItems(data || []);
        } catch (error) {
            console.error("Error fetching order items:", error);
            toast.error("Failed to load order items");
        }
    };

    const filterOrders = () => {
        let filtered = orders;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(
                (order) =>
                    order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    order.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    order.customer_phone.includes(searchTerm)
            );
        }

        // Filter by status
        if (statusFilter !== "all") {
            filtered = filtered.filter((order) => order.status === statusFilter);
        }

        setFilteredOrders(filtered);
    };

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from("orders")
                .update({ status: newStatus })
                .eq("id", orderId);

            if (error) throw error;

            toast.success("Order status updated successfully");
            fetchOrders();
            fetchStats();

            if (selectedOrder?.id === orderId) {
                setSelectedOrder({ ...selectedOrder, status: newStatus });
            }
        } catch (error) {
            console.error("Error updating order:", error);
            toast.error("Failed to update order status");
        }
    };

    const updatePaymentStatus = async (orderId: string, paymentStatus: string) => {
        try {
            const { error } = await supabase
                .from("orders")
                .update({ payment_status: paymentStatus })
                .eq("id", orderId);

            if (error) throw error;

            toast.success("Payment status updated successfully");
            fetchOrders();
            fetchStats();

            if (selectedOrder?.id === orderId) {
                setSelectedOrder({ ...selectedOrder, payment_status: paymentStatus });
            }
        } catch (error) {
            console.error("Error updating payment status:", error);
            toast.error("Failed to update payment status");
        }
    };

    const updateTrackingNumber = async (orderId: string, trackingNumber: string) => {
        try {
            const { error } = await supabase
                .from("orders")
                .update({ tracking_number: trackingNumber })
                .eq("id", orderId);

            if (error) throw error;

            toast.success("Tracking number updated successfully");
            fetchOrders();

            if (selectedOrder?.id === orderId) {
                setSelectedOrder({ ...selectedOrder, tracking_number: trackingNumber });
            }
        } catch (error) {
            console.error("Error updating tracking number:", error);
            toast.error("Failed to update tracking number");
        }
    };

    const updateAdminNotes = async (orderId: string, notes: string) => {
        try {
            const { error } = await supabase
                .from("orders")
                .update({ admin_notes: notes })
                .eq("id", orderId);

            if (error) throw error;

            toast.success("Admin notes updated successfully");
            fetchOrders();

            if (selectedOrder?.id === orderId) {
                setSelectedOrder({ ...selectedOrder, admin_notes: notes });
            }
        } catch (error) {
            console.error("Error updating admin notes:", error);
            toast.error("Failed to update admin notes");
        }
    };

    const openOrderDetails = async (order: Order) => {
        setSelectedOrder(order);
        await fetchOrderItems(order.id);
        setIsDetailsOpen(true);
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: "bg-yellow-500",
            confirmed: "bg-blue-500",
            processing: "bg-purple-500",
            packed: "bg-indigo-500",
            shipped: "bg-orange-500",
            out_for_delivery: "bg-teal-500",
            delivered: "bg-green-500",
            cancelled: "bg-red-500",
            refunded: "bg-gray-500",
        };
        return colors[status] || "bg-gray-500";
    };

    const getPaymentStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: "bg-yellow-500",
            paid: "bg-green-500",
            failed: "bg-red-500",
            refunded: "bg-gray-500",
        };
        return colors[status] || "bg-gray-500";
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <>
            <SEO
                title="Order Management - Admin Dashboard"
                description="Manage customer orders, track deliveries, and update order status"
                keywords="order management, admin, ecommerce orders"
            />
            <div className="min-h-screen bg-background p-4 md:p-8">
                <div className="container mx-auto max-w-7xl">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">Order Management</h1>
                        <p className="text-muted-foreground">
                            Track and manage customer orders
                        </p>
                    </div>

                    {/* Statistics Cards */}
                    {stats && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Total Orders
                                    </CardTitle>
                                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.total_orders}</div>
                                    <p className="text-xs text-muted-foreground">
                                        {stats.today_orders} orders today
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Total Revenue
                                    </CardTitle>
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        ₦{stats.total_revenue.toLocaleString()}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        ₦{stats.today_revenue.toLocaleString()} today
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Pending Orders
                                    </CardTitle>
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.pending_orders}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Awaiting confirmation
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Delivered
                                    </CardTitle>
                                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {stats.delivered_orders}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Successfully completed
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Filters and Search */}
                    <Card className="mb-6">
                        <CardContent className="pt-6">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by order number, customer name, email, or phone..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-full md:w-[200px]">
                                        <Filter className="h-4 w-4 mr-2" />
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Orders</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="confirmed">Confirmed</SelectItem>
                                        <SelectItem value="processing">Processing</SelectItem>
                                        <SelectItem value="packed">Packed</SelectItem>
                                        <SelectItem value="shipped">Shipped</SelectItem>
                                        <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                                        <SelectItem value="delivered">Delivered</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Orders Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Orders ({filteredOrders.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Order #</TableHead>
                                            <TableHead>Customer</TableHead>
                                            <TableHead>Total</TableHead>
                                            <TableHead>Payment</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredOrders.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center py-8">
                                                    <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                                                    <p className="text-muted-foreground">No orders found</p>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredOrders.map((order) => (
                                                <TableRow key={order.id}>
                                                    <TableCell className="font-medium">
                                                        {order.order_number}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div>
                                                            <div className="font-medium">{order.customer_name}</div>
                                                            <div className="text-sm text-muted-foreground">
                                                                {order.customer_email}
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">
                                                                {order.customer_phone}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="font-semibold">
                                                        ₦{order.total_amount.toLocaleString()}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge className={getPaymentStatusColor(order.payment_status)}>
                                                            {order.payment_status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge className={getStatusColor(order.status)}>
                                                            {order.status.replace(/_/g, " ")}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {new Date(order.created_at).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => openOrderDetails(order)}
                                                        >
                                                            <Eye className="h-4 w-4 mr-1" />
                                                            View
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Order Details Dialog */}
                <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Order Details - {selectedOrder?.order_number}</DialogTitle>
                        </DialogHeader>

                        {selectedOrder && (
                            <div className="space-y-6">
                                {/* Customer Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Customer Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-muted-foreground">Name</Label>
                                            <p className="font-medium">{selectedOrder.customer_name}</p>
                                        </div>
                                        <div>
                                            <Label className="text-muted-foreground">Email</Label>
                                            <p className="font-medium">{selectedOrder.customer_email}</p>
                                        </div>
                                        <div>
                                            <Label className="text-muted-foreground">Phone</Label>
                                            <p className="font-medium">{selectedOrder.customer_phone}</p>
                                        </div>
                                        <div>
                                            <Label className="text-muted-foreground">Delivery Option</Label>
                                            <p className="font-medium capitalize">
                                                {selectedOrder.delivery_option.replace(/_/g, " ")}
                                            </p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <Label className="text-muted-foreground">Address</Label>
                                            <p className="font-medium">
                                                {selectedOrder.customer_address}, {selectedOrder.city},{" "}
                                                {selectedOrder.state}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Order Items */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Order Items</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {orderItems.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-center gap-4 p-4 border rounded"
                                                >
                                                    <img
                                                        src={item.product_image}
                                                        alt={item.product_name}
                                                        className="w-16 h-16 object-cover rounded"
                                                    />
                                                    <div className="flex-1">
                                                        <h4 className="font-medium">{item.product_name}</h4>
                                                        {item.product_brand && (
                                                            <p className="text-sm text-muted-foreground">
                                                                {item.product_brand}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-medium">
                                                            ₦{item.unit_price.toLocaleString()} × {item.quantity}
                                                        </p>
                                                        <p className="text-sm font-semibold text-primary">
                                                            ₦{item.total.toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Order Summary */}
                                        <div className="mt-6 space-y-2 border-t pt-4">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Subtotal</span>
                                                <span className="font-medium">
                                                    ₦{selectedOrder.subtotal.toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Delivery Fee</span>
                                                <span className="font-medium">
                                                    ₦{selectedOrder.delivery_fee.toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-lg font-bold border-t pt-2">
                                                <span>Total</span>
                                                <span className="text-primary">
                                                    ₦{selectedOrder.total_amount.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Order Status Management */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Order Management</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label>Order Status</Label>
                                                <Select
                                                    value={selectedOrder.status}
                                                    onValueChange={(value) =>
                                                        updateOrderStatus(selectedOrder.id, value)
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="pending">Pending</SelectItem>
                                                        <SelectItem value="confirmed">Confirmed</SelectItem>
                                                        <SelectItem value="processing">Processing</SelectItem>
                                                        <SelectItem value="packed">Packed</SelectItem>
                                                        <SelectItem value="shipped">Shipped</SelectItem>
                                                        <SelectItem value="out_for_delivery">
                                                            Out for Delivery
                                                        </SelectItem>
                                                        <SelectItem value="delivered">Delivered</SelectItem>
                                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <Label>Payment Status</Label>
                                                <Select
                                                    value={selectedOrder.payment_status}
                                                    onValueChange={(value) =>
                                                        updatePaymentStatus(selectedOrder.id, value)
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="pending">Pending</SelectItem>
                                                        <SelectItem value="paid">Paid</SelectItem>
                                                        <SelectItem value="failed">Failed</SelectItem>
                                                        <SelectItem value="refunded">Refunded</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div>
                                            <Label>Tracking Number</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder="Enter tracking number"
                                                    defaultValue={selectedOrder.tracking_number || ""}
                                                    onBlur={(e) =>
                                                        updateTrackingNumber(selectedOrder.id, e.target.value)
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label>Admin Notes</Label>
                                            <Textarea
                                                placeholder="Add internal notes about this order..."
                                                defaultValue={selectedOrder.admin_notes || ""}
                                                onBlur={(e) =>
                                                    updateAdminNotes(selectedOrder.id, e.target.value)
                                                }
                                                rows={4}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
};

export default OrderManagement;
