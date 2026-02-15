/**
 * Feature: product-showcase, Property 16: Product JSON-LD structured data
 *
 * Validates: Requirements 12.8
 *
 * For any product with content_mode "detailed", the rendered product page should
 * contain a JSON-LD script block of type "Product" with the product name,
 * description, image, and brand name.
 */
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import JsonLdProduct from '../json-ld-product';
import type { Product, Brand } from '@/types/models';

// --- Generators ---

const slugArb = fc.stringMatching(/^[a-z][a-z0-9-]{0,29}$/);

const alphaNameArb = fc.stringMatching(/^[A-Za-z0-9][A-Za-z0-9 ]{0,39}$/)
    .filter((s) => s.trim().length > 0);

const brandArb: fc.Arbitrary<Brand> = fc.record({
    id: fc.nat({ max: 100_000 }),
    name: alphaNameArb,
    slug: slugArb,
    logo: fc.stringMatching(/^logos\/[a-z0-9]{1,20}\.(png|jpg|webp)$/),
    is_partner: fc.boolean(),
    is_reference: fc.boolean(),
    order: fc.nat({ max: 100 }),
    is_active: fc.boolean(),
});

const detailedProductArb: fc.Arbitrary<Product> = fc.record({
    id: fc.nat({ max: 100_000 }),
    division_id: fc.nat({ max: 1000 }),
    category_id: fc.nat({ max: 1000 }),
    brand_id: fc.option(fc.nat({ max: 1000 }), { nil: null }),
    content_mode: fc.constant('detailed' as const),
    name: alphaNameArb,
    slug: slugArb,
    short_description: alphaNameArb,
    description: fc.option(alphaNameArb, { nil: null }),
    featured_image: fc.stringMatching(/^uploads\/[a-z0-9]{1,20}\.(jpg|png|webp)$/),
    brochure_file: fc.option(
        fc.stringMatching(/^brochures\/[a-z0-9]{1,20}\.pdf$/),
        { nil: null },
    ),
    video_url: fc.option(fc.constant('https://youtube.com/watch?v=abc'), { nil: null }),
    is_active: fc.boolean(),
    order: fc.nat({ max: 100 }),
    brand: fc.option(brandArb, { nil: undefined }),
});

// Product with a brand always present (for brand-specific tests)
const detailedProductWithBrandArb: fc.Arbitrary<Product> = fc.record({
    id: fc.nat({ max: 100_000 }),
    division_id: fc.nat({ max: 1000 }),
    category_id: fc.nat({ max: 1000 }),
    brand_id: fc.nat({ max: 1000 }),
    content_mode: fc.constant('detailed' as const),
    name: alphaNameArb,
    slug: slugArb,
    short_description: alphaNameArb,
    description: fc.option(alphaNameArb, { nil: null }),
    featured_image: fc.stringMatching(/^uploads\/[a-z0-9]{1,20}\.(jpg|png|webp)$/),
    brochure_file: fc.option(
        fc.stringMatching(/^brochures\/[a-z0-9]{1,20}\.pdf$/),
        { nil: null },
    ),
    video_url: fc.option(fc.constant('https://youtube.com/watch?v=abc'), { nil: null }),
    is_active: fc.boolean(),
    order: fc.nat({ max: 100 }),
    brand: brandArb,
});

// --- Helpers ---

function parseJsonLd(container: HTMLElement): Record<string, unknown> {
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    return JSON.parse(script!.textContent ?? '{}');
}

// --- Property Tests ---

describe('JsonLdProduct — Property 16: Product JSON-LD structured data', () => {
    /**
     * **Validates: Requirements 12.8**
     * The JSON-LD block has @type "Product" and includes the product name.
     */
    it('renders a JSON-LD script block with @type "Product" and correct name', () => {
        fc.assert(
            fc.property(detailedProductArb, (product) => {
                const { container, unmount } = render(<JsonLdProduct product={product} />);

                const jsonLd = parseJsonLd(container);
                expect(jsonLd['@context']).toBe('https://schema.org');
                expect(jsonLd['@type']).toBe('Product');
                expect(jsonLd['name']).toBe(product.name);

                unmount();
            }),
            { numRuns: 100 },
        );
    });

    /**
     * **Validates: Requirements 12.8**
     * The description field uses product.description when available,
     * falling back to product.short_description.
     */
    it('uses description when present, falls back to short_description', () => {
        fc.assert(
            fc.property(detailedProductArb, (product) => {
                const { container, unmount } = render(<JsonLdProduct product={product} />);

                const jsonLd = parseJsonLd(container);
                const expectedDescription = product.description ?? product.short_description;
                expect(jsonLd['description']).toBe(expectedDescription);

                unmount();
            }),
            { numRuns: 100 },
        );
    });

    /**
     * **Validates: Requirements 12.8**
     * The image field contains the featured_image path with origin prefix.
     */
    it('includes the featured_image in the image field', () => {
        fc.assert(
            fc.property(detailedProductArb, (product) => {
                const { container, unmount } = render(<JsonLdProduct product={product} />);

                const jsonLd = parseJsonLd(container);
                expect(jsonLd['image']).toContain(`/storage/${product.featured_image}`);

                unmount();
            }),
            { numRuns: 100 },
        );
    });

    /**
     * **Validates: Requirements 12.8**
     * When a brand is present, the JSON-LD includes brand.name with @type "Brand".
     */
    it('includes brand name when brand is present', () => {
        fc.assert(
            fc.property(detailedProductWithBrandArb, (product) => {
                const { container, unmount } = render(<JsonLdProduct product={product} />);

                const jsonLd = parseJsonLd(container);
                const brand = jsonLd['brand'] as Record<string, unknown>;
                expect(brand).toBeDefined();
                expect(brand['@type']).toBe('Brand');
                expect(brand['name']).toBe(product.brand!.name);

                unmount();
            }),
            { numRuns: 100 },
        );
    });

    /**
     * **Validates: Requirements 12.8**
     * When no brand is present, the brand field is undefined in the JSON-LD.
     */
    it('omits brand when product has no brand', () => {
        const noBrandProductArb = detailedProductArb.map((p) => ({
            ...p,
            brand: undefined,
            brand_id: null,
        }));

        fc.assert(
            fc.property(noBrandProductArb, (product) => {
                const { container, unmount } = render(<JsonLdProduct product={product} />);

                const jsonLd = parseJsonLd(container);
                expect(jsonLd['brand']).toBeUndefined();

                unmount();
            }),
            { numRuns: 100 },
        );
    });
});
