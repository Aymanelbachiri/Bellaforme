import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import OptimizedImage from '../optimized-image';

describe('OptimizedImage', () => {
    it('renders a picture element with WebP source and img fallback', () => {
        const { container } = render(
            <OptimizedImage src="/storage/uploads/photo.jpg" alt="Test photo" />
        );

        const picture = container.querySelector('picture');
        expect(picture).toBeInTheDocument();

        const source = picture!.querySelector('source');
        expect(source).toHaveAttribute('type', 'image/webp');
        expect(source).toHaveAttribute(
            'srcset',
            '/storage/uploads/photo-thumb.webp 150w, /storage/uploads/photo-medium.webp 600w, /storage/uploads/photo-large.webp 1200w'
        );

        const img = screen.getByRole('img', { name: 'Test photo' });
        expect(img).toHaveAttribute('src', '/storage/uploads/photo.jpg');
    });

    it('defaults loading to lazy', () => {
        render(<OptimizedImage src="/storage/uploads/photo.jpg" alt="Lazy image" />);
        expect(screen.getByRole('img')).toHaveAttribute('loading', 'lazy');
    });

    it('supports loading="eager"', () => {
        render(<OptimizedImage src="/storage/uploads/photo.jpg" alt="Eager image" loading="eager" />);
        expect(screen.getByRole('img')).toHaveAttribute('loading', 'eager');
    });

    it('passes className to the img element', () => {
        render(<OptimizedImage src="/storage/uploads/photo.jpg" alt="Styled" className="w-full rounded" />);
        expect(screen.getByRole('img')).toHaveClass('w-full', 'rounded');
    });

    it('passes sizes attribute to the source element', () => {
        const { container } = render(
            <OptimizedImage src="/storage/uploads/photo.jpg" alt="Responsive" sizes="(max-width: 600px) 100vw, 50vw" />
        );
        const source = container.querySelector('source');
        expect(source).toHaveAttribute('sizes', '(max-width: 600px) 100vw, 50vw');
    });

    it('handles src with no file extension', () => {
        const { container } = render(
            <OptimizedImage src="/storage/uploads/photo" alt="No ext" />
        );
        const source = container.querySelector('source');
        expect(source).toHaveAttribute(
            'srcset',
            '/storage/uploads/photo-thumb.webp 150w, /storage/uploads/photo-medium.webp 600w, /storage/uploads/photo-large.webp 1200w'
        );
    });

    it('handles src with multiple dots in path', () => {
        const { container } = render(
            <OptimizedImage src="/storage/uploads/my.photo.name.png" alt="Dots" />
        );
        const source = container.querySelector('source');
        expect(source).toHaveAttribute(
            'srcset',
            '/storage/uploads/my.photo.name-thumb.webp 150w, /storage/uploads/my.photo.name-medium.webp 600w, /storage/uploads/my.photo.name-large.webp 1200w'
        );
    });
});
