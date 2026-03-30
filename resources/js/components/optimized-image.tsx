interface OptimizedImageProps {
    src: string;
    alt: string;
    loading?: 'lazy' | 'eager';
    fetchPriority?: 'high' | 'low' | 'auto';
    className?: string;
    sizes?: string;
}

export function getAvifUrl(src: string): string {
    const lastDot = src.lastIndexOf('.');
    if (lastDot === -1) return `${src}.avif`;
    return `${src.substring(0, lastDot)}.avif`;
}

export default function OptimizedImage({
    src,
    alt,
    loading = 'lazy',
    fetchPriority,
    className,
    sizes,
}: OptimizedImageProps) {
    const avifUrl = getAvifUrl(src);

    return (
        <picture>
            <source
                type="image/avif"
                srcSet={avifUrl}
                sizes={sizes}
            />
            <img
                src={src}
                alt={alt}
                loading={loading}
                fetchPriority={fetchPriority}
                decoding="async"
                className={className}
            />
        </picture>
    );
}
