import { Download, Maximize2, Minimize2, X } from 'lucide-react';
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
    const [isMobile, setIsMobile] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKey);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('resize', checkMobile);
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-0 md:p-8" onClick={onClose}>
            <div
                ref={containerRef}
                className="relative flex h-full w-full flex-col bg-black md:h-[90vh] md:w-[95vw] md:max-w-300 md:rounded-xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="relative z-20 flex w-full shrink-0 items-center justify-between gap-2 px-3 py-2 sm:w-[70%] sm:m-auto sm:my-4 sm:gap-3 sm:rounded-full sm:bg-white/10 sm:px-6 sm:py-3">
                    <h2 className="truncate text-xs font-bold text-white sm:text-lg" style={{ fontFamily: "'Manrope', sans-serif" }}>
                        {title}
                    </h2>
                    <div className="flex items-center gap-2">
                        <a
                            href={contactUrl}
                            className="shrink-0 rounded-full bg-white glow-btn px-3 py-1.5 text-[10px] font-semibold text-black transition-colors hover:bg-[#d5ab70] hover:text-white sm:px-5 sm:py-2 sm:text-sm"
                        >
                            Demander un devis
                        </a>
                        {/* Close - inline on mobile */}
                        <button
                            onClick={onClose}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition-colors hover:bg-red-700 sm:hidden"
                            aria-label="Fermer"
                        >
                            <X className="size-4" />
                        </button>
                    </div>
                </div>

                {/* PDF content */}
                <div className="relative flex min-h-0 flex-1 overflow-hidden md:rounded-b-xl">
                    {isMobile ? (
                        /* Mobile: show download link + open in new tab since most mobile browsers can't render PDF in iframe */
                        <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-[#1a1a1a] px-6 text-center">
                            <p className="text-sm text-white/70">
                                Le PDF ne peut pas s'afficher directement sur mobile.
                            </p>
                            <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-[#d5ab70] hover:text-white"
                            >
                                Ouvrir le PDF
                            </a>
                            <a
                                href={url}
                                download
                                className="inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
                            >
                                <Download className="size-4" />
                                Télécharger
                            </a>
                        </div>
                    ) : (
                        <iframe
                            src={url}
                            title={title}
                            className="h-full w-full border-0"
                            style={{ background: 'white' }}
                        />
                    )}
                </div>

                {/* Bottom controls - desktop only */}
                {!isMobile && (
                    <div className="absolute bottom-0 right-0 z-20 flex items-center gap-2 rounded-tl-lg bg-black/80 px-3 py-2">
                        <button
                            onClick={toggleFullscreen}
                            className="flex h-8 w-8 items-center justify-center rounded text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                        >
                            {isFullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
                        </button>
                    </div>
                )}

                {/* Close - desktop only */}
                <button
                    onClick={onClose}
                    className="absolute right-2 top-2 z-20 hidden h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition-colors hover:bg-red-700 sm:flex"
                    aria-label="Fermer"
                >
                    <X className="size-5" />
                </button>
            </div>
        </div>
    );
}
