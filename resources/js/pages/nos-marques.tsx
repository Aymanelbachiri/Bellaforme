import { Head } from '@inertiajs/react';
import SeoHead from '@/components/seo-head';
import PublicLayout from '@/layouts/public-layout';
import type { Brand, Division, SeoData } from '@/types/models';

interface DivisionWithBrands extends Division {
    brands: Brand[];
}

interface NosMarquesProps {
    divisions: DivisionWithBrands[];
    seo: SeoData;
}

export default function NosMarques({ divisions, seo }: NosMarquesProps) {
    return (
        <PublicLayout>
            <SeoHead {...seo} />
            <Head title="Nos Marques" />

            {/* Hero */}
            <section
                className="relative bg-black py-16"
                style={{ backgroundImage: "url('/images/Black-shape-bg.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
                <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                    <h1
                        className="text-4xl font-bold text-white glow-text md:text-6xl"
                        style={{ fontFamily: "'Manrope', sans-serif" }}
                    >
                        Nos Marques
                    </h1>
                </div>
            </section>

            {/* Brands by Division */}
            <section className="bg-black py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {divisions.length === 0 ? (
                        <p className="text-center text-gray-400">Aucune marque pour le moment.</p>
                    ) : (
                        <div className="space-y-20">
                            {divisions.map((division) => (
                                <div key={division.id} className="flex flex-wrap items-center justify-center gap-8 [&>div]:w-[calc(33.333%-1.5rem)] sm:[&>div]:w-[calc(16.666%-1.5rem)]">
                                    {division.brands.map((brand) => (
                                        <div key={brand.id} className="flex items-center justify-center">
                                            {brand.logo ? (
                                                <img
                                                    src={`/storage/${brand.logo}`}
                                                    alt={brand.name}
                                                    className="h-20 max-w-[200px] object-contain sm:h-28"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <span className="text-sm font-medium text-gray-400">{brand.name}</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
