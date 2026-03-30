import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConfirmDialog, useConfirmDialog } from '@/components/confirm-dialog';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, ContactMessage, PaginatedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tableau de bord', href: '/dashboard' },
    { title: 'Messages de contact', href: '/admin/contact-messages' },
];

export default function ContactMessagesIndex({
    contactMessages,
}: {
    contactMessages: PaginatedData<ContactMessage>;
}) {
    const dialog = useConfirmDialog();
    const [selected, setSelected] = useState<number[]>([]);

    const allIds = contactMessages.data.map((m) => m.id);
    const allSelected = allIds.length > 0 && allIds.every((id) => selected.includes(id));

    function toggleAll() {
        setSelected(allSelected ? [] : allIds);
    }

    function toggleOne(id: number) {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
        );
    }

    function handleDelete(msg: ContactMessage) {
        dialog.confirm(
            `Supprimer le message de "${msg.name}" ?`,
            'Ce message sera définitivement supprimé. Cette action est irréversible.',
            () => router.delete(`/admin/contact-messages/${msg.id}`, {
                onSuccess: () => setSelected((prev) => prev.filter((i) => i !== msg.id)),
            }),
        );
    }

    function handleBulkDelete() {
        dialog.confirm(
            `Supprimer ${selected.length} message${selected.length > 1 ? 's' : ''} ?`,
            'Ces messages seront définitivement supprimés. Cette action est irréversible.',
            () => router.post('/admin/contact-messages/bulk-destroy', { ids: selected }, {
                onSuccess: () => setSelected([]),
            }),
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Messages de contact" />

            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold tracking-tight">
                        Messages de contact
                    </h1>
                    <div className="flex items-center gap-3">
                        {selected.length > 0 && (
                            <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                                Supprimer ({selected.length})
                            </Button>
                        )}
                        <Badge variant="secondary">
                            {contactMessages.total} message{contactMessages.total !== 1 ? 's' : ''}
                        </Badge>
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/50">
                            <tr>
                                <th className="w-10 px-4 py-3">
                                    <input
                                        type="checkbox"
                                        checked={allSelected}
                                        onChange={toggleAll}
                                        className="size-4 rounded border-gray-300"
                                    />
                                </th>
                                <th className="px-4 py-3 text-left font-medium">Nom</th>
                                <th className="px-4 py-3 text-left font-medium">E-mail</th>
                                <th className="px-4 py-3 text-left font-medium">Message</th>
                                <th className="px-4 py-3 text-left font-medium">Produit</th>
                                <th className="px-4 py-3 text-left font-medium">Date</th>
                                <th className="px-4 py-3 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {contactMessages.data.map((msg) => (
                                <tr key={msg.id} className={selected.includes(msg.id) ? 'bg-muted/30' : ''}>
                                    <td className="px-4 py-3">
                                        <input
                                            type="checkbox"
                                            checked={selected.includes(msg.id)}
                                            onChange={() => toggleOne(msg.id)}
                                            className="size-4 rounded border-gray-300"
                                        />
                                    </td>
                                    <td className="px-4 py-3 font-medium">{msg.name}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{msg.email}</td>
                                    <td className="max-w-xs truncate px-4 py-3 text-muted-foreground">
                                        {msg.message.length > 80
                                            ? msg.message.substring(0, 80) + '…'
                                            : msg.message}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {msg.product?.name ?? '—'}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                                        {new Date(msg.created_at).toLocaleDateString('fr-FR', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/admin/contact-messages/${msg.id}`}>
                                                    Voir
                                                </Link>
                                            </Button>
                                            <Button variant="destructive" size="sm" onClick={() => handleDelete(msg)}>
                                                Supprimer
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {contactMessages.data.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                                        Aucun message de contact trouvé.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {contactMessages.last_page > 1 && (
                    <div className="flex items-center justify-center gap-1">
                        {contactMessages.links.map((link, i) => (
                            <Button
                                key={i}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                asChild={!!link.url}
                            >
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
                onConfirm={dialog.handleConfirm}
            />
        </AppLayout>
    );
}