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

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tableau de bord', href: '/dashboard' },
    { title: 'Catégories', href: '/admin/categories' },
    { title: 'Créer', href: '/admin/categories/create' },
];

export default function CategoriesCreate({ divisions, nextOrder = 0 }: { divisions: Pick<Division, 'id' | 'name'>[]; nextOrder?: number }) {
    const { data, setData, post, processing, errors } = useForm({
        division_id: '' as string | number,
        name: '',
        slug: '',
        image: null as File | null,
        hero_image: null as File | null,
        video_cover: null as File | null,
        video_url: '',
        order: nextOrder,
        is_active: true,
        meta_title: '',
        meta_description: '',
        og_image: null as File | null,
    });

    const [previews, setPreviews] = useState<Record<string, string>>({});
    const mediaPicker = useMediaPicker();

    function openImagePicker(field: 'image' | 'hero_image' | 'video_cover' | 'og_image', directory?: string) {
        mediaPicker.openPicker({
            type: 'image',
            directory,
            onSelect: (file) => {
                setData(field, file.path);
                setPreviews((p) => ({ ...p, [field]: file.url }));
            },
            onUpload: (file) => {
                setData(field, file);
                setPreviews((p) => ({ ...p, [field]: URL.createObjectURL(file) }));
            },
        });
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        post('/admin/categories', { forceFormData: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Créer une catégorie" />
            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold tracking-tight">Créer une catégorie</h1>
                    <Button variant="outline" asChild><Link href="/admin/categories">Retour</Link></Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Détails de la catégorie</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nom *</Label>
                                    <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                                    <InputError message={errors.name} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="slug">Slug <span className="text-muted-foreground">(auto-généré si vide)</span></Label>
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
                                        onChange={(e) => setData('division_id', e.target.value ? parseInt(e.target.value) : '')}
                                        required
                                    >
                                        <option value="">Sélectionner une division</option>
                                        {divisions.map((d) => (<option key={d.id} value={d.id}>{d.name}</option>))}
                                    </select>
                                    <InputError message={errors.division_id} />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label>Image carte *</Label>
                                    {previews.image && (
                                        <img src={previews.image} alt="Image preview" className="h-24 w-40 rounded object-cover" />
                                    )}
                                    <Button type="button" variant="outline" className="w-fit gap-2" onClick={() => openImagePicker('image', 'categories')}>
                                        <ImageIcon className="h-4 w-4" />
                                        {previews.image ? 'Changer l\'image' : 'Sélectionner une image'}
                                    </Button>
                                    <InputError message={errors.image} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Image hero</Label>
                                    {previews.hero_image && (
                                        <img src={previews.hero_image} alt="Hero preview" className="h-24 w-40 rounded object-cover" />
                                    )}
                                    <Button type="button" variant="outline" className="w-fit gap-2" onClick={() => openImagePicker('hero_image', 'categories')}>
                                        <ImageIcon className="h-4 w-4" />
                                        {previews.hero_image ? 'Changer l\'image' : 'Sélectionner une image'}
                                    </Button>
                                    <InputError message={errors.hero_image} />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="order">Ordre</Label>
                                    <Input id="order" type="number" value={data.order} onChange={(e) => setData('order', parseInt(e.target.value) || 0)} />
                                    <InputError message={errors.order} />
                                </div>
                                <div className="flex items-end gap-2 pb-1">
                                    <Checkbox id="is_active" checked={data.is_active} onCheckedChange={(checked) => setData('is_active', checked === true)} />
                                    <Label htmlFor="is_active">Actif</Label>
                                    <InputError message={errors.is_active} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Vidéo</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label>Couverture vidéo</Label>
                                    {previews.video_cover && (
                                        <img src={previews.video_cover} alt="Video cover" className="h-24 w-40 rounded object-cover" />
                                    )}
                                    <Button type="button" variant="outline" className="w-fit gap-2" onClick={() => openImagePicker('video_cover', 'categories')}>
                                        <ImageIcon className="h-4 w-4" />
                                        {previews.video_cover ? 'Changer l\'image' : 'Sélectionner une image'}
                                    </Button>
                                    <InputError message={errors.video_cover} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="video_url">Lien YouTube</Label>
                                    <Input id="video_url" type="url" value={data.video_url} onChange={(e) => setData('video_url', e.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
                                    <InputError message={errors.video_url} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Métadonnées SEO</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="meta_title">Titre Meta</Label>
                                    <Input id="meta_title" value={data.meta_title} onChange={(e) => setData('meta_title', e.target.value)} />
                                    <InputError message={errors.meta_title} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Image OG</Label>
                                    {previews.og_image && (
                                        <img src={previews.og_image} alt="OG preview" className="h-16 w-28 rounded object-cover" />
                                    )}
                                    <Button type="button" variant="outline" className="w-fit gap-2" onClick={() => openImagePicker('og_image', 'seo')}>
                                        <ImageIcon className="h-4 w-4" />
                                        {previews.og_image ? 'Changer l\'image' : 'Sélectionner une image'}
                                    </Button>
                                    <InputError message={errors.og_image} />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="meta_description">Description Meta</Label>
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
                        <Button type="submit" disabled={processing}>{processing ? 'Création...' : 'Créer la catégorie'}</Button>
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
