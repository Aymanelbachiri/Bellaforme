import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    confirmLabel?: string;
    processing?: boolean;
}

export function ConfirmDialog({
    open,
    onOpenChange,
    onConfirm,
    title = 'Êtes-vous sûr ?',
    description = 'Cette action est irréversible.',
    confirmLabel = 'Supprimer',
    processing = false,
}: ConfirmDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Annuler
                    </Button>
                    <Button variant="destructive" onClick={onConfirm} disabled={processing}>
                        {processing ? 'Suppression…' : confirmLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export function useConfirmDialog() {
    const [open, setOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
    const [meta, setMeta] = useState({ title: '', description: '' });

    function confirm(title: string, description: string, action: () => void) {
        setMeta({ title, description });
        setPendingAction(() => action);
        setOpen(true);
    }

    function handleConfirm() {
        pendingAction?.();
        setOpen(false);
    }

    return {
        open,
        setOpen,
        confirm,
        handleConfirm,
        title: meta.title,
        description: meta.description,
    };
}
