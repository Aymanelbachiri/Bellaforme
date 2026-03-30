import React, { lazy, Suspense } from 'react';
import { createPortal } from 'react-dom';

interface PdfViewerProps {
    open: boolean;
    onClose: () => void;
    url: string;
    title: string;
    contactUrl?: string;
}

export default function PdfViewer(props: PdfViewerProps) {
    if (!props.open) return null;
    return createPortal(
        <Suspense fallback={
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
                <div className="text-white">Chargement…</div>
            </div>
        }>
            <PdfViewerInner {...props} />
        </Suspense>,
        document.body,
    );
}

const PdfViewerInner = lazy(() => import('./pdf-viewer-inner'));
