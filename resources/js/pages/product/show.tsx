import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Phone } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import JsonLdProduct from '@/components/json-ld-product';
import OptimizedImage from '@/components/optimized-image';
import PdfViewer from '@/components/pdf-viewer';
import SeoHead from '@/components/seo-head';
import PublicLayout from '@/layouts/public-layout';
import type { Product, ProductImage, SeoData } from '@/types/models';

interface Props {
    product: Product;
    seo: SeoData;
}

export default function ProductShow({ product, seo }: Props) {
    const [pdfOpen, setPdfOpen] = useState(false);
    const brochureUrl = product.brochure_file ? `/storage/${product.brochure_file}` : '';

    return (
        <PublicLayout>
            <SeoHead {...seo} />
            <JsonLdProduct product={product} />

            <div className="">
                <div className="mx-auto max-w-7xl px-0 mt-4 sm:mt-10 sm:px-6 lg:px-8">
                    {/* Breadcrumbs */}
                    <nav className="mb-4 flex flex-wrap text-xs text-white/70 sm:text-sm sm:text-white">
                        <Link href="/" className="hover:text-[#d5ab70]">Accueil</Link>
                        {product.category?.division && (
                            <>
                                <span className="mx-1.5 sm:mx-2">&gt;</span>
                                <Link href={`/${product.category.division.slug}`} className="hover:text-[#d5ab70]">
                                    {product.category.division.name}
                                </Link>
                            </>
                        )}
                        {product.category && (
                            <>
                                <span className="mx-1.5 sm:mx-2">&gt;</span>
                                <Link
                                    href={`/${product.category.division?.slug}/category/${product.category.slug}`}
                                    className="hover:text-[#d5ab70]"
                                >
                                    {product.category.name}
                                </Link>
                            </>
                        )}
                        <span className="mx-1.5 sm:mx-2">&gt;</span>
                        <span className="text-white">{product.name}</span>
                    </nav>
                    <div className="grid overflow-hidden bg-[#1a1a1a] gap-4 sm:gap-10 lg:grid-cols-2">
                        <FeaturedImage
                            featuredImage={product.featured_image}
                            productName={product.name}
                        />
                        <div className="flex min-w-0 flex-col px-4 gap-4 sm:gap-6 sm:px-6 sm:pt-4 lg:px-0">
                            <h1 className="text-xl font-regular text-white sm:text-3xl" style={{ fontFamily: "'roboto', sans-serif" }}>
                                {product.name}
                            </h1>
                            {product.description && (
                                <ExpandableDescription html={product.description} />
                            )}

                            {/* Phone + Devis */}
                            <div className="mt-auto flex w-full min-w-0 items-center rounded-full bg-black p-1 sm:w-fit sm:gap-4">
                                <a
                                    href="tel:+212522258481"
                                    className="flex min-w-0 items-center gap-1.5 whitespace-nowrap px-3 py-3 font-myriad font-bold text-white sm:gap-2 sm:px-5"
                                    style={{ fontSize: 'clamp(11px, 3vw, 14px)' }}
                                >
                                    <Phone className="size-4 shrink-0" />
                                    +212 522 258 481
                                </a>
                                <Link
                                    href={`/contact?product_id=${product.id}`}
                                    className="ml-auto inline-flex shrink-0 items-center whitespace-nowrap rounded-full bg-white px-4 py-3 font-myriad font-bold text-black transition-colors hover:bg-[#d5ab70] hover:text-white sm:px-6"
                                    style={{ fontSize: 'clamp(11px, 3vw, 14px)' }}
                                >
                                    Demander un devis
                                </Link>
                            </div>

                            {/* Specs + Brochure links */}
                            <div className="flex items-center justify-center pb-6 sm:justify-start sm:pb-14">
                                <button
                                    type="button"
                                    onClick={() => {
                                        document.getElementById('specs')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="min-h-[44px] whitespace-nowrap font-bold uppercase text-white transition-opacity hover:opacity-70 sm:tracking-wider sm:text-sm"
                                    style={{ fontFamily: "'Poppins', sans-serif", fontSize: 'clamp(10px, 2.6vw, 14px)' }}
                                >
                                    Caractéristiques Techniques
                                </button>
                                {brochureUrl && (
                                    <>
                                        <span className="mx-2 h-6 w-px bg-white sm:mx-6" />
                                        <button
                                            type="button"
                                            onClick={() => setPdfOpen(true)}
                                            className="min-h-[44px] whitespace-nowrap font-bold uppercase text-white transition-opacity hover:opacity-70 sm:tracking-wider sm:text-sm"
                                            style={{ fontFamily: "'Poppins', sans-serif", fontSize: 'clamp(10px, 2.6vw, 14px)' }}
                                        >
                                            Catalogue / Brochure
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {(product.images ?? []).length > 0 && (
                    <ImageCarousel images={product.images!} productName={product.name} />
                )}

                {(product.specifications ?? []).length > 0 && (
                    <div id="specs" className="mt-8 scroll-mt-8 sm:mt-12">
                        <SpecsTable specifications={product.specifications!} />
                    </div>
                )}

                {product.video_url && <VideoPlayer url={product.video_url} />}
            </div>

            {brochureUrl && (
                <PdfViewer
                    open={pdfOpen}
                    onClose={() => setPdfOpen(false)}
                    url={brochureUrl}
                    title={`Catalogue ${product.name}`}
                />
            )}
        </PublicLayout>
    );
}

/* ------------------------------------------------------------------ */
/*  Featured Image                                                     */
/* ------------------------------------------------------------------ */

function FeaturedImage({ featuredImage, productName }: {
    featuredImage: string;
    productName: string;
}) {
    return (
        <div className="relative overflow-hidden bg-white">
            <OptimizedImage
                src={`/storage/${featuredImage}`}
                alt={productName}
                loading="eager"
                className="h-[280px] w-full object-contain sm:h-[400px] lg:h-[500px]"
                sizes="(max-width: 1024px) 100vw, 50vw"
            />
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Image Carousel                                                     */
/* ------------------------------------------------------------------ */

function ImageCarousel({ images, productName }: { images: ProductImage[]; productName: string }) {
    const total = images.length;

    // Responsive viewport detection
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const mql = window.matchMedia('(max-width: 639px)');
        const onChange = (e: MediaQueryListEvent | MediaQueryList) => setIsMobile(e.matches);
        onChange(mql);
        mql.addEventListener('change', onChange);
        return () => mql.removeEventListener('change', onChange);
    }, []);

    const cloneCount = isMobile ? 1 : 3;
    const cloneBefore = images.slice(-cloneCount);
    const cloneAfter = images.slice(0, cloneCount);
    const allSlides = [...cloneBefore, ...images, ...cloneAfter];

    const [index, setIndex] = useState(cloneCount); // start at first real slide
    const [isTransitioning, setIsTransitioning] = useState(true);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Reset index when cloneCount changes (viewport switch)
    const prevCloneCountRef = useRef(cloneCount);
    useEffect(() => {
        if (prevCloneCountRef.current !== cloneCount) {
            setIsTransitioning(false);
            setIndex(cloneCount);
            prevCloneCountRef.current = cloneCount;
        }
    }, [cloneCount]);

    const slideTo = useCallback((i: number) => {
        setIsTransitioning(true);
        setIndex(i);
    }, []);

    // Auto-advance
    useEffect(() => {
        timeoutRef.current = setTimeout(() => slideTo(index + 1), 4000);
        return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
    }, [index, slideTo]);

    // When transition ends on a clone, jump instantly to the real slide
    const handleTransitionEnd = () => {
        if (index >= total + cloneCount) {
            setIsTransitioning(false);
            setIndex(cloneCount);
        } else if (index < cloneCount) {
            setIsTransitioning(false);
            setIndex(total + cloneCount - 1);
        }
    };

    const slideWidth = isMobile ? '100%' : '33.333%';
    const gapOffset = isMobile ? '0rem' : '0.25rem';

    const trackStyle: React.CSSProperties = {
        transform: `translateX(calc(-${index} * (${slideWidth} + ${gapOffset})))`,
        transition: isTransitioning ? 'transform 600ms cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none',
    };

    return (
        <section className="relative mt-1 overflow-hidden">
            <button
                type="button"
                aria-label="Image précédente"
                onClick={() => slideTo(index - 1)}
                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 min-w-[44px] min-h-[44px] p-2"
            >
                <ChevronLeft className="size-8 text-white" strokeWidth={3} />
            </button>
            <button
                type="button"
                aria-label="Image suivante"
                onClick={() => slideTo(index + 1)}
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 min-w-[44px] min-h-[44px] p-2"
            >
                <ChevronRight className="size-8 text-white" strokeWidth={3} />
            </button>
            <div
                className={isMobile ? 'flex' : 'flex gap-1'}
                style={trackStyle}
                onTransitionEnd={handleTransitionEnd}
            >
                {allSlides.map((img, i) => (
                    <div key={`slide-${i}`} className={`${isMobile ? 'w-full' : 'w-1/3'} flex-shrink-0`}>
                        <div className="aspect-square overflow-hidden bg-black sm:aspect-[3/4]">
                            <OptimizedImage
                                src={`/storage/${img.image_path}`}
                                alt={`${productName} - ${((i - cloneCount + total) % total) + 1}`}
                                className="h-full w-full object-cover"
                                sizes={isMobile ? '100vw' : '(max-width: 1024px) 50vw, 33vw'}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/*  Video Player                                                       */
/* ------------------------------------------------------------------ */

function getEmbedUrl(url: string): string | null {
    const ytMatch = url.match(
        /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    );
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

    return null;
}

function VideoPlayer({ url }: { url: string }) {
    const embedUrl = getEmbedUrl(url);
    if (!embedUrl) return null;

    return (
        <section className="mt-8 w-full sm:mt-12 sm:w-3/4 sm:mx-auto">
            <div className="relative overflow-hidden border border-gray-700" style={{ paddingBottom: '56.25%' }}>
                <iframe
                    src={embedUrl}
                    title="Product video"
                    className="absolute inset-0 h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/*  Specs Table                                                        */
/* ------------------------------------------------------------------ */

function SpecsTable({ specifications }: { specifications: Array<{ label: string; value: string }> }) {
    if (specifications.length === 0) {
        return <p className="text-sm text-gray-500">Aucune caractéristique technique disponible.</p>;
    }

    return (
        <div className="overflow-hidden" id='specs'>
            <h2
                className="px-4 py-4 text-center text-lg font-black uppercase text-white sm:px-6 sm:py-5 sm:text-2xl"
                style={{ fontFamily: "'Poppins', sans-serif" }}
            >
                Caractéristiques Techniques
            </h2>
            <div className="divide-y-4 divide-black bg-[#1a1a1a] font-roboto">
                {specifications.map((spec, idx) => (
                    <div key={idx} className="flex">
                        <div className="w-2/5 sm:w-1/3 px-3 py-3 text-sm text-white sm:px-6 sm:py-4 sm:text-base">
                            {spec.label}
                        </div>
                        <div className="flex-1 px-3 py-3 text-xs text-white sm:px-6 sm:py-4 sm:text-sm">
                            {spec.value}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ExpandableDescription({ html }: { html: string }) {
    const [expanded, setExpanded] = useState(false);
    const [needsExpand, setNeedsExpand] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) {
            setNeedsExpand(ref.current.scrollHeight > 160);
        }
    }, [html]);

    return (
        <div className="relative">
            <div
                ref={ref}
                className={`prose prose-invert prose-sm sm:prose-base max-w-none text-white overflow-hidden break-words transition-all duration-300 ${!expanded && needsExpand ? 'max-h-40' : ''}`}
                dangerouslySetInnerHTML={{ __html: html }}
            />
            {needsExpand && !expanded && (
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-center bg-gradient-to-t from-[#1a1a1a] to-transparent pt-10 pb-1">
                    <button
                        type="button"
                        onClick={() => setExpanded(true)}
                        className="text-sm font-semibold text-[#d5ab70] hover:underline"
                    >
                        Lire plus
                    </button>
                </div>
            )}
            {needsExpand && expanded && (
                <button
                    type="button"
                    onClick={() => setExpanded(false)}
                    className="mt-2 text-sm font-semibold text-[#d5ab70] hover:underline"
                >
                    Lire moins
                </button>
            )}
        </div>
    );
}
