import OptimizedImage from '@/components/optimized-image';
import type { Product } from '@/types/models';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const imageUrl = product.featured_image ? `/storage/${product.featured_image}` : '';

    return (
        <div className="group overflow-hidden rounded-xl border border-gray-700 bg-black shadow-sm transition-shadow hover:shadow-md">
            <div className="aspect-[4/3] overflow-hidden">
                {imageUrl ? (
                    <OptimizedImage
                        src={imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-800 text-gray-500">
                        {product.name}
                    </div>
                )}
            </div>
            <div className="p-5">
                <h3 className="mb-2 text-lg font-semibold text-white">{product.name}</h3>
                <p className="mb-4 line-clamp-2 text-sm text-gray-400">
                    {product.short_description}
                </p>
                {product.content_mode === 'detailed' ? (
                    <a
                        href={`/product/${product.slug}`}
                        className="inline-block rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-white/80"
                    >
                        En savoir plus
                    </a>
                ) : (
                    <a
                        href={product.brochure_file ? `/storage/${product.brochure_file}` : '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-white/80"
                    >
                        Voir la brochure
                    </a>
                )}
            </div>
        </div>
    );
}
