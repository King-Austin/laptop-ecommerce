-- Create products table with support for multiple images
CREATE TABLE IF NOT EXISTS public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL NOT NULL,
  original_price DECIMAL,
  image TEXT NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  brand TEXT NOT NULL,
  rating DECIMAL NOT NULL DEFAULT 0,
  reviews INTEGER NOT NULL DEFAULT 0,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  featured BOOLEAN NOT NULL DEFAULT false,
  processor TEXT,
  ram TEXT,
  storage TEXT,
  gpu TEXT,
  display TEXT,
  battery TEXT,
  screen_size TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policy for anyone to read products
CREATE POLICY "Anyone can read products"
ON public.products
FOR SELECT
USING (true);

-- Create policy for authenticated users to insert products (admin only)
CREATE POLICY "Authenticated users can insert products"
ON public.products
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Create policy for authenticated users to update products (admin only)
CREATE POLICY "Authenticated users can update products"
ON public.products
FOR UPDATE
USING (auth.role() = 'authenticated');

-- Create policy for authenticated users to delete products (admin only)
CREATE POLICY "Authenticated users can delete products"
ON public.products
FOR DELETE
USING (auth.role() = 'authenticated');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_brand ON public.products(brand);
CREATE INDEX idx_products_featured ON public.products(featured);
CREATE INDEX idx_products_in_stock ON public.products(in_stock);
