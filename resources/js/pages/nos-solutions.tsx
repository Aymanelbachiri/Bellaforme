import { Head } from '@inertiajs/react';
import { Download } from 'lucide-react';
import { useState } from 'react';
import OptimizedImage, { getAvifUrl } from '@/components/optimized-image';
import PdfViewer from '@/components/pdf-viewer';
import SeoHead from '@/components/seo-head';
import PublicLayout from '@/layouts/public-layout';
import type { SeoData, SolutionsSection, SolutionsSettings } from '@/types/models';

interface NosSolutionsProps {
    settings: SolutionsSettings | null;
    seo: SeoData;
}

export default function NosSolutions({ settings, seo }: NosSolutionsProps) {
    const sections = settings?.sections ?? [];
    const [pdfOpen, setPdfOpen] = useState<{ url: string; title: string } | null>(null);

    const heroImageUrl = settings?.hero_image ? `/storage/${settings.hero_image}` : null;
    const heroAvifUrl = heroImageUrl ? getAvifUrl(heroImageUrl) : null;

    return (
        <PublicLayout>
            <SeoHead {...seo} />
            {heroAvifUrl && (
                <Head>
                    <link rel="preload" href={heroAvifUrl} as="image" type="image/avif" />
                </Head>
            )}

            {/* Hero */}
            <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden bg-black">
                {heroImageUrl ? (
                    <div className="absolute inset-0">
                        <OptimizedImage
                            src={heroImageUrl}
                            alt="Nos Solutions"
                            loading="eager"
                            fetchPriority="high"
                            className="h-full w-full object-cover opacity-70"
                            sizes="100vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black" />
                    </div>
                ) : (
                    <div
                        className="absolute inset-0"
                        style={{ backgroundImage: "url('/images/Black-shape-bg.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
                    />
                )}
                <div className="relative z-10 mx-auto max-w-5xl px-4 text-center text-white entrance-fade-up">
                    <h1
                        className="mb-4 text-3xl font-bold leading-tight sm:text-4xl md:text-7xl glow-text"
                        style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 'bold' }}
                    >
                        {settings?.hero_title || 'Nos Solutions à vos Projets'}
                    </h1>
                    {settings?.hero_subtitle && (
                        <p className="mx-auto max-w-2xl text-lg text-gray-200 md:text-xl">
                            {settings.hero_subtitle}
                        </p>
                    )}
                </div>
            </section>

            {/* Catalogue Grid */}
            <section className="bg-black py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {sections.length > 0 ? (
                        <div className="mx-auto grid w-[75%] grid-cols-1 gap-6 sm:w-full sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
                            {sections.map((section, index) => (
                                <div
                                    key={index}
                                    className="entrance-fade-up opacity-0"
                                    style={{ animationDelay: `${index * 60}ms` }}
                                >
                                    <SolutionCard section={section} onOpenPdf={(url, title) => setPdfOpen({ url, title })} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-400 font-myriad">Contenu bientôt disponible.</p>
                    )}
                </div>
            </section>

            {pdfOpen && (
                <PdfViewer
                    open={true}
                    onClose={() => setPdfOpen(null)}
                    url={pdfOpen.url}
                    title={pdfOpen.title}
                />
            )}
        </PublicLayout>
    );
}

function SolutionCard({ section, onOpenPdf }: { section: SolutionsSection; onOpenPdf: (url: string, title: string) => void }) {
    const imageUrl = section.image ? `/storage/${section.image}` : '';
    const brochureUrl = section.brochure ? `/storage/${section.brochure}` : '';

    return (
        <div className="group relative overflow-hidden border bg-black" style={{ aspectRatio: '210 / 297' }}>
            {/* Folded corner */}
            <div className="absolute right-0 top-0 z-10" style={{ width: '60px', height: '60px' }}>
                <div className="absolute inset-0 bg-white" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }} />
                <div className="absolute inset-0 bg-black" style={{ clipPath: 'polygon(0 0, 0 100%, 100% 100%)' }} />
            </div>

            {/* Background image */}
            {imageUrl ? (
                <OptimizedImage
                    src={imageUrl}
                    alt={section.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 75vw, (max-width: 1024px) 50vw, 25vw"
                />
            ) : (
                <div className="h-full w-full bg-[#1a1a1a]" />
            )}

            {/* Bottom overlay */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent px-2 pb-5 pt-16">
                <h3
                    className="mb-4 text-lg font-bold text-white"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                    {section.title}
                </h3>
                <div className="flex items-center gap-3">
                    {brochureUrl ? (
                        <>
                            <button
                                type="button"
                                onClick={() => onOpenPdf(brochureUrl, section.title)}
                                className="rounded-full glow-btn glow-btn-gold border border-white bg-white px-5 py-2 text-sm font-semibold text-black transition-all hover:text-white hover:bg-[#d5ab70] hover:border-[#d5ab70]"
                            >
                                Voir la brochure
                            </button>
                            <a
                                href={brochureUrl}
                                download={`${section.title}.pdf`}
                                className="flex items-center gap-1.5 text-sm font-medium text-white transition-colors hover:text-white/70"
                            >
                                Télécharger
                                <Download className="size-4" />
                            </a>
                        </>
                    ) : (
                        <span className="text-sm text-white/50">Brochure bientôt disponible</span>
                    )}
                </div>
            </div>
        </div>
    );
}
