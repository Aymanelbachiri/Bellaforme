import { Head, Link, router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConfirmDialog, useConfirmDialog } from '@/components/confirm-dialog';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Brand, PaginatedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tableau de bord', href: '/dashboard' },
    { title: 'Marques', href: '/admin/brands' },
];

export default function BrandsIndex({
    brands,
}: {
    brands: PaginatedData<Brand>;
}) {
    const dialog = useConfirmDialog();

    function handleDelete(brand: Brand) {
        dialog.confirm(
            `Supprimer "${brand.name}" ?`,
            'Cette marque sera définitivement supprimée. Cette action est irréversible.',
            () => router.delete(`/admin/brands/${brand.id}`),
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Marques" />

            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold tracking-tight">
                        Marques
                    </h1>
                    <Button asChild>
                        <Link href="/admin/brands/create">
                            Créer une marque
                        </Link>
                    </Button>
                </div>

                <div className="overflow-hidden rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/50">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">
                                    Logo
                                </th>
                                <th className="px-4 py-3 text-left font-medium">
                                    Nom
                                </th>
                                <th className="px-4 py-3 text-left font-medium">
                                    Division
                                </th>
                                <th className="px-4 py-3 text-left font-medium">
                                    Slug
                                </th>
                                <th className="px-4 py-3 text-left font-medium">
                                    Partenaire
                                </th>
                                <th className="px-4 py-3 text-left font-medium">
                                    Référence
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
                            {brands.data.map((brand) => (
                                <tr key={brand.id}>
                                    <td className="px-4 py-3">
                                        {brand.logo ? (
                                            <img
                                                src={`/storage/${brand.logo}`}
                                                alt={brand.name}
                                                className="h-10 w-16 rounded object-contain"
                                            />
                                        ) : (
                                            <div className="flex h-10 w-16 items-center justify-center rounded bg-muted text-xs text-muted-foreground">
                                                Pas de logo
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 font-medium">
                                        {brand.name}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {brand.divisions && brand.divisions.length > 0
                                            ? brand.divisions.map((d) => d.name).join(', ')
                                            : '—'}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {brand.slug}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge
                                            variant={
                                                brand.is_partner
                                                    ? 'default'
                                                    : 'secondary'
                                            }
                                        >
                                            {brand.is_partner ? 'Oui' : 'Non'}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge
                                            variant={
                                                brand.is_reference
                                                    ? 'default'
                                                    : 'secondary'
                                            }
                                        >
                                            {brand.is_reference ? 'Oui' : 'Non'}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        {brand.order}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge
                                            variant={
                                                brand.is_active
                                                    ? 'default'
                                                    : 'secondary'
                                            }
                                        >
                                            {brand.is_active
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
                                                    href={`/admin/brands/${brand.id}/edit`}
                                                >
                                                    Modifier
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() =>
                                                    handleDelete(brand)
                                                }
                                            >
                                                Supprimer
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {brands.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={9}
                                        className="px-4 py-8 text-center text-muted-foreground"
                                    >
                                        Aucune marque trouvée.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {brands.last_page > 1 && (
                    <div className="flex items-center justify-center gap-1">
                        {brands.links.map((link, i) => (
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
