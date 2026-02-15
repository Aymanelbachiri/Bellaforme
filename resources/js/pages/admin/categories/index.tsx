import { Head, Link, router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConfirmDialog, useConfirmDialog } from '@/components/confirm-dialog';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Category, PaginatedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Categories', href: '/admin/categories' },
];

export default function CategoriesIndex({
    categories,
}: {
    categories: PaginatedData<Category>;
}) {
    const dialog = useConfirmDialog();

    function handleDelete(category: Category) {
        dialog.confirm(
            `Delete "${category.name}"?`,
            'This category will be permanently deleted. This action cannot be undone.',
            () => router.delete(`/admin/categories/${category.id}`),
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories" />

            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold tracking-tight">
                        Categories
                    </h1>
                    <Button asChild>
                        <Link href="/admin/categories/create">
                            Create Category
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
                                    Name
                                </th>
                                <th className="px-4 py-3 text-left font-medium">
                                    Slug
                                </th>
                                <th className="px-4 py-3 text-left font-medium">
                                    Division
                                </th>
                                <th className="px-4 py-3 text-left font-medium">
                                    Order
                                </th>
                                <th className="px-4 py-3 text-left font-medium">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-right font-medium">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {categories.data.map((category) => (
                                <tr key={category.id}>
                                    <td className="px-4 py-3">
                                        {category.image ? (
                                            <img
                                                src={`/storage/${category.image}`}
                                                alt={category.name}
                                                className="h-10 w-16 rounded object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-10 w-16 items-center justify-center rounded bg-muted text-xs text-muted-foreground">
                                                No image
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 font-medium">
                                        {category.name}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {category.slug}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {category.division?.name ?? '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {category.order}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge
                                            variant={
                                                category.is_active
                                                    ? 'default'
                                                    : 'secondary'
                                            }
                                        >
                                            {category.is_active
                                                ? 'Active'
                                                : 'Inactive'}
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
                                                    href={`/admin/categories/${category.id}/edit`}
                                                >
                                                    Edit
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() =>
                                                    handleDelete(category)
                                                }
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {categories.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-4 py-8 text-center text-muted-foreground"
                                    >
                                        No categories found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {categories.last_page > 1 && (
                    <div className="flex items-center justify-center gap-1">
                        {categories.links.map((link, i) => (
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
