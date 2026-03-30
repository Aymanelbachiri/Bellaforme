import { Head, useForm } from '@inertiajs/react';
import { ImageIcon, Plus, Trash2 } from 'lucide-react';
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

export default function SolutionsEdit({ settings }: { settings: SolutionsSettings }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Tableau de bord', href: '/dashboard' },
        { title: 'Nos Solutions', href: '/admin/solutions' },
    ];

    const { data, setData, post, processing, errors } = useForm<{
        hero_title: string;
        hero_subtitle: string;
        hero_image: File | null;
        sections: SolutionsSection[];
        section_images: Record<number, File>;
        _method: 'PUT';
    }>({
        hero_title: settings.hero_title ?? '',
        hero_subtitle: settings.hero_subtitle ?? '',
        hero_image: null,
        sections: ((settings.sections ?? []) as SolutionsSection[]).map((s) => ({
            title: s.title || '',
            description: s.description || '',
            image: s.image || '',
        })),
        section_images: {},
        _method: 'PUT',
    });

    const [heroPreview, setHeroPreview] = useState(settings.hero_image ? `/storage/${settings.hero_image}` : '');
    const [sectionImagePreviews, setSectionImagePreviews] = useState<Record<number, string>>(() => {
        const initial: Record<number, string> = {};
        ((settings.sections ?? []) as SolutionsSection[]).forEach((s, i) => {
            if (s.image) initial[i] = `/storage/${s.image}`;
        });
        return initial;
    });

    const mediaPicker = useMediaPicker();

    function openHeroPicker() {
        mediaPicker.openPicker({
            type: 'image',
            directory: 'solutions',
            onSelect: (file) => {
                setData('hero_image', file.path);
                setHeroPreview(file.url);
            },
            onUpload: (file) => {
                setData('hero_image', file);
                setHeroPreview(URL.createObjectURL(file));
            },
        });
    }

    function openSectionPicker(index: number) {
        mediaPicker.openPicker({
            type: 'image',
            directory: 'solutions/sections',
            onSelect: (file) => {
                setData('section_images', { ...data.section_images, [index]: file.path });
                setSectionImagePreviews((p) => ({ ...p, [index]: file.url }));
            },
            onUpload: (file) => {
                setData('section_images', { ...data.section_images, [index]: file });
                setSectionImagePreviews((p) => ({ ...p, [index]: URL.createObjectURL(file) }));
            },
        });
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        post('/admin/solutions', { forceFormData: true, preserveScroll: true });
    }

    function addSection() {
        setData('sections', [...data.sections, { title: '', description: '', image: '' }]);
    }

    function removeSection(index: number) {
        const newSections = data.sections.filter((_, i) => i !== index);
        const newImages: Record<number, File> = {};
        Object.entries(data.section_images).forEach(([key, file]) => {
            const oldIndex = parseInt(key);
            if (oldIndex < index) newImages[oldIndex] = file;
            else if (oldIndex > index) newImages[oldIndex - 1] = file;
        });
        setData((prev) => ({ ...prev, sections: newSections, section_images: newImages }));
        setSectionImagePreviews((prev) => {
            const updated: Record<number, string> = {};
            Object.entries(prev).forEach(([key, url]) => {
                const oldIndex = parseInt(key);
                if (oldIndex < index) updated[oldIndex] = url;
                else if (oldIndex > index) updated[oldIndex - 1] = url;
            });
            return updated;
        });
    }

    function updateSection(index: number, field: keyof SolutionsSection, val: string) {
        const updated = data.sections.map((s, i) => (i === index ? { ...s, [field]: val } : s));
        setData('sections', updated);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nos Solutions" />
            <div className="space-y-6 p-4">
                <h1 className="text-xl font-semibold tracking-tight">Paramètres — Nos Solutions à vos Projets</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Hero */}
                    <Card>
                        <CardHeader><CardTitle>Section hero</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label>Image hero</Label>
                                    {heroPreview && (
                                        <img src={heroPreview} alt="Hero" className="h-32 w-full rounded object-cover" />
                                    )}
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

                    {/* Sections */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Sections</CardTitle>
                                <Button type="button" variant="outline" size="sm" onClick={addSection}>
                                    <Plus className="mr-1 h-4 w-4" /> Ajouter une section
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {data.sections.length === 0 && (
                                <p className="text-sm text-muted-foreground">
                                    Aucune section. Cliquez sur "Ajouter une section" pour commencer.
                                </p>
                            )}
                            {data.sections.map((section, index) => (
                                <div key={index} className="rounded-lg border p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Section {index + 1}</span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:text-destructive"
                                            onClick={() => removeSection(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Titre</Label>
                                        <Input
                                            value={section.title}
                                            onChange={(e) => updateSection(index, 'title', e.target.value)}
                                            placeholder="Titre de la section"
                                        />
                                        <InputError message={(errors as Record<string, string>)[`sections.${index}.title`]} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Description</Label>
                                        <Textarea
                                            value={section.description}
                                            onChange={(e) => updateSection(index, 'description', e.target.value)}
                                            placeholder="Description de la section"
                                            rows={4}
                                        />
                                        <InputError message={(errors as Record<string, string>)[`sections.${index}.description`]} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Image</Label>
                                        {(sectionImagePreviews[index] || section.image) && (
                                            <img
                                                src={sectionImagePreviews[index] || `/storage/${section.image}`}
                                                alt={`Section ${index + 1}`}
                                                className="h-20 w-32 rounded object-cover"
                                            />
                                        )}
                                        <Button type="button" variant="outline" className="w-fit gap-2" onClick={() => openSectionPicker(index)}>
                                            <ImageIcon className="h-4 w-4" />
                                            {(sectionImagePreviews[index] || section.image) ? 'Changer l\'image' : 'Sélectionner une image'}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Enregistrement...' : 'Enregistrer les paramètres'}
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
