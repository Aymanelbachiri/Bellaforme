import { Head, Link, usePage } from '@inertiajs/react';
import { Award, CheckCircle2, FolderTree, ImageIcon, Layers, Loader2, MessageSquare, Package, Plus, XCircle } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

interface ContactMessage {
    id: number;
    name: string;
    email: string;
    created_at: string;
}

interface DashboardProps {
    stats: {
        divisions: number;
        categories: number;
        brands: number;
        products: number;
    };
    recentMessages: ContactMessage[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tableau de bord',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    const { stats, recentMessages } = usePage<{ props: DashboardProps }>().props as unknown as DashboardProps;
    const flash = (usePage().props as Record<string, unknown>).flash as { success?: string } | undefined;

    const statCards = [
        { label: 'Divisions', value: stats.divisions, icon: Layers, href: '/admin/divisions' },
        { label: 'Catégories', value: stats.categories, icon: FolderTree, href: '/admin/categories' },
        { label: 'Marques', value: stats.brands, icon: Award, href: '/admin/brands' },
        { label: 'Produits', value: stats.products, icon: Package, href: '/admin/products' },
    ];

    const quickActions = [
        { label: 'Nouvelle division', href: '/admin/divisions/create' },
        { label: 'Nouvelle catégorie', href: '/admin/categories/create' },
        { label: 'Nouvelle marque', href: '/admin/brands/create' },
        { label: 'Nouveau produit', href: '/admin/products/create' },
    ];

    type ImageEntry = { path: string; type: 'image' | 'stale_webp' };
    type ProcessResult = { path: string; status: string; error?: string };

    const [dialogOpen, setDialogOpen] = useState(false);
    const [phase, setPhase] = useState<'idle' | 'loading' | 'processing' | 'done'>('idle');
    const [images, setImages] = useState<ImageEntry[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentFile, setCurrentFile] = useState('');
    const [results, setResults] = useState({ optimized: 0, avif: 0, cleaned: 0, failed: 0 });
    const [errors, setErrors] = useState<ProcessResult[]>([]);
    const cancelledRef = useRef(false);

    const handleRegenerate = useCallback(async () => {
        cancelledRef.current = false;
        setPhase('loading');
        setDialogOpen(true);
        setCurrentIndex(0);
        setCurrentFile('');
        setResults({ optimized: 0, avif: 0, cleaned: 0, failed: 0 });
        setErrors([]);

        try {
            const res = await fetch('/admin/regenerate-images/list', {
                headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            });
            if (!res.ok) throw new Error('Failed to fetch image list');
            const data = await res.json();
            const imageList: ImageEntry[] = data.images;
            setImages(imageList);

            if (imageList.length === 0) {
                setPhase('done');
                return;
            }

            setPhase('processing');
            const totals = { optimized: 0, avif: 0, cleaned: 0, failed: 0 };
            const failedItems: ProcessResult[] = [];

            const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '';

            for (let i = 0; i < imageList.length; i++) {
                if (cancelledRef.current) break;

                const img = imageList[i];
                setCurrentIndex(i + 1);
                setCurrentFile(img.path);

                try {
                    const r = await fetch('/admin/regenerate-images/process', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'X-CSRF-TOKEN': csrfToken,
                            'X-Requested-With': 'XMLHttpRequest',
                        },
                        body: JSON.stringify({ path: img.path, type: img.type }),
                    });

                    if (!r.ok) {
                        totals.failed++;
                        failedItems.push({ path: img.path, status: 'error', error: `HTTP ${r.status}` });
                    } else {
                        const result = await r.json();
                        if (result.status === 'cleaned') totals.cleaned++;
                        if (result.optimized) totals.optimized++;
                        if (result.avif) totals.avif++;
                    }
                } catch {
                    totals.failed++;
                    failedItems.push({ path: img.path, status: 'error', error: 'Network error' });
                }

                setResults({ ...totals });
                setErrors([...failedItems]);
            }
        } catch {
            setErrors([{ path: '', status: 'error', error: 'Impossible de charger la liste des images' }]);
        }

        setPhase('done');
    }, []);

    function handleCancel() {
        cancelledRef.current = true;
    }

    function handleClose() {
        if (phase === 'processing') {
            cancelledRef.current = true;
        }
        setDialogOpen(false);
        setPhase('idle');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tableau de bord" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Flash message */}
                {flash?.success && (
                    <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                        {flash.success}
                    </div>
                )}
                {/* Stat Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((stat) => (
                        <Link key={stat.label} href={stat.href}>
                            <Card className="transition-shadow hover:shadow-md">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-muted-foreground text-sm font-medium">{stat.label}</CardTitle>
                                    <stat.icon className="text-muted-foreground h-4 w-4" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    {/* Recent Contact Messages */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" />
                                Messages de contact récents
                            </CardTitle>
                            <Link href="/admin/contact-messages" className="text-muted-foreground text-sm hover:underline">
                                Voir tout
                            </Link>
                        </CardHeader>
                        <CardContent>
                            {recentMessages.length === 0 ? (
                                <p className="text-muted-foreground text-sm">Aucun message pour le moment.</p>
                            ) : (
                                <div className="space-y-3">
                                    {recentMessages.map((msg) => (
                                        <div key={msg.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                                            <div>
                                                <p className="text-sm font-medium">{msg.name}</p>
                                                <p className="text-muted-foreground text-xs">{msg.email}</p>
                                            </div>
                                            <p className="text-muted-foreground text-xs">
                                                {new Date(msg.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Actions rapides</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-3">
                                {quickActions.map((action) => (
                                    <Link
                                        key={action.label}
                                        href={action.href}
                                        className="border-input hover:bg-accent flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors"
                                    >
                                        <Plus className="h-4 w-4" />
                                        {action.label}
                                    </Link>
                                ))}
                            </div>
                            <div className="mt-4 border-t pt-4">
                                <button
                                    onClick={handleRegenerate}
                                    disabled={phase === 'processing' || phase === 'loading'}
                                    className="border-input hover:bg-accent flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors disabled:opacity-50"
                                >
                                    <ImageIcon className="h-4 w-4" />
                                    Régénérer toutes les images
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                {/* Regenerate Images Dialog */}
                <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
                    <DialogContent className="sm:max-w-lg" onInteractOutside={(e) => e.preventDefault()}>
                        <DialogHeader>
                            <DialogTitle>Régénération des images</DialogTitle>
                            <DialogDescription>
                                {phase === 'loading' && 'Chargement de la liste des images…'}
                                {phase === 'processing' && `Traitement en cours : ${currentIndex} / ${images.length}`}
                                {phase === 'done' && (cancelledRef.current ? 'Régénération annulée.' : 'Régénération terminée.')}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                            {/* Progress bar */}
                            {(phase === 'processing' || phase === 'done') && images.length > 0 && (
                                <div className="space-y-2">
                                    <div className="bg-secondary h-3 w-full overflow-hidden rounded-full">
                                        <div
                                            className="bg-primary h-full rounded-full transition-all duration-300"
                                            style={{ width: `${Math.round((currentIndex / images.length) * 100)}%` }}
                                        />
                                    </div>
                                    <p className="text-muted-foreground text-center text-xs">
                                        {Math.round((currentIndex / images.length) * 100)}%
                                    </p>
                                </div>
                            )}

                            {phase === 'loading' && (
                                <div className="flex items-center justify-center py-4">
                                    <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
                                </div>
                            )}

                            {/* Current file */}
                            {phase === 'processing' && currentFile && (
                                <div className="flex items-center gap-2 rounded-md border px-3 py-2">
                                    <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                                    <span className="truncate text-xs font-mono">{currentFile}</span>
                                </div>
                            )}

                            {/* Stats */}
                            {(phase === 'processing' || phase === 'done') && (
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                        <span>{results.optimized} optimisées</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-blue-600" />
                                        <span>{results.avif} AVIF générés</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-amber-600" />
                                        <span>{results.cleaned} WebP nettoyés</span>
                                    </div>
                                    {results.failed > 0 && (
                                        <div className="flex items-center gap-2">
                                            <XCircle className="h-4 w-4 text-red-600" />
                                            <span>{results.failed} échoués</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Error list */}
                            {errors.length > 0 && phase === 'done' && (
                                <div className="max-h-32 overflow-y-auto rounded border border-red-200 bg-red-50 p-2 text-xs">
                                    {errors.map((err, i) => (
                                        <div key={i} className="text-red-700">
                                            {err.path ? `${err.path}: ` : ''}{err.error}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <DialogFooter>
                            {phase === 'processing' && (
                                <button
                                    onClick={handleCancel}
                                    className="rounded-md border px-4 py-2 text-sm hover:bg-red-50 transition-colors"
                                >
                                    Annuler
                                </button>
                            )}
                            {phase === 'done' && (
                                <button
                                    onClick={handleClose}
                                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm transition-colors"
                                >
                                    Fermer
                                </button>
                            )}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
