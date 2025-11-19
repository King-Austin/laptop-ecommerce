@echo off
echo ========================================
echo Jumia Clone - Order Management System
echo Database Migration Script
echo ========================================
echo.

echo Step 1: Checking Supabase CLI...
where supabase >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Supabase CLI not found!
    echo Installing Supabase CLI...
    npm install -g supabase
) else (
    echo Supabase CLI found!
)

echo.
echo Step 2: Linking to your Supabase project...
echo Project ID: jtezcxkjjrrzqakrfukf
supabase link --project-ref jtezcxkjjrrzqakrfukf

echo.
echo Step 3: Pushing database migrations...
echo This will create the following tables:
echo  - products (laptop inventory)
echo  - orders (customer orders)
echo  - order_items (items in each order)
echo  - order_status_history (status tracking)
echo  - payment_records (payment tracking)
echo  - Storage bucket: product-images
echo.

supabase db push

echo.
echo Step 4: Verifying setup...
echo Generating TypeScript types...
supabase gen types typescript --project-id jtezcxkjjrrzqakrfukf > src\integrations\supabase\types.ts

echo.
echo ========================================
echo Setup Complete! ✅
echo ========================================
echo.
echo Next steps:
echo 1. Run: npm run dev
echo 2. Visit: http://localhost:5173/admin
echo 3. Click: "View Orders" button
echo 4. Test: Place an order from /checkout
echo.
echo Admin pages:
echo  - Products: http://localhost:5173/admin
echo  - Orders:   http://localhost:5173/admin/orders
echo.
pause
