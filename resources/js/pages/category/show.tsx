import { useCallback, useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import { Play, SlidersHorizontal } from 'lucide-react';
import OptimizedImage, { getAvifUrl } from '@/components/optimized-image';
import ProductCard from '@/components/product-card';
import SeoHead from '@/components/seo-head';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PublicLayout from '@/layouts/public-layout';
import type { Brand, Category, Division, Product, SeoData } from '@/types/models';
import division from '@/routes/division';

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

    const heroImg = category.hero_image || category.image;
    const heroAvifUrl = heroImg ? getAvifUrl(`/storage/${heroImg}`) : null;

    return (
        <PublicLayout>
            <SeoHead {...seo} />
            {heroAvifUrl && (
                <Head>
                    <link rel="preload" href={heroAvifUrl} as="image" type="image/avif" />
                </Head>
            )}
            <HeroSection category={category} division={division} />
            <section className="bg-black py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <BrandFilter
                        brands={brands}
                        selected={selectedBrand}
                        onChange={setSelectedBrand}
                    />
                    {loading ? (
                        <div className="py-12 text-center text-white">
                            Chargement des produits…
                        </div>
                    ) : products.length === 0 ? (
                        <div className="py-12 text-center text-white">
                            Aucun produit trouvé.
                        </div>
                    ) : (
                        <div className="mx-auto grid w-[75%] grid-cols-1 gap-6 sm:w-full sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
                            {products.map((product, index) => (
                                <div
                                    key={product.id}
                                    className="entrance-fade-up opacity-0"
                                    style={{ animationDelay: `${index * 60}ms` }}
                                >
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Video section */}
            {category.video_cover && category.video_url && (
                <section className="bg-black">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 entrance-fade-up">
                        <a
                            href={category.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative block w-full overflow-hidden"
                            style={{ aspectRatio: '16 / 7' }}
                        >
                            <OptimizedImage
                                src={`/storage/${category.video_cover}`}
                                alt={`Vidéo ${category.name}`}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes="100vw"
                            />
                            <div className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/40" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 shadow-lg transition-transform group-hover:scale-110 md:h-20 md:w-20">
                                    <Play className="size-7 fill-current/20 md:size-9" />
                                </div>
                            </div>
                        </a>
                    </div>
                </section>
            )}
        </PublicLayout>
    );
}

function HeroSection({ category, division }: { category: Category; division: Division }) {
    const heroImg = category.hero_image || category.image;
    const bgImage = heroImg ? `/storage/${heroImg}` : '';

    return (
        <section className="relative flex min-h-[35vh] sm:min-h-[50vh] items-center justify-center overflow-hidden bg-black">
            {bgImage && (
                <div className="absolute inset-0">
                    <OptimizedImage
                        src={bgImage}
                        alt={category.name}
                        loading="eager"
                        fetchPriority="high"
                        className="h-full w-full object-cover object-top"
                        sizes="100vw"
                    />
                </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
            <div className="relative z-10 mx-auto max-w-4xl px-4 text-center text-white entrance-fade-up">
                <h2 className="text-l font-bold leading-tight md:text-2xl">
                    {division.name}
                </h2>
                <h1 className="text-2xl py-8 font-bold leading-tight md:text-6xl glow-text"
                    style={ {fontFamily:"'manrope', sans-serif", fontWeight:'bold'}}
                >
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
            <Select value={selected || '__all__'} onValueChange={(v) => onChange(v === '__all__' ? '' : v)}>
                <SelectTrigger className="w-auto min-w-[180px] gap-0 rounded-2xl border border-white/20 bg-[#1a1a1a] py-2 pl-3 pr-4 text-sm text-white [&>svg]:text-white data-[state=open]:rounded-b-none data-[state=open]:border-b-0" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 'bold' }}>
                    <SlidersHorizontal className="mr-2 size-4 shrink-0 text-white" />
                    <span className="mr-3 h-4 w-px shrink-0 bg-white/40" />
                    <SelectValue placeholder="Filtre par marque" />
                </SelectTrigger>
                <SelectContent className="w-[var(--radix-select-trigger-width)] rounded-2xl rounded-t-none border border-t-0 border-white/20 bg-[#1a1a1a] text-white data-[side=bottom]:translate-y-0" sideOffset={0} align="end">
                    <SelectItem value="__all__" className="focus:bg-white focus:text-black">Toutes les marques</SelectItem>
                    {brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.slug} className="focus:bg-white focus:text-black">
                            {brand.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}


