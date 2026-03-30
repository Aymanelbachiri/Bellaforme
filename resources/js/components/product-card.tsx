import { Download } from 'lucide-react';
import { useState } from 'react';
import OptimizedImage from '@/components/optimized-image';
import PdfViewer from '@/components/pdf-viewer';
import type { Product } from '@/types/models';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const imageUrl = product.featured_image ? `/storage/${product.featured_image}` : '';
    const [pdfOpen, setPdfOpen] = useState(false);
    const brochureUrl = product.brochure_file ? `/storage/${product.brochure_file}` : '';

    if (product.content_mode === 'detailed') {
        return (
            <div className="group flex flex-col border bg-black" style={{ aspectRatio: '210 / 297' }}>
                <div className="flex-1 overflow-hidden">
                    {imageUrl ? (
                        <OptimizedImage
                            src={imageUrl}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[#1a1a1a] text-white">
                            {product.name}
                        </div>
                    )}
                </div>
                <div className="mt-auto p-5 bg-[#1a1a1a]">
                    <h3 className="mb-4 text-xl font-semibold text-white"
                        style={{ fontFamily: "'manrope', sans-serif", fontWeight: 'bold' }}
                    >{product.name}</h3>
                    <a
                        href={`/product/${product.slug}`}
                        className="inline-block rounded-full glow-btn bg-white px-5 py-2.5 mt-4 text-sm font-semibold text-black transition-colors hover:bg-[#d5ab70] hover:text-white"
                    >
                        En savoir plus
                    </a>
                </div>
            </div>
        );
    }

    // Brochure-only card: A4 aspect ratio with bottom overlay
    return (
        <>
            <div className="group relative overflow-hidden border bg-black" style={{ aspectRatio: '210 / 297' }}>
                {/* Folded corner */}
                <div className="absolute right-0 top-0 z-10 " style={{ width: '60px', height: '60px' }}>
                    {/* Black triangle (background showing through) */}
                    <div className="absolute inset-0 bg-white" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }} />
                    {/* Dark fold shadow */}
                    <div className="absolute inset-0 bg-black" style={{ clipPath: 'polygon(0 0, 0 100%, 100% 100%)' }} />
                </div>

                {/* Background image */}
                {imageUrl ? (
                    <OptimizedImage
                        src={imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                ) : (
                    <div className="h-full w-full bg-[#1a1a1a]" />
                )}

                {/* Bottom overlay — always visible */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent px-5 pb-5 pt-16">
                    <h3
                        className="mb-4 text-lg font-bold text-white"
                        style={{ fontFamily: "'Manrope', sans-serif" }}
                    >
                        {product.name}
                    </h3>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setPdfOpen(true)}
                            disabled={!brochureUrl}
                            className="rounded-full glow-btn glow-btn-gold border border-white bg-white px-5 py-2 text-sm font-semibold text-black transition-all hover:text-white hover:bg-[#d5ab70] hover:border-[#d5ab70] disabled:opacity-50"
                        >
                            Voir la brochure
                        </button>
                        {brochureUrl && (
                            <a
                                href={brochureUrl}
                                download={`${product.name}.pdf`}
                                className="flex items-center gap-1.5 text-sm font-medium text-white transition-colors hover:text-white/70"
                            >
                                Télécharger
                                <Download className="size-4" />
                            </a>
                        )}
                    </div>
                </div>
            </div>

            <PdfViewer
                open={pdfOpen}
                onClose={() => setPdfOpen(false)}
                url={brochureUrl}
                title={`Catalogue ${product.name}`}
            />
        </>
    );
}
