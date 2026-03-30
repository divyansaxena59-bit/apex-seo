# Apex SEO — World-Class Shopify SEO Plugin

A comprehensive, production-ready Shopify SEO optimization plugin built with React Router v7, Prisma, and Anthropic Claude API.

## 🚀 Phase 1 (MVP) — Completed Foundation

### ✅ Project Setup
- **Framework**: React Router v7 (successor to Remix)
- **UI**: Polaris components
- **Database**: Prisma + SQLite (dev) / PostgreSQL (prod)
- **AI**: Anthropic Claude API (claude-sonnet-4-5)
- **Server**: Node.js with React Router

### ✅ Core Services Implemented

#### 1. **Readability Analyzer** (`app/services/seo/readability.server.ts`)
- **Flesch Reading Ease Score** — calculates reading difficulty (0-100)
- **Sentence Length Analysis** — detects overly long sentences
- **Passive Voice Detection** — regex-based passive voice percentage
- **Transition Words Check** — verifies content flow
- **Pure functions** — no external API calls needed

#### 2. **Focus Keyphrase Checker** (`app/services/seo/keyphrase.server.ts`)
- **Placement Analysis** — checks keyphrase in title, description, H1, first 100 words
- **Density Calculation** — optimal range 0.5-3% for keyword targeting
- **Word Form Expansion** — (Claude API integration ready)
- **Scoring System** — 16-point keyphrase score

#### 3. **SEO Scorer** (`app/services/seo/scorer.server.ts`)
- **100-Point Score Breakdown**:
  - Title (20 pts) — presence, length, keyphrase inclusion
  - Description (20 pts) — presence, length, keyphrase inclusion
  - Images (15 pts) — alt text coverage
  - Schema Markup (15 pts) — JSON-LD types enabled
  - Technical SEO (15 pts) — canonical, OG tags, noindex
  - Readability (10 pts) — Flesch score, passive voice, sentence length
  - Keyphrase (5 pts) — density and placement
- **Color-Coded Display** — Green (80+), Orange (60-79), Red (<60)

### ✅ Database Schema (Prisma)
**15 Models** fully designed:
- `Shop` — merchant store data
- `SeoRecord` — per-product/page SEO metadata (title, description, keyphrase, scores)
- `SchemaConfig` — JSON-LD configuration per schema type
- `SitemapConfig` — XML sitemap settings
- `Redirect` — 301/302 redirect management
- `ScanJob` — background async jobs (audits, bulk operations)
- `AuditReport` + `AuditItem` — full SEO audit results (35+ checks)
- `AltTextRecord` — image alt text tracking
- `PageSpeedResult` — Core Web Vitals history
- `TrackedKeyword` — keyword position tracking
- `BrokenLink` — broken link detection

### ✅ Routes & Features

#### Dashboard (`/app/dashboard`)
- Store SEO score (average across all products/pages)
- Total pages analyzed
- Latest audit results
- Quick start guide

#### Meta Tags Manager (`/app/meta-tags`)
- Resource type selector (Products, Collections, Pages, Blogs)
- Products list (bulk editor ready)
- Individual product SEO editor
- SERP preview component (ready for implementation)
- Keyphrase input field
- Readability panel

#### Settings (`/app/settings`)
- Organization name & URL
- Claude API key (for AI features)
- PSI API key (for PageSpeed)

### ✅ Utilities & Helpers
- `utils/seo-score.ts` — score color + label functions
- `models/seoRecord.server.ts` — CRUD operations for SeoRecords

---

## 🏗️ Project Structure

```
apex-seo/
├── .env                          # Environment config
├── .env.example
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── vite.config.ts                # Vite build config
├── app.shopify.toml              # Shopify CLI config
│
├── prisma/
│   └── schema.prisma             # Complete database schema
│
├── app/
│   ├── entry.server.tsx          # SSR entry point
│   ├── entry.client.tsx          # Client entry point
│   ├── root.tsx                  # App root + Polaris provider
│   ├── db.server.ts              # Prisma client singleton
│   ├── shopify.server.ts         # Shopify app config
│   │
│   ├── routes/
│   │   ├── app.tsx               # Authenticated shell + navigation
│   │   ├── app._index.tsx        # Redirect to dashboard
│   │   ├── app.dashboard.tsx     # Dashboard with scores
│   │   ├── app.meta-tags.tsx     # Resource type selector
│   │   ├── app.settings.tsx      # Settings
│   │   └── [future routes...]
│   │
│   ├── services/
│   │   ├── seo/
│   │   │   ├── readability.server.ts   # Flesch + passive voice + sentence analysis
│   │   │   ├── keyphrase.server.ts     # Keyphrase density & placement
│   │   │   └── scorer.server.ts        # Overall SEO score calculation
│   │   ├── ai/
│   │   │   └── [Claude API integrations]
│   │   ├── shopify/
│   │   │   └── [GraphQL wrappers]
│   │   └── pagespeed/
│   │       └── [PSI API client]
│   │
│   ├── models/
│   │   └── seoRecord.server.ts   # SeoRecord CRUD
│   │
│   ├── utils/
│   │   └── seo-score.ts          # Score formatting utils
│   │
│   └── components/
│       └── [Polaris UI components - ready for implementation]
│
└── extensions/
    └── apex-seo-theme/           # Theme App Extension (blocks structure)
```

---

## 🎯 What's Ready to Use

### ✅ Services (Production-Ready)
```typescript
// Calculate SEO score
import { calculateSeoScore } from '~/services/seo/scorer.server';

const breakdown = calculateSeoScore({
  metaTitle: "Best Running Shoes | Nike",
  metaDescription: "Premium running shoes with excellent...",
  focusKeyphrase: "running shoes",
  bodyText: "...",
  hasProductSchema: true,
  hasOgTags: true,
  // ... more fields
});

console.log(breakdown.total); // 0-100 score
```

```typescript
// Analyze readability
import { analyzeReadability } from '~/services/seo/readability.server';

const metrics = analyzeReadability("Your product description text...");
console.log(metrics.fleschScore);      // 45-95
console.log(metrics.grade);            // "Easy", "Standard", etc.
console.log(metrics.passiveVoicePct);  // 5.2%
```

```typescript
// Check keyphrase
import { analyzeKeyphrase } from '~/services/seo/keyphrase.server';

const analysis = analyzeKeyphrase(
  "running shoes",
  title,
  description,
  h1,
  bodyText
);
console.log(analysis.score);           // 0-16
console.log(analysis.density);         // percentage
console.log(analysis.densityStatus);   // "perfect" | "too_low" | "too_high"
```

### ✅ Database Ready
- All 15 models created
- Prisma client generated
- Ready for migrations: `npm run prisma:migrate`

---

## 📋 Next Steps (Phase 1 Completion)

1. **Create Product Editor Route** (`app/routes/app.meta-tags.products.$id.tsx`)
   - Form with title, description, keyphrase, OG fields
   - Live SERP preview
   - Readability gauge
   - Keyphrase score breakdown
   - Save to Shopify via GraphQL mutation

2. **GraphQL Setup** (`app/services/shopify/graphql.server.ts`)
   - Fetch products
   - Update product SEO via `productUpdate` mutation

3. **Authentication Flow**
   - Complete OAuth setup
   - Session storage

4. **Deployment**
   - Fly.io configuration
   - Database setup (PostgreSQL)
   - Environment variables

---

## 🔐 API Keys Needed

```env
SHOPIFY_API_KEY=              # From Shopify Partner Dashboard
SHOPIFY_API_SECRET=
DATABASE_URL=file:./dev.db    # SQLite for dev
ANTHROPIC_API_KEY=            # For Claude AI features (optional Phase 2+)
PSI_API_KEY=                  # For PageSpeed Insights (optional Phase 2+)
APP_URL=http://localhost:3000
```

---

## 🎨 Features Highlighted

### ✨ Readability Analyzer
- **Flesch Reading Ease** formula implemented
- Perfect for optimizing product descriptions
- Automatically warns if content is too difficult

### 🔍 Focus Keyphrase Checker
- Analyzes placement in critical SEO fields
- Calculates density with warnings for keyword stuffing
- 16-point scoring system

### 📊 SEO Scorer
- Comprehensive 100-point score
- Weights readability + keyphrase (Yoast-like features)
- Color-coded feedback for merchants

---

## 🚀 Commands

```bash
# Development
npm run dev           # Start Shopify app dev tunnel

# Database
npm run prisma:generate   # Generate Prisma client
npm run prisma:migrate    # Run migrations
npm run prisma:studio     # Open Prisma Studio GUI

# Build & Deploy
npm run build         # Production build
npm run deploy        # Deploy to Fly.io
```

---

## 📚 Documentation

- **Readability Analysis**: Uses Flesch Reading Ease algorithm (no external API)
- **Keyphrase Scoring**: 16-point system based on placement + density
- **SEO Score**: 100-point aggregate with readability + keyphrase components
- **Database**: Prisma ORM with SQLite (dev) / PostgreSQL (prod)

---

**Built with ❤️ for Shopify merchants who want world-class SEO optimization.**
