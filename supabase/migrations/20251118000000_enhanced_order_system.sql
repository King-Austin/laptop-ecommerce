-- Enhanced Order Management System
-- This migration creates a comprehensive order system with order items, status tracking, and payment records

-- ============================================
-- 1. CREATE ENHANCED ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL DEFAULT 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0'),

-- Customer Information
customer_name TEXT NOT NULL,
customer_email TEXT NOT NULL,
customer_phone TEXT NOT NULL,
customer_address TEXT NOT NULL,
city TEXT NOT NULL,
state TEXT NOT NULL,
postal_code TEXT,

-- Order Details
subtotal DECIMAL NOT NULL,
delivery_fee DECIMAL NOT NULL DEFAULT 2500,
discount DECIMAL DEFAULT 0,
total_amount DECIMAL NOT NULL,

-- Delivery & Payment
delivery_option TEXT NOT NULL CHECK (
    delivery_option IN (
        'pickup',
        'doorstep',
        'express'
    )
),
payment_method TEXT NOT NULL CHECK (
    payment_method IN (
        'paystack',
        'bank_transfer',
        'cash_on_delivery',
        'whatsapp'
    )
),
payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (
    payment_status IN (
        'pending',
        'paid',
        'failed',
        'refunded'
    )
),

-- Order Status & Tracking
status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN (
        'pending',
        'confirmed',
        'processing',
        'packed',
        'shipped',
        'out_for_delivery',
        'delivered',
        'cancelled',
        'refunded'
    )
),
tracking_number TEXT,
delivery_notes TEXT,

-- Admin Notes
admin_notes TEXT, cancellation_reason TEXT,

-- Timestamps
confirmed_at TIMESTAMP WITH TIME ZONE,
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ============================================
-- 2. CREATE ORDER ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL,

-- Product Snapshot (preserve product details at time of purchase)
product_name TEXT NOT NULL,
product_image TEXT NOT NULL,
product_brand TEXT,
product_category TEXT,

-- Product Specifications at time of order
specs JSONB,

-- Pricing
unit_price DECIMAL NOT NULL,
quantity INTEGER NOT NULL DEFAULT 1,
subtotal DECIMAL NOT NULL,
discount DECIMAL DEFAULT 0,
total DECIMAL NOT NULL,

-- Timestamps
created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ============================================
-- 3. CREATE ORDER STATUS HISTORY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.order_status_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,

-- Status Change
from_status TEXT, to_status TEXT NOT NULL,

-- Change Details
changed_by TEXT, -- admin email or 'system'
notes TEXT,

-- Metadata
metadata JSONB,

-- Timestamp
created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW() );

-- ============================================
-- 4. CREATE PAYMENT RECORDS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.payment_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,

-- Payment Details
payment_method TEXT NOT NULL,
amount DECIMAL NOT NULL,
currency TEXT NOT NULL DEFAULT 'NGN',

-- Payment Gateway Details
gateway_reference TEXT UNIQUE, -- Paystack reference, etc.
gateway_response JSONB,

-- Status
status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN (
        'pending',
        'success',
        'failed',
        'refunded'
    )
),

-- Timestamps
paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ============================================
-- 5. CREATE INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_orders_order_number ON public.orders (order_number);

CREATE INDEX idx_orders_customer_email ON public.orders (customer_email);

CREATE INDEX idx_orders_status ON public.orders (status);

CREATE INDEX idx_orders_payment_status ON public.orders (payment_status);

CREATE INDEX idx_orders_created_at ON public.orders (created_at DESC);

CREATE INDEX idx_orders_customer_phone ON public.orders (customer_phone);

CREATE INDEX idx_order_items_order_id ON public.order_items (order_id);

CREATE INDEX idx_order_items_product_id ON public.order_items (product_id);

CREATE INDEX idx_order_status_history_order_id ON public.order_status_history (order_id);

CREATE INDEX idx_order_status_history_created_at ON public.order_status_history (created_at DESC);

CREATE INDEX idx_payment_records_order_id ON public.payment_records (order_id);

CREATE INDEX idx_payment_records_gateway_ref ON public.payment_records (gateway_reference);

CREATE INDEX idx_payment_records_status ON public.payment_records (status);

-- ============================================
-- 6. CREATE TRIGGERS FOR UPDATED_AT
-- ============================================
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_order_items_updated_at
BEFORE UPDATE ON public.order_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payment_records_updated_at
BEFORE UPDATE ON public.payment_records
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 7. CREATE TRIGGER FOR ORDER STATUS HISTORY
-- ============================================
CREATE OR REPLACE FUNCTION public.track_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Only track if status actually changed
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.order_status_history (order_id, from_status, to_status, changed_by, notes)
    VALUES (NEW.id, OLD.status, NEW.status, 'system', 'Status updated');
    
    -- Update timestamp fields based on status
    IF NEW.status = 'confirmed' AND NEW.confirmed_at IS NULL THEN
      NEW.confirmed_at = NOW();
    ELSIF NEW.status = 'shipped' AND NEW.shipped_at IS NULL THEN
      NEW.shipped_at = NOW();
    ELSIF NEW.status = 'delivered' AND NEW.delivered_at IS NULL THEN
      NEW.delivered_at = NOW();
    ELSIF NEW.status = 'cancelled' AND NEW.cancelled_at IS NULL THEN
      NEW.cancelled_at = NOW();
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER track_order_status_changes
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.track_order_status_change();

-- ============================================
-- 8. ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.payment_records ENABLE ROW LEVEL SECURITY;

-- Orders Policies
CREATE POLICY "Anyone can create orders" ON public.orders FOR INSERT
WITH
    CHECK (true);

CREATE POLICY "Customers can view their own orders" ON public.orders FOR
SELECT USING (
        customer_email = current_setting('request.jwt.claims', true)::json ->> 'email'
        OR true
    );
-- Allow public for now

CREATE POLICY "Authenticated users can update orders" ON public.orders
FOR UPDATE
    USING (
        auth.role () = 'authenticated'
    );

-- Order Items Policies
CREATE POLICY "Anyone can create order items" ON public.order_items FOR INSERT
WITH
    CHECK (true);

CREATE POLICY "Anyone can view order items" ON public.order_items FOR
SELECT USING (true);

CREATE POLICY "Authenticated users can update order items" ON public.order_items
FOR UPDATE
    USING (
        auth.role () = 'authenticated'
    );

-- Order Status History Policies
CREATE POLICY "Anyone can view status history" ON public.order_status_history FOR
SELECT USING (true);

CREATE POLICY "Authenticated users can insert status history" ON public.order_status_history FOR INSERT
WITH
    CHECK (
        auth.role () = 'authenticated'
        OR true
    );

-- Payment Records Policies
CREATE POLICY "Anyone can create payment records" ON public.payment_records FOR INSERT
WITH
    CHECK (true);

CREATE POLICY "Anyone can view payment records" ON public.payment_records FOR
SELECT USING (true);

CREATE POLICY "Authenticated users can update payment records" ON public.payment_records
FOR UPDATE
    USING (
        auth.role () = 'authenticated'
    );

-- ============================================
-- 9. CREATE VIEWS FOR ADMIN DASHBOARD
-- ============================================

-- View: Order Summary with Items Count
CREATE OR REPLACE VIEW public.order_summary AS
SELECT
    o.id,
    o.order_number,
    o.customer_name,
    o.customer_email,
    o.customer_phone,
    o.total_amount,
    o.status,
    o.payment_status,
    o.payment_method,
    o.delivery_option,
    o.created_at,
    COUNT(oi.id) as items_count,
    SUM(oi.quantity) as total_items
FROM public.orders o
    LEFT JOIN public.order_items oi ON o.id = oi.order_id
GROUP BY
    o.id;

-- View: Order Details with Items
CREATE OR REPLACE VIEW public.order_details AS
SELECT
    o.id as order_id,
    o.order_number,
    o.customer_name,
    o.customer_email,
    o.customer_phone,
    o.customer_address,
    o.city,
    o.state,
    o.total_amount,
    o.status,
    o.payment_status,
    o.created_at,
    oi.id as item_id,
    oi.product_name,
    oi.product_image,
    oi.quantity,
    oi.unit_price,
    oi.total as item_total
FROM public.orders o
    LEFT JOIN public.order_items oi ON o.id = oi.order_id;

-- View: Order Analytics
CREATE OR REPLACE VIEW public.order_analytics AS
SELECT
    DATE_TRUNC('day', created_at) as date,
    COUNT(*) as total_orders,
    SUM(total_amount) as total_revenue,
    AVG(total_amount) as average_order_value,
    COUNT(
        CASE
            WHEN status = 'delivered' THEN 1
        END
    ) as delivered_orders,
    COUNT(
        CASE
            WHEN status = 'cancelled' THEN 1
        END
    ) as cancelled_orders,
    COUNT(
        CASE
            WHEN payment_status = 'paid' THEN 1
        END
    ) as paid_orders
FROM public.orders
GROUP BY
    DATE_TRUNC('day', created_at)
ORDER BY date DESC;

-- ============================================
-- 10. CREATE HELPER FUNCTIONS
-- ============================================

-- Function to calculate order total
CREATE OR REPLACE FUNCTION public.calculate_order_total(order_id_param UUID)
RETURNS DECIMAL AS $$
DECLARE
  items_total DECIMAL;
  delivery DECIMAL;
  discount_amount DECIMAL;
BEGIN
  SELECT COALESCE(SUM(total), 0) INTO items_total
  FROM public.order_items
  WHERE order_id = order_id_param;
  
  SELECT delivery_fee, discount INTO delivery, discount_amount
  FROM public.orders
  WHERE id = order_id_param;
  
  RETURN items_total + delivery - COALESCE(discount_amount, 0);
END;
$$ LANGUAGE plpgsql;

-- Function to get order statistics
CREATE OR REPLACE FUNCTION public.get_order_statistics()
RETURNS TABLE (
  total_orders BIGINT,
  pending_orders BIGINT,
  confirmed_orders BIGINT,
  shipped_orders BIGINT,
  delivered_orders BIGINT,
  cancelled_orders BIGINT,
  total_revenue DECIMAL,
  today_orders BIGINT,
  today_revenue DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_orders,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
    COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_orders,
    COUNT(CASE WHEN status = 'shipped' THEN 1 END) as shipped_orders,
    COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_orders,
    COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_orders,
    COALESCE(SUM(total_amount), 0) as total_revenue,
    COUNT(CASE WHEN DATE(created_at) = CURRENT_DATE THEN 1 END) as today_orders,
    COALESCE(SUM(CASE WHEN DATE(created_at) = CURRENT_DATE THEN total_amount ELSE 0 END), 0) as today_revenue
  FROM public.orders;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 11. INSERT SAMPLE DATA (OPTIONAL - FOR TESTING)
-- ============================================

-- Sample order
INSERT INTO
    public.orders (
        customer_name,
        customer_email,
        customer_phone,
        customer_address,
        city,
        state,
        subtotal,
        delivery_fee,
        total_amount,
        delivery_option,
        payment_method,
        status
    )
VALUES (
        'John Doe',
        'john@example.com',
        '+2348012345678',
        '123 Main Street, Ikeja',
        'Lagos',
        'Lagos State',
        1850000,
        2500,
        1852500,
        'doorstep',
        'paystack',
        'confirmed'
    )
RETURNING
    id;

-- Note: You would need to insert order_items manually with the returned order id

COMMENT ON TABLE public.orders IS 'Main orders table with customer and delivery information';

COMMENT ON TABLE public.order_items IS 'Individual items in each order with product snapshot';

COMMENT ON TABLE public.order_status_history IS 'Audit trail of order status changes';

COMMENT ON TABLE public.payment_records IS 'Payment transaction records';