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
import type { Brand, BreadcrumbItem, Division } from '@/types';

export default function BrandsEdit({ brand, divisions }: { brand: Brand; divisions: Pick<Division, 'id' | 'name'>[] }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Tableau de bord', href: '/dashboard' },
        { title: 'Marques', href: '/admin/brands' },
        { title: brand.name, href: `/admin/brands/${brand.id}/edit` },
    ];

    const { data, setData, post, processing, errors } = useForm({
        division_ids: (brand.divisions ?? []).map((d) => d.id) as number[],
        name: brand.name,
        slug: brand.slug,
        logo: null as File | null,
        is_partner: brand.is_partner,
        is_reference: brand.is_reference,
        order: brand.order,
        is_active: brand.is_active,
        _method: 'PUT' as const,
    });

    const [previews, setPreviews] = useState<Record<string, string>>({
        logo: brand.logo ? `/storage/${brand.logo}` : '',
    });
    const mediaPicker = useMediaPicker();

    function openImagePicker(field: 'logo', directory?: string) {
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
        post(`/admin/brands/${brand.id}`, { forceFormData: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Modifier ${brand.name}`} />

            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold tracking-tight">Modifier la marque</h1>
                    <Button variant="outline" asChild>
                        <Link href="/admin/brands">Retour</Link>
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Détails de la marque</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            {/* Name + Slug side by side */}
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nom *</Label>
                                    <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                                    <InputError message={errors.name} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="slug">Slug</Label>
                                    <Input id="slug" value={data.slug} onChange={(e) => setData('slug', e.target.value)} />
                                    <InputError message={errors.slug} />
                                </div>
                            </div>

                            {/* Order + Active side by side */}
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

                            {/* Logo full width */}
                            <div className="grid gap-2">
                                <Label>Logo</Label>
                                {previews.logo && (
                                    <img src={previews.logo} alt={brand.name} className="h-16 w-28 rounded object-contain" />
                                )}
                                <Button type="button" variant="outline" className="w-fit gap-2" onClick={() => openImagePicker('logo', 'brands')}>
                                    <ImageIcon className="h-4 w-4" />
                                    {previews.logo ? 'Changer le logo' : 'Sélectionner un logo'}
                                </Button>
                                <InputError message={errors.logo} />
                            </div>

                            {/* Divisions full width */}
                            <div className="grid gap-2">
                                <Label>Divisions</Label>
                                <div className="flex flex-wrap gap-3">
                                    {divisions.map((d) => (
                                        <div key={d.id} className="flex items-center gap-2">
                                            <Checkbox
                                                id={`div-${d.id}`}
                                                checked={data.division_ids.includes(d.id)}
                                                onCheckedChange={(checked) => {
                                                    setData('division_ids', checked
                                                        ? [...data.division_ids, d.id]
                                                        : data.division_ids.filter((id) => id !== d.id));
                                                }}
                                            />
                                            <Label htmlFor={`div-${d.id}`} className="font-normal">{d.name}</Label>
                                        </div>
                                    ))}
                                </div>
                                <InputError message={errors.division_ids} />
                            </div>

                            {/* Partner + Reference side by side */}
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="flex items-center gap-2">
                                    <Checkbox id="is_partner" checked={data.is_partner} onCheckedChange={(checked) => setData('is_partner', checked === true)} />
                                    <Label htmlFor="is_partner">Marque partenaire</Label>
                                    <InputError message={errors.is_partner} />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Checkbox id="is_reference" checked={data.is_reference} onCheckedChange={(checked) => setData('is_reference', checked === true)} />
                                    <Label htmlFor="is_reference">Marque de référence</Label>
                                    <InputError message={errors.is_reference} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Enregistrement...' : 'Mettre à jour la marque'}
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
