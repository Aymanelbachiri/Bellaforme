import { Head } from '@inertiajs/react';
import {
    Download,
    Eye,
    File,
    FileText,
    Film,
    FolderPlus,
    Image,
    Search,
    Trash2,
    Upload,
    X,
} from 'lucide-react';
import { type ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Media Library', href: '/admin/media' },
];

interface MediaFile {
    path: string;
    url: string;
    name: string;
    directory: string;
    size: number;
    modified: number;
    extension: string;
    type: 'image' | 'video' | 'document';
}

type FilterType = 'all' | 'image' | 'video' | 'document';

function getCsrfToken(): string {
    // Try meta tag first
    const meta = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]');
    if (meta?.content) return meta.content;
    // Fallback: read XSRF-TOKEN cookie (URL-decoded)
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}

function csrfHeaders(json = true): Record<string, string> {
    const token = getCsrfToken();
    const headers: Record<string, string> = {
        'Accept': 'application/json',
        'X-CSRF-TOKEN': token,
        'X-Requested-With': 'XMLHttpRequest',
    };
    if (json) headers['Content-Type'] = 'application/json';
    return headers;
}

export default function MediaIndex() {
    const [files, setFiles] = useState<MediaFile[]>([]);
    const [directories, setDirectories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<FilterType>('all');
    const [directory, setDirectory] = useState('');
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [previewFile, setPreviewFile] = useState<MediaFile | null>(null);
    const [uploading, setUploading] = useState(false);
    const [showUpload, setShowUpload] = useState(false);
    const [uploadDir, setUploadDir] = useState('media');
    const [showNewDir, setShowNewDir] = useState(false);
    const [newDirName, setNewDirName] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; paths: string[] }>({ open: false, paths: [] });
    const [deleteDirConfirm, setDeleteDirConfirm] = useState<{ open: boolean; name: string }>({ open: false, name: '' });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchFiles = useCallback(() => {
        setLoading(true);
        const params = new URLSearchParams();
        if (filter !== 'all') params.set('type', filter);
        if (directory) params.set('directory', directory);
        fetch(`/admin/media/list?${params}`)
            .then((r) => r.json())
            .then((data) => {
                setFiles(data.files);
                setDirectories(data.directories);
            })
            .catch(() => setFiles([]))
            .finally(() => setLoading(false));
    }, [filter, directory]);

    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);

    const filteredFiles = search
        ? files.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()))
        : files;

    function toggleSelect(path: string) {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(path)) next.delete(path);
            else next.add(path);
            return next;
        });
    }

    function selectAll() {
        if (selected.size === filteredFiles.length) {
            setSelected(new Set());
        } else {
            setSelected(new Set(filteredFiles.map((f) => f.path)));
        }
    }

    async function handleUpload(e: ChangeEvent<HTMLInputElement>) {
        const fileList = e.target.files;
        if (!fileList?.length) return;

        setUploading(true);
        const formData = new FormData();
        Array.from(fileList).forEach((f) => formData.append('files[]', f));
        formData.append('directory', uploadDir);

        try {
            await fetch('/admin/media/upload', {
                method: 'POST',
                headers: csrfHeaders(false),
                body: formData,
                credentials: 'same-origin',
            });
            fetchFiles();
            setShowUpload(false);
        } catch {
            // silent
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    }

    async function handleDelete(paths: string[]) {
        for (const path of paths) {
            await fetch('/admin/media/delete', {
                method: 'DELETE',
                headers: csrfHeaders(),
                body: JSON.stringify({ path }),
                credentials: 'same-origin',
            });
        }
        setDeleteConfirm({ open: false, paths: [] });
        setSelected(new Set());
        fetchFiles();
    }

    async function handleCreateDir() {
        if (!newDirName.trim()) return;
        try {
            const res = await fetch('/admin/media/directory', {
                method: 'POST',
                headers: csrfHeaders(),
                body: JSON.stringify({ name: newDirName.trim().toLowerCase() }),
                credentials: 'same-origin',
            });
            if (!res.ok) {
                const err = await res.json().catch(() => null);
                alert(err?.error || err?.message || 'Erreur lors de la création du dossier');
                return;
            }
        } catch {
            alert('Erreur réseau');
            return;
        }
        setNewDirName('');
        setShowNewDir(false);
        fetchFiles();
    }

    async function handleDeleteDir(name: string) {
        await fetch('/admin/media/directory', {
            method: 'DELETE',
            headers: csrfHeaders(),
            body: JSON.stringify({ name }),
            credentials: 'same-origin',
        });
        setDeleteDirConfirm({ open: false, name: '' });
        if (directory === name) setDirectory('');
        fetchFiles();
    }

    function formatSize(bytes: number) {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    function formatDate(ts: number) {
        return new Date(ts * 1000).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    }

    const FileIcon = ({ type }: { type: string }) => {
        switch (type) {
            case 'image': return <Image className="size-5 text-blue-400" />;
            case 'video': return <Film className="size-5 text-purple-400" />;
            default: return <FileText className="size-5 text-orange-400" />;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Media Library" />

            <div className="space-y-4 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h1 className="text-xl font-semibold tracking-tight">Media Library</h1>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setShowNewDir(true)}>
                            <FolderPlus className="mr-1.5 size-4" /> New Folder
                        </Button>
                        <Button size="sm" onClick={() => setShowUpload(true)}>
                            <Upload className="mr-1.5 size-4" /> Upload
                        </Button>
                    </div>
                </div>

                {/* Filters bar */}
                <Card>
                    <CardContent className="flex flex-wrap items-center gap-3 py-3">
                        {/* Type filter */}
                        <div className="flex gap-1">
                            {(['all', 'image', 'video', 'document'] as FilterType[]).map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => { setFilter(t); setSelected(new Set()); }}
                                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                                        filter === t ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-accent'
                                    }`}
                                >
                                    {t === 'all' ? 'Tous' : t === 'image' ? 'Images' : t === 'video' ? 'Vidéos' : 'Documents'}
                                </button>
                            ))}
                        </div>

                        {/* Directory filter */}
                        <div className="flex items-center gap-1">
                            <select
                                value={directory}
                                onChange={(e) => { setDirectory(e.target.value); setSelected(new Set()); }}
                                className="bg-background border-input rounded-md border px-3 py-1.5 text-xs"
                            >
                                <option value="">Tous les dossiers</option>
                                {directories.map((d) => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                            {directory && (
                                <button
                                    type="button"
                                    onClick={() => setDeleteDirConfirm({ open: true, name: directory })}
                                    className="rounded-md p-1.5 text-destructive hover:bg-destructive/10 transition-colors"
                                    title={`Supprimer le dossier "${directory}"`}
                                >
                                    <Trash2 className="size-3.5" />
                                </button>
                            )}
                        </div>

                        {/* Search */}
                        <div className="relative ml-auto">
                            <Search className="text-muted-foreground absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2" />
                            <Input
                                placeholder="Rechercher..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-8 w-48 pl-8 text-xs"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Bulk actions */}
                {selected.size > 0 && (
                    <div className="flex items-center gap-3 rounded-lg bg-muted px-4 py-2">
                        <span className="text-sm">{selected.size} sélectionné(s)</span>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setDeleteConfirm({ open: true, paths: Array.from(selected) })}
                        >
                            <Trash2 className="mr-1.5 size-3.5" /> Supprimer
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setSelected(new Set())}>
                            Désélectionner
                        </Button>
                        <Button variant="ghost" size="sm" onClick={selectAll}>
                            {selected.size === filteredFiles.length ? 'Désélectionner tout' : 'Tout sélectionner'}
                        </Button>
                    </div>
                )}

                {/* File grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-20 text-sm text-muted-foreground">
                        Chargement...
                    </div>
                ) : filteredFiles.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                        <File className="mb-3 size-10" />
                        <p className="text-sm">Aucun fichier trouvé</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        {filteredFiles.map((file) => (
                            <div
                                key={file.path}
                                className={`group relative cursor-pointer overflow-hidden rounded-lg border-2 transition-all ${
                                    selected.has(file.path)
                                        ? 'border-primary ring-2 ring-primary/30'
                                        : 'border-border hover:border-muted-foreground/40'
                                }`}
                                onClick={() => toggleSelect(file.path)}
                                onDoubleClick={() => setPreviewFile(file)}
                            >
                                {/* Thumbnail */}
                                <div className="relative aspect-square bg-muted">
                                    {file.type === 'image' ? (
                                        <img src={file.url} alt={file.name} className="h-full w-full object-cover" loading="lazy" />
                                    ) : file.type === 'video' ? (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <Film className="size-10 text-purple-400" />
                                        </div>
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <FileText className="size-10 text-orange-400" />
                                        </div>
                                    )}

                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                                        <button
                                            type="button"
                                            className="rounded-full bg-white/90 p-1.5 text-black hover:bg-white"
                                            onClick={(e) => { e.stopPropagation(); setPreviewFile(file); }}
                                            aria-label="Preview"
                                        >
                                            <Eye className="size-4" />
                                        </button>
                                        <button
                                            type="button"
                                            className="rounded-full bg-white/90 p-1.5 text-black hover:bg-white"
                                            onClick={(e) => { e.stopPropagation(); setDeleteConfirm({ open: true, paths: [file.path] }); }}
                                            aria-label="Delete"
                                        >
                                            <Trash2 className="size-4" />
                                        </button>
                                    </div>

                                    {/* Selection check */}
                                    {selected.has(file.path) && (
                                        <div className="absolute top-1.5 left-1.5 flex size-5 items-center justify-center rounded-full bg-primary">
                                            <svg className="size-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                {/* File info */}
                                <div className="space-y-0.5 p-2">
                                    <p className="truncate text-xs font-medium" title={file.name}>{file.name}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] text-muted-foreground">{formatSize(file.size)}</span>
                                        <span className="text-[10px] text-muted-foreground">{file.directory}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <p className="text-xs text-muted-foreground">{filteredFiles.length} fichier(s)</p>
            </div>

            {/* Upload dialog */}
            <Dialog open={showUpload} onOpenChange={setShowUpload}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Upload des fichiers</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label>Dossier de destination</Label>
                            <select
                                value={uploadDir}
                                onChange={(e) => setUploadDir(e.target.value)}
                                className="bg-background border-input w-full rounded-md border px-3 py-2 text-sm"
                            >
                                {directories.map((d) => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                                <option value="media">media</option>
                            </select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Fichiers</Label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                onChange={handleUpload}
                                className="text-sm"
                                disabled={uploading}
                            />
                        </div>
                        {uploading && <p className="text-sm text-muted-foreground">Upload en cours...</p>}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowUpload(false)}>Fermer</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* New directory dialog */}
            <Dialog open={showNewDir} onOpenChange={setShowNewDir}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Nouveau dossier</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-2">
                        <Label>Nom du dossier</Label>
                        <Input
                            value={newDirName}
                            onChange={(e) => setNewDirName(e.target.value)}
                            placeholder="mon-dossier"
                            onKeyDown={(e) => e.key === 'Enter' && handleCreateDir()}
                        />
                        <p className="text-xs text-muted-foreground">Lettres minuscules, chiffres, tirets et underscores uniquement</p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowNewDir(false)}>Annuler</Button>
                        <Button onClick={handleCreateDir} disabled={!newDirName.trim()}>Créer</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Preview dialog */}
            <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
                <DialogContent className="sm:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {previewFile && <FileIcon type={previewFile.type} />}
                            {previewFile?.name}
                        </DialogTitle>
                    </DialogHeader>
                    {previewFile && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-center rounded-lg bg-muted p-4">
                                {previewFile.type === 'image' ? (
                                    <img src={previewFile.url} alt={previewFile.name} className="max-h-[60vh] rounded object-contain" />
                                ) : previewFile.type === 'video' ? (
                                    <video src={previewFile.url} controls className="max-h-[60vh] rounded">
                                        <track kind="captions" />
                                    </video>
                                ) : (
                                    <div className="flex flex-col items-center gap-3 py-8">
                                        <FileText className="size-16 text-orange-400" />
                                        <p className="text-sm text-muted-foreground">{previewFile.name}</p>
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div><span className="text-muted-foreground">Taille:</span> {formatSize(previewFile.size)}</div>
                                <div><span className="text-muted-foreground">Dossier:</span> {previewFile.directory}</div>
                                <div><span className="text-muted-foreground">Type:</span> .{previewFile.extension}</div>
                                <div><span className="text-muted-foreground">Modifié:</span> {formatDate(previewFile.modified)}</div>
                            </div>
                            <div className="grid gap-2">
                                <Label>URL</Label>
                                <Input readOnly value={previewFile.url} onClick={(e) => (e.target as HTMLInputElement).select()} />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <a href={previewFile?.url} download target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm">
                                <Download className="mr-1.5 size-3.5" /> Télécharger
                            </Button>
                        </a>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                                if (previewFile) {
                                    setDeleteConfirm({ open: true, paths: [previewFile.path] });
                                    setPreviewFile(null);
                                }
                            }}
                        >
                            <Trash2 className="mr-1.5 size-3.5" /> Supprimer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete confirmation */}
            <ConfirmDialog
                open={deleteConfirm.open}
                onOpenChange={(open) => setDeleteConfirm((prev) => ({ ...prev, open }))}
                title="Supprimer"
                description={`Êtes-vous sûr de vouloir supprimer ${deleteConfirm.paths.length} fichier(s) ? Cette action est irréversible.`}
                onConfirm={() => handleDelete(deleteConfirm.paths)}
                confirmLabel="Supprimer"
            />

            {/* Delete directory confirmation */}
            <ConfirmDialog
                open={deleteDirConfirm.open}
                onOpenChange={(open) => setDeleteDirConfirm((prev) => ({ ...prev, open }))}
                title="Supprimer le dossier"
                description={`Êtes-vous sûr de vouloir supprimer le dossier "${deleteDirConfirm.name}" et tout son contenu ? Cette action est irréversible.`}
                onConfirm={() => handleDeleteDir(deleteDirConfirm.name)}
                confirmLabel="Supprimer"
            />
        </AppLayout>
    );
}
