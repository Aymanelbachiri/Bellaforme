import type { Product } from '@/types/models';

export default function JsonLdProduct({ product }: { product: Product }) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description ?? product.short_description,
        image: product.featured_image ? `${window.location.origin}/storage/${product.featured_image}` : undefined,
        brand: product.brand
            ? { '@type': 'Brand', name: product.brand.name }
            : undefined,
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
