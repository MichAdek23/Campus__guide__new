# Campus Guide Nigeria - Admin Setup Guide

## Table of Contents
1. [Environment Setup](#environment-setup)
2. [Database Configuration](#database-configuration)
3. [Admin User Creation](#admin-user-creation)
4. [Authentication & Authorization](#authentication--authorization)
5. [API Endpoints](#api-endpoints)
6. [Configuration Files](#configuration-files)
7. [Security Considerations](#security-considerations)
8. [Maintenance & Monitoring](#maintenance--monitoring)

## Environment Setup

### Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://hmwnqimmgysxmtsckvin.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhtd25xaW1tZ3lzeG10c2NrdmluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2Nzg0NzUsImV4cCI6MjA2MTI1NDQ3NX0.kogAFlbsquAldlzquD5eAwM-H8O31mIM40rp7_GxrLs
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhtd25xaW1tZ3lzeG10c2NrdmluIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTY3ODQ3NSwiZXhwIjoyMDYxMjU0NDc1fQ.jANbAVl1KYWF7nckXD5aomkDvHBhYEhvUkyzBi6KY20

# Database Configuration
POSTGRES_URL=postgres://postgres.hmwnqimmgysxmtsckvin:We9o4gipQbNnqCGl@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x
POSTGRES_URL_NON_POOLING=postgres://postgres.hmwnqimmgysxmtsckvin:We9o4gipQbNnqCGl@aws-0-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require
POSTGRES_HOST=db.hmwnqimmgysxmtsckvin.supabase.co
POSTGRES_USER=postgres
POSTGRES_PASSWORD=We9o4gipQbNnqCGl
POSTGRES_DATABASE=postgres

# JWT Configuration
SUPABASE_JWT_SECRET=rioAlRawBNcePo8Ueb9soW3a2epHpaFs+NAkKtYmHN5SV/OpXakfK3hljJeZmmFu66ioQjqvYVq6KXZ0QT1iZQ==

# Application Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here
NODE_ENV=development
\`\`\`

### Installation Steps

1. **Clone the repository:**
   \`\`\`bash
   git clone https://github.com/your-username/campus-guide-nigeria.git
   cd campus-guide-nigeria
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Set up environment variables:**
   \`\`\`bash
   cp .env.example .env.local
   # Edit .env.local with your actual values
   \`\`\`

4. **Run database setup:**
   \`\`\`bash
   npm run db:setup
   \`\`\`

5. **Start the development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

## Database Configuration

### Initial Database Setup

The application uses Supabase as the backend. Follow these steps:

1. **Access Supabase Dashboard:**
   - URL: https://supabase.com/dashboard
   - Project URL: https://hmwnqimmgysxmtsckvin.supabase.co

2. **Run Database Migration:**
   Execute the setup script in the Supabase SQL editor or use the provided script runner.

3. **Verify Tables:**
   Ensure the following tables are created:
   - `profiles`
   - `categories`
   - `scholarships`
   - `events`
   - `news`
   - `saved_items`
   - `advertisements`
   - `settings`

### Database Schema

\`\`\`sql
-- Key tables structure
profiles (id, username, full_name, bio, avatar_url, university, course, graduation_year, role, created_at, updated_at)
scholarships (id, title, description, content, amount, currency, deadline, eligibility, application_url, category_id, is_featured, is_hot, views, created_at, updated_at)
events (id, title, description, content, event_date, location, registration_url, category_id, is_featured, views, created_at, updated_at)
news (id, title, description, content, author, image_url, category_id, is_featured, views, created_at, updated_at)
\`\`\`

## Admin User Creation

### Method 1: Database Direct Insert

1. **Access Supabase SQL Editor:**
   - Go to https://supabase.com/dashboard/project/hmwnqimmgysxmtsckvin/sql

2. **Create Admin User:**
   \`\`\`sql
   -- First, create a user account through the auth system
   -- Then update their profile to admin role
   UPDATE profiles 
   SET role = 'admin' 
   WHERE id = 'user-uuid-here';
   \`\`\`

### Method 2: Admin Setup Page

1. **Access Setup Page:**
   - URL: `http://localhost:3000/admin/setup`
   - This page allows creating the first admin user

2. **Follow Setup Wizard:**
   - Enter admin credentials
   - Verify email
   - Complete profile setup

## Authentication & Authorization

### Authentication Flow

1. **User Registration/Login:**
   - Users register through `/auth/sign-up`
   - Login through `/auth/sign-in`
   - Password reset via `/auth/forgot-password`

2. **Role-Based Access:**
   - `user`: Default role, can save items and manage profile
   - `admin`: Full access to admin panel
   - `moderator`: Limited admin access (future feature)

### Authorization Middleware

The application uses Row Level Security (RLS) policies:

\`\`\`sql
-- Example admin policy
CREATE POLICY "Only admins can manage scholarships" ON scholarships FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);
\`\`\`

### Protected Routes

- `/admin/*` - Requires admin role
- `/profile/*` - Requires authentication
- `/api/admin/*` - Admin API endpoints

## API Endpoints

### Public Endpoints

\`\`\`
GET /api/scholarships - List scholarships
GET /api/events - List events  
GET /api/news - List news articles
GET /api/categories - List categories
POST /api/newsletter - Subscribe to newsletter
\`\`\`

### Admin Endpoints

\`\`\`
# Scholarships Management
GET /api/admin/scholarships - List all scholarships
POST /api/admin/scholarships - Create scholarship
PUT /api/admin/scholarships/[id] - Update scholarship
DELETE /api/admin/scholarships/[id] - Delete scholarship

# Events Management
GET /api/admin/events - List all events
POST /api/admin/events - Create event
PUT /api/admin/events/[id] - Update event
DELETE /api/admin/events/[id] - Delete event

# News Management
GET /api/admin/news - List all news
POST /api/admin/news - Create news article
PUT /api/admin/news/[id] - Update news article
DELETE /api/admin/news/[id] - Delete news article

# User Management
GET /api/admin/users - List all users
PUT /api/admin/users/[id] - Update user role
DELETE /api/admin/users/[id] - Delete user

# Categories Management
GET /api/admin/categories - List categories
POST /api/admin/categories - Create category
PUT /api/admin/categories/[id] - Update category
DELETE /api/admin/categories/[id] - Delete category

# Advertisements Management
GET /api/admin/advertisements - List ads
POST /api/admin/advertisements - Create ad
PUT /api/admin/advertisements/[id] - Update ad
DELETE /api/admin/advertisements/[id] - Delete ad

# Settings Management
GET /api/admin/settings - Get settings
PUT /api/admin/settings - Update settings
\`\`\`

### User Endpoints

\`\`\`
GET /api/user/profile - Get user profile
PUT /api/user/profile - Update profile
GET /api/user/saved-items - Get saved items
POST /api/user/saved-items - Save item
DELETE /api/user/saved-items/[id] - Remove saved item
\`\`\`

## Configuration Files

### Next.js Configuration (`next.config.mjs`)

\`\`\`javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['hmwnqimmgysxmtsckvin.supabase.co'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

export default nextConfig
\`\`\`

### TypeScript Configuration (`tsconfig.json`)

\`\`\`json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
\`\`\`

### Tailwind Configuration (`tailwind.config.ts`)

\`\`\`typescript
import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
\`\`\`

## Security Considerations

### 1. Environment Variables
- Never commit `.env.local` to version control
- Use different keys for production and development
- Rotate API keys regularly

### 2. Database Security
- Row Level Security (RLS) is enabled on all tables
- Admin operations require proper role verification
- Sensitive operations use service role key

### 3. Authentication Security
- JWT tokens are handled securely by Supabase
- Session management is automatic
- Password reset flows are secure

### 4. API Security
- All admin endpoints verify user role
- Rate limiting should be implemented
- Input validation on all endpoints

## Maintenance & Monitoring

### 1. Database Maintenance
- Regular backups via Supabase dashboard
- Monitor query performance
- Update RLS policies as needed

### 2. Application Monitoring
- Monitor error logs
- Track user activity
- Performance monitoring

### 3. Updates & Patches
- Keep dependencies updated
- Monitor security advisories
- Test updates in staging environment

## Useful Links & Resources

### Supabase Resources
- [Supabase Dashboard](https://supabase.com/dashboard/project/hmwnqimmgysxmtsckvin)
- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

### Next.js Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)
- [API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

### Development Tools
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

### Deployment
- [Vercel Deployment](https://vercel.com/docs)
- [Environment Variables in Vercel](https://vercel.com/docs/concepts/projects/environment-variables)

## Support & Troubleshooting

### Common Issues

1. **Authentication Errors:**
   - Check environment variables
   - Verify Supabase configuration
   - Check user roles in database

2. **Database Connection Issues:**
   - Verify connection strings
   - Check Supabase project status
   - Review RLS policies

3. **Admin Access Issues:**
   - Verify user role is set to 'admin'
   - Check RLS policies
   - Review middleware configuration

### Getting Help

- Check the application logs
- Review Supabase dashboard for errors
- Consult the documentation links above
- Contact the development team

---

For additional support or questions, please refer to the project documentation or contact the development team.
\`\`\`

Now let's create the admin setup page:
