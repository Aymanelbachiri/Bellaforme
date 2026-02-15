import { Head, useForm, usePage } from '@inertiajs/react';
import { ImageIcon } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import InputError from '@/components/input-error';
import { MediaPicker, useMediaPicker } from '@/components/media-picker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface PageSeo {
    key: string;
    label: string;
    seoable_id: number;
    meta_title: string;
    meta_description: string;
    og_image: string | null;
}

interface FormPage {
    seoable_id: number;
    meta_title: string;
    meta_description: string;
    og_image: File | null;
}

export default function SeoEdit({ pages }: { pages: PageSeo[] }) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'SEO Settings', href: '/admin/seo' },
    ];

    const { data, setData, post, processing, errors } = useForm({
        pages: pages.map((p) => ({
            seoable_id: p.seoable_id,
            meta_title: p.meta_title ?? '',
            meta_description: p.meta_description ?? '',
            og_image: null as File | null,
        })) as FormPage[],
        _method: 'PUT' as const,
    });

    const [previews, setPreviews] = useState<Record<number, string>>(() => {
        const initial: Record<number, string> = {};
        pages.forEach((p, i) => { if (p.og_image) initial[i] = `/storage/${p.og_image}`; });
        return initial;
    });
    const mediaPicker = useMediaPicker();
    const [pickerIndex, setPickerIndex] = useState<number>(0);

    function openOgPicker(index: number) {
        setPickerIndex(index);
        mediaPicker.openPicker({
            type: 'image',
            directory: 'seo',
            onSelect: (file) => {
                fetch(file.url).then((r) => r.blob()).then((blob) => {
                    const f = new File([blob], file.name, { type: blob.type });
                    const updated = data.pages.map((page, i) => i === index ? { ...page, og_image: f } : page);
                    setData('pages', updated);
                    setPreviews((p) => ({ ...p, [index]: file.url }));
                });
            },
            onUpload: (file) => {
                const updated = data.pages.map((page, i) => i === index ? { ...page, og_image: file } : page);
                setData('pages', updated);
                setPreviews((p) => ({ ...p, [index]: URL.createObjectURL(file) }));
            },
        });
    }

    function updatePage(index: number, field: keyof FormPage, value: string | File | null) {
        const updated = data.pages.map((page, i) => i === index ? { ...page, [field]: value } : page);
        setData('pages', updated);
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        post('/admin/seo', { forceFormData: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="SEO Settings" />
            <div className="space-y-6 p-4">
                <h1 className="text-xl font-semibold tracking-tight">SEO Settings</h1>

                {flash?.success && (
                    <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">{flash.success}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {pages.map((page, index) => (
                        <Card key={page.key}>
                            <CardHeader><CardTitle>{page.label}</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor={`meta_title_${page.key}`}>Meta Title</Label>
                                        <Input
                                            id={`meta_title_${page.key}`}
                                            value={data.pages[index].meta_title}
                                            onChange={(e) => updatePage(index, 'meta_title', e.target.value)}
                                            placeholder="Page title for search engines"
                                            maxLength={255}
                                        />
                                        <InputError message={errors[`pages.${index}.meta_title` as keyof typeof errors]} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>OG Image</Label>
                                        {previews[index] && (
                                            <img src={previews[index]} alt={`OG image for ${page.label}`} className="h-24 w-40 rounded object-cover" />
                                        )}
                                        <Button type="button" variant="outline" className="w-fit gap-2" onClick={() => openOgPicker(index)}>
                                            <ImageIcon className="h-4 w-4" />
                                            {previews[index] ? 'Change Image' : 'Select Image'}
                                        </Button>
                                        <InputError message={errors[`pages.${index}.og_image` as keyof typeof errors]} />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor={`meta_description_${page.key}`}>Meta Description</Label>
                                    <textarea
                                        id={`meta_description_${page.key}`}
                                        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                        value={data.pages[index].meta_description}
                                        onChange={(e) => updatePage(index, 'meta_description', e.target.value)}
                                        placeholder="Brief description for search engines (max 500 characters)"
                                        maxLength={500}
                                        rows={3}
                                    />
                                    <InputError message={errors[`pages.${index}.meta_description` as keyof typeof errors]} />
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing}>{processing ? 'Saving...' : 'Save SEO Settings'}</Button>
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
