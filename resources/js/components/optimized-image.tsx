interface OptimizedImageProps {
    src: string;
    alt: string;
    loading?: 'lazy' | 'eager';
    className?: string;
    sizes?: string;
}

function getWebPUrl(src: string, suffix: string): string {
    const lastDot = src.lastIndexOf('.');
    if (lastDot === -1) return `${src}-${suffix}.webp`;
    return `${src.substring(0, lastDot)}-${suffix}.webp`;
}

export default function OptimizedImage({
    src,
    alt,
    loading = 'lazy',
    className,
    sizes,
}: OptimizedImageProps) {
    const thumbUrl = getWebPUrl(src, 'thumb');
    const mediumUrl = getWebPUrl(src, 'medium');
    const largeUrl = getWebPUrl(src, 'large');
    const xlargeUrl = getWebPUrl(src, 'xlarge');

    const srcSet = `${thumbUrl} 150w, ${mediumUrl} 600w, ${largeUrl} 1200w, ${xlargeUrl} 1920w`;

    return (
        <picture>
            <source
                type="image/webp"
                srcSet={srcSet}
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
