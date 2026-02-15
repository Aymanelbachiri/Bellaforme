import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface MediaFile {
    path: string;
    url: string;
    name: string;
    directory: string;
    size: number;
    modified: number;
}

interface MediaPickerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect: (file: MediaFile) => void;
    onUpload: (file: File) => void;
    type?: 'image' | 'document';
    directory?: string;
}

export function MediaPicker({
    open,
    onOpenChange,
    onSelect,
    onUpload,
    type = 'image',
    directory,
}: MediaPickerProps) {
    const [files, setFiles] = useState<MediaFile[]>([]);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<MediaFile | null>(null);
    const [tab, setTab] = useState<'gallery' | 'upload'>('gallery');
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (open) {
            setLoading(true);
            setSelected(null);
            setUploadFile(null);
            setPreview(null);
            setTab('gallery');
            const params = new URLSearchParams({ type });
            if (directory) params.set('directory', directory);
            fetch(`/api/media?${params}`)
                .then((r) => r.json())
                .then((data) => setFiles(data))
                .catch(() => setFiles([]))
                .finally(() => setLoading(false));
        }
    }, [open, type, directory]);

    function handleUploadChange(file: File | null) {
        setUploadFile(file);
        if (file && type === 'image') {
            const url = URL.createObjectURL(file);
            setPreview(url);
        } else {
            setPreview(null);
        }
    }

    function handleConfirm() {
        if (tab === 'gallery' && selected) {
            onSelect(selected);
            onOpenChange(false);
        } else if (tab === 'upload' && uploadFile) {
            onUpload(uploadFile);
            onOpenChange(false);
        }
    }

    const accept = type === 'image' ? 'image/*' : '.pdf,.doc,.docx,.xls,.xlsx';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>
                        {type === 'image' ? 'Select Image' : 'Select File'}
                    </DialogTitle>
                </DialogHeader>

                {/* Tabs */}
                <div className="flex gap-2 border-b pb-2">
                    <button
                        type="button"
                        className={`px-4 py-1.5 text-sm rounded-md transition-colors ${tab === 'gallery' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
                        onClick={() => setTab('gallery')}
                    >
                        Media Library
                    </button>
                    <button
                        type="button"
                        className={`px-4 py-1.5 text-sm rounded-md transition-colors ${tab === 'upload' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
                        onClick={() => setTab('upload')}
                    >
                        Upload New
                    </button>
                </div>

                {tab === 'gallery' ? (
                    <div className="max-h-[400px] overflow-y-auto">
                        {loading ? (
                            <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
                                Loading…
                            </div>
                        ) : files.length === 0 ? (
                            <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
                                No files found. Upload one instead.
                            </div>
                        ) : (
                            <div className="grid grid-cols-4 gap-3 p-1 sm:grid-cols-5 md:grid-cols-6">
                                {files.map((file) => (
                                    <button
                                        key={file.path}
                                        type="button"
                                        onClick={() => setSelected(file)}
                                        className={`group relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                                            selected?.path === file.path
                                                ? 'border-primary ring-2 ring-primary/30'
                                                : 'border-transparent hover:border-muted-foreground/30'
                                        }`}
                                    >
                                        {type === 'image' ? (
                                            <img
                                                src={file.url}
                                                alt={file.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-muted p-2">
                                                <span className="text-xs font-medium text-muted-foreground uppercase">
                                                    {file.name.split('.').pop()}
                                                </span>
                                                <span className="text-[10px] text-muted-foreground truncate w-full text-center">
                                                    {file.name}
                                                </span>
                                            </div>
                                        )}
                                        {selected?.path === file.path && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4 py-8">
                        {preview ? (
                            <img src={preview} alt="Preview" className="h-40 w-40 rounded-lg object-cover" />
                        ) : uploadFile ? (
                            <div className="flex h-40 w-40 items-center justify-center rounded-lg bg-muted">
                                <span className="text-sm text-muted-foreground">{uploadFile.name}</span>
                            </div>
                        ) : null}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept={accept}
                            className="hidden"
                            onChange={(e) => handleUploadChange(e.target.files?.[0] ?? null)}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {uploadFile ? 'Change File' : 'Choose File'}
                        </Button>
                        {uploadFile && (
                            <p className="text-xs text-muted-foreground">{uploadFile.name}</p>
                        )}
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={
                            (tab === 'gallery' && !selected) ||
                            (tab === 'upload' && !uploadFile)
                        }
                    >
                        {tab === 'gallery' ? 'Select' : 'Upload & Use'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// Hook for easy usage in forms
export function useMediaPicker() {
    const [open, setOpen] = useState(false);
    const [config, setConfig] = useState<{
        type: 'image' | 'document';
        directory?: string;
        onSelect: (file: MediaFile) => void;
        onUpload: (file: File) => void;
    } | null>(null);

    function openPicker(opts: {
        type?: 'image' | 'document';
        directory?: string;
        onSelect: (file: MediaFile) => void;
        onUpload: (file: File) => void;
    }) {
        setConfig({
            type: opts.type ?? 'image',
            directory: opts.directory,
            onSelect: opts.onSelect,
            onUpload: opts.onUpload,
        });
        setOpen(true);
    }

    return { open, setOpen, config, openPicker };
}
