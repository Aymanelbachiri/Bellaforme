import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConfirmDialog, useConfirmDialog } from '@/components/confirm-dialog';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, PaginatedData, Product } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tableau de bord', href: '/dashboard' },
    { title: 'Produits', href: '/admin/products' },
];

export default function ProductsIndex({
    products,
    filters,
}: {
    products: PaginatedData<Product>;
    filters: { search: string };
}) {
    const dialog = useConfirmDialog();
    const [search, setSearch] = useState(filters.search ?? '');

    function handleDelete(product: Product) {
        dialog.confirm(
            `Supprimer "${product.name}" ?`,
            'Ce produit sera définitivement supprimé. Cette action est irréversible.',
            () => router.delete(`/admin/products/${product.id}`),
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Produits" />

            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold tracking-tight">
                        Produits
                    </h1>
                    <div className="flex items-center gap-3">
                        <form onSubmit={(e) => { e.preventDefault(); router.get('/admin/products', search ? { search } : {}, { preserveState: true }); }}>
                            <Input
                                placeholder="Rechercher..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-9 w-48"
                            />
                        </form>
                        <Button asChild>
                            <Link href="/admin/products/create">
                                Créer un produit
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/50">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">Image</th>
                                <th className="px-4 py-3 text-left font-medium">Nom</th>
                                <th className="px-4 py-3 text-left font-medium">Type</th>
                                <th className="px-4 py-3 text-left font-medium">Division</th>
                                <th className="px-4 py-3 text-left font-medium">Catégorie</th>
                                <th className="px-4 py-3 text-left font-medium">Marque</th>
                                <th className="px-4 py-3 text-left font-medium">Ordre</th>
                                <th className="px-4 py-3 text-left font-medium">Statut</th>
                                <th className="px-4 py-3 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {products.data.map((product) => (
                                <tr key={product.id}>
                                    <td className="px-4 py-3">
                                        {product.featured_image ? (
                                            <img
                                                src={`/storage/${product.featured_image}`}
                                                alt={product.name}
                                                className="h-10 w-16 rounded object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-10 w-16 items-center justify-center rounded bg-muted text-xs text-muted-foreground">
                                            Pas d'image
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 font-medium">{product.name}</td>
                                    <td className="px-4 py-3">
                                        <Badge variant={product.content_mode === 'detailed' ? 'default' : 'outline'}>
                                            {product.content_mode === 'detailed' ? 'Complet' : 'Catalogue'}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {product.division?.name ?? '—'}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {product.category?.name ?? '—'}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {product.brand?.name ?? '—'}
                                    </td>
                                    <td className="px-4 py-3">{product.order}</td>
                                    <td className="px-4 py-3">
                                        <Badge variant={product.is_active ? 'default' : 'secondary'}>
                                            {product.is_active ? 'Actif' : 'Inactif'}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/admin/products/${product.id}/edit`}>Modifier</Link>
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(product)}
                                            >
                                                Supprimer
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {products.data.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">
                                        Aucun produit trouvé.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {products.last_page > 1 && (
                    <div className="flex items-center justify-center gap-1">
                        {products.links.map((link, i) => (
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
                onConfirm={dialog.handleConfirm}
                title={dialog.title}
                description={dialog.description}
            />
        </AppLayout>
    );
}
