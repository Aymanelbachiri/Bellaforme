import { Head } from '@inertiajs/react';
import { Download, FileText } from 'lucide-react';
import OptimizedImage from '@/components/optimized-image';
import SeoHead from '@/components/seo-head';
import PublicLayout from '@/layouts/public-layout';
import type { Product, SeoData } from '@/types/models';

interface NosCataloguesProps {
    products: Product[];
    seo: SeoData;
}

export default function NosCatalogues({ products, seo }: NosCataloguesProps) {
    return (
        <PublicLayout>
            <SeoHead {...seo} />
            <Head title="Nos Catalogues" />

            {/* Hero */}
            <section
                className="relative bg-black py-16"
                style={{ backgroundImage: "url('/images/Black-shape-bg.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <h1
                        className="mb-4 text-4xl font-bold text-white glow-text md:text-6xl"
                        style={{ fontFamily: "'Manrope', sans-serif" }}
                    >
                        Nos Catalogues
                    </h1>
                    <p className="max-w-2xl text-md leading-relaxed text-white font-myriad">
                        Consultez et téléchargez nos catalogues produits pour découvrir notre gamme complète d'équipements.
                    </p>
                </div>
            </section>

            {/* Catalogues Grid */}
            <section className="bg-black py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {products.length === 0 ? (
                        <p className="text-center text-gray-400">Aucun catalogue disponible pour le moment.</p>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className="group overflow-hidden rounded-2xl bg-[#1a1a1a] transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                                >
                                    {/* Image */}
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        {product.featured_image ? (
                                            <OptimizedImage
                                                src={`/storage/${product.featured_image}`}
                                                alt={product.name}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gray-800">
                                                <FileText className="size-12 text-gray-600" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        <h3 className="mb-1 text-sm font-bold text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                            {product.name}
                                        </h3>
                                        {product.brand && (
                                            <p className="mb-2 text-xs text-gray-400">{product.brand.name}</p>
                                        )}
                                        {product.short_description && (
                                            <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-gray-300 font-myriad">
                                                {product.short_description}
                                            </p>
                                        )}
                                        <a
                                            href={`/storage/${product.brochure_file}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-xs font-semibold text-black transition-colors glow-btn hover:bg-[#d5ab70] hover:text-white"
                                            style={{ fontFamily: "'Poppins', sans-serif" }}
                                        >
                                            <Download className="size-3.5" />
                                            Télécharger
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
