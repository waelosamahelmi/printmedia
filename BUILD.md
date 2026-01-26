# PrintMedia PM Solutions Oy - Modern Website Build Guide

This document provides comprehensive instructions to build a modern, responsive website for PrintMedia PM Solutions Oy with an integrated admin panel for content management.

## 🎯 Project Overview

**Current Site:** https://www.printmedia.fi/ (Joomla-based, outdated design)  
**Goal:** Modern React/Next.js website with headless CMS for easy content management

---

## 🛠️ Tech Stack (Hostinger Optimized)

### Frontend
- **Next.js 14+** - React framework with App Router (deployed as static/SSG)
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework for modern styling
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Modern icon library

### Backend/API
- **Next.js API Routes** - Serverless functions for API endpoints
- **Prisma ORM** - Type-safe database access for MySQL
- **NextAuth.js** - Authentication for admin panel

### Database (Hostinger MySQL)
- **MySQL 8.0** - Hostinger's managed MySQL database
- **Prisma** - Modern ORM for database operations

### File Storage
- **Hostinger File Manager** - Direct file storage on hosting
- **Local uploads** - Store in `/public/uploads/` directory

### Hosting
- **Hostinger** - Web hosting with Node.js support
- **Hostinger MySQL** - Managed database service

---

## 📁 Project Structure

```
printmedia-website/
├── public/
│   ├── logo.svg                    # Company logo
│   ├── images/
│   │   ├── products/               # Product images
│   │   ├── logos/                  # Brand logos (Docan, GCC, etc.)
│   │   ├── devices/                # Equipment images
│   │   └── hero/                   # Hero section images
│   └── files/
│       └── PrintMedia_HINNASTO.pdf # Price lists
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── (admin)/               # Admin panel routes
│   │   │   ├── admin/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx       # Dashboard
│   │   │   │   ├── pages/         # Page editor
│   │   │   │   ├── products/      # Product manager
│   │   │   │   ├── files/         # File manager
│   │   │   │   └── settings/      # Site settings
│   │   ├── (site)/                # Public website routes
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx           # Homepage
│   │   │   ├── tulostusvaerit/
│   │   │   │   ├── page.tsx
│   │   │   │   └── jetbest/page.tsx
│   │   │   ├── tulostusmateriaalit/page.tsx
│   │   │   ├── display-tuotteet/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── roll-up/page.tsx
│   │   │   │   ├── messupoydat/page.tsx
│   │   │   │   └── messuseinat/page.tsx
│   │   │   ├── laitteet/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── docan-uv-tulostimet/page.tsx
│   │   │   │   ├── gcc-tarraleikkurit/page.tsx
│   │   │   │   ├── monitoimileikkurit/page.tsx
│   │   │   │   └── laminaattorit/page.tsx
│   │   │   ├── muut-tarvikkeet/page.tsx
│   │   │   ├── huolto-ja-tuki/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── tulostimien-varaosat/page.tsx
│   │   │   │   ├── leikkureiden-varaosat/page.tsx
│   │   │   │   ├── ergosoft-rip/page.tsx
│   │   │   │   └── flexi/page.tsx
│   │   │   ├── toimitusehdot/page.tsx
│   │   │   ├── hinnasto/page.tsx
│   │   │   └── yhteystiedot/page.tsx
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── upload/route.ts
│   │   │   └── content/route.ts
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/                     # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── MobileMenu.tsx
│   │   ├── sections/
│   │   │   ├── Hero.tsx
│   │   │   ├── Products.tsx
│   │   │   ├── Services.tsx
│   │   │   └── Contact.tsx
│   │   └── admin/
│   │       ├── Dashboard.tsx
│   │       ├── ContentEditor.tsx
│   │       ├── FileUploader.tsx
│   │       └── ImageGallery.tsx
│   ├── lib/
│   │   ├── db.ts                   # Database connection
│   │   ├── auth.ts                 # Authentication
│   │   └── utils.ts                # Utility functions
│   ├── hooks/
│   │   └── useContent.ts
│   └── types/
│       └── index.ts
├── content/                        # Content JSON files
│   ├── pages.json
│   ├── products.json
│   └── navigation.json
├── .env.local
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 🚀 Step-by-Step Setup

### Step 1: Create Next.js Project

```bash
npx create-next-app@latest printmedia-website --typescript --tailwind --eslint --app --src-dir
cd printmedia-website
```

### Step 2: Install Dependencies

```bash
# Core dependencies
npm install @headlessui/react @heroicons/react lucide-react
npm install framer-motion
npm install react-hook-form @hookform/resolvers zod

# UI Components
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install @radix-ui/react-navigation-menu @radix-ui/react-tabs
npm install class-variance-authority clsx tailwind-merge

# Database (MySQL with Prisma)
npm install prisma @prisma/client
npm install mysql2

# Authentication
npm install next-auth @auth/prisma-adapter
npm install bcryptjs
npm install --save-dev @types/bcryptjs

# File uploads (local)
npm install formidable
npm install --save-dev @types/formidable

# Additional utilities
npm install date-fns slugify
npm install sharp  # Image optimization
```

### Step 3: Initialize Prisma for MySQL

```bash
npx prisma init
```

Update `.env` file with Hostinger MySQL credentials:

```env
# Hostinger MySQL Database
DATABASE_URL="mysql://u123456789_user:password@srv123.hstgr.io:3306/u123456789_printmedia"

# NextAuth
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="https://www.printmedia.fi"

# Admin credentials (change these!)
ADMIN_EMAIL="admin@printmedia.fi"
ADMIN_PASSWORD="your-secure-password"
```

### Step 3: Configure Tailwind CSS

Update `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        accent: {
          500: '#f97316', // Orange for CTA buttons
          600: '#ea580c',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Lexend', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}
```

---

## 📄 Content Structure (JSON-based CMS)

### `content/navigation.json`
```json
{
  "mainNav": [
    {
      "id": "tulostusvarit",
      "title": "Tulostusvärit",
      "href": "/tulostusvaerit",
      "children": [
        { "id": "jetbest", "title": "Jetbest", "href": "/tulostusvaerit/jetbest" }
      ]
    },
    {
      "id": "tulostusmateriaalit",
      "title": "Tulostusmateriaalit",
      "href": "/tulostusmateriaalit"
    },
    {
      "id": "display-tuotteet",
      "title": "Display-tuotteet",
      "href": "/display-tuotteet",
      "children": [
        { "id": "roll-up", "title": "Roll Up", "href": "/display-tuotteet/roll-up" },
        { "id": "messupoydat", "title": "Messupöydät", "href": "/display-tuotteet/messupoydat" },
        { "id": "messuseinat", "title": "Messuseinät", "href": "/display-tuotteet/messuseinat" },
        { "id": "muut", "title": "Muut", "href": "/display-tuotteet/muut" }
      ]
    },
    {
      "id": "laitteet",
      "title": "Laitteet",
      "href": "/laitteet",
      "children": [
        { "id": "docan", "title": "Docan UV-tulostimet", "href": "/laitteet/docan-uv-tulostimet" },
        { "id": "gcc", "title": "GCC-tarraleikkurit", "href": "/laitteet/gcc-tarraleikkurit" },
        { "id": "monitoimileikkurit", "title": "Monitoimileikkurit", "href": "/laitteet/monitoimileikkurit" },
        { "id": "laminaattorit", "title": "Laminaattorit", "href": "/laitteet/laminaattorit" }
      ]
    },
    {
      "id": "muut-tarvikkeet",
      "title": "Muut tarvikkeet",
      "href": "/muut-tarvikkeet"
    },
    {
      "id": "huolto-ja-tuki",
      "title": "Huolto ja tuki",
      "href": "/huolto-ja-tuki",
      "children": [
        { "id": "tulostimien-varaosat", "title": "Tulostimien varaosat", "href": "/huolto-ja-tuki/tulostimien-varaosat" },
        { "id": "leikkureiden-varaosat", "title": "Leikkureiden varaosat", "href": "/huolto-ja-tuki/leikkureiden-varaosat" },
        { "id": "ergosoft", "title": "Ergosoft RIP", "href": "/huolto-ja-tuki/ergosoft-rip" },
        { "id": "flexi", "title": "SAi Flexi", "href": "/huolto-ja-tuki/flexi" }
      ]
    },
    { "id": "yritys", "title": "Yritys", "href": "/" },
    { "id": "toimitusehdot", "title": "Toimitusehdot", "href": "/toimitusehdot" },
    { "id": "hinnasto", "title": "Hinnasto", "href": "/hinnasto" },
    { "id": "yhteystiedot", "title": "Yhteystiedot", "href": "/yhteystiedot" }
  ]
}
```

### `content/company.json`
```json
{
  "name": "PrintMedia PM Solutions Oy",
  "tagline": "Suurkuvatulostusalan tukkukauppa",
  "description": "Valikoimastamme löydät mm. tulostusmediat, tulostusvärit, display-tuotteet sekä monet muut laadukkaat ratkaisut edullisesti juuri sinun tarpeisiin.",
  "contact": {
    "address": {
      "street": "Koskueentie 7",
      "postalCode": "19700",
      "city": "Sysmä",
      "country": "Finland"
    },
    "phone": "+358 440 875 025",
    "email": "myynti@printmedia.fi",
    "businessId": "1877937-4"
  },
  "businessHours": {
    "weekdays": "07:30 – 15:30",
    "note": "Ennen klo 13:30 tulleet tilaukset pyrimme toimittamaan Matkahuoltoon vielä samana päivänä."
  },
  "staff": [
    {
      "name": "Harri Hynynen",
      "title": "Toimitusjohtaja",
      "phone": "+358 440 875 020",
      "email": "harri.hynynen@printmedia.fi"
    }
  ],
  "invoicing": {
    "ovtId": "003718779374",
    "operator": "Ropo Capital",
    "operatorId": "003714377140"
  }
}
```

---

## 🎨 Key Component Examples

### Header Component (`src/components/layout/Header.tsx`)

```tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ChevronDown, Phone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import navigation from '@/content/navigation.json'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      {/* Top bar */}
      <div className="bg-primary-900 text-white text-sm py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <span>Palvelemme arkisin klo 07:30 – 15:30</span>
          <a href="tel:+358440875025" className="flex items-center gap-2 hover:text-primary-200">
            <Phone className="w-4 h-4" />
            0440 875 025
          </a>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-20">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo.svg"
              alt="PrintMedia PM Solutions"
              width={200}
              height={50}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.mainNav.map((item) => (
              <NavItem key={item.id} item={item} />
            ))}
          </div>

          {/* CTA Button */}
          <Link
            href="/hinnasto"
            className="hidden lg:inline-flex items-center px-6 py-2.5 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-colors"
          >
            Lataa hinnasto
          </Link>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileMenu items={navigation.mainNav} onClose={() => setMobileMenuOpen(false)} />
        )}
      </AnimatePresence>
    </header>
  )
}

function NavItem({ item }: { item: any }) {
  const [open, setOpen] = useState(false)

  if (item.children) {
    return (
      <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
        <button className="flex items-center gap-1 px-4 py-2 text-gray-700 hover:text-primary-600 font-medium">
          {item.title}
          <ChevronDown className="w-4 h-4" />
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-0 bg-white shadow-xl rounded-lg py-2 min-w-[220px] border border-gray-100"
            >
              {item.children.map((child: any) => (
                <Link
                  key={child.id}
                  href={child.href}
                  className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                >
                  {child.title}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <Link
      href={item.href}
      className="px-4 py-2 text-gray-700 hover:text-primary-600 font-medium"
    >
      {item.title}
    </Link>
  )
}
```

### Hero Section (`src/components/sections/Hero.tsx`)

```tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Download, Phone } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)"/>
        </svg>
      </div>

      <div className="container mx-auto px-4 py-24 lg:py-32 relative z-10">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1 bg-white/10 text-primary-200 rounded-full text-sm font-medium mb-6">
              Suurkuvatulostusalan tukkukauppa
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight"
          >
            PrintMedia PM Solutions Oy
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-primary-100 mb-10 max-w-2xl"
          >
            Valikoimastamme löydät tulostusmediat, tulostusvärit, display-tuotteet 
            sekä monet muut laadukkaat ratkaisut edullisesti juuri sinun tarpeisiin.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              href="/hinnasto"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent-500 text-white font-semibold rounded-xl hover:bg-accent-600 transition-all hover:scale-105 shadow-lg shadow-accent-500/25"
            >
              <Download className="w-5 h-5" />
              Lataa hinnasto
            </Link>
            <Link
              href="/yhteystiedot"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/20"
            >
              <Phone className="w-5 h-5" />
              Ota yhteyttä
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Decorative elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute right-0 bottom-0 w-1/2 h-full hidden lg:block"
      >
        <div className="absolute right-10 bottom-10 w-80 h-80 bg-accent-500/20 rounded-full blur-3xl" />
        <div className="absolute right-40 bottom-40 w-60 h-60 bg-primary-400/20 rounded-full blur-3xl" />
      </motion.div>
    </section>
  )
}
```

### Product Card Component (`src/components/ui/ProductCard.tsx`)

```tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

interface ProductCardProps {
  title: string
  description?: string
  image: string
  href: string
  features?: string[]
}

export function ProductCard({ title, description, image, href, features }: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
    >
      <div className="aspect-[4/3] relative overflow-hidden bg-gray-50">
        <Image
          src={image}
          alt={title}
          fill
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
          {title}
        </h3>
        {description && (
          <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
        )}
        {features && features.length > 0 && (
          <ul className="space-y-1 mb-4">
            {features.slice(0, 3).map((feature, index) => (
              <li key={index} className="text-sm text-gray-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                {feature}
              </li>
            ))}
          </ul>
        )}
        <Link
          href={href}
          className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:gap-3 transition-all"
        >
          Lue lisää
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  )
}
```

---

## 🔐 Admin Panel Implementation

### Option 1: Simple JSON-based Admin (Recommended for small sites)

```tsx
// src/app/admin/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  
  if (status === 'unauthenticated') {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-900">PrintMedia Admin</h1>
        </div>
        <nav className="px-4">
          <a href="/admin" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
            Dashboard
          </a>
          <a href="/admin/pages" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
            Sivut
          </a>
          <a href="/admin/products" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
            Tuotteet
          </a>
          <a href="/admin/files" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
            Tiedostot
          </a>
          <a href="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
            Asetukset
          </a>
        </nav>
      </aside>
      
      <main className="ml-64 p-8">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        {/* Dashboard content */}
      </main>
    </div>
  )
}
```

### Admin API Routes (MySQL with Prisma)

```tsx
// src/app/api/content/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'
import { authOptions } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') // 'page', 'product', 'setting'
  const slug = searchParams.get('slug')
  
  try {
    if (type === 'page' && slug) {
      const page = await prisma.page.findUnique({
        where: { slug },
        include: { sections: true }
      })
      return NextResponse.json(page)
    }
    
    if (type === 'products') {
      const products = await prisma.product.findMany({
        include: { category: true, images: true }
      })
      return NextResponse.json(products)
    }
    
    if (type === 'settings') {
      const settings = await prisma.setting.findMany()
      return NextResponse.json(settings)
    }
    
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const { type, data } = await req.json()
    
    if (type === 'page') {
      const page = await prisma.page.upsert({
        where: { slug: data.slug },
        update: data,
        create: data
      })
      return NextResponse.json(page)
    }
    
    if (type === 'product') {
      const product = await prisma.product.upsert({
        where: { id: data.id || '' },
        update: data,
        create: data
      })
      return NextResponse.json(product)
    }
    
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}
```

### File Upload Handler (Hostinger Local Storage)

```tsx
// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import path from 'path'
import sharp from 'sharp'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'uploads'
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }
    
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Create upload directory
    const uploadDir = path.join(process.cwd(), 'public', folder)
    await mkdir(uploadDir, { recursive: true })
    
    // Generate unique filename
    const timestamp = Date.now()
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '')
    const fileName = `${timestamp}-${safeName}`
    const filePath = path.join(uploadDir, fileName)
    
    // Optimize images before saving
    if (file.type.startsWith('image/') && !file.name.endsWith('.svg')) {
      const optimized = await sharp(buffer)
        .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toBuffer()
      await writeFile(filePath.replace(/\.[^.]+$/, '.jpg'), optimized)
    } else {
      await writeFile(filePath, buffer)
    }
    
    return NextResponse.json({ 
      success: true, 
      url: `/${folder}/${fileName}`,
      fileName 
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
```

---

## 📥 Downloading Images from Current Website

Create a script to download all images:

```javascript
// scripts/download-images.js
const https = require('https')
const fs = require('fs')
const path = require('path')

const images = [
  // Logos
  'https://www.printmedia.fi/images/logo.svg',
  'https://www.printmedia.fi/images/logos/docan_logo2.jpg',
  'https://www.printmedia.fi/images/logos/GCC_Logo.png',
  'https://www.printmedia.fi/images/logos/j-wei-logo.png',
  'https://www.printmedia.fi/images/logos/fayon-logo.png',
  'https://www.printmedia.fi/images/logos/jetbest_sahkoposti.jpg',
  'https://www.printmedia.fi/images/logos/sai-flexi-logo.png',
  'https://www.printmedia.fi/images/xrite_logo.jpg',
  'https://www.printmedia.fi/images/tulostimien_tarvikkeet.jpg',
  
  // Product images
  'https://www.printmedia.fi/images/tuotekuvat/spyro2.jpg',
  'https://www.printmedia.fi/images/tuotekuvat/export_uusi_laukku.jpg',
  'https://www.printmedia.fi/images/tuotekuvat/luxury_uusi_laukku.jpg',
  'https://www.printmedia.fi/images/tuotekuvat/deluxe_1_uusi_kuva_laukku.jpg',
  'https://www.printmedia.fi/images/tuotekuvat/mini_roll_up.jpg',
  'https://www.printmedia.fi/images/tuotekuvat/promopyt_1_uusi_kuva_1.jpg',
  'https://www.printmedia.fi/images/tuotekuvat/promopyt_2_uusi_kuva_1.jpg',
  'https://www.printmedia.fi/images/tuotekuvat/promopyt_4.jpg',
  'https://www.printmedia.fi/images/tuotekuvat/suora_messuseina.jpg',
  'https://www.printmedia.fi/images/tuotekuvat/kaareva_280_x_230.jpg',
  'https://www.printmedia.fi/images/tuotekuvat/turvaviivain_tersreunalla.jpg',
  'https://www.printmedia.fi/images/tuotekuvat/turvaviivain_leikkurilla.jpg',
  'https://www.printmedia.fi/images/tuotekuvat/bungee-ball.jpg',
  'https://www.printmedia.fi/images/tuotekuvat/bungee-koukku.jpg',
  'https://www.printmedia.fi/images/tuotekuvat/bannerclip.jpg',
  'https://www.printmedia.fi/images/tuotekuvat/cb03ii_500px_500x.jpg',
  'https://www.printmedia.fi/images/tuotekuvat/tools_600px_600x.png',
  
  // Device images
  'https://www.printmedia.fi/images/devices/docan_h3000r_m10_574x.png',
  'https://www.printmedia.fi/images/devices/RXII_132_400.png',
  'https://www.printmedia.fi/images/devices/J5-132.jpg',
  'https://www.printmedia.fi/images/fayon/fayon-1600se.png',
  
  // Price list
  'https://www.printmedia.fi/images/PrintMedia_-_Hinnasto_2023_kuva.png',
]

const pdfs = [
  'https://www.printmedia.fi/images/Esitteet-hinnastot-asiakirjat/PrintMedia_-_HINNASTO_2023_V2.pdf',
  'https://www.printmedia.fi/images/Esitteet-hinnastot-asiakirjat/RXII-esite.pdf',
  'https://www.printmedia.fi/images/Esitteet-hinnastot-asiakirjat/JaguarV-esite.pdf',
  'https://www.printmedia.fi/images/docs/Docan-esite.pdf',
  'https://www.printmedia.fi/images/docs/CB03II-esite.pdf',
  'https://www.printmedia.fi/images/docs/CB08II-esite.pdf',
  'https://www.printmedia.fi/images/docs/ecosolmax_vs._jbnew-eco.pdf',
  'https://www.printmedia.fi/images/docs/ss21_vs_jbss21.pdf',
  'https://www.printmedia.fi/images/docs/ghs_ss21_safety_data_sheet_fi.pdf',
  'https://www.printmedia.fi/images/docs/new_eco_ink_msds_fi.pdf',
  'https://www.printmedia.fi/images/docs/hinnasto2022-tulostusmateriaalit.pdf',
]

async function downloadFile(url, destFolder) {
  const fileName = path.basename(url)
  const destPath = path.join(destFolder, fileName)
  
  // Create directory if it doesn't exist
  fs.mkdirSync(destFolder, { recursive: true })
  
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath)
    https.get(url, (response) => {
      response.pipe(file)
      file.on('finish', () => {
        file.close()
        console.log(`Downloaded: ${fileName}`)
        resolve()
      })
    }).on('error', (err) => {
      fs.unlink(destPath, () => {})
      reject(err)
    })
  })
}

async function downloadAll() {
  console.log('Downloading images...')
  for (const url of images) {
    try {
      await downloadFile(url, './public/images')
    } catch (err) {
      console.error(`Failed to download ${url}:`, err.message)
    }
  }
  
  console.log('\nDownloading PDFs...')
  for (const url of pdfs) {
    try {
      await downloadFile(url, './public/files')
    } catch (err) {
      console.error(`Failed to download ${url}:`, err.message)
    }
  }
  
  console.log('\nDownload complete!')
}

downloadAll()
```

Run with: `node scripts/download-images.js`

---

## 🌐 Hostinger Deployment Guide

### Prerequisites
1. Hostinger hosting plan with Node.js support (Business or Cloud hosting)
2. MySQL database created in Hostinger hPanel
3. Domain connected to Hostinger

### Step 1: Create MySQL Database in Hostinger

1. Log in to **Hostinger hPanel**
2. Go to **Databases** → **MySQL Databases**
3. Create a new database:
   - Database name: `u123456789_printmedia`
   - Username: `u123456789_admin`
   - Password: `your-secure-password`
4. Note down the connection details:
   - Host: `localhost` (or `srv123.hstgr.io` for remote access)
   - Port: `3306`

### Step 2: Configure Environment Variables

Create `.env.production` file:

```env
# Database - Hostinger MySQL
DATABASE_URL="mysql://u123456789_admin:your-password@localhost:3306/u123456789_printmedia"

# NextAuth
NEXTAUTH_SECRET="generate-a-32-char-random-string"
NEXTAUTH_URL="https://www.printmedia.fi"

# Site URL
NEXT_PUBLIC_SITE_URL="https://www.printmedia.fi"
```

### Step 3: Prisma Database Schema

Create `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String
  name          String?
  role          String    @default("admin")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Page {
  id            String    @id @default(cuid())
  slug          String    @unique
  title         String
  metaTitle     String?
  metaDesc      String?   @db.Text
  content       String    @db.LongText
  isPublished   Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  sections      Section[]
}

model Section {
  id            String    @id @default(cuid())
  pageId        String
  page          Page      @relation(fields: [pageId], references: [id], onDelete: Cascade)
  type          String    // hero, products, content, gallery, etc.
  title         String?
  content       String?   @db.LongText
  order         Int       @default(0)
  settings      String?   @db.Text  // JSON settings
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Category {
  id            String    @id @default(cuid())
  slug          String    @unique
  name          String
  description   String?   @db.Text
  parentId      String?
  parent        Category? @relation("CategoryTree", fields: [parentId], references: [id])
  children      Category[] @relation("CategoryTree")
  products      Product[]
  order         Int       @default(0)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Product {
  id            String    @id @default(cuid())
  slug          String    @unique
  name          String
  description   String?   @db.Text
  features      String?   @db.Text  // JSON array
  specs         String?   @db.Text  // JSON object
  categoryId    String?
  category      Category? @relation(fields: [categoryId], references: [id])
  images        ProductImage[]
  documents     Document[]
  productNumber String?
  isPublished   Boolean   @default(true)
  order         Int       @default(0)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model ProductImage {
  id            String    @id @default(cuid())
  productId     String
  product       Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
  url           String
  alt           String?
  isPrimary     Boolean   @default(false)
  order         Int       @default(0)
}

model Document {
  id            String    @id @default(cuid())
  productId     String?
  product       Product?  @relation(fields: [productId], references: [id], onDelete: SetNull)
  title         String
  url           String
  type          String    // pdf, brochure, manual, etc.
  createdAt     DateTime  @default(now())
}

model Setting {
  id            String    @id @default(cuid())
  key           String    @unique
  value         String    @db.LongText
  type          String    @default("text") // text, json, boolean
  group         String    @default("general")
  updatedAt     DateTime  @updatedAt
}

model Navigation {
  id            String    @id @default(cuid())
  location      String    // main, footer, mobile
  items         String    @db.LongText  // JSON navigation structure
  updatedAt     DateTime  @updatedAt
}

model Media {
  id            String    @id @default(cuid())
  filename      String
  url           String
  mimeType      String
  size          Int
  alt           String?
  folder        String    @default("uploads")
  createdAt     DateTime  @default(now())
}
```

### Step 4: Database Connection Utility

Create `src/lib/db.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### Step 5: Authentication Setup

Create `src/lib/auth.ts`:

```typescript
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './db'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role as string
      }
      return session
    }
  }
}
```

### Step 6: Build for Production

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed admin user (create scripts/seed.ts first)
npx ts-node scripts/seed.ts

# Build the application
npm run build
```

### Step 7: Create Admin Seed Script

Create `scripts/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('your-secure-password', 12)
  
  await prisma.user.upsert({
    where: { email: 'admin@printmedia.fi' },
    update: {},
    create: {
      email: 'admin@printmedia.fi',
      password: hashedPassword,
      name: 'Admin',
      role: 'admin'
    }
  })

  // Create default settings
  const settings = [
    { key: 'site_name', value: 'PrintMedia PM Solutions Oy', type: 'text', group: 'general' },
    { key: 'site_tagline', value: 'Suurkuvatulostusalan tukkukauppa', type: 'text', group: 'general' },
    { key: 'contact_phone', value: '+358 440 875 025', type: 'text', group: 'contact' },
    { key: 'contact_email', value: 'myynti@printmedia.fi', type: 'text', group: 'contact' },
    { key: 'contact_address', value: JSON.stringify({
      street: 'Koskueentie 7',
      postalCode: '19700',
      city: 'Sysmä',
      country: 'Finland'
    }), type: 'json', group: 'contact' },
    { key: 'business_hours', value: '07:30 – 15:30', type: 'text', group: 'contact' },
    { key: 'business_id', value: '1877937-4', type: 'text', group: 'company' },
  ]

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

### Step 8: Deploy to Hostinger

#### Option A: Using Hostinger Git Deployment

1. In hPanel, go to **Advanced** → **Git**
2. Connect your GitHub/GitLab repository
3. Set deployment branch to `main`
4. Add build commands:

```bash
npm install
npx prisma generate
npm run build
```

5. Set start command: `npm start`

#### Option B: Manual Upload via FTP/File Manager

1. Build locally:
```bash
npm run build
```

2. Upload these folders/files to Hostinger:
```
.next/
node_modules/
public/
prisma/
package.json
next.config.js
.env.production (rename to .env)
```

3. In hPanel, set up Node.js:
   - Go to **Advanced** → **Node.js**
   - Select Node.js version 18.x or 20.x
   - Set entry point: `node_modules/.bin/next`
   - Set start command: `start`

#### Option C: Static Export (Recommended for Hostinger Shared Hosting)

If using shared hosting without Node.js runtime:

1. Update `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig
```

2. Build static site:
```bash
npm run build
```

3. Upload the `out/` folder contents to `public_html`

4. For admin panel, create a separate PHP backend or use external API

### Step 9: Configure Domain & SSL

1. In hPanel, go to **Domains**
2. Point `printmedia.fi` to your hosting
3. Enable **SSL** (free Let's Encrypt)
4. Force HTTPS redirect

### Step 10: Set Up Cron Jobs (Optional)

For scheduled tasks, add in hPanel → **Advanced** → **Cron Jobs**:

```bash
# Clear cache daily at 3 AM
0 3 * * * cd /home/u123456789/domains/printmedia.fi && node scripts/clear-cache.js
```

---

## 📱 Responsive Design Breakpoints

```css
/* Mobile first approach */
/* sm: 640px */
/* md: 768px */
/* lg: 1024px */
/* xl: 1280px */
/* 2xl: 1536px */
```

---

## ✅ Feature Checklist

### Public Website
- [ ] Responsive header with mega menu
- [ ] Hero section with CTAs
- [ ] Product category pages
- [ ] Individual product pages
- [ ] Contact page with form
- [ ] Price list download
- [ ] Footer with contact info
- [ ] SEO optimization
- [ ] Finnish language throughout

### Admin Panel
- [ ] Authentication (login/logout)
- [ ] Dashboard with stats
- [ ] Page content editor
- [ ] Product management
- [ ] File/image upload
- [ ] Navigation editor
- [ ] Company info settings
- [ ] User management

### Technical
- [ ] Image optimization
- [ ] Lazy loading
- [ ] PWA support
- [ ] Analytics integration
- [ ] Contact form with email
- [ ] Sitemap generation
- [ ] robots.txt

---

## 🔧 Commands Reference

```bash
# Development
npm run dev

# Database commands (Prisma + MySQL)
npx prisma generate        # Generate Prisma client
npx prisma db push         # Push schema to MySQL
npx prisma db pull         # Pull schema from MySQL
npx prisma studio          # Open database GUI
npx prisma migrate dev     # Create migration
npx prisma migrate deploy  # Deploy migrations

# Seed database
npx ts-node scripts/seed.ts

# Build
npm run build

# Start production
npm start

# Static export (for shared hosting)
npm run build && npx next export

# Download images from old site
node scripts/download-assets.js

# Type check
npm run type-check

# Lint
npm run lint
```

---

## 📄 Hostinger Configuration Files

### `.htaccess` (for static export)

```apache
# Enable rewrite engine
RewriteEngine On

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Remove www (or add www if preferred)
RewriteCond %{HTTP_HOST} ^www\.(.*)$ [NC]
RewriteRule ^(.*)$ https://%1/$1 [R=301,L]

# Handle Next.js static routes
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME}.html -f
RewriteRule ^(.*)$ $1.html [L]

# Fallback for SPA routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L]

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType application/pdf "access plus 1 month"
</IfModule>

# Compress text files
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
</IfModule>
```

### `next.config.js` (Hostinger optimized)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // For Node.js hosting (Business/Cloud plan)
  // output: 'standalone',
  
  // For shared hosting (static export)
  // output: 'export',
  
  images: {
    // Use unoptimized for static export
    // unoptimized: true,
    
    // For Node.js hosting with optimization
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.printmedia.fi',
      },
    ],
  },
  
  // Trailing slashes for better static hosting compatibility
  trailingSlash: true,
  
  // Disable x-powered-by header
  poweredByHeader: false,
  
  // Compress responses
  compress: true,
  
  // Environment variables
  env: {
    SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.printmedia.fi',
  },
}

module.exports = nextConfig
```

### `package.json` scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "db:push": "prisma db push",
    "db:studio": "prisma studio",
    "db:seed": "ts-node scripts/seed.ts",
    "postinstall": "prisma generate"
  }
}
```

---

## 📞 Contact Information (for website)

**PrintMedia PM Solutions Oy**  
Koskueentie 7  
19700 Sysmä, Finland

📞 +358 440 875 025  
📧 myynti@printmedia.fi  
🌐 www.printmedia.fi

Y-tunnus: 1877937-4

Palveluajat: arkisin klo 07:30 – 15:30

---

## 🚨 Hostinger Troubleshooting

### Database Connection Issues

```bash
# Test MySQL connection
mysql -h localhost -u u123456789_admin -p u123456789_printmedia

# Check if Prisma can connect
npx prisma db pull
```

### Common Issues

1. **"Access denied for user"**
   - Verify username/password in hPanel
   - Check if user has permissions on the database
   - Try `localhost` instead of remote hostname

2. **"ECONNREFUSED"**
   - MySQL might not be running
   - Contact Hostinger support

3. **"Too many connections"**
   - Add connection pooling to Prisma:
   ```
   DATABASE_URL="mysql://user:pass@host:3306/db?connection_limit=5"
   ```

4. **Static export not working**
   - Make sure all dynamic routes use `generateStaticParams`
   - Check for server-side only code in pages

5. **Images not loading**
   - Verify paths start with `/` for absolute paths
   - Check file permissions (644 for files, 755 for folders)

### Hostinger hPanel Quick Links

- **File Manager**: Upload/manage files
- **MySQL Databases**: Create/manage databases
- **Node.js**: Configure Node.js app (Business+ plans)
- **SSL/TLS**: Enable HTTPS
- **Cron Jobs**: Schedule tasks
- **Error Logs**: Debug issues
