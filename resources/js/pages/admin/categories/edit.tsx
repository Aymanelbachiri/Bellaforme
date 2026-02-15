import { Head, Link, useForm } from '@inertiajs/react';
import { ImageIcon } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import InputError from '@/components/input-error';
import { MediaPicker, useMediaPicker } from '@/components/media-picker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Category, Division } from '@/types';

export default function CategoriesEdit({ category, divisions }: { category: Category; divisions: Pick<Division, 'id' | 'name'>[] }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Categories', href: '/admin/categories' },
        { title: category.name, href: `/admin/categories/${category.id}/edit` },
    ];

    const { data, setData, post, processing, errors } = useForm({
        division_id: category.division_id,
        name: category.name,
        slug: category.slug,
        image: null as File | null,
        order: category.order,
        is_active: category.is_active,
        meta_title: category.seo?.meta_title ?? '',
        meta_description: category.seo?.meta_description ?? '',
        og_image: null as File | null,
        _method: 'PUT' as const,
    });

    const [previews, setPreviews] = useState<Record<string, string>>({
        image: category.image ? `/storage/${category.image}` : '',
        og_image: category.seo?.og_image ? `/storage/${category.seo.og_image}` : '',
    });
    const mediaPicker = useMediaPicker();

    function openImagePicker(field: 'image' | 'og_image', directory?: string) {
        mediaPicker.openPicker({
            type: 'image',
            directory,
            onSelect: (file) => {
                fetch(file.url)
                    .then((r) => r.blob())
                    .then((blob) => {
                        const f = new File([blob], file.name, { type: blob.type });
                        setData(field, f);
                        setPreviews((p) => ({ ...p, [field]: file.url }));
                    });
            },
            onUpload: (file) => {
                setData(field, file);
                setPreviews((p) => ({ ...p, [field]: URL.createObjectURL(file) }));
            },
        });
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        post(`/admin/categories/${category.id}`, { forceFormData: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${category.name}`} />
            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold tracking-tight">Edit Category</h1>
                    <Button variant="outline" asChild><Link href="/admin/categories">Back</Link></Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Category Details</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name *</Label>
                                    <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                                    <InputError message={errors.name} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="slug">Slug</Label>
                                    <Input id="slug" value={data.slug} onChange={(e) => setData('slug', e.target.value)} />
                                    <InputError message={errors.slug} />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="division_id">Division *</Label>
                                    <select
                                        id="division_id"
                                        className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                        value={data.division_id}
                                        onChange={(e) => setData('division_id', parseInt(e.target.value))}
                                        required
                                    >
                                        <option value="">Select a division</option>
                                        {divisions.map((d) => (<option key={d.id} value={d.id}>{d.name}</option>))}
                                    </select>
                                    <InputError message={errors.division_id} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Image</Label>
                                    {previews.image && (
                                        <img src={previews.image} alt={category.name} className="h-24 w-40 rounded object-cover" />
                                    )}
                                    <Button type="button" variant="outline" className="w-fit gap-2" onClick={() => openImagePicker('image', 'categories')}>
                                        <ImageIcon className="h-4 w-4" />
                                        {previews.image ? 'Change Image' : 'Select Image'}
                                    </Button>
                                    <InputError message={errors.image} />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="order">Order</Label>
                                    <Input id="order" type="number" value={data.order} onChange={(e) => setData('order', parseInt(e.target.value) || 0)} />
                                    <InputError message={errors.order} />
                                </div>
                                <div className="flex items-end gap-2 pb-1">
                                    <Checkbox id="is_active" checked={data.is_active} onCheckedChange={(checked) => setData('is_active', checked === true)} />
                                    <Label htmlFor="is_active">Active</Label>
                                    <InputError message={errors.is_active} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>SEO Metadata</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="meta_title">Meta Title</Label>
                                    <Input id="meta_title" value={data.meta_title} onChange={(e) => setData('meta_title', e.target.value)} />
                                    <InputError message={errors.meta_title} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>OG Image</Label>
                                    {previews.og_image && (
                                        <img src={previews.og_image} alt="OG image" className="h-16 w-28 rounded object-cover" />
                                    )}
                                    <Button type="button" variant="outline" className="w-fit gap-2" onClick={() => openImagePicker('og_image', 'seo')}>
                                        <ImageIcon className="h-4 w-4" />
                                        {previews.og_image ? 'Change Image' : 'Select Image'}
                                    </Button>
                                    <InputError message={errors.og_image} />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="meta_description">Meta Description</Label>
                                <textarea
                                    id="meta_description"
                                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                    value={data.meta_description}
                                    onChange={(e) => setData('meta_description', e.target.value)}
                                />
                                <InputError message={errors.meta_description} />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing}>{processing ? 'Saving...' : 'Update Category'}</Button>
                    </div>
                </form>
            </div>

            {mediaPicker.config && (
                <MediaPicker
                    open={mediaPicker.open}
                    onOpenChange={mediaPicker.setOpen}
                    onSelect={mediaPicker.config.onSelect}
                    onUpload={mediaPicker.config.onUpload}
                    type={mediaPicker.config.type}
                    directory={mediaPicker.config.directory}
                />
            )}
        </AppLayout>
    );
}
