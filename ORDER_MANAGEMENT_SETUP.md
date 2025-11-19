# Order Management System Setup Guide

## Overview
This guide will help you set up the comprehensive order management system with proper database tables and admin interface.

## Step 1: Update Environment Variables ✅ DONE
Your `.env` file has been updated with the correct Supabase credentials:
```
VITE_SUPABASE_PROJECT_ID="jtezcxkjjrrzqakrfukf"
VITE_SUPABASE_URL="https://jtezcxkjjrrzqakrfukf.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJ..."
```

## Step 2: Run Database Migrations

You need to apply the new database schema to your Supabase project.

### Option A: Using Supabase Dashboard (Recommended for Quick Setup)

1. Go to your Supabase project: https://supabase.com/dashboard/project/jtezcxkjjrrzqakrfukf

2. Click on "SQL Editor" in the left sidebar

3. Open and run these migration files in order:

   **First:** `supabase/migrations/20251113000000_create_products_table.sql`
   - This creates the products table if it doesn't exist

   **Second:** `supabase/migrations/20251114000000_create_storage_bucket.sql`
   - This creates the product-images storage bucket

   **Third:** `supabase/migrations/20251118000000_enhanced_order_system.sql`
   - This creates the comprehensive order management system

4. Click "Run" for each migration

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref jtezcxkjjrrzqakrfukf

# Push all migrations
supabase db push
```

## Step 3: Verify Database Tables

After running migrations, verify these tables exist in your Supabase project:

### Tables Created:
1. **products** - Product catalog
2. **orders** - Main orders table
3. **order_items** - Individual items in each order
4. **order_status_history** - Audit trail of status changes
5. **payment_records** - Payment transaction records

### Views Created:
1. **order_summary** - Quick order overview
2. **order_details** - Complete order information
3. **order_analytics** - Sales analytics

### Functions Created:
1. **get_order_statistics()** - Get order stats for dashboard
2. **calculate_order_total()** - Calculate order totals

## Step 4: Update Supabase Types

After running migrations, you need to regenerate TypeScript types:

### Option A: Automatic (Supabase CLI)
```bash
supabase gen types typescript --project-id jtezcxkjjrrzqakrfukf > src/integrations/supabase/types.ts
```

### Option B: Manual (If CLI doesn't work)
1. Go to your Supabase project dashboard
2. Click on "API Docs" in the left sidebar
3. Scroll down to "TypeScript Types"
4. Copy the generated types
5. Replace the content of `src/integrations/supabase/types.ts` with the copied types

## Step 5: Test the System

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Test Checkout Flow:**
   - Add products to cart
   - Go to checkout (`/checkout`)
   - Fill in customer details
   - Submit order
   - Check if order appears in database

3. **Test Order Management:**
   - Navigate to `/admin/orders`
   - You should see the order you just created
   - Test updating order status
   - Test adding tracking number
   - Test updating payment status

## Step 6: Access Admin Features

### Product Management
- URL: `http://localhost:5173/admin`
- Features:
  - Add/Edit/Delete products
  - Upload up to 4 images per product
  - Manage inventory and specs

### Order Management
- URL: `http://localhost:5173/admin/orders`
- Features:
  - View all orders
  - Filter by status
  - Search orders
  - Update order status
  - Update payment status
  - Add tracking numbers
  - Add admin notes

## Database Schema Overview

### Orders Table Structure
```sql
orders:
  - id (UUID, Primary Key)
  - order_number (TEXT, Unique) - Auto-generated: ORD-20251118-1234
  - customer_name (TEXT)
  - customer_email (TEXT)
  - customer_phone (TEXT)
  - customer_address (TEXT)
  - city (TEXT)
  - state (TEXT)
  - subtotal (DECIMAL)
  - delivery_fee (DECIMAL)
  - total_amount (DECIMAL)
  - delivery_option (pickup|doorstep|express)
  - payment_method (paystack|bank_transfer|cash_on_delivery|whatsapp)
  - payment_status (pending|paid|failed|refunded)
  - status (pending|confirmed|processing|packed|shipped|out_for_delivery|delivered|cancelled|refunded)
  - tracking_number (TEXT)
  - admin_notes (TEXT)
  - created_at, updated_at (TIMESTAMP)
```

### Order Items Table Structure
```sql
order_items:
  - id (UUID, Primary Key)
  - order_id (UUID, Foreign Key → orders.id)
  - product_id (UUID)
  - product_name (TEXT)
  - product_image (TEXT)
  - product_brand (TEXT)
  - product_category (TEXT)
  - specs (JSONB) - Full product specs snapshot
  - unit_price (DECIMAL)
  - quantity (INTEGER)
  - subtotal (DECIMAL)
  - total (DECIMAL)
  - created_at, updated_at (TIMESTAMP)
```

## Features Implemented

### Customer-Facing:
✅ Shopping cart system
✅ Checkout with customer information form
✅ Multiple delivery options (Pickup, Doorstep, Express)
✅ Multiple payment methods (Paystack, Bank Transfer, COD, WhatsApp)
✅ Order confirmation with order number
✅ Email field for order tracking

### Admin Features:
✅ Complete order dashboard with statistics
✅ Real-time order count and revenue metrics
✅ Search orders by number, customer name, email, or phone
✅ Filter orders by status
✅ View detailed order information
✅ Update order status (9 states)
✅ Update payment status (4 states)
✅ Add/update tracking numbers
✅ Add internal admin notes
✅ View order items with product snapshots
✅ Order history tracking

### Advanced Features:
✅ Automatic order numbering (ORD-YYYYMMDD-XXXX)
✅ Status change history (audit trail)
✅ Product snapshot at time of purchase
✅ Real-time statistics calculations
✅ Row Level Security (RLS) policies
✅ Database triggers for automation

## Troubleshooting

### Issue: TypeScript errors about missing fields
**Solution:** Run migrations first, then regenerate types (Step 4)

### Issue: "Table does not exist" error
**Solution:** Make sure you ran all migrations in Step 2

### Issue: Orders not appearing in dashboard
**Solution:** 
1. Check browser console for errors
2. Verify migrations ran successfully
3. Check Supabase dashboard → Table Editor → orders table

### Issue: Can't update order status
**Solution:** Check that RLS policies are enabled (they're included in migrations)

## Next Steps

After setup is complete:

1. **Add Real Payment Integration:**
   - Integrate Paystack API for payment processing
   - See: `PROJECT_AUDIT_AND_RECOMMENDATIONS.md` for Paystack setup guide

2. **Add Email Notifications:**
   - Use Supabase Edge Functions to send order confirmations
   - Send status update emails to customers

3. **Add SMS Notifications:**
   - Integrate Twilio or Termii for SMS
   - Notify customers of order status changes

4. **Enhanced Analytics:**
   - Build sales reports
   - Product performance metrics
   - Customer insights

5. **Inventory Management:**
   - Reduce stock quantity on order
   - Low stock alerts
   - Out of stock handling

## Support

If you encounter issues:
1. Check Supabase logs: Dashboard → Logs
2. Check browser console for JavaScript errors
3. Verify all migrations ran successfully
4. Ensure environment variables are correct

## Database ERD (Entity Relationship Diagram)

```
┌─────────────┐         ┌──────────────┐
│  products   │         │   orders     │
│             │         │              │
│ id (PK)     │◄────┐   │ id (PK)      │
│ name        │     │   │ order_number │
│ price       │     │   │ customer_*   │
│ images[]    │     │   │ total_amount │
│ ...         │     │   │ status       │
└─────────────┘     │   │ ...          │
                    │   └──────────────┘
                    │          │
                    │          │ 1:N
                    │          ▼
                    │   ┌──────────────────┐
                    └───│  order_items     │
                        │                  │
                        │ id (PK)          │
                        │ order_id (FK)    │
                        │ product_id       │
                        │ product_name     │
                        │ quantity         │
                        │ unit_price       │
                        │ ...              │
                        └──────────────────┘
                               │
                        ┌──────┴──────┐
                        │             │
                        ▼             ▼
         ┌─────────────────────┐  ┌─────────────────┐
         │ order_status_history│  │ payment_records │
         │                     │  │                 │
         │ id (PK)             │  │ id (PK)         │
         │ order_id (FK)       │  │ order_id (FK)   │
         │ from_status         │  │ amount          │
         │ to_status           │  │ status          │
         │ changed_by          │  │ gateway_ref     │
         │ ...                 │  │ ...             │
         └─────────────────────┘  └─────────────────┘
```

---

**Last Updated:** November 18, 2025  
**Status:** Ready for deployment after migrations
