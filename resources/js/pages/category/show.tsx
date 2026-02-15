import { useCallback, useEffect, useState } from 'react';
import OptimizedImage from '@/components/optimized-image';
import ProductCard from '@/components/product-card';
import SeoHead from '@/components/seo-head';
import PublicLayout from '@/layouts/public-layout';
import type { Brand, Category, Division, Product, SeoData } from '@/types/models';

interface CategoryShowProps {
    division: Division;
    category: Category;
    brands: Brand[];
    seo: SeoData;
}

export default function CategoryShow({ division, category, brands, seo }: CategoryShowProps) {
    const [selectedBrand, setSelectedBrand] = useState<string>('');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ category: category.slug });
            if (selectedBrand) {
                params.set('brand', selectedBrand);
            }
            const response = await fetch(`/api/products?${params.toString()}`);
            if (response.ok) {
                const data = await response.json();
                setProducts(data);
            }
        } catch {
            // Network error — leave products empty
        } finally {
            setLoading(false);
        }
    }, [category.slug, selectedBrand]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return (
        <PublicLayout>
            <SeoHead {...seo} />
            <HeroSection category={category} />
            <section className="bg-black py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <BrandFilter
                        brands={brands}
                        selected={selectedBrand}
                        onChange={setSelectedBrand}
                    />
                    {loading ? (
                        <div className="py-12 text-center text-gray-500">
                            Chargement des produits…
                        </div>
                    ) : products.length === 0 ? (
                        <div className="py-12 text-center text-gray-500">
                            Aucun produit trouvé.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}

function HeroSection({ category }: { category: Category }) {
    const bgImage = category.image ? `/storage/${category.image}` : '';

    return (
        <section className="relative flex min-h-[40vh] items-center justify-center overflow-hidden bg-black">
            {bgImage && (
                <div className="absolute inset-0">
                    <OptimizedImage
                        src={bgImage}
                        alt={category.name}
                        loading="eager"
                        className="h-full w-full object-cover opacity-60"
                        sizes="100vw"
                    />
                </div>
            )}
            <div className="relative z-10 mx-auto max-w-4xl px-4 text-center text-white">
                <h1 className="text-4xl font-bold leading-tight md:text-5xl">
                    {category.name}
                </h1>
            </div>
        </section>
    );
}

interface BrandFilterProps {
    brands: Brand[];
    selected: string;
    onChange: (brandSlug: string) => void;
}

function BrandFilter({ brands, selected, onChange }: BrandFilterProps) {
    if (brands.length === 0) return null;

    return (
        <div className="mb-10 flex items-center justify-end gap-3">
            <label htmlFor="brand-filter" className="text-sm font-medium text-gray-300">
                Filtrer par marque
            </label>
            <select
                id="brand-filter"
                value={selected}
                onChange={(e) => onChange(e.target.value)}
                className="rounded-lg border border-gray-700 bg-black px-4 py-2 text-sm text-gray-200 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
                <option value="">Toutes les marques</option>
                {brands.map((brand) => (
                    <option key={brand.id} value={brand.slug}>
                        {brand.name}
                    </option>
                ))}
            </select>
        </div>
    );
}


