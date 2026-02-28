# Project Memory

## 1. Project Overview
- Purpose: Bella Forme Group product showcase website (dark-themed)
- Tech stack: Laravel 11, Inertia.js, React, TypeScript, Tailwind CSS v4
- Architecture style: Monolith with SPA frontend via Inertia.js

## 2. Environment
- Runtime: PHP 8.x, Node.js
- Package manager: Composer (PHP), npm (JS)
- Key dependencies: Intervention Image (image processing), react-slick (hero carousel), Fortify (auth)
- Environment variables: See `.env.example`

## 3. Architecture Decisions

### Decision: Switch image optimization from multi-size WebP to single AVIF
- Reason: User requested simplification — convert to AVIF only, no rescaling. Reduces storage and complexity.
- Date: 2026-02-28

### Decision: Mobile viewport optimization using Tailwind responsive utilities
- Reason: Fix layout overflows, improve touch targets, adapt component sizing for mobile (<640px).
- Date: 2026-02-28

## 4. Database Schema
- Tables: users, divisions, categories, brands, products, product_images, product_specifications, contact_messages, homepage_settings, seo_metadata, email_settings, newsletter_subscribers
- Relationships: Division → Categories → Products; Products → Images, Specifications; Products → Brand
- Migrations applied: See `database/migrations/`

## 5. API Contracts
- Endpoint: /api/products (search)
- Method: GET
- Request format: Query params (search, category, etc.)
- Response format: JSON paginated product list

## 6. Conventions
- Naming: Laravel conventions (snake_case DB, camelCase JS)
- Folder structure: `app/Http/Controllers/{Admin,Public,Api,Settings}`, `resources/js/pages/`, `resources/js/components/`
- Patterns used: Traits for shared model behavior (`HasOptimizedImages`, `HasSeo`, `HasSlug`), Form Requests for validation

## 7. Known Issues / Constraints
- Issue: Existing uploaded images still have old WebP variants on disk
  - Context: After switching to AVIF, previously uploaded images retain their `-thumb.webp`, `-medium.webp`, etc. files. New uploads only generate `.avif`.
  - Status: Needs a one-time cleanup migration or artisan command to re-process existing images

## 8. Current State
- What is completed: Mobile/tablet responsive optimization across all public pages; Image optimization switched from multi-size WebP to single AVIF
- What is in progress: Nothing
- Next planned steps: Visual QA of mobile layouts; cleanup of old WebP files for existing uploads
