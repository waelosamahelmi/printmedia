# PrintMedia Finland Oy - Website

Modern, responsive website for PrintMedia Finland Oy built with Next.js 14, Tailwind CSS, and Prisma.

## Features

- 🎨 Modern, responsive design with Tailwind CSS
- ⚡ Next.js 14 with App Router
- 🔐 Admin panel with NextAuth.js authentication
- 📦 Product management system
- 📝 Page content management
- 🖼️ Media library with file uploads
- 🗄️ MySQL database with Prisma ORM
- 🌐 SEO optimized

## Tech Stack

- **Framework:** Next.js 14
- **Styling:** Tailwind CSS
- **Database:** MySQL (Hostinger)
- **ORM:** Prisma
- **Authentication:** NextAuth.js
- **Animations:** Framer Motion
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL database (Hostinger or local)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd printmedia
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your database credentials:
   ```
   DATABASE_URL="mysql://user:password@localhost:3306/printmedia"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. Set up the database:
   ```bash
   npx prisma db push
   npm run db:seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

### Admin Panel

Access the admin panel at `/admin`:

- **Email:** admin@printmedia.fi
- **Password:** admin123

⚠️ **Important:** Change the default password after first login!

## Project Structure

```
printmedia/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── admin/          # Admin panel pages
│   │   ├── api/            # API routes
│   │   └── (public pages)
│   ├── components/         # React components
│   │   ├── admin/         # Admin-specific components
│   │   ├── layout/        # Header, Footer
│   │   ├── sections/      # Page sections
│   │   └── ui/            # Reusable UI components
│   ├── lib/               # Utility functions
│   └── types/             # TypeScript types
├── prisma/                # Database schema
├── public/               # Static assets
│   ├── images/          # Images
│   └── uploads/         # User uploads
└── content/             # Static content
```

## Deployment to Hostinger

### Option 1: Node.js Hosting (Recommended)

1. Create MySQL database in Hostinger hPanel
2. Push code to GitHub
3. Connect repository in Hostinger's Git deployment
4. Set environment variables
5. Run build and start commands

### Option 2: Static Export

1. Add to `next.config.js`:
   ```js
   output: 'export'
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Upload the `out` folder to Hostinger's `public_html`

### Option 3: Manual FTP

1. Build for production
2. Upload all files via FTP
3. Set up Node.js application in hPanel

See [BUILD.md](./BUILD.md) for detailed deployment instructions.

## License

© 2024 PrintMedia Finland Oy. All rights reserved.
