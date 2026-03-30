import { Head, Link, router } from '@inertiajs/react';
import { Download } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConfirmDialog, useConfirmDialog } from '@/components/confirm-dialog';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, PaginatedData } from '@/types';

interface Subscriber {
    id: number;
    email: string;
    created_at: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tableau de bord', href: '/dashboard' },
    { title: 'Newsletter', href: '/admin/newsletter' },
];

export default function NewsletterIndex({
    subscribers,
}: {
    subscribers: PaginatedData<Subscriber>;
}) {
    const dialog = useConfirmDialog();
    const [selected, setSelected] = useState<number[]>([]);

    const allIds = subscribers.data.map((s) => s.id);
    const allSelected = allIds.length > 0 && allIds.every((id) => selected.includes(id));

    function toggleAll() {
        setSelected(allSelected ? [] : allIds);
    }

    function toggleOne(id: number) {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
        );
    }

    function handleDelete(sub: Subscriber) {
        dialog.confirm(
            `Supprimer "${sub.email}" ?`,
            'Cet abonné sera définitivement supprimé.',
            () => router.delete(`/admin/newsletter/${sub.id}`, {
                onSuccess: () => setSelected((prev) => prev.filter((i) => i !== sub.id)),
            }),
        );
    }

    function handleBulkDelete() {
        dialog.confirm(
            `Supprimer ${selected.length} abonné${selected.length > 1 ? 's' : ''} ?`,
            'Ces abonnés seront définitivement supprimés.',
            () => router.post('/admin/newsletter/bulk-destroy', { ids: selected }, {
                onSuccess: () => setSelected([]),
            }),
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Newsletter" />

            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold tracking-tight">Abonnés Newsletter</h1>
                    <div className="flex items-center gap-3">
                        {selected.length > 0 && (
                            <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                                Supprimer ({selected.length})
                            </Button>
                        )}
                        <Button variant="outline" size="sm" asChild>
                            <a href="/admin/newsletter/export">
                                <Download className="mr-2 size-4" />
                                Exporter CSV
                            </a>
                        </Button>
                        <Badge variant="secondary">
                            {subscribers.total} abonné{subscribers.total !== 1 ? 's' : ''}
                        </Badge>
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/50">
                            <tr>
                                <th className="w-10 px-4 py-3">
                                    <input type="checkbox" checked={allSelected} onChange={toggleAll} className="size-4 rounded border-gray-300" />
                                </th>
                                <th className="px-4 py-3 text-left font-medium">E-mail</th>
                                <th className="px-4 py-3 text-left font-medium">Date d'inscription</th>
                                <th className="px-4 py-3 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {subscribers.data.map((sub) => (
                                <tr key={sub.id} className={selected.includes(sub.id) ? 'bg-muted/30' : ''}>
                                    <td className="px-4 py-3">
                                        <input type="checkbox" checked={selected.includes(sub.id)} onChange={() => toggleOne(sub.id)} className="size-4 rounded border-gray-300" />
                                    </td>
                                    <td className="px-4 py-3 font-medium">{sub.email}</td>
                                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                                        {new Date(sub.created_at).toLocaleDateString('fr-FR', {
                                            day: '2-digit', month: '2-digit', year: 'numeric',
                                            hour: '2-digit', minute: '2-digit',
                                        })}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <Button variant="destructive" size="sm" onClick={() => handleDelete(sub)}>
                                            Supprimer
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {subscribers.data.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                                        Aucun abonné pour le moment.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {subscribers.last_page > 1 && (
                    <div className="flex items-center justify-center gap-1">
                        {subscribers.links.map((link, i) => (
                            <Button key={i} variant={link.active ? 'default' : 'outline'} size="sm" disabled={!link.url} asChild={!!link.url}>
                                {link.url ? (
                                    <Link href={link.url} dangerouslySetInnerHTML={{ __html: link.label }} />
                                ) : (
                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                )}
                            </Button>
                        ))}
                    </div>
                )}
            </div>
            <ConfirmDialog
                open={dialog.open}
                onOpenChange={dialog.setOpen}
                title={dialog.title}
                description={dialog.description}
                onConfirm={dialog.onConfirm}
            />
        </AppLayout>
    );
}
