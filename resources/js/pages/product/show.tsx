import { Link } from '@inertiajs/react';
import { Download } from 'lucide-react';
import { useState } from 'react';

import JsonLdProduct from '@/components/json-ld-product';
import OptimizedImage from '@/components/optimized-image';
import SeoHead from '@/components/seo-head';
import PublicLayout from '@/layouts/public-layout';
import type { Product, ProductImage, SeoData } from '@/types/models';

interface Props {
    product: Product;
    seo: SeoData;
}

export default function ProductShow({ product, seo }: Props) {
    return (
        <PublicLayout>
            <SeoHead {...seo} />
            <JsonLdProduct product={product} />

            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="grid gap-10 lg:grid-cols-2">
                    <ImageGallery
                        featuredImage={product.featured_image}
                        images={product.images ?? []}
                        productName={product.name}
                    />
                    <div className="flex flex-col gap-6">
                        {product.brand && (
                            <span className="text-sm font-medium uppercase tracking-wide text-gray-400">
                                {product.brand.name}
                            </span>
                        )}
                        <h1 className="text-3xl font-bold text-white">{product.name}</h1>
                        <div
                            className="prose prose-invert max-w-none text-gray-300"
                            dangerouslySetInnerHTML={{ __html: product.description ?? '' }}
                        />
                        <Link
                            href={`/contact?product_id=${product.id}`}
                            className="inline-flex w-fit items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-colors glow-btn hover:bg-white/80"
                        >
                            Demander un devis
                        </Link>
                    </div>
                </div>

                {product.video_url && <VideoPlayer url={product.video_url} />}

                <TabbedSections
                    specifications={product.specifications ?? []}
                    brochureFile={product.brochure_file}
                />
            </div>
        </PublicLayout>
    );
}

/* ------------------------------------------------------------------ */
/*  Image Gallery                                                      */
/* ------------------------------------------------------------------ */

interface ImageGalleryProps {
    featuredImage: string;
    images: ProductImage[];
    productName: string;
}

function ImageGallery({ featuredImage, images, productName }: ImageGalleryProps) {
    const allImages = [
        { id: 0, image_path: featuredImage },
        ...images.map((img) => ({ id: img.id, image_path: img.image_path })),
    ];
    const [selectedIndex, setSelectedIndex] = useState(0);
    const selected = allImages[selectedIndex];

    return (
        <div className="flex flex-col gap-4">
            <div className="overflow-hidden rounded-xl border border-gray-700 bg-black">
                <OptimizedImage
                    src={`/storage/${selected.image_path}`}
                    alt={productName}
                    loading="eager"
                    className="h-[400px] w-full object-contain sm:h-[500px]"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                />
            </div>
            {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {allImages.map((img, idx) => (
                        <button
                            key={img.id}
                            type="button"
                            onClick={() => setSelectedIndex(idx)}
                            className={`shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                                idx === selectedIndex
                                    ? 'border-primary'
                                    : 'border-transparent hover:border-gray-600'
                            }`}
                            aria-label={`View image ${idx + 1}`}
                        >
                            <OptimizedImage
                                src={`/storage/${img.image_path}`}
                                alt={`${productName} - ${idx + 1}`}
                                className="h-16 w-16 object-cover sm:h-20 sm:w-20"
                                sizes="80px"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
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
        <section className="mt-12">
            <h2 className="mb-4 text-xl font-semibold text-white">Vidéo</h2>
            <div className="relative overflow-hidden rounded-xl border border-gray-700" style={{ paddingBottom: '56.25%' }}>
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
/*  Tabbed Sections                                                    */
/* ------------------------------------------------------------------ */

interface TabbedSectionsProps {
    specifications: Product['specifications'] extends (infer T)[] | undefined ? T[] : never;
    brochureFile: string | null;
}

type TabKey = 'specs' | 'brochure';

function TabbedSections({ specifications, brochureFile }: TabbedSectionsProps) {
    const tabs: { key: TabKey; label: string }[] = [
        { key: 'specs', label: 'Caractéristiques Techniques' },
        { key: 'brochure', label: 'Catalogue / Brochure' },
    ];
    const [activeTab, setActiveTab] = useState<TabKey>('specs');

    return (
        <section className="mt-12">
            <div className="flex border-b border-gray-700" role="tablist">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        type="button"
                        role="tab"
                        aria-selected={activeTab === tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-5 py-3 text-sm font-medium transition-colors ${
                            activeTab === tab.key
                                ? 'border-b-2 border-primary text-primary'
                                : 'text-gray-500 hover:text-gray-300'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="py-6">
                {activeTab === 'specs' && <SpecsTable specifications={specifications} />}
                {activeTab === 'brochure' && <BrochureDownload brochureFile={brochureFile} />}
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/*  Specs Table                                                        */
/* ------------------------------------------------------------------ */

interface SpecsTableProps {
    specifications: Array<{ label: string; value: string }>;
}

function SpecsTable({ specifications }: SpecsTableProps) {
    if (specifications.length === 0) {
        return <p className="text-sm text-gray-500">Aucune caractéristique technique disponible.</p>;
    }

    return (
        <div className="overflow-hidden rounded-lg border border-gray-700">
            <table className="w-full text-sm">
                <thead>
                    <tr className="bg-black">
                        <th className="px-4 py-3 text-left font-medium text-gray-300">Caractéristique</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-300">Valeur</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                    {specifications.map((spec, idx) => (
                        <tr key={idx} className="hover:bg-black">
                            <td className="px-4 py-3 font-medium text-white">{spec.label}</td>
                            <td className="px-4 py-3 text-gray-300">{spec.value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Brochure Download                                                  */
/* ------------------------------------------------------------------ */

function BrochureDownload({ brochureFile }: { brochureFile: string | null }) {
    if (!brochureFile) {
        return <p className="text-sm text-gray-500">Aucune brochure disponible pour ce produit.</p>;
    }

    return (
        <a
            href={`/storage/${brochureFile}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-white/80"
        >
            <Download className="size-4" />
            Télécharger la brochure
        </a>
    );
}
