import { Link } from '@inertiajs/react';
import OptimizedImage from '@/components/optimized-image';
import SeoHead from '@/components/seo-head';
import PublicLayout from '@/layouts/public-layout';
import type { Brand, Category, Division, SeoData } from '@/types/models';

interface DivisionShowProps {
    division: Division;
    categories: Category[];
    referenceBrands: Brand[];
    partnerBrands: Brand[];
    seo: SeoData;
}

export default function DivisionShow({
    division,
    categories,
    referenceBrands,
    partnerBrands,
    seo,
}: DivisionShowProps) {
    return (
        <PublicLayout>
            <SeoHead {...seo} />
            <HeroSection division={division} />
            <CategoryGrid categories={categories} divisionSlug={division.slug} />
            {referenceBrands.length > 0 && (
                <BrandCarousel title="Nos Références" brands={referenceBrands} />
            )}
            {partnerBrands.length > 0 && (
                <BrandCarousel title="Nos Marques Partenaires" brands={partnerBrands} />
            )}
        </PublicLayout>
    );
}

function HeroSection({ division }: { division: Division }) {
    const bgImage = division.hero_image ? `/storage/${division.hero_image}` : '';

    return (
        <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden bg-black">
            {bgImage && (
                <div className="absolute inset-0">
                    <OptimizedImage
                        src={bgImage}
                        alt={division.name}
                        loading="eager"
                        className="h-full w-full object-cover opacity-60"
                        sizes="100vw"
                    />
                </div>
            )}
            <div className="relative z-10 mx-auto max-w-4xl px-4 text-center text-white">
                {division.hero_title && (
                    <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl">
                        {division.hero_title}
                    </h1>
                )}
                {division.hero_subtitle && (
                    <p className="mx-auto max-w-2xl text-lg text-gray-200 md:text-xl">
                        {division.hero_subtitle}
                    </p>
                )}
            </div>
        </section>
    );
}

function CategoryGrid({ categories, divisionSlug }: { categories: Category[]; divisionSlug: string }) {
    if (categories.length === 0) return null;

    return (
        <section className="bg-black py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h2 className="mb-10 text-center text-3xl font-bold text-white">
                    Découvrez l'univers de nos produits
                </h2>
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.map((category) => (
                        <CategoryCard
                            key={category.id}
                            category={category}
                            divisionSlug={divisionSlug}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function CategoryCard({ category, divisionSlug }: { category: Category; divisionSlug: string }) {
    return (
        <div className="group overflow-hidden rounded-xl border bg-black shadow-sm transition-shadow hover:shadow-md">
            <div className="aspect-[4/3] overflow-hidden">
                {category.image ? (
                    <OptimizedImage
                        src={`/storage/${category.image}`}
                        alt={category.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-800 text-gray-500">
                        {category.name}
                    </div>
                )}
            </div>
            <div className="p-5 text-center">
                <h3 className="mb-4 text-lg font-semibold text-white">{category.name}</h3>
                <Link
                    href={`/${divisionSlug}/category/${category.slug}`}
                    className="inline-block rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black transition-colors glow-btn hover:bg-white/80"
                >
                    Explorer
                </Link>
            </div>
        </div>
    );
}

function BrandCarousel({ title, brands }: { title: string; brands: Brand[] }) {
    // Duplicate the list so the marquee can loop seamlessly
    const items = [...brands, ...brands];

    return (
        <section className="bg-black py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h2 className="mb-8 text-center text-2xl font-bold text-white">{title}</h2>
                <div className="brand-marquee-wrapper overflow-hidden py-8">
                    <div className="brand-marquee flex gap-2">
                        {items.map((brand, i) => (
                            <div
                                key={`${brand.id}-${i}`}
                                className="flex shrink-0 items-center justify-center"
                                style={{ minWidth: '180px', height: '130px' }}
                            >
                                {brand.logo ? (
                                    <img
                                        src={`/storage/${brand.logo}`}
                                        alt={brand.name}
                                        className="max-h-28 max-w-[260px] object-contain"
                                        loading="lazy"
                                    />
                                ) : (
                                    <span className="text-sm font-medium text-gray-400">{brand.name}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
