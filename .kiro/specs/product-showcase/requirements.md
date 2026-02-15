# Requirements Document

## Introduction

A corporate product showcase website for Bella Forme Group, built on the existing Laravel + React (Inertia.js) application. The system manages Divisions (e.g., Esthétique & Médical, Sport & Fitness, Coiffure & Spa), Categories, Brands, and Products with a unified product table supporting two content modes: "detailed" (full product pages with specs, gallery, video) and "brochure_only" (PDF/catalog-only entries). The system includes an admin panel for CRUD operations with dynamic forms, a public-facing frontend with conditional routing based on content mode, a homepage with hero carousel and division showcases, brand filtering on category pages, an extended contact form, and comprehensive SEO metadata management.

## Glossary

- **Division**: A top-level organizational unit grouping categories (e.g., "Esthétique & Médical", "Sport & Fitness", "Coiffure & Spa"). Has hero imagery for its landing page.
- **Category**: A grouping of products within a division (e.g., "Appareils diagnostique", "Cardio Training"). Each has an image and an "Explorer" button.
- **Brand**: A manufacturer or supplier associated with products. Can be flagged as is_partner (shown in "Nos Marques Partenaires" carousel) or is_reference (shown in "Nos Références" carousel).
- **Product**: An item in the showcase. Has a `content_mode` field determining its behavior: either "detailed" (full product page) or "brochure_only" (PDF/catalog download only).
- **Content_Mode**: A string field on Product with two possible values: "detailed" or "brochure_only". Determines which fields are required and how the product is displayed and routed.
- **Product_Image**: A gallery image associated with a detailed product, displayed on the single product page.
- **Product_Specification**: A key-value pair (label/value) describing a technical attribute of a detailed product, displayed in the "Caractéristiques Techniques" tab.
- **Contact_Message**: A message submitted by a visitor through the contact form, optionally linked to a product.
- **Homepage_Section**: A configurable section on the homepage, such as the hero carousel, division showcases, or stats counters.
- **Admin_Panel**: The authenticated area where administrators manage all content entities.
- **Public_Frontend**: The unauthenticated visitor-facing pages displaying the website content.
- **Brochure_File**: A PDF document uploaded for a product, required for brochure_only products and optional for detailed products.
- **SEO_Metadata**: A set of meta fields (meta_title, meta_description, og_image) associated with a page entity (Division, Category, Product, or static pages) for search engine optimization.
- **Email_Settings**: SMTP configuration (host, port, username, password, encryption, from_address, from_name) managed from the admin dashboard and used for sending system emails (e.g., contact form notifications).

## Requirements

### Requirement 1: Division Management

**User Story:** As an administrator, I want to manage divisions so that I can organize the product catalog into top-level sections.

#### Acceptance Criteria

1. THE Admin_Panel SHALL provide CRUD operations for divisions with fields: name, slug, hero_image, hero_title, hero_subtitle, order, and is_active.
2. WHEN an administrator creates or updates a division, THE Admin_Panel SHALL validate that name and slug are required and that slug is unique among divisions.
3. WHEN a division is saved with an empty slug field, THE Admin_Panel SHALL auto-generate the slug from the name.
4. THE Public_Frontend SHALL display only divisions where is_active is true, ordered by the order field.

### Requirement 2: Category Management

**User Story:** As an administrator, I want to manage categories within divisions so that I can organize products into logical groups.

#### Acceptance Criteria

1. THE Admin_Panel SHALL provide CRUD operations for categories with fields: division_id, name, slug, image, order, and is_active.
2. WHEN an administrator creates or updates a category, THE Admin_Panel SHALL validate that division_id, name, and slug are required and that slug is unique among categories.
3. WHEN a category is saved with an empty slug field, THE Admin_Panel SHALL auto-generate the slug from the name.
4. THE Public_Frontend SHALL display only categories where is_active is true, ordered by the order field, within their parent division.

### Requirement 3: Brand Management

**User Story:** As an administrator, I want to manage brands so that I can associate products with their manufacturers and display partner/reference logos on division pages.

#### Acceptance Criteria

1. THE Admin_Panel SHALL provide CRUD operations for brands with fields: name, slug, logo, is_partner, is_reference, order, and is_active.
2. WHEN an administrator creates or updates a brand, THE Admin_Panel SHALL validate that name and slug are required and that slug is unique among brands.
3. WHEN a brand is saved with an empty slug field, THE Admin_Panel SHALL auto-generate the slug from the name.
4. WHEN a division page is displayed, THE Public_Frontend SHALL show a "Nos Références" carousel containing brands where is_reference is true and that are associated with products in that division.
5. WHEN a division page is displayed, THE Public_Frontend SHALL show a "Nos Marques Partenaires" carousel containing brands where is_partner is true and that are associated with products in that division.

### Requirement 4: Product Management with Content Mode

**User Story:** As an administrator, I want to create and manage products with two distinct content modes so that some products have full detail pages while others serve as brochure/catalog entries.

#### Acceptance Criteria

1. THE Admin_Panel SHALL provide a product create/edit form with a Product Type selector offering two options: "Full Product" (content_mode = "detailed") and "Catalog Only" (content_mode = "brochure_only").
2. WHEN content_mode is "detailed", THE Admin_Panel SHALL display fields for description, video_url, specifications (label/value pairs), and image gallery upload, and SHALL validate that description is required.
3. WHEN content_mode is "brochure_only", THE Admin_Panel SHALL hide the description, video_url, specifications, and image gallery fields, and SHALL validate that brochure_file is required.
4. WHEN an administrator switches the Product Type selector, THE Admin_Panel SHALL dynamically show or hide the relevant form fields without a page reload.
5. THE Admin_Panel SHALL validate that division_id, category_id, name, slug, short_description, featured_image, and content_mode are required for all products regardless of content mode.
6. WHEN a product is saved with an empty slug field, THE Admin_Panel SHALL auto-generate the slug from the name.
7. WHEN content_mode is "detailed", THE Admin_Panel SHALL allow managing product specifications as an ordered list of label/value pairs that can be added, removed, and reordered.
8. WHEN content_mode is "detailed", THE Admin_Panel SHALL allow managing a product image gallery as an ordered set of images that can be added, removed, and reordered.

### Requirement 5: Product Conditional Validation

**User Story:** As a developer, I want the backend to enforce content-mode-specific validation rules so that data integrity is maintained regardless of how the API is called.

#### Acceptance Criteria

1. WHEN a product with content_mode "brochure_only" is submitted without a brochure_file, THE Product API SHALL reject the request with a validation error indicating brochure_file is required.
2. WHEN a product with content_mode "detailed" is submitted without a description, THE Product API SHALL reject the request with a validation error indicating description is required.
3. WHEN a product with content_mode "brochure_only" is submitted with specifications or gallery images, THE Product API SHALL ignore the specifications and gallery image data.
4. THE Product API SHALL validate that content_mode contains only the values "detailed" or "brochure_only".

### Requirement 6: Public Product Listing with Brand Filter

**User Story:** As a visitor, I want to browse products by category and filter by brand so that I can find items relevant to my needs.

#### Acceptance Criteria

1. WHEN a visitor navigates to a category page, THE Public_Frontend SHALL display the category hero section and a grid of product cards for all active products in that category.
2. WHEN a product card is rendered for a product with content_mode "detailed", THE Public_Frontend SHALL display a button labeled "En savoir plus" that links to the product detail page at /product/:slug.
3. WHEN a product card is rendered for a product with content_mode "brochure_only", THE Public_Frontend SHALL display a button labeled "Voir la brochure" that opens the brochure PDF file.
4. THE Public_Frontend SHALL display each product card with the product name, featured_image, and short_description.
5. THE Public_Frontend SHALL display only products where is_active is true, ordered by the order field.
6. THE Public_Frontend SHALL provide a "Filtrer par marque" dropdown on the category page that filters the product grid by the selected brand.

### Requirement 7: Single Product Page

**User Story:** As a visitor, I want to view detailed information about a product so that I can evaluate it before contacting the company.

#### Acceptance Criteria

1. WHEN a visitor navigates to /product/:slug for a product with content_mode "detailed", THE Public_Frontend SHALL display the featured image, image gallery, description, a "Demander un devis" call-to-action button, and tabbed sections for "Caractéristiques Techniques" (specifications table) and "Catalogue / Brochure" (brochure download if available).
2. WHEN a product has a video_url, THE Public_Frontend SHALL display an embedded video player on the single product page.
3. WHEN a visitor navigates to /product/:slug for a product with content_mode "brochure_only", THE Product API SHALL return a 404 response.
4. WHEN a visitor navigates to /product/:slug for a non-existent slug, THE Product API SHALL return a 404 response.

### Requirement 8: Contact Form

**User Story:** As a visitor, I want to submit a contact message so that I can inquire about products or request a quote.

#### Acceptance Criteria

1. THE Public_Frontend SHALL provide a contact form with fields: name (Nom & prénom), phone (Téléphone), email (E-mail), city (Ville), activity_type (Type d'activité, dropdown), project_nature (Nature du projet, dropdown), equipment_timeline (Délai d'équipement, dropdown), request_reason (Motif de la demande, dropdown), and message (Message).
2. WHEN a visitor submits the contact form, THE Contact API SHALL validate that name, email, and message are required, and that email is a valid email format.
3. WHEN a visitor clicks "Demander un devis" on a product detail page, THE Public_Frontend SHALL navigate to the contact form with the product_id pre-associated.
4. WHEN a contact message is successfully submitted, THE Public_Frontend SHALL display a confirmation message to the visitor.
5. THE Admin_Panel SHALL provide a read-only list view of all submitted contact messages, ordered by creation date descending.

### Requirement 9: Public Division Page and Navigation

**User Story:** As a visitor, I want to navigate through divisions and categories so that I can explore the product catalog hierarchically.

#### Acceptance Criteria

1. WHEN a visitor navigates to a division page, THE Public_Frontend SHALL display the division hero section (hero_image, hero_title, hero_subtitle), a "Découvrez l'univers de nos produits" heading, and a grid of active category cards with "Explorer" buttons.
2. WHEN a visitor clicks an "Explorer" button on a category card, THE Public_Frontend SHALL navigate to the category page showing the product grid for that category.
3. THE Public_Frontend SHALL provide a main navigation bar with links to each active division, a "Contactez-nous" link, and the company logo.

### Requirement 10: Homepage

**User Story:** As a visitor, I want to see an engaging homepage so that I can quickly understand the company offerings and navigate to relevant divisions.

#### Acceptance Criteria

1. THE Public_Frontend SHALL display a hero section on the homepage with a background image and the tagline "Votre espace professionnel".
2. THE Public_Frontend SHALL display division showcase sections on the homepage, each with an image composition and a "Découvrir" button linking to the division page.
3. THE Public_Frontend SHALL display a stats section showing key figures (e.g., "+30 ans d'expérience", "+50 marques internationales", "+3,000 clients satisfaits").
4. THE Admin_Panel SHALL allow administrators to manage homepage content including the hero section and stats values.

### Requirement 11: API Endpoints for Product Listing and Detail

**User Story:** As a developer, I want well-defined API endpoints so that the frontend can retrieve product data efficiently.

#### Acceptance Criteria

1. WHEN the frontend requests GET /api/products with a category query parameter, THE Product API SHALL return a list of active products in that category with fields: id, name, slug, content_mode, featured_image, short_description, and brochure_file.
2. WHEN the frontend requests GET /api/products with a category and brand query parameter, THE Product API SHALL return only products matching both the category and brand filters.
3. WHEN the frontend requests GET /api/product/{slug} for a product with content_mode "detailed", THE Product API SHALL return the full product data including description, specifications, gallery images, video_url, and brand information.
4. WHEN the frontend requests GET /api/product/{slug} for a product with content_mode "brochure_only", THE Product API SHALL return a 404 response.
5. THE Product API SHALL serialize product data to JSON and deserialize incoming product data from JSON for all API interactions.

### Requirement 12: SEO Metadata Management

**User Story:** As an administrator, I want to manage SEO metadata for each page so that the website ranks well in search engines and displays correctly when shared on social media.

#### Acceptance Criteria

1. THE Admin_Panel SHALL provide SEO metadata fields (meta_title, meta_description, og_image) on the edit forms for divisions, categories, and products (detailed only).
2. THE Admin_Panel SHALL provide a dedicated SEO settings page for managing metadata of static pages (homepage, contact page, about page).
3. WHEN a public page is rendered, THE Public_Frontend SHALL include the corresponding meta_title in the HTML `<title>` tag and as `og:title`.
4. WHEN a public page is rendered, THE Public_Frontend SHALL include the corresponding meta_description in a `<meta name="description">` tag and as `og:description`.
5. WHEN a public page has an og_image set, THE Public_Frontend SHALL include it as `og:image` in the page head.
6. WHEN SEO metadata fields are left empty for an entity, THE Public_Frontend SHALL generate default values: meta_title from the entity name, meta_description from the entity short_description or hero_subtitle, and og_image from the entity featured_image or hero_image.
7. THE Public_Frontend SHALL include canonical URL tags on all public pages.
8. THE Public_Frontend SHALL render structured data (JSON-LD) for product detail pages including product name, description, image, and brand.

### Requirement 13: Email / SMTP Settings Management

**User Story:** As an administrator, I want to configure SMTP email settings from the admin dashboard so that I can manage how the system sends emails without editing server configuration files.

#### Acceptance Criteria

1. THE Admin_Panel SHALL provide an email settings page with fields: SMTP host, SMTP port, SMTP username, SMTP password, encryption type (none, TLS, SSL), from address, and from name.
2. WHEN an administrator saves email settings, THE Admin_Panel SHALL validate that host, port, from_address, and from_name are required, and that from_address is a valid email format.
3. WHEN an administrator saves email settings, THE System SHALL store the SMTP password in an encrypted format in the database.
4. THE Admin_Panel SHALL provide a "Send Test Email" button that sends a test email to a specified address using the current SMTP settings.
5. WHEN a contact form message is submitted, THE System SHALL send a notification email to the configured from_address using the stored SMTP settings.
6. IF the SMTP settings are not configured or the email fails to send, THEN THE System SHALL log the error and continue processing the contact form submission without failing.

### Requirement 14: Image Optimization

**User Story:** As an administrator, I want uploaded images to be automatically optimized so that the website loads quickly for visitors.

#### Acceptance Criteria

1. WHEN an image is uploaded (hero images, category images, product featured images, gallery images, brand logos), THE System SHALL generate optimized WebP versions in multiple sizes: thumbnail (150px), medium (600px), and large (1200px).
2. THE Public_Frontend SHALL serve WebP images using the `<picture>` element with appropriate `srcset` attributes for responsive loading.
3. THE System SHALL preserve the original uploaded image alongside the optimized versions.
4. WHEN an image is deleted, THE System SHALL remove all associated optimized versions from storage.
5. THE System SHALL apply lazy loading to all images below the fold on public pages.
