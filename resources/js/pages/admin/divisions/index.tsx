import { Head, Link, router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConfirmDialog, useConfirmDialog } from '@/components/confirm-dialog';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Division, PaginatedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tableau de bord', href: '/dashboard' },
    { title: 'Divisions', href: '/admin/divisions' },
];

export default function DivisionsIndex({
    divisions,
}: {
    divisions: PaginatedData<Division>;
}) {
    const dialog = useConfirmDialog();

    function handleDelete(division: Division) {
        dialog.confirm(
            `Supprimer "${division.name}" ?`,
            'Cette division et toutes ses données seront définitivement supprimées. Cette action est irréversible.',
            () => router.delete(`/admin/divisions/${division.id}`),
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Divisions" />

            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold tracking-tight">
                        Divisions
                    </h1>
                    <Button asChild>
                        <Link href="/admin/divisions/create">
                            Créer une division
                        </Link>
                    </Button>
                </div>

                <div className="overflow-hidden rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/50">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">
                                    Image
                                </th>
                                <th className="px-4 py-3 text-left font-medium">
                                    Nom
                                </th>
                                <th className="px-4 py-3 text-left font-medium">
                                    Slug
                                </th>
                                <th className="px-4 py-3 text-left font-medium">
                                    Ordre
                                </th>
                                <th className="px-4 py-3 text-left font-medium">
                                    Statut
                                </th>
                                <th className="px-4 py-3 text-right font-medium">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {divisions.data.map((division) => (
                                <tr key={division.id}>
                                    <td className="px-4 py-3">
                                        {division.hero_image ? (
                                            <img
                                                src={`/storage/${division.hero_image}`}
                                                alt={division.name}
                                                className="h-10 w-16 rounded object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-10 w-16 items-center justify-center rounded bg-muted text-xs text-muted-foreground">
                                    Pas d'image
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 font-medium">
                                        {division.name}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {division.slug}
                                    </td>
                                    <td className="px-4 py-3">
                                        {division.order}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge
                                            variant={
                                                division.is_active
                                                    ? 'default'
                                                    : 'secondary'
                                            }
                                        >
                                            {division.is_active
                                                ? 'Actif'
                                                : 'Inactif'}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                asChild
                                            >
                                                <Link
                                                    href={`/admin/divisions/${division.id}/edit`}
                                                >
                                                    Modifier
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() =>
                                                    handleDelete(division)
                                                }
                                            >
                                                Supprimer
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {divisions.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-4 py-8 text-center text-muted-foreground"
                                    >
                                    Aucune division trouvée.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {divisions.last_page > 1 && (
                    <div className="flex items-center justify-center gap-1">
                        {divisions.links.map((link, i) => (
                            <Button
                                key={i}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                asChild={!!link.url}
                            >
                                {link.url ? (
                                    <Link
                                        href={link.url}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ) : (
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                )}
                            </Button>
                        ))}
                    </div>
                )}
            </div>
            <ConfirmDialog
                open={dialog.open}
                onOpenChange={dialog.setOpen}
                onConfirm={dialog.handleConfirm}
                title={dialog.title}
                description={dialog.description}
            />
        </AppLayout>
    );
}
