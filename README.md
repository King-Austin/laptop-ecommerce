# Jumia Clone App

## Project info

A modern e-commerce application built with React, TypeScript, and Vite featuring full SEO optimization, admin dashboard, and responsive design.

## Features

### SEO Optimization
- Dynamic meta tags for all pages (title, description, keywords)
- Open Graph and Twitter Card tags for social media sharing
- Structured data (JSON-LD) for products
- Optimized image alt tags for better accessibility
- Sitemap.xml and robots.txt for search engines

### Admin Dashboard
- Full CRUD operations for product management
- Multiple image upload support with live preview
- Product inventory management (pricing, specs, stock status)
- Category and brand management
- Featured products toggle

### Frontend Features
- Responsive design optimized for all screen sizes
- Image carousel with mobile swipe support
- Advanced product filtering (category, brand, RAM, storage, processor, price range)
- Product search functionality
- Shopping cart with quantity management
- Checkout process with order form

### Technical Features
- Built with React 18, TypeScript, and Vite
- Supabase backend for products and orders
- Tailwind CSS for styling
- shadcn-ui component library
- Embla Carousel for image galleries
- React Query for data fetching
- React Router for navigation

## How can I edit this code?

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Set up environment variables (see below)

# Step 5: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_SUPABASE_PROJECT_ID=your_supabase_project_id
```

### Getting Supabase Credentials

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Project Settings > API
4. Copy the Project URL and anon/public key
5. The Project ID is in the URL of your Supabase project

### Database Setup

Run the migrations in the `supabase/migrations` folder to set up the database schema:

1. Install Supabase CLI: `npm install -g supabase`
2. Link your project: `supabase link --project-ref your-project-ref`
3. Run migrations: `supabase db push`

Or manually run the SQL in the Supabase SQL Editor:
- `20251112093906_84b4314a-2173-4e07-861b-903f5ce1e00b.sql` - Creates orders table
- `20251113000000_create_products_table.sql` - Creates products table

## What technologies are used for this project?

This project is built with:

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn-ui
- **Backend**: Supabase (PostgreSQL)
- **Routing**: React Router v6
- **State Management**: React Context API, React Query
- **Image Carousel**: Embla Carousel React
- **Form Handling**: React Hook Form with Zod validation
- **Notifications**: Sonner

## How can I deploy this project?

### Deploying to Vercel (Recommended)

This project includes a `vercel.json` configuration file optimized for production deployment.

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Follow the prompts to deploy

**Or use the Vercel Dashboard:**

1. Push your code to GitHub
2. Import the repository in [Vercel Dashboard](https://vercel.com/new)
3. Add environment variables in the Vercel project settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_PROJECT_ID`
4. Deploy!

### Environment Variables in Production

Make sure to set the following environment variables in your hosting platform:

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase publishable (anon) key
- `VITE_SUPABASE_PROJECT_ID`: Your Supabase project ID

### Other Hosting Platforms

You can also deploy to:
- **Netlify**: Similar to Vercel, supports SPA routing
- **GitHub Pages**: Build the project using `npm run build` and deploy the `dist` folder
- **Firebase Hosting**: Use Firebase CLI to deploy
- **Any static hosting**: Simply upload the contents of the `dist` folder after building

### Important Notes

1. The `vercel.json` includes:
   - SPA routing configuration (all routes redirect to index.html)
   - Cache headers for static assets (1 year)
   - Image optimization settings
   - Environment variable mappings

2. For optimal performance:
   - Images are lazy-loaded except the main product image
   - Static assets are cached with long expiration times
   - The build is optimized for production

3. Admin Dashboard Access:
   - Navigate to `/admin` to access the admin dashboard
   - Requires Supabase authentication (set up auth in your Supabase project)
   - For development, Row Level Security policies allow authenticated users to manage products

## Admin Dashboard

Access the admin dashboard at `/admin` to manage products:

- **Add Products**: Click "Add Product" button
- **Edit Products**: Click edit icon on any product
- **Delete Products**: Click delete icon (with confirmation)
- **Upload Images**: Add multiple image URLs with live preview
- **Manage Specs**: Add technical specifications (processor, RAM, storage, etc.)
- **Stock Management**: Toggle in-stock status and featured products

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── ui/            # shadcn-ui components
│   ├── ImageCarousel.tsx
│   ├── ProductCard.tsx
│   └── SEO.tsx
├── contexts/          # React context providers
├── data/              # Static data (products, categories)
├── integrations/      # Third-party integrations (Supabase)
├── layouts/           # Layout components
├── lib/               # Utility functions
│   └── seo.ts        # SEO utilities
├── pages/            # Page components
│   ├── Home.tsx
│   ├── Products.tsx
│   ├── ProductDetail.tsx
│   ├── Cart.tsx
│   ├── Checkout.tsx
│   └── AdminDashboard.tsx
└── App.tsx           # Main app component

public/
├── sitemap.xml       # SEO sitemap
└── robots.txt        # Search engine directives

supabase/
└── migrations/       # Database migrations
```

## Contributing

Feel free to submit issues and enhancement requests!
