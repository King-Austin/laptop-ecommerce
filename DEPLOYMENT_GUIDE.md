# Deployment Guide for Jumia Clone App

## Prerequisites

Before deploying this application, ensure you have:

1. **Node.js** (v18 or higher) and npm installed
2. **Supabase Account** for backend services
3. **Vercel Account** (recommended) or other hosting platform

## Environment Setup

### 1. Supabase Configuration

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API
3. Copy the following credentials:
   - Project URL (e.g., `https://your-project.supabase.co`)
   - Anon/Public Key
   - Project ID (from URL)

### 2. Database Setup

Run the migrations to create necessary tables:

**Option A: Using Supabase CLI (Recommended)**
```bash
# Install Supabase CLI
npm install -g supabase

# Link your project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

**Option B: Manual Setup**
1. Go to Supabase Dashboard > SQL Editor
2. Run the migration files in order:
   - `supabase/migrations/20251112093906_84b4314a-2173-4e07-861b-903f5ce1e00b.sql`
   - `supabase/migrations/20251113000000_create_products_table.sql`

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
VITE_SUPABASE_PROJECT_ID=your_project_id
```

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will be available at `http://localhost:5173`

## Deployment to Vercel

### Method 1: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Method 2: Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repository
4. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_PROJECT_ID`
5. Click "Deploy"

The `vercel.json` configuration file is already set up with:
- Build settings
- SPA routing
- Cache headers for static assets
- Image optimization

## Deployment to Other Platforms

### Netlify

1. Build the project: `npm run build`
2. Install Netlify CLI: `npm i -g netlify-cli`
3. Deploy: `netlify deploy --prod --dir=dist`

Or use Netlify's GitHub integration:
1. Connect your repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables

### Firebase Hosting

```bash
# Install Firebase CLI
npm i -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Deploy
firebase deploy
```

### GitHub Pages

```bash
# Build the project
npm run build

# Deploy dist folder to gh-pages branch
npx gh-pages -d dist
```

**Note:** For GitHub Pages, you may need to configure the base URL in `vite.config.ts`

## Post-Deployment Steps

### 1. Verify Deployment

- Visit your deployed URL
- Check all pages load correctly
- Test navigation between pages
- Verify SEO meta tags (use browser dev tools)
- Test admin dashboard at `/admin`

### 2. SEO Configuration

Update the sitemap.xml and robots.txt with your production domain:

**public/sitemap.xml:**
```xml
<loc>https://your-domain.com/</loc>
```

**public/robots.txt:**
```
Sitemap: https://your-domain.com/sitemap.xml
```

### 3. Google Search Console

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add your property (domain or URL prefix)
3. Verify ownership
4. Submit sitemap: `https://your-domain.com/sitemap.xml`

### 4. Admin Access

To use the admin dashboard:

1. Set up authentication in Supabase:
   - Go to Authentication > Providers
   - Enable Email provider
   - Create admin users

2. Access at: `https://your-domain.com/admin`

3. For production, consider:
   - Adding role-based access control
   - Creating an admin-specific subdomain
   - Implementing additional security measures

## Performance Optimization

The deployment is already optimized with:

- ✅ Static asset caching (1 year)
- ✅ Image lazy loading
- ✅ Code splitting
- ✅ Gzip compression
- ✅ Minified CSS and JS

### Further Optimizations

1. **Image CDN**: Consider using a CDN for product images
2. **Dynamic Imports**: Implement route-based code splitting
3. **Service Worker**: Add PWA capabilities
4. **Analytics**: Integrate Google Analytics or similar

## Monitoring

### Error Tracking

Consider adding error tracking:
- Sentry
- LogRocket
- Bugsnag

### Analytics

Recommended analytics tools:
- Google Analytics 4
- Plausible Analytics
- Vercel Analytics

## Security Best Practices

✅ Already Implemented:
- URL validation for image uploads
- Row Level Security in Supabase
- HTTPS-only image URLs
- Input sanitization

Additional Recommendations:
1. Set up Supabase auth for admin access
2. Implement rate limiting for API calls
3. Add CAPTCHA to forms
4. Regular security audits

## Troubleshooting

### Build Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear build cache
rm -rf dist .vite
npm run build
```

### Environment Variables Not Working

- Ensure variables start with `VITE_`
- Restart dev server after changing .env
- Verify variables are set in hosting platform

### Supabase Connection Issues

- Check Supabase project is active
- Verify API keys are correct
- Check network connectivity
- Review Supabase logs in dashboard

## Support

For issues or questions:
1. Check the [README.md](README.md)
2. Review Supabase documentation
3. Check Vercel deployment logs
4. Open an issue on GitHub

## License

This project is open source and available under the MIT License.
