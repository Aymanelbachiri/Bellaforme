import { Head, useForm } from '@inertiajs/react';
import { Film, ImageIcon, Plus, Trash2 } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import InputError from '@/components/input-error';
import { MediaPicker, useMediaPicker } from '@/components/media-picker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { HeroSlide, HomepageSettings } from '@/types/models';

export default function HomepageEdit({ settings }: { settings: HomepageSettings }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Homepage Settings', href: '/admin/homepage' },
    ];

    const { data, setData, post, processing, errors } = useForm<{
        hero_image: File | null;
        hero_title: string;
        hero_subtitle: string;
        hero_slides: HeroSlide[];
        hero_slide_images: Record<number, File>;
        stats: Array<{ label: string; value: string }>;
        _method: 'PUT';
    }>({
        hero_image: null,
        hero_title: settings.hero_title ?? '',
        hero_subtitle: settings.hero_subtitle ?? '',
        hero_slides: ((settings.hero_slides ?? []) as HeroSlide[]).map((s) => ({
            type: s.type,
            media_url: s.media_url || '',
            title: s.title || '',
            subtitle: s.subtitle || '',
            button_text: s.button_text || '',
            button_url: s.button_url || '',
        })),
        hero_slide_images: {},
        stats: (settings.stats ?? []) as Array<{ label: string; value: string }>,
        _method: 'PUT',
    });

    const [heroPreview, setHeroPreview] = useState(settings.hero_image ? `/storage/${settings.hero_image}` : '');
    const [slideImagePreviews, setSlideImagePreviews] = useState<Record<number, string>>(() => {
        const initial: Record<number, string> = {};
        ((settings.hero_slides ?? []) as HeroSlide[]).forEach((s, i) => {
            if (s.type === 'image' && s.media_url) initial[i] = `/storage/${s.media_url}`;
        });
        return initial;
    });
    const mediaPicker = useMediaPicker();
    // Track which field/index the picker is for
    const [pickerTarget, setPickerTarget] = useState<{ type: 'hero' } | { type: 'slide'; index: number } | null>(null);

    function openHeroPicker() {
        setPickerTarget({ type: 'hero' });
        mediaPicker.openPicker({
            type: 'image',
            directory: 'homepage',
            onSelect: (file) => {
                fetch(file.url).then((r) => r.blob()).then((blob) => {
                    const f = new File([blob], file.name, { type: blob.type });
                    setData('hero_image', f);
                    setHeroPreview(file.url);
                });
            },
            onUpload: (file) => {
                setData('hero_image', file);
                setHeroPreview(URL.createObjectURL(file));
            },
        });
    }

    function openSlidePicker(index: number) {
        setPickerTarget({ type: 'slide', index });
        mediaPicker.openPicker({
            type: 'image',
            directory: 'homepage/slides',
            onSelect: (file) => {
                fetch(file.url).then((r) => r.blob()).then((blob) => {
                    const f = new File([blob], file.name, { type: blob.type });
                    setData('hero_slide_images', { ...data.hero_slide_images, [index]: f });
                    setSlideImagePreviews((p) => ({ ...p, [index]: file.url }));
                });
            },
            onUpload: (file) => {
                setData('hero_slide_images', { ...data.hero_slide_images, [index]: file });
                setSlideImagePreviews((p) => ({ ...p, [index]: URL.createObjectURL(file) }));
            },
        });
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        post('/admin/homepage', { forceFormData: true, preserveScroll: true });
    }

    function addSlide(type: 'image' | 'video') {
        setData('hero_slides', [
            ...data.hero_slides,
            { type, media_url: '', title: '', subtitle: '', button_text: '', button_url: '' },
        ]);
    }

    function removeSlide(index: number) {
        const newSlides = data.hero_slides.filter((_, i) => i !== index);
        const newImages: Record<number, File> = {};
        Object.entries(data.hero_slide_images).forEach(([key, file]) => {
            const oldIndex = parseInt(key);
            if (oldIndex < index) newImages[oldIndex] = file;
            else if (oldIndex > index) newImages[oldIndex - 1] = file;
        });
        setData((prev) => ({ ...prev, hero_slides: newSlides, hero_slide_images: newImages }));
        // Re-index slide previews
        setSlideImagePreviews((prev) => {
            const updated: Record<number, string> = {};
            Object.entries(prev).forEach(([key, url]) => {
                const oldIndex = parseInt(key);
                if (oldIndex < index) updated[oldIndex] = url;
                else if (oldIndex > index) updated[oldIndex - 1] = url;
            });
            return updated;
        });
    }

    function updateSlide(index: number, field: keyof HeroSlide, val: string) {
        const updated = data.hero_slides.map((s, i) => i === index ? { ...s, [field]: val } : s);
        setData('hero_slides', updated);
    }

    function addStat() { setData('stats', [...data.stats, { label: '', value: '' }]); }
    function removeStat(index: number) { setData('stats', data.stats.filter((_, i) => i !== index)); }
    function updateStat(index: number, field: 'label' | 'value', val: string) {
        const updated = data.stats.map((stat, i) => i === index ? { ...stat, [field]: val } : stat);
        setData('stats', updated);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Homepage Settings" />
            <div className="space-y-6 p-4">
                <h1 className="text-xl font-semibold tracking-tight">Homepage Settings</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Legacy Hero Image */}
                    <Card>
                        <CardHeader><CardTitle>Default Hero Image</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label>Fallback Hero Image</Label>
                                    {heroPreview && (
                                        <img src={heroPreview} alt="Current hero" className="h-32 w-full rounded object-cover" />
                                    )}
                                    <Button type="button" variant="outline" className="w-fit gap-2" onClick={openHeroPicker}>
                                        <ImageIcon className="h-4 w-4" />
                                        {heroPreview ? 'Change Image' : 'Select Image'}
                                    </Button>
                                    <InputError message={errors.hero_image} />
                                </div>
                                <div className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="hero_title">Default Title</Label>
                                        <Input id="hero_title" value={data.hero_title} onChange={(e) => setData('hero_title', e.target.value)} />
                                        <InputError message={errors.hero_title} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="hero_subtitle">Default Subtitle</Label>
                                        <Input id="hero_subtitle" value={data.hero_subtitle} onChange={(e) => setData('hero_subtitle', e.target.value)} />
                                        <InputError message={errors.hero_subtitle} />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Hero Slides */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Hero Slides</CardTitle>
                                <div className="flex gap-2">
                                    <Button type="button" variant="outline" size="sm" onClick={() => addSlide('image')}>
                                        <ImageIcon className="mr-1 h-4 w-4" /> Add Image Slide
                                    </Button>
                                    <Button type="button" variant="outline" size="sm" onClick={() => addSlide('video')}>
                                        <Film className="mr-1 h-4 w-4" /> Add Video Slide
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {data.hero_slides.length === 0 && (
                                <p className="text-sm text-muted-foreground">No slides yet. The default hero image will be used. Add slides to create a carousel.</p>
                            )}
                            {data.hero_slides.map((slide, index) => (
                                <div key={index} className="rounded-lg border p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-2 text-sm font-medium">
                                            {slide.type === 'image' ? <ImageIcon className="h-4 w-4" /> : <Film className="h-4 w-4" />}
                                            Slide {index + 1} — {slide.type === 'image' ? 'Image' : 'Video'}
                                        </span>
                                        <Button type="button" variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => removeSlide(index)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    {slide.type === 'image' ? (
                                        <div className="grid gap-2">
                                            <Label>Image</Label>
                                            {(slideImagePreviews[index] || slide.media_url) && (
                                                <img src={slideImagePreviews[index] || `/storage/${slide.media_url}`} alt={`Slide ${index + 1}`} className="h-20 w-32 rounded object-cover" />
                                            )}
                                            <Button type="button" variant="outline" className="w-fit gap-2" onClick={() => openSlidePicker(index)}>
                                                <ImageIcon className="h-4 w-4" />
                                                {(slideImagePreviews[index] || slide.media_url) ? 'Change Image' : 'Select Image'}
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="grid gap-2">
                                            <Label>Video URL (YouTube or Vimeo)</Label>
                                            <Input value={slide.media_url} onChange={(e) => updateSlide(index, 'media_url', e.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
                                        </div>
                                    )}
                                    <div className="grid gap-2">
                                        <Label>Title</Label>
                                        <Input value={slide.title ?? ''} onChange={(e) => updateSlide(index, 'title', e.target.value)} placeholder="Slide title" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Subtitle</Label>
                                        <Input value={slide.subtitle ?? ''} onChange={(e) => updateSlide(index, 'subtitle', e.target.value)} placeholder="Slide subtitle" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="grid gap-2">
                                            <Label>Button Text</Label>
                                            <Input value={slide.button_text ?? ''} onChange={(e) => updateSlide(index, 'button_text', e.target.value)} placeholder="e.g. Contactez-nous" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Button URL</Label>
                                            <Input value={slide.button_url ?? ''} onChange={(e) => updateSlide(index, 'button_url', e.target.value)} placeholder="e.g. /contact" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Stats */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Stats</CardTitle>
                                <Button type="button" variant="outline" size="sm" onClick={addStat}>
                                    <Plus className="mr-1 h-4 w-4" /> Add Stat
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {data.stats.length === 0 && <p className="text-sm text-muted-foreground">No stats yet. Click "Add Stat" to add one.</p>}
                            {data.stats.map((stat, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <div className="grid flex-1 gap-2">
                                        <Label htmlFor={`stat-label-${index}`}>Label</Label>
                                        <Input id={`stat-label-${index}`} value={stat.label} onChange={(e) => updateStat(index, 'label', e.target.value)} placeholder="e.g. +30 ans d'expérience" />
                                    </div>
                                    <div className="grid flex-1 gap-2">
                                        <Label htmlFor={`stat-value-${index}`}>Value</Label>
                                        <Input id={`stat-value-${index}`} value={stat.value} onChange={(e) => updateStat(index, 'value', e.target.value)} placeholder="e.g. 30+" />
                                    </div>
                                    <Button type="button" variant="ghost" size="icon" className="mt-7 shrink-0 text-destructive hover:text-destructive" onClick={() => removeStat(index)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing}>{processing ? 'Saving...' : 'Save Settings'}</Button>
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
