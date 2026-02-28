interface OptimizedImageProps {
    src: string;
    alt: string;
    loading?: 'lazy' | 'eager';
    className?: string;
    sizes?: string;
}

function getAvifUrl(src: string): string {
    const lastDot = src.lastIndexOf('.');
    if (lastDot === -1) return `${src}.avif`;
    return `${src.substring(0, lastDot)}.avif`;
}

export default function OptimizedImage({
    src,
    alt,
    loading = 'lazy',
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
                className={className}
            />
        </picture>
    );
}
