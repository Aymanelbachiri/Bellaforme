import { Head, Link } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import OptimizedImage, { getAvifUrl } from '@/components/optimized-image';
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
    const heroImageUrl = division.hero_image ? `/storage/${division.hero_image}` : null;
    const heroAvifUrl = heroImageUrl ? getAvifUrl(heroImageUrl) : null;
    const aboveFoldCategoryImages = categories
        .filter((c) => c.image)
        .slice(0, 4)
        .map((c) => getAvifUrl(`/storage/${c.image}`));

    return (
        <PublicLayout>
            <SeoHead {...seo} />
            <Head>
                {heroAvifUrl && (
                    <link rel="preload" href={heroAvifUrl} as="image" type="image/avif" />
                )}
                {aboveFoldCategoryImages.map((url) => (
                    <link key={url} rel="preload" href={url} as="image" type="image/avif" />
                ))}
            </Head>
            <HeroSection division={division} />
            <CategoryGrid categories={categories} divisionSlug={division.slug} />
            {referenceBrands.length > 0 && (
                <BrandCarousel title="Nos références" brands={referenceBrands} />
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
                        fetchPriority="high"
                        className="h-full w-full object-cover opacity-70"
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black" />
                </div>
            )}
            <div className="relative z-10 mx-auto max-w-5xl px-4 text-center text-white entrance-fade-up">
                {division.hero_title && (
                    <h1 className="mb-4 text-3xl font-bold leading-tight sm:text-4xl md:text-7xl glow-text"
                        style={ {fontFamily:"'Manrope', sans-serif", fontWeight:'bold'}}
                    >
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
                <h2 className="mb-10 text-center text-3xl font-bold text-white entrance-fade-up"
                    style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 'bold' }}
                >
                    Découvrez l'univers de nos produits
                </h2>
                <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
                    {categories.map((category, index) => (
                        <CategoryCard
                            key={category.id}
                            category={category}
                            divisionSlug={divisionSlug}
                            style={{ animationDelay: `${index * 80}ms` }}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function CategoryCard({ category, divisionSlug, style }: { category: Category; divisionSlug: string; style?: React.CSSProperties }) {
    return (
        <div
            className="group relative overflow-hidden shadow-sm transition-shadow hover:shadow-md entrance-fade-up opacity-0"
            style={style}
        >
            <div className="relative aspect-[3/4]">
                {category.image ? (
                    <OptimizedImage
                        src={`/storage/${category.image}`}
                        alt={category.name}
                        loading="eager"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-900 text-white">
                        {category.name}
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                    <h3 className="mb-3 text-xs font-semibold text-white font-poppins sm:mb-5 sm:text-sm">
                        {category.name}
                    </h3>
                    <Link
                        href={`/${divisionSlug}/category/${category.slug}`}
                        className="inline-block rounded-full bg-white px-3 py-1 text-[10px] font-bold text-black transition-colors glow-btn hover:bg-[#d5ab70] hover:text-white font-poppins sm:px-4 sm:py-1.5 sm:text-xs"
                    >
                        Explorer &gt;
                    </Link>
                </div>
            </div>
        </div>
    );
}

function BrandCarousel({ title, brands }: { title: string; brands: Brand[] }) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const pausedRef = useRef(false);

    // Infinite auto-scroll, pauses on hover, resumes on mouse leave
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        let animId: number;
        let lastTime = 0;
        let accumulated = 0;
        const pxPerSecond = 60;

        const step = (time: number) => {
            if (lastTime) {
                const delta = time - lastTime;
                if (!pausedRef.current && el) {
                    accumulated += (pxPerSecond * delta) / 1000;
                    if (accumulated >= 1) {
                        const px = Math.floor(accumulated);
                        el.scrollLeft += px;
                        accumulated -= px;
                        if (el.scrollLeft >= el.scrollWidth / 2) {
                            el.scrollLeft = 0;
                        }
                    }
                }
            }
            lastTime = time;
            animId = requestAnimationFrame(step);
        };
        animId = requestAnimationFrame(step);
        return () => cancelAnimationFrame(animId);
    }, []);

    // Duplicate so user can scroll far in both directions
    const items = [...brands, ...brands, ...brands, ...brands];

    return (
        <section className="bg-black py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h2 className="mb-10 text-center text-xl font-poppins font-black text-white uppercase sm:mb-20 sm:text-2xl">{title}</h2>
            </div>
            <div className="bg-[#1a1a1a]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="brand-marquee-wrapper overflow-hidden">
                        <div
                            ref={scrollRef}
                            className="scrollbar-hide flex gap-2 overflow-x-auto py-8"
                            onMouseEnter={() => { pausedRef.current = true; }}
                            onMouseLeave={() => { pausedRef.current = false; }}
                        >
                            {items.map((brand, i) => (
                                <div
                                    key={`${brand.id}-${i}`}
                                    className="flex shrink-0 items-center justify-center min-w-[120px] sm:min-w-[180px]"
                                    style={{ height: '130px' }}
                                >
                                    {brand.logo ? (
                                        <img
                                            src={`/storage/${brand.logo}`}
                                            alt={brand.name}
                                            loading="eager"
                                            decoding="async"
                                            className="max-h-28 max-w-[260px] object-contain"
                                        />
                                    ) : (
                                        <span className="text-sm font-medium text-gray-400">{brand.name}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
