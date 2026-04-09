import { Head, useForm } from '@inertiajs/react';
import { FileIcon, ImageIcon, Plus, Trash2 } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import InputError from '@/components/input-error';
import { MediaPicker, useMediaPicker } from '@/components/media-picker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { SolutionsSection, SolutionsSettings } from '@/types/models';

interface SeoProps {
    meta_title: string;
    meta_description: string;
}

export default function SolutionsEdit({ settings, seo }: { settings: SolutionsSettings; seo: SeoProps }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Tableau de bord', href: '/dashboard' },
        { title: 'Nos Solutions', href: '/admin/solutions' },
    ];

    const { data, setData, post, processing, errors } = useForm<{
        hero_title: string;
        hero_subtitle: string;
        hero_image: File | string | null;
        sections: SolutionsSection[];
        section_images: Record<number, File | string>;
        section_brochures: Record<number, File | string>;
        meta_title: string;
        meta_description: string;
        _method: 'PUT';
    }>({
        hero_title: settings.hero_title ?? '',
        hero_subtitle: settings.hero_subtitle ?? '',
        hero_image: null,
        meta_title: seo.meta_title ?? '',
        meta_description: seo.meta_description ?? '',
        sections: ((settings.sections ?? []) as SolutionsSection[]).map((s) => ({
            title: s.title || '',
            description: s.description || '',
            image: s.image || '',
            brochure: s.brochure || '',
        })),
        section_images: {},
        section_brochures: {},
        _method: 'PUT',
    });

    const [heroPreview, setHeroPreview] = useState(settings.hero_image ? `/storage/${settings.hero_image}` : '');
    const [imagePreviews, setImagePreviews] = useState<Record<number, string>>(() => {
        const initial: Record<number, string> = {};
        ((settings.sections ?? []) as SolutionsSection[]).forEach((s, i) => {
            if (s.image) initial[i] = `/storage/${s.image}`;
        });
        return initial;
    });
    const [brochureNames, setBrochureNames] = useState<Record<number, string>>(() => {
        const initial: Record<number, string> = {};
        ((settings.sections ?? []) as SolutionsSection[]).forEach((s, i) => {
            if (s.brochure) initial[i] = s.brochure.split('/').pop() || 'Brochure';
        });
        return initial;
    });

    const mediaPicker = useMediaPicker();
    const docPicker = useMediaPicker();

    function openHeroPicker() {
        mediaPicker.openPicker({
            type: 'image',
            directory: 'solutions',
            onSelect: (file) => { setData('hero_image', file.path); setHeroPreview(file.url); },
            onUpload: (file) => { setData('hero_image', file); setHeroPreview(URL.createObjectURL(file)); },
        });
    }

    function openImagePicker(index: number) {
        mediaPicker.openPicker({
            type: 'image',
            directory: 'solutions/sections',
            onSelect: (file) => {
                setData('section_images', { ...data.section_images, [index]: file.path });
                setImagePreviews((p) => ({ ...p, [index]: file.url }));
            },
            onUpload: (file) => {
                setData('section_images', { ...data.section_images, [index]: file });
                setImagePreviews((p) => ({ ...p, [index]: URL.createObjectURL(file) }));
            },
        });
    }

    function openBrochurePicker(index: number) {
        docPicker.openPicker({
            type: 'document',
            directory: 'solutions/brochures',
            onSelect: (file) => {
                setData('section_brochures', { ...data.section_brochures, [index]: file.path });
                setBrochureNames((p) => ({ ...p, [index]: file.name }));
            },
            onUpload: (file) => {
                setData('section_brochures', { ...data.section_brochures, [index]: file });
                setBrochureNames((p) => ({ ...p, [index]: file.name }));
            },
        });
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        post('/admin/solutions', { forceFormData: true, preserveScroll: true });
    }

    function addSolution() {
        setData('sections', [...data.sections, { title: '', description: '', image: '', brochure: '' }]);
    }

    function removeSolution(index: number) {
        const reindex = (record: Record<number, any>) => {
            const result: Record<number, any> = {};
            Object.entries(record).forEach(([key, val]) => {
                const k = parseInt(key);
                if (k < index) result[k] = val;
                else if (k > index) result[k - 1] = val;
            });
            return result;
        };
        setData((prev) => ({
            ...prev,
            sections: prev.sections.filter((_, i) => i !== index),
            section_images: reindex(prev.section_images),
            section_brochures: reindex(prev.section_brochures),
        }));
        setImagePreviews((prev) => reindex(prev));
        setBrochureNames((prev) => reindex(prev));
    }

    function removeBrochure(index: number) {
        const updated = data.sections.map((s, i) => (i === index ? { ...s, brochure: '' } : s));
        setData('sections', updated);
        const newBrochures = { ...data.section_brochures };
        delete newBrochures[index];
        setData('section_brochures', newBrochures);
        setBrochureNames((prev) => { const u = { ...prev }; delete u[index]; return u; });
    }

    function updateSolution(index: number, field: keyof SolutionsSection, val: string) {
        setData('sections', data.sections.map((s, i) => (i === index ? { ...s, [field]: val } : s)));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nos Solutions" />
            <div className="space-y-6 p-4">
                <h1 className="text-xl font-semibold tracking-tight">Nos Solutions à vos Projets</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Hero */}
                    <Card>
                        <CardHeader><CardTitle>Section hero</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label>Image hero</Label>
                                    {heroPreview && <img src={heroPreview} alt="Hero" className="h-32 w-full rounded object-cover" />}
                                    <Button type="button" variant="outline" className="w-fit gap-2" onClick={openHeroPicker}>
                                        <ImageIcon className="h-4 w-4" />
                                        {heroPreview ? 'Changer l\'image' : 'Sélectionner une image'}
                                    </Button>
                                    <InputError message={errors.hero_image} />
                                </div>
                                <div className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="hero_title">Titre</Label>
                                        <Input id="hero_title" value={data.hero_title} onChange={(e) => setData('hero_title', e.target.value)} />
                                        <InputError message={errors.hero_title} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="hero_subtitle">Sous-titre</Label>
                                        <Textarea id="hero_subtitle" value={data.hero_subtitle} onChange={(e) => setData('hero_subtitle', e.target.value)} rows={3} />
                                        <InputError message={errors.hero_subtitle} />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Solutions / Catalogues */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Catalogues / Brochures</CardTitle>
                                <Button type="button" variant="outline" size="sm" onClick={addSolution}>
                                    <Plus className="mr-1 h-4 w-4" /> Ajouter un catalogue
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {data.sections.length === 0 && (
                                <p className="text-sm text-muted-foreground">
                                    Aucun catalogue. Cliquez sur "Ajouter un catalogue" pour commencer.
                                </p>
                            )}
                            {data.sections.map((item, index) => (
                                <div key={index} className="rounded-lg border p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Catalogue {index + 1}</span>
                                        <Button type="button" variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => removeSolution(index)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {/* Title */}
                                    <div className="grid gap-2">
                                        <Label>Titre</Label>
                                        <Input value={item.title} onChange={(e) => updateSolution(index, 'title', e.target.value)} placeholder="Nom du catalogue" />
                                        <InputError message={(errors as Record<string, string>)[`sections.${index}.title`]} />
                                    </div>

                                    {/* Image + Brochure side by side */}
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {/* Image */}
                                        <div className="grid gap-2">
                                            <Label>Image de couverture</Label>
                                            {(imagePreviews[index] || item.image) && (
                                                <img src={imagePreviews[index] || `/storage/${item.image}`} alt={`Catalogue ${index + 1}`} className="h-32 w-full rounded object-cover" />
                                            )}
                                            <Button type="button" variant="outline" className="w-fit gap-2" onClick={() => openImagePicker(index)}>
                                                <ImageIcon className="h-4 w-4" />
                                                {(imagePreviews[index] || item.image) ? 'Changer' : 'Sélectionner une image'}
                                            </Button>
                                        </div>

                                        {/* Brochure PDF */}
                                        <div className="grid gap-2">
                                            <Label>Fichier PDF</Label>
                                            {(brochureNames[index] || item.brochure) && (
                                                <div className="flex items-center gap-2">
                                                    <FileIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                                                    <span className="text-sm text-muted-foreground truncate">
                                                        {brochureNames[index] || item.brochure.split('/').pop()}
                                                    </span>
                                                    <Button type="button" variant="ghost" size="icon" className="h-6 w-6 shrink-0 text-destructive" onClick={() => removeBrochure(index)}>
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            )}
                                            <Button type="button" variant="outline" className="w-fit gap-2" onClick={() => openBrochurePicker(index)}>
                                                <FileIcon className="h-4 w-4" />
                                                {(brochureNames[index] || item.brochure) ? 'Changer le PDF' : 'Ajouter un PDF'}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* SEO */}
                    <Card>
                        <CardHeader><CardTitle>SEO</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="meta_title">Titre Meta</Label>
                                <Input id="meta_title" value={data.meta_title} onChange={(e) => setData('meta_title', e.target.value)} placeholder="Nos Solutions à vos Projets - Bella Forme Group" />
                                <InputError message={errors.meta_title} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="meta_description">Description Meta</Label>
                                <Textarea id="meta_description" value={data.meta_description} onChange={(e) => setData('meta_description', e.target.value)} rows={3} placeholder="Description pour les moteurs de recherche..." />
                                <InputError message={errors.meta_description} />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Enregistrement...' : 'Enregistrer'}
                        </Button>
                    </div>
                </form>
            </div>

            {mediaPicker.config && (
                <MediaPicker open={mediaPicker.open} onOpenChange={mediaPicker.setOpen} onSelect={mediaPicker.config.onSelect} onUpload={mediaPicker.config.onUpload} type={mediaPicker.config.type} directory={mediaPicker.config.directory} />
            )}
            {docPicker.config && (
                <MediaPicker open={docPicker.open} onOpenChange={docPicker.setOpen} onSelect={docPicker.config.onSelect} onUpload={docPicker.config.onUpload} type={docPicker.config.type} directory={docPicker.config.directory} />
            )}
        </AppLayout>
    );
}
