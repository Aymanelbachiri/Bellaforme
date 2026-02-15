/**
 * Feature: product-showcase, Property 7: ProductCard conditional rendering
 *
 * Validates: Requirements 6.2, 6.3, 6.4
 *
 * For any product, the ProductCard component should render the product name,
 * featured_image, and short_description. Additionally, if content_mode is
 * "detailed", the card should contain a link to /product/{slug} with text
 * "En savoir plus". If content_mode is "brochure_only", the card should
 * contain a link to the brochure_file URL with text "Voir la brochure".
 */
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import ProductCard from '../product-card';
import type { Product } from '@/types/models';

// --- Generators ---
// Use alphanumeric strings to avoid DOM text-matching edge cases with whitespace/special chars.

const slugArb = fc.stringMatching(/^[a-z][a-z0-9-]{0,29}$/);

const alphaNameArb = fc.stringMatching(/^[A-Za-z0-9][A-Za-z0-9 ]{0,39}$/)
    .filter((s) => s.trim().length > 0);

const baseProductArb = fc.record({
    id: fc.nat({ max: 100_000 }),
    division_id: fc.nat({ max: 1000 }),
    category_id: fc.nat({ max: 1000 }),
    brand_id: fc.option(fc.nat({ max: 1000 }), { nil: null }),
    name: alphaNameArb,
    slug: slugArb,
    short_description: alphaNameArb,
    description: fc.option(fc.constant('Some description'), { nil: null }),
    featured_image: fc.stringMatching(/^uploads\/[a-z0-9]{1,20}\.(jpg|png|webp)$/),
    brochure_file: fc.option(
        fc.stringMatching(/^brochures\/[a-z0-9]{1,20}\.pdf$/),
        { nil: null },
    ),
    video_url: fc.option(fc.constant('https://youtube.com/watch?v=abc'), { nil: null }),
    is_active: fc.boolean(),
    order: fc.nat({ max: 100 }),
});

const detailedProductArb: fc.Arbitrary<Product> = baseProductArb.map((p) => ({
    ...p,
    content_mode: 'detailed' as const,
}));

const brochureProductArb: fc.Arbitrary<Product> = baseProductArb
    .filter((p) => p.brochure_file !== null)
    .map((p) => ({
        ...p,
        content_mode: 'brochure_only' as const,
    }));

const anyProductArb: fc.Arbitrary<Product> = fc.oneof(detailedProductArb, brochureProductArb);


// --- Property Tests ---

describe('ProductCard — Property 7: Conditional rendering', () => {
    /**
     * **Validates: Requirements 6.4**
     * Every product card renders the product name, featured_image, and short_description.
     */
    it('always renders product name, featured_image, and short_description', () => {
        fc.assert(
            fc.property(anyProductArb, (product) => {
                const { container, unmount } = render(<ProductCard product={product} />);

                const html = container.innerHTML;

                // Product name rendered inside an h3
                const h3 = container.querySelector('h3');
                expect(h3).not.toBeNull();
                expect(h3!.textContent).toBe(product.name);

                // Short description rendered inside a p tag
                const p = container.querySelector('p');
                expect(p).not.toBeNull();
                expect(p!.textContent).toBe(product.short_description);

                // Featured image used in an img element (via OptimizedImage)
                const img = container.querySelector('img');
                expect(img).not.toBeNull();
                expect(img!.getAttribute('src')).toBe(`/storage/${product.featured_image}`);

                unmount();
            }),
            { numRuns: 100 },
        );
    });

    /**
     * **Validates: Requirements 6.2**
     * For detailed products, the card contains a link to /product/{slug} with text "En savoir plus".
     */
    it('renders "En savoir plus" link to /product/{slug} for detailed products', () => {
        fc.assert(
            fc.property(detailedProductArb, (product) => {
                const { container, unmount } = render(<ProductCard product={product} />);

                const links = container.querySelectorAll('a');
                const detailLink = Array.from(links).find(
                    (a) => a.textContent?.trim() === 'En savoir plus',
                );

                expect(detailLink).toBeDefined();
                expect(detailLink!.getAttribute('href')).toBe(`/product/${product.slug}`);

                // Should NOT have "Voir la brochure"
                const brochureLink = Array.from(links).find(
                    (a) => a.textContent?.trim() === 'Voir la brochure',
                );
                expect(brochureLink).toBeUndefined();

                unmount();
            }),
            { numRuns: 100 },
        );
    });

    /**
     * **Validates: Requirements 6.3**
     * For brochure_only products, the card contains a link to the brochure_file URL
     * with text "Voir la brochure".
     */
    it('renders "Voir la brochure" link to brochure_file for brochure_only products', () => {
        fc.assert(
            fc.property(brochureProductArb, (product) => {
                const { container, unmount } = render(<ProductCard product={product} />);

                const links = container.querySelectorAll('a');
                const brochureLink = Array.from(links).find(
                    (a) => a.textContent?.trim() === 'Voir la brochure',
                );

                expect(brochureLink).toBeDefined();
                expect(brochureLink!.getAttribute('href')).toBe(
                    `/storage/${product.brochure_file}`,
                );
                expect(brochureLink!.getAttribute('target')).toBe('_blank');

                // Should NOT have "En savoir plus"
                const detailLink = Array.from(links).find(
                    (a) => a.textContent?.trim() === 'En savoir plus',
                );
                expect(detailLink).toBeUndefined();

                unmount();
            }),
            { numRuns: 100 },
        );
    });
});
