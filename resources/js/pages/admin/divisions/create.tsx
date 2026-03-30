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
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tableau de bord', href: '/dashboard' },
    { title: 'Divisions', href: '/admin/divisions' },
    { title: 'Créer', href: '/admin/divisions/create' },
];

export default function DivisionsCreate({ nextOrder = 0 }: { nextOrder?: number }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        slug: '',
        hero_image: null as File | null,
        homepage_image: null as File | null,
        hero_title: '',
        hero_subtitle: '',
        homepage_subtitle: '',
        phone: '',
        facebook_url: '',
        instagram_url: '',
        linkedin_url: '',
        youtube_url: '',
        order: nextOrder,
        is_active: true,
        meta_title: '',
        meta_description: '',
        og_image: null as File | null,
    });

    const [previews, setPreviews] = useState<Record<string, string>>({});
    const mediaPicker = useMediaPicker();

    function openImagePicker(field: 'hero_image' | 'homepage_image' | 'og_image', directory?: string) {
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
        post('/admin/divisions', { forceFormData: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Créer une division" />

            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold tracking-tight">Créer une division</h1>
                    <Button variant="outline" asChild>
                        <Link href="/admin/divisions">Retour</Link>
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Détails de la division</CardTitle></CardHeader>
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
                                    <Label htmlFor="hero_title">Titre hero</Label>
                                    <Input id="hero_title" value={data.hero_title} onChange={(e) => setData('hero_title', e.target.value)} />
                                    <InputError message={errors.hero_title} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="hero_subtitle">Sous-titre hero</Label>
                                    <Input id="hero_subtitle" value={data.hero_subtitle} onChange={(e) => setData('hero_subtitle', e.target.value)} />
                                    <InputError message={errors.hero_subtitle} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="homepage_subtitle">Sous-titre page d'accueil</Label>
                                <Input id="homepage_subtitle" value={data.homepage_subtitle} onChange={(e) => setData('homepage_subtitle', e.target.value)} placeholder="Sous-titre séparé pour l'affichage sur la page d'accueil" />
                                <InputError message={errors.homepage_subtitle} />
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
                        <CardHeader><CardTitle>Images</CardTitle></CardHeader>
                        <CardContent>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label>Image hero *</Label>
                                    {previews.hero_image && (
                                        <img src={previews.hero_image} alt="Hero preview" className="h-32 w-full rounded object-cover" />
                                    )}
                                    <Button type="button" variant="outline" className="w-fit gap-2" onClick={() => openImagePicker('hero_image', 'divisions')}>
                                        <ImageIcon className="h-4 w-4" />
                                        {previews.hero_image ? 'Changer l\'image' : 'Sélectionner une image'}
                                    </Button>
                                    <InputError message={errors.hero_image} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Image de fond page d'accueil</Label>
                                    {previews.homepage_image && (
                                        <img src={previews.homepage_image} alt="Homepage preview" className="h-32 w-full rounded object-cover" />
                                    )}
                                    <Button type="button" variant="outline" className="w-fit gap-2" onClick={() => openImagePicker('homepage_image', 'divisions')}>
                                        <ImageIcon className="h-4 w-4" />
                                        {previews.homepage_image ? 'Changer l\'image' : 'Sélectionner une image'}
                                    </Button>
                                    <InputError message={errors.homepage_image} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Contact & Réseaux sociaux</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Téléphone</Label>
                                    <Input id="phone" value={data.phone} onChange={(e) => setData('phone', e.target.value)} placeholder="+212 5XX XXX XXX" />
                                    <InputError message={errors.phone} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="linkedin_url">LinkedIn</Label>
                                    <Input id="linkedin_url" type="url" value={data.linkedin_url} onChange={(e) => setData('linkedin_url', e.target.value)} placeholder="https://linkedin.com/..." />
                                    <InputError message={errors.linkedin_url} />
                                </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="facebook_url">Facebook</Label>
                                    <Input id="facebook_url" type="url" value={data.facebook_url} onChange={(e) => setData('facebook_url', e.target.value)} placeholder="https://facebook.com/..." />
                                    <InputError message={errors.facebook_url} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="instagram_url">Instagram</Label>
                                    <Input id="instagram_url" type="url" value={data.instagram_url} onChange={(e) => setData('instagram_url', e.target.value)} placeholder="https://instagram.com/..." />
                                    <InputError message={errors.instagram_url} />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="youtube_url">YouTube</Label>
                                <Input id="youtube_url" type="url" value={data.youtube_url} onChange={(e) => setData('youtube_url', e.target.value)} placeholder="https://youtube.com/..." />
                                <InputError message={errors.youtube_url} />
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
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Création...' : 'Créer la division'}
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
