import { Maximize2, Minimize2, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface Props {
    open: boolean;
    onClose: () => void;
    url: string;
    title: string;
    contactUrl?: string;
}

export default function PdfViewerInner({ open, onClose, url, title, contactUrl = '/contact' }: Props) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleKey);
            document.body.style.overflow = '';
        };
    }, [open, onClose]);

    const toggleFullscreen = useCallback(() => {
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }, []);

    useEffect(() => {
        const handler = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handler);
        return () => document.removeEventListener('fullscreenchange', handler);
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-8" onClick={onClose}>
            <div
                ref={containerRef}
                className="relative flex h-[90vh] w-[95vw] max-w-[1200px] flex-col rounded-xl bg-black"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="relative z-20 flex w-[95%] sm:w-[70%] center m-auto my-3 sm:my-4 shrink-0 items-center justify-between gap-3 rounded-full bg-white/10 px-4 py-2.5 sm:px-6 sm:py-3">
                    <h2 className="truncate text-sm font-bold text-white sm:text-lg" style={{ fontFamily: "'Manrope', sans-serif" }}>
                        {title}
                    </h2>
                    <a
                        href={contactUrl}
                        className="shrink-0 rounded-full bg-white glow-btn px-3 py-1.5 text-xs font-semibold text-black transition-colors hover:bg-[#d5ab70] hover:text-white sm:px-5 sm:py-2 sm:text-sm"
                    >
                        Demander un devis
                    </a>
                </div>

                {/* PDF via browser native renderer */}
                <div className="relative flex min-h-0 flex-1 overflow-hidden rounded-b-xl">
                    <iframe
                        src={url}
                        title={title}
                        className="h-full w-full border-0"
                        style={{ background: 'white' }}
                    />
                </div>

                {/* Bottom controls */}
                <div className="absolute bottom-0 right-0 z-20 flex items-center gap-2 rounded-tl-lg bg-black/80 px-3 py-2">
                    <button
                        onClick={toggleFullscreen}
                        className="flex h-8 w-8 items-center justify-center rounded text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                    >
                        {isFullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
                    </button>
                </div>

                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute right-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition-colors hover:bg-red-700"
                    aria-label="Fermer"
                >
                    <X className="size-5" />
                </button>
            </div>
        </div>
    );
}
