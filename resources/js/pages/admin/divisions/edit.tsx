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
import type { BreadcrumbItem, Division } from '@/types';

export default function DivisionsEdit({ division }: { division: Division }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Divisions', href: '/admin/divisions' },
        { title: division.name, href: `/admin/divisions/${division.id}/edit` },
    ];

    const { data, setData, post, processing, errors } = useForm({
        name: division.name,
        slug: division.slug,
        hero_image: null as File | null,
        homepage_image: null as File | null,
        hero_title: division.hero_title ?? '',
        hero_subtitle: division.hero_subtitle ?? '',
        homepage_subtitle: division.homepage_subtitle ?? '',
        order: division.order,
        is_active: division.is_active,
        meta_title: division.seo?.meta_title ?? '',
        meta_description: division.seo?.meta_description ?? '',
        og_image: null as File | null,
        _method: 'PUT' as const,
    });

    // Track preview URLs for selected/uploaded images
    const [previews, setPreviews] = useState<Record<string, string>>({
        hero_image: division.hero_image ? `/storage/${division.hero_image}` : '',
        homepage_image: division.homepage_image ? `/storage/${division.homepage_image}` : '',
        og_image: division.seo?.og_image ? `/storage/${division.seo.og_image}` : '',
    });

    const mediaPicker = useMediaPicker();

    function openImagePicker(field: 'hero_image' | 'homepage_image' | 'og_image', directory?: string) {
        mediaPicker.openPicker({
            type: 'image',
            directory,
            onSelect: (file) => {
                // For existing files, we fetch them as a blob and set as File
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
        post(`/admin/divisions/${division.id}`, { forceFormData: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${division.name}`} />

            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold tracking-tight">Edit Division</h1>
                    <Button variant="outline" asChild>
                        <Link href="/admin/divisions">Back</Link>
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Division Details</CardTitle></CardHeader>
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
                                    <Label htmlFor="hero_title">Hero Title</Label>
                                    <Input id="hero_title" value={data.hero_title} onChange={(e) => setData('hero_title', e.target.value)} />
                                    <InputError message={errors.hero_title} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
                                    <Input id="hero_subtitle" value={data.hero_subtitle} onChange={(e) => setData('hero_subtitle', e.target.value)} />
                                    <InputError message={errors.hero_subtitle} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="homepage_subtitle">Homepage Subtitle</Label>
                                <Input id="homepage_subtitle" value={data.homepage_subtitle} onChange={(e) => setData('homepage_subtitle', e.target.value)} placeholder="Separate subtitle for homepage display" />
                                <InputError message={errors.homepage_subtitle} />
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
                        <CardHeader><CardTitle>Images</CardTitle></CardHeader>
                        <CardContent>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label>Hero Image</Label>
                                    {previews.hero_image && (
                                        <img src={previews.hero_image} alt={division.name} className="h-32 w-full rounded object-cover" />
                                    )}
                                    <Button type="button" variant="outline" className="w-fit gap-2" onClick={() => openImagePicker('hero_image', 'divisions')}>
                                        <ImageIcon className="h-4 w-4" />
                                        {previews.hero_image ? 'Change Image' : 'Select Image'}
                                    </Button>
                                    <InputError message={errors.hero_image} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Homepage Background Image</Label>
                                    {previews.homepage_image && (
                                        <img src={previews.homepage_image} alt={`${division.name} homepage`} className="h-32 w-full rounded object-cover" />
                                    )}
                                    <Button type="button" variant="outline" className="w-fit gap-2" onClick={() => openImagePicker('homepage_image', 'divisions')}>
                                        <ImageIcon className="h-4 w-4" />
                                        {previews.homepage_image ? 'Change Image' : 'Select Image'}
                                    </Button>
                                    <InputError message={errors.homepage_image} />
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
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Update Division'}
                        </Button>
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
