import { Head, Link, useForm } from '@inertiajs/react';
import { FileIcon, ImageIcon } from 'lucide-react';
import { type FormEvent, useMemo, useState } from 'react';
import InputError from '@/components/input-error';
import { MediaPicker, useMediaPicker } from '@/components/media-picker';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { Brand, BreadcrumbItem, Category, Division } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Products', href: '/admin/products' },
    { title: 'Create', href: '/admin/products/create' },
];

const selectClass =
    'border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50';

const textareaClass =
    'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50';

interface SpecEntry { label: string; value: string; }

export default function ProductsCreate({
    divisions, categories, brands, nextOrder = 0,
}: {
    divisions: Pick<Division, 'id' | 'name'>[];
    categories: Pick<Category, 'id' | 'name' | 'division_id'>[];
    brands: Pick<Brand, 'id' | 'name'>[];
    nextOrder?: number;
}) {
    const { data, setData, post, processing, errors } = useForm<{
        content_mode: 'detailed' | 'brochure_only';
        division_id: string | number;
        category_id: string | number;
        brand_id: string | number;
        name: string;
        slug: string;
        short_description: string;
        description: string;
        featured_image: File | null;
        brochure_file: File | null;
        video_url: string;
        order: number;
        is_active: boolean;
        specifications: SpecEntry[];
        gallery: File[];
        meta_title: string;
        meta_description: string;
        og_image: File | null;
    }>({
        content_mode: 'detailed',
        division_id: '', category_id: '', brand_id: '',
        name: '', slug: '', short_description: '', description: '',
        featured_image: null, brochure_file: null, video_url: '',
        order: nextOrder, is_active: true, specifications: [], gallery: [],
        meta_title: '', meta_description: '', og_image: null,
    });

    const [previews, setPreviews] = useState<Record<string, string>>({});
    const mediaPicker = useMediaPicker();

    function openImagePicker(field: 'featured_image' | 'og_image', directory?: string) {
        mediaPicker.openPicker({
            type: 'image',
            directory,
            onSelect: (file) => {
                fetch(file.url).then((r) => r.blob()).then((blob) => {
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

    function openDocPicker(field: 'brochure_file', directory?: string) {
        mediaPicker.openPicker({
            type: 'document',
            directory,
            onSelect: (file) => {
                fetch(file.url).then((r) => r.blob()).then((blob) => {
                    const f = new File([blob], file.name, { type: blob.type });
                    setData(field, f);
                    setPreviews((p) => ({ ...p, [field]: file.name }));
                });
            },
            onUpload: (file) => {
                setData(field, file);
                setPreviews((p) => ({ ...p, [field]: file.name }));
            },
        });
    }

    const filteredCategories = useMemo(
        () => categories.filter((c) => c.division_id === Number(data.division_id)),
        [categories, data.division_id],
    );

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        post('/admin/products', { forceFormData: true });
    }

    function addSpec() { setData('specifications', [...data.specifications, { label: '', value: '' }]); }
    function removeSpec(index: number) { setData('specifications', data.specifications.filter((_, i) => i !== index)); }
    function updateSpec(index: number, field: 'label' | 'value', val: string) {
        const updated = [...data.specifications]; updated[index] = { ...updated[index], [field]: val }; setData('specifications', updated);
    }
    function moveSpec(index: number, direction: -1 | 1) {
        const target = index + direction;
        if (target < 0 || target >= data.specifications.length) return;
        const updated = [...data.specifications];
        [updated[index], updated[target]] = [updated[target], updated[index]];
        setData('specifications', updated);
    }
    function addGalleryFiles(files: FileList | null) {
        if (!files) return; setData('gallery', [...data.gallery, ...Array.from(files)]);
    }
    function removeGalleryFile(index: number) { setData('gallery', data.gallery.filter((_, i) => i !== index)); }
    function moveGallery(index: number, direction: -1 | 1) {
        const target = index + direction;
        if (target < 0 || target >= data.gallery.length) return;
        const updated = [...data.gallery];
        [updated[index], updated[target]] = [updated[target], updated[index]];
        setData('gallery', updated);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Product" />
            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold tracking-tight">Create Product</h1>
                    <Button variant="outline" asChild><Link href="/admin/products">Back</Link></Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Product Type Selector */}
                    <Card>
                        <CardHeader><CardTitle>Product Type</CardTitle></CardHeader>
                        <CardContent>
                            <div className="flex gap-2">
                                <Button type="button" variant={data.content_mode === 'detailed' ? 'default' : 'outline'} onClick={() => setData('content_mode', 'detailed')}>Full Product</Button>
                                <Button type="button" variant={data.content_mode === 'brochure_only' ? 'default' : 'outline'} onClick={() => setData('content_mode', 'brochure_only')}>Catalog Only</Button>
                            </div>
                            <InputError message={errors.content_mode} />
                        </CardContent>
                    </Card>

                    {/* Common Fields */}
                    <Card>
                        <CardHeader><CardTitle>Product Details</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="division_id">Division *</Label>
                                    <select id="division_id" className={selectClass} value={data.division_id} onChange={(e) => { setData('division_id', e.target.value ? parseInt(e.target.value) : ''); setData('category_id', ''); }} required>
                                        <option value="">Select a division</option>
                                        {divisions.map((d) => (<option key={d.id} value={d.id}>{d.name}</option>))}
                                    </select>
                                    <InputError message={errors.division_id} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="category_id">Category *</Label>
                                    <select id="category_id" className={selectClass} value={data.category_id} onChange={(e) => setData('category_id', e.target.value ? parseInt(e.target.value) : '')} required>
                                        <option value="">Select a category</option>
                                        {filteredCategories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                                    </select>
                                    <InputError message={errors.category_id} />
                                </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="brand_id">Brand</Label>
                                    <select id="brand_id" className={selectClass} value={data.brand_id} onChange={(e) => setData('brand_id', e.target.value ? parseInt(e.target.value) : '')}>
                                        <option value="">None</option>
                                        {brands.map((b) => (<option key={b.id} value={b.id}>{b.name}</option>))}
                                    </select>
                                    <InputError message={errors.brand_id} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name *</Label>
                                    <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                                    <InputError message={errors.name} />
                                </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="slug">Slug <span className="text-muted-foreground">(auto-generated if empty)</span></Label>
                                    <Input id="slug" value={data.slug} onChange={(e) => setData('slug', e.target.value)} />
                                    <InputError message={errors.slug} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="order">Order</Label>
                                    <Input id="order" type="number" value={data.order} onChange={(e) => setData('order', parseInt(e.target.value) || 0)} />
                                    <InputError message={errors.order} />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="short_description">Short Description *</Label>
                                <textarea id="short_description" className={textareaClass} value={data.short_description} onChange={(e) => setData('short_description', e.target.value)} required />
                                <InputError message={errors.short_description} />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                {/* Featured Image - MediaPicker */}
                                <div className="grid gap-2">
                                    <Label>Featured Image *</Label>
                                    {previews.featured_image && (
                                        <img src={previews.featured_image} alt="Featured preview" className="h-24 w-40 rounded object-cover" />
                                    )}
                                    <Button type="button" variant="outline" className="w-fit gap-2" onClick={() => openImagePicker('featured_image', 'products')}>
                                        <ImageIcon className="h-4 w-4" />
                                        {previews.featured_image ? 'Change Image' : 'Select Image'}
                                    </Button>
                                    <InputError message={errors.featured_image} />
                                </div>
                                <div className="flex items-end gap-2 pb-1">
                                    <Checkbox id="is_active" checked={data.is_active} onCheckedChange={(checked) => setData('is_active', checked === true)} />
                                    <Label htmlFor="is_active">Active</Label>
                                    <InputError message={errors.is_active} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Detailed-only fields */}
                    {data.content_mode === 'detailed' && (
                        <>
                            <Card>
                                <CardHeader><CardTitle>Detailed Content</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="description">Description *</Label>
                                        <textarea id="description" className={textareaClass} style={{ minHeight: '120px' }} value={data.description} onChange={(e) => setData('description', e.target.value)} required />
                                        <InputError message={errors.description} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="video_url">Video URL</Label>
                                        <Input id="video_url" type="url" value={data.video_url} onChange={(e) => setData('video_url', e.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
                                        <InputError message={errors.video_url} />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Specifications */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        Specifications
                                        <Button type="button" variant="outline" size="sm" onClick={addSpec}>Add Specification</Button>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {data.specifications.length === 0 && <p className="text-sm text-muted-foreground">No specifications added yet.</p>}
                                    {data.specifications.map((spec, index) => (
                                        <div key={index} className="flex items-start gap-2">
                                            <div className="flex flex-col gap-1">
                                                <Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0" disabled={index === 0} onClick={() => moveSpec(index, -1)}>↑</Button>
                                                <Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0" disabled={index === data.specifications.length - 1} onClick={() => moveSpec(index, 1)}>↓</Button>
                                            </div>
                                            <div className="grid flex-1 gap-2 sm:grid-cols-2">
                                                <Input placeholder="Label" value={spec.label} onChange={(e) => updateSpec(index, 'label', e.target.value)} />
                                                <Input placeholder="Value" value={spec.value} onChange={(e) => updateSpec(index, 'value', e.target.value)} />
                                            </div>
                                            <Button type="button" variant="destructive" size="sm" onClick={() => removeSpec(index)}>Remove</Button>
                                        </div>
                                    ))}
                                    <InputError message={errors.specifications} />
                                </CardContent>
                            </Card>

                            {/* Gallery */}
                            <Card>
                                <CardHeader><CardTitle>Image Gallery</CardTitle></CardHeader>
                                <CardContent className="space-y-3">
                                    <Input type="file" accept="image/*" multiple onChange={(e) => addGalleryFiles(e.target.files)} />
                                    {data.gallery.length > 0 && (
                                        <div className="space-y-2">
                                            {data.gallery.map((file, index) => (
                                                <div key={index} className="flex items-center gap-2 rounded border p-2">
                                                    <div className="flex flex-col gap-1">
                                                        <Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0" disabled={index === 0} onClick={() => moveGallery(index, -1)}>↑</Button>
                                                        <Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0" disabled={index === data.gallery.length - 1} onClick={() => moveGallery(index, 1)}>↓</Button>
                                                    </div>
                                                    <img src={URL.createObjectURL(file)} alt={`Gallery ${index + 1}`} className="h-12 w-16 rounded object-cover" />
                                                    <span className="flex-1 truncate text-sm">{file.name}</span>
                                                    <Badge variant="outline" className="text-xs">#{index + 1}</Badge>
                                                    <Button type="button" variant="destructive" size="sm" onClick={() => removeGalleryFile(index)}>Remove</Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <InputError message={errors.gallery} />
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {/* Brochure-only */}
                    {data.content_mode === 'brochure_only' && (
                        <Card>
                            <CardHeader><CardTitle>Brochure</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label>Brochure File (PDF) *</Label>
                                    {previews.brochure_file && (
                                        <p className="text-sm text-muted-foreground">Selected: {previews.brochure_file}</p>
                                    )}
                                    <Button type="button" variant="outline" className="w-fit gap-2" onClick={() => openDocPicker('brochure_file', 'products')}>
                                        <FileIcon className="h-4 w-4" />
                                        {previews.brochure_file ? 'Change File' : 'Select File'}
                                    </Button>
                                    <InputError message={errors.brochure_file} />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* SEO */}
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
                                        <img src={previews.og_image} alt="OG preview" className="h-16 w-28 rounded object-cover" />
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
                                <textarea id="meta_description" className={textareaClass} value={data.meta_description} onChange={(e) => setData('meta_description', e.target.value)} />
                                <InputError message={errors.meta_description} />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing}>{processing ? 'Creating...' : 'Create Product'}</Button>
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
