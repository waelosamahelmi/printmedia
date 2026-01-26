# PrintMedia PM Solutions Oy - Website Documentation

## Project Overview

This is the Next.js 14 website for PrintMedia PM Solutions Oy, a large format printing equipment wholesaler based in Sysmä, Finland.

## Company Information

- **Company Name:** PrintMedia PM Solutions Oy
- **Business ID (Y-tunnus):** 1877937-4
- **Address:** Koskueentie 7, 19700 Sysmä, Finland
- **Phone:** 0440 875 025
- **Email:** myynti@printmedia.fi
- **CEO:** Harri Hynynen (0440 875 020)

## Tech Stack

- **Framework:** Next.js 14.1.0 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 3.4.1
- **Database:** MySQL with Prisma ORM
- **Authentication:** NextAuth.js
- **Animations:** Framer Motion
- **Icons:** Lucide React

## Project Structure

```
printmedia/
├── docs/                    # Documentation
├── public/                  # Static assets
│   ├── images/
│   │   ├── devices/        # Device images
│   │   ├── logos/          # Brand logos
│   │   └── products/       # Product images
│   └── files/              # Downloadable files
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── admin/          # Admin panel
│   │   ├── api/            # API routes
│   │   ├── laitteet/       # Device pages
│   │   ├── tarvikkeet/     # Supplies pages
│   │   ├── display/        # Display product pages
│   │   └── huolto/         # Service pages
│   ├── components/         # React components
│   │   ├── ui/             # Base UI components
│   │   ├── layout/         # Layout components
│   │   ├── sections/       # Page sections
│   │   └── admin/          # Admin components
│   └── lib/                # Utilities
├── prisma/                 # Database schema
└── database/               # Database files
```

## Pages

### Main Pages
- `/` - Home page
- `/laitteet` - Devices overview
- `/tarvikkeet` - Supplies overview
- `/display` - Display products
- `/huolto` - Service & support
- `/yhteystiedot` - Contact
- `/hinnasto` - Price list
- `/toimitusehdot` - Terms

### Device Subcategories
- `/laitteet/docan-uv-tulostimet` - Docan UV printers
- `/laitteet/gcc-tarraleikkurit` - GCC cutters
- `/laitteet/monitoimileikkurit` - Jingwei flatbed cutters
- `/laitteet/laminaattorit` - Fayon laminators

### Display Subcategories
- `/display/roll-up` - Roll-up stands
- `/display/messuseinat` - Pop-up walls
- `/display/messupoydat` - Promo tables

### Supplies Subcategories
- `/tarvikkeet/jetbest` - JetBest inks
- `/tarvikkeet/tulostusmateriaalit` - Print materials
- `/tarvikkeet/muut-tarvikkeet` - Accessories

### Service Subcategories
- `/huolto/tulostimien-varaosat` - Printer spare parts
- `/huolto/leikkureiden-varaosat` - Cutter spare parts
- `/huolto/ergosoft-rip` - ErgoSoft RIP software
- `/huolto/flexi` - SAi Flexi software

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
DATABASE_URL="mysql://user:password@localhost:3306/printmedia"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```
