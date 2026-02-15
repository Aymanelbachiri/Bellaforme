import { Head, Link, router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConfirmDialog, useConfirmDialog } from '@/components/confirm-dialog';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, PaginatedData, Product } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Products', href: '/admin/products' },
];

export default function ProductsIndex({
    products,
}: {
    products: PaginatedData<Product>;
}) {
    const dialog = useConfirmDialog();

    function handleDelete(product: Product) {
        dialog.confirm(
            `Delete "${product.name}"?`,
            'This product will be permanently deleted. This action cannot be undone.',
            () => router.delete(`/admin/products/${product.id}`),
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />

            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold tracking-tight">
                        Products
                    </h1>
                    <Button asChild>
                        <Link href="/admin/products/create">
                            Create Product
                        </Link>
                    </Button>
                </div>

                <div className="overflow-hidden rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/50">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">Image</th>
                                <th className="px-4 py-3 text-left font-medium">Name</th>
                                <th className="px-4 py-3 text-left font-medium">Type</th>
                                <th className="px-4 py-3 text-left font-medium">Division</th>
                                <th className="px-4 py-3 text-left font-medium">Category</th>
                                <th className="px-4 py-3 text-left font-medium">Brand</th>
                                <th className="px-4 py-3 text-left font-medium">Order</th>
                                <th className="px-4 py-3 text-left font-medium">Status</th>
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
                                                No image
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 font-medium">{product.name}</td>
                                    <td className="px-4 py-3">
                                        <Badge variant={product.content_mode === 'detailed' ? 'default' : 'outline'}>
                                            {product.content_mode === 'detailed' ? 'Full' : 'Catalog'}
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
                                            {product.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(product)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {products.data.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">
                                        No products found.
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
