import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Minus, Plus, X } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import HTMLFlipBook from 'react-pageflip';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface Props {
    open: boolean;
    onClose: () => void;
    url: string;
    title: string;
    contactUrl?: string;
}

const FlipPage = React.forwardRef<HTMLDivElement, { pageNumber: number; width: number; height: number }>(
    ({ pageNumber, width, height }, ref) => (
        <div ref={ref} style={{ width, height }} className="bg-white">
            <Page pageNumber={pageNumber} width={width} renderTextLayer={false} renderAnnotationLayer={false} />
        </div>
    ),
);
FlipPage.displayName = 'FlipPage';

export default function PdfViewerInner({ open, onClose, url, title, contactUrl = '/contact' }: Props) {
    const [numPages, setNumPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [dimensions, setDimensions] = useState<{ w: number; h: number } | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const dragRef = useRef<{ dragging: boolean; startX: number; startY: number; startPanX: number; startPanY: number }>({
        dragging: false, startX: 0, startY: 0, startPanX: 0, startPanY: 0,
    });
    const bookRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const areaRef = useRef<HTMLDivElement>(null);

    // Measure available space and compute page size
    useEffect(() => {
        if (!open || !areaRef.current) return;
        const measure = () => {
            if (!areaRef.current) return;
            const rect = areaRef.current.getBoundingClientRect();
            const mobile = rect.width < 768;
            setIsMobile(mobile);
            const availW = rect.width - 80;
            const availH = rect.height - 16;
            const ratio = 1.414;
            let pageW: number;
            let pageH: number;
            if (mobile) {
                // Single page mode — use full width
                pageW = availW;
                pageH = pageW * ratio;
                if (pageH > availH) {
                    pageH = availH;
                    pageW = pageH / ratio;
                }
            } else {
                // Two-page spread
                pageW = availW / 2;
                pageH = pageW * ratio;
                if (pageH > availH) {
                    pageH = availH;
                    pageW = pageH / ratio;
                }
            }
            setDimensions({ w: Math.floor(pageW), h: Math.floor(pageH) });
        };
        const timer = setTimeout(measure, 50);
        window.addEventListener('resize', measure);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', measure);
        };
    }, [open, numPages]);

    useEffect(() => {
        if (!open) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') bookRef.current?.pageFlip()?.flipPrev();
            if (e.key === 'ArrowRight') bookRef.current?.pageFlip()?.flipNext();
        };
        document.addEventListener('keydown', handleKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleKey);
            document.body.style.overflow = '';
        };
    }, [open, onClose]);

    const onDocumentLoadSuccess = useCallback(({ numPages: n }: { numPages: number }) => {
        setNumPages(n);
    }, []);

    const onFlip = useCallback((e: any) => {
        setCurrentPage(e.data);
    }, []);

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

    // Reset pan when zoom goes back to 1
    useEffect(() => {
        if (zoom <= 1) setPan({ x: 0, y: 0 });
    }, [zoom]);

    const isZoomed = zoom > 1;

    const onPointerDown = useCallback((e: React.PointerEvent) => {
        if (!isZoomed) return;
        dragRef.current = { dragging: true, startX: e.clientX, startY: e.clientY, startPanX: pan.x, startPanY: pan.y };
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }, [isZoomed, pan]);

    const onPointerMove = useCallback((e: React.PointerEvent) => {
        if (!dragRef.current.dragging) return;
        const dx = e.clientX - dragRef.current.startX;
        const dy = e.clientY - dragRef.current.startY;
        setPan({ x: dragRef.current.startPanX + dx, y: dragRef.current.startPanY + dy });
    }, []);

    const onPointerUp = useCallback(() => {
        dragRef.current.dragging = false;
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

                {/* Flipbook area */}
                <div ref={areaRef} className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden">
                    {/* Prev */}
                    <button
                        onClick={() => bookRef.current?.pageFlip()?.flipPrev()}
                        className="absolute left-2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                        aria-label="Page précédente"
                    >
                        <ChevronLeft className="size-6" />
                    </button>

                    <div
                        style={{
                            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                            transformOrigin: 'center center',
                            transition: dragRef.current.dragging ? 'none' : 'transform 0.2s ease',
                            cursor: isZoomed ? (dragRef.current.dragging ? 'grabbing' : 'grab') : 'default',
                        }}
                        onPointerDown={onPointerDown}
                        onPointerMove={onPointerMove}
                        onPointerUp={onPointerUp}
                    >
                    <Document
                        file={url}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading={
                            <div className="flex items-center justify-center text-white" style={{ height: 400 }}>
                                Chargement du PDF…
                            </div>
                        }
                    >
                        {numPages > 0 && dimensions && (
                            // @ts-ignore
                            <HTMLFlipBook
                                ref={bookRef}
                                width={dimensions.w}
                                height={dimensions.h}
                                size="fixed"
                                showCover={false}
                                onFlip={onFlip}
                                className=""
                                style={{}}
                                startPage={0}
                                drawShadow={true}
                                flippingTime={600}
                                usePortrait={isMobile}
                                startZIndex={0}
                                autoSize={false}
                                maxShadowOpacity={0.5}
                                mobileScrollSupport={true}
                                clickEventForward={true}
                                useMouseEvents={true}
                                swipeDistance={30}
                                showPageCorners={false}
                                disableFlipByClick={false}
                            >
                                {Array.from({ length: numPages }, (_, i) => (
                                    <FlipPage key={i} pageNumber={i + 1} width={dimensions.w} height={dimensions.h} />
                                ))}
                            </HTMLFlipBook>
                        )}
                    </Document>
                    </div>

                    {/* Next */}
                    <button
                        onClick={() => bookRef.current?.pageFlip()?.flipNext()}
                        className="absolute right-2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                        aria-label="Page suivante"
                    >
                        <ChevronRight className="size-6" />
                    </button>
                </div>

                {/* Bottom controls */}
                <div className="relative z-20 flex shrink-0 items-center justify-center gap-2 sm:gap-4 overflow-x-auto rounded-b-xl bg-black/80 px-3 py-2 sm:px-4 sm:py-3">
                    <span className="text-sm text-white/70">
                        {currentPage + 1} / {numPages}
                    </span>
                    <div className="h-4 w-px bg-white/20" />
                    <button
                        onClick={() => bookRef.current?.pageFlip()?.flipPrev()}
                        className="flex h-8 w-8 items-center justify-center rounded text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                    >
                        <ChevronLeft className="size-4" />
                    </button>
                    <button
                        onClick={() => bookRef.current?.pageFlip()?.flipNext()}
                        className="flex h-8 w-8 items-center justify-center rounded text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                    >
                        <ChevronRight className="size-4" />
                    </button>
                    <div className="h-4 w-px bg-white/20" />
                    <button
                        onClick={() => { setZoom((z) => Math.max(0.5, z - 0.1)); }}
                        className="flex h-8 w-8 items-center justify-center rounded text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                        aria-label="Zoom arrière"
                    >
                        <Minus className="size-4" />
                    </button>
                    <span className="text-xs text-white/70 min-w-[3ch] text-center">{Math.round(zoom * 100)}%</span>
                    <button
                        onClick={() => { setZoom((z) => Math.min(2, z + 0.1)); }}
                        className="flex h-8 w-8 items-center justify-center rounded text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                        aria-label="Zoom avant"
                    >
                        <Plus className="size-4" />
                    </button>
                    <div className="h-4 w-px bg-white/20" />
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
