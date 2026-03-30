import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import OptimizedImage from '@/components/optimized-image';
import SeoHead from '@/components/seo-head';
import PublicLayout from '@/layouts/public-layout';
import type { SeoData, SolutionsSettings } from '@/types/models';

interface NosSolutionsProps {
    settings: SolutionsSettings | null;
    seo: SeoData;
}

export default function NosSolutions({ settings, seo }: NosSolutionsProps) {
    const sections = settings?.sections ?? [];

    return (
        <PublicLayout>
            <SeoHead {...seo} />
            <Head title="Nos Solutions à vos Projets" />

            {/* Hero */}
            <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden bg-black">
                {settings?.hero_image ? (
                    <div className="absolute inset-0">
                        <OptimizedImage
                            src={`/storage/${settings.hero_image}`}
                            alt="Nos Solutions"
                            loading="eager"
                            fetchPriority="high"
                            className="h-full w-full object-cover opacity-70"
                            sizes="100vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/30 to-black" />
                    </div>
                ) : (
                    <div
                        className="absolute inset-0"
                        style={{ backgroundImage: "url('/images/Black-shape-bg.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
                    />
                )}
                <div className="relative z-10 mx-auto max-w-4xl px-4 text-center text-white entrance-fade-up">
                    <h1
                        className="mb-4 text-3xl font-bold leading-tight sm:text-4xl md:text-6xl glow-text"
                        style={{ fontFamily: "'Manrope', sans-serif" }}
                    >
                        {settings?.hero_title || 'Nos Solutions à vos Projets'}
                    </h1>
                    {(settings?.hero_subtitle) && (
                        <p className="mx-auto max-w-2xl text-md leading-relaxed text-white font-myriad sm:text-lg">
                            {settings.hero_subtitle}
                        </p>
                    )}
                </div>
            </section>

            {/* Sections */}
            {sections.length > 0 ? (
                <section className="bg-black">
                    {sections.map((section, index) => (
                        <div
                            key={index}
                            className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} min-h-[50vh]`}
                        >
                            {/* Image */}
                            {section.image && (
                                <div className="relative w-full lg:w-1/2">
                                    <OptimizedImage
                                        src={`/storage/${section.image}`}
                                        alt={section.title}
                                        className="h-full min-h-[300px] w-full object-cover"
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                    />
                                    <div className={`absolute inset-0 ${index % 2 === 1 ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-black/30 to-transparent lg:block hidden`} />
                                </div>
                            )}

                            {/* Content */}
                            <div className={`flex w-full items-center ${section.image ? 'lg:w-1/2' : ''} bg-[#1a1a1a]`}>
                                <div className="mx-auto max-w-xl px-6 py-12 sm:px-10 lg:py-16">
                                    <h2
                                        className="mb-6 text-2xl font-black uppercase text-white md:text-3xl"
                                        style={{ fontFamily: "'Poppins', sans-serif" }}
                                    >
                                        {section.title}
                                    </h2>
                                    {section.description && (
                                        <div
                                            className="text-md leading-relaxed text-gray-300 font-myriad whitespace-pre-line"
                                        >
                                            {section.description}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </section>
            ) : (
                <section className="bg-black py-20">
                    <div className="mx-auto max-w-4xl px-4 text-center">
                        <p className="text-gray-400 font-myriad">Contenu bientôt disponible.</p>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="bg-[#1a1a1a] py-16">
                <div className="mx-auto max-w-3xl px-4 text-center">
                    <h2
                        className="mb-4 text-2xl font-black uppercase text-white md:text-3xl"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                        Vous avez un projet ?
                    </h2>
                    <p className="mb-8 text-sm text-gray-300 font-myriad">
                        Nos équipes sont à votre disposition pour vous accompagner dans la réalisation de votre projet.
                    </p>
                    <Link
                        href="/contact"
                        className="glow-btn inline-block rounded-full bg-white px-10 py-3 text-sm font-semibold text-black transition-colors hover:bg-[#d5ab70] hover:text-white"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                        Nous contacter
                    </Link>
                </div>
            </section>
        </PublicLayout>
    );
}
