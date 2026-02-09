# Page Migration Guide

This guide explains how to migrate your hardcoded TSX pages to the database so you can edit them through the admin panel.

## Overview

Your hardcoded pages (like `/huolto`, `/yhteystiedot`, etc.) need to be converted into database entries with sections. The migration script [scripts/migrate-hardcoded-pages.ts](scripts/migrate-hardcoded-pages.ts) does this automatically.

## How to Migrate Pages

### Step 1: Add Your Pages to the Migration Script

Edit [scripts/migrate-hardcoded-pages.ts](scripts/migrate-hardcoded-pages.ts) and add your pages to the `pages` array. Here's the pattern:

```typescript
{
  slug: 'your-page-slug',           // Must match the URL (without leading /)
  title: 'Page Title',
  description: 'Short description',
  metaTitle: 'SEO Title',
  metaDesc: 'SEO Description',
  status: 'PUBLISHED',              // or 'DRAFT'
  sections: [
    // Add sections here (see section types below)
  ]
}
```

### Step 2: Define Sections for Each Page

Each page consists of sections. Here are the available section types:

#### 1. Hero Section
```typescript
{
  type: 'hero',
  sortOrder: 0,
  isVisible: true,
  settings: {
    subtitle: 'Optional subtitle',
    title: 'Main Title',
    description: 'Description text',
    primaryCta: { text: 'Button Text', href: '/link' },
    secondaryCta: { text: 'Button 2', href: '/link2' },
    image: '/images/hero.jpg',       // optional
    features: ['Feature 1', 'Feature 2']  // optional
  }
}
```

#### 2. Features Section
```typescript
{
  type: 'features',
  sortOrder: 1,
  isVisible: true,
  settings: {
    title: 'Features Title',
    subtitle: 'Optional subtitle',
    features: [
      {
        icon: 'CheckCircle',         // Lucide icon name
        title: 'Feature Title',
        description: 'Feature description'
      },
      // Add more features...
    ]
  }
}
```

#### 3. Categories Grid
```typescript
{
  type: 'categories',
  sortOrder: 2,
  isVisible: true,
  settings: {
    title: 'Categories Title',
    subtitle: 'Optional subtitle',
    mode: 'auto',                    // or 'manual'
    limit: 6                         // number of categories to show
  }
}
```

#### 4. Products Showcase
```typescript
{
  type: 'products',
  sortOrder: 3,
  isVisible: true,
  settings: {
    title: 'Products Title',
    subtitle: 'Optional subtitle',
    mode: 'featured',                // 'featured', 'manual', or 'category'
    limit: 4,
    viewAllHref: '/tuotteet'
  }
}
```

#### 5. CTA (Call to Action)
```typescript
{
  type: 'cta',
  sortOrder: 4,
  isVisible: true,
  settings: {
    variant: 'gradient',             // 'default', 'dark', or 'gradient'
    title: 'CTA Title',
    description: 'CTA description',
    primaryCta: { text: 'Button', href: '/link' },
    secondaryCta: { text: 'Button 2', href: '/link2' },  // optional
    image: '/images/cta.jpg'         // optional
  }
}
```

#### 6. Contact Form
```typescript
{
  type: 'contact',
  sortOrder: 5,
  isVisible: true,
  settings: {
    showMap: true                    // show Google Maps embed
  }
}
```

#### 7. Rich Content (HTML)
```typescript
{
  type: 'content',
  sortOrder: 6,
  isVisible: true,
  settings: {
    html: `
      <h2>Your HTML Content</h2>
      <p>Any HTML you want...</p>
    `,
    maxWidth: 'lg'                   // 'sm', 'md', 'lg', 'xl', 'full'
  }
}
```

#### 8. Custom HTML
```typescript
{
  type: 'custom_html',
  sortOrder: 7,
  isVisible: true,
  settings: {
    html: '<div>Custom HTML</div>'
  }
}
```

### Step 3: Run the Migration

Once you've added all your pages to the script:

```bash
npm run db:migrate-pages
```

This will:
- Check if each page already exists (skips duplicates)
- Create new pages with their sections
- Show progress with ✅ success or ❌ error messages

### Step 4: Verify in Admin

1. Go to `/admin/pages`
2. You should see your migrated pages
3. Click "Edit" on any page to see the sections
4. Now you can edit them through the admin panel!

### Step 5: Test the Pages

Visit your pages (e.g., `/huolto`, `/yhteystiedot`) to verify they display correctly.

## Example: Migrating the Huolto Page

Here's a complete example of migrating the `/huolto` page:

```typescript
{
  slug: 'huolto',
  title: 'Huolto ja tuki',
  description: 'Kattavat huolto- ja tukipalvelut',
  metaTitle: 'Huolto ja tuki',
  metaDesc: 'PrintMedia PM Solutions tarjoaa kattavat huolto- ja tukipalvelut.',
  status: 'PUBLISHED',
  sections: [
    // Hero section
    {
      type: 'hero',
      sortOrder: 0,
      isVisible: true,
      settings: {
        subtitle: 'Huoltopalvelut',
        title: 'Huolto ja tuki',
        description: 'Tarjoamme kattavat huolto- ja tukipalvelut...',
        primaryCta: { text: 'Ota yhteyttä', href: '/yhteystiedot' },
        secondaryCta: { text: 'Soita 0440 875 025', href: 'tel:+358440875025' }
      }
    },
    // Services grid (using content section with custom HTML)
    {
      type: 'content',
      title: 'Varaosat ja ohjelmistot',
      sortOrder: 1,
      isVisible: true,
      settings: {
        html: `
          <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div class="bg-white rounded-2xl p-6 shadow-lg">
              <h3 class="text-xl font-bold mb-2">Tulostimien varaosat</h3>
              <p>Alkuperäiset ja yhteensopivat varaosat...</p>
            </div>
            <!-- Add more service cards -->
          </div>
        `,
        maxWidth: 'xl'
      }
    },
    // CTA section
    {
      type: 'cta',
      sortOrder: 2,
      isVisible: true,
      settings: {
        variant: 'dark',
        title: 'Tarvitsetko huoltoapua?',
        description: 'Ota meihin yhteyttä...',
        primaryCta: { text: 'Ota yhteyttä', href: '/yhteystiedot' }
      }
    }
  ]
}
```

## Tips

1. **Start Small**: Migrate one page at a time and test it
2. **Use Content Sections**: For complex custom layouts, use the `content` section type with HTML
3. **Check Existing Components**: Look at your hardcoded pages to see what components they use
4. **Section Order**: The `sortOrder` field determines the order sections appear on the page
5. **Visibility**: Use `isVisible: false` to hide sections without deleting them

## Removing Hardcoded Pages

After migrating and verifying a page works from the database:

1. The dynamic route `[...slug]/page.tsx` will take precedence
2. You can safely delete the old hardcoded TSX file (but keep a backup!)
3. Or keep them as fallbacks - the system checks the database first

## Troubleshooting

### "Page already exists"
- The script skips existing pages automatically
- To re-migrate, delete the page from the database first (through admin or Prisma Studio)

### Page not displaying
- Check the page status is `PUBLISHED`
- Verify all sections have `isVisible: true`
- Check the browser console for errors

### Sections not rendering correctly
- Validate your JSON settings structure
- Check that icon names are valid Lucide icon names
- Ensure all required fields are present

## Need Help?

Check the existing examples in `scripts/migrate-hardcoded-pages.ts` for reference patterns.
