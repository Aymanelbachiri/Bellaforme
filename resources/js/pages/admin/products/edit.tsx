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
import type { Brand, BreadcrumbItem, Category, Division, Product } from '@/types';

const selectClass =
    'border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50';

const textareaClass =
    'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50';

interface SpecEntry { label: string; value: string; }

type GalleryItem = File | { type: 'path'; path: string; url: string };

function isGalleryFile(item: GalleryItem): item is File {
    return item instanceof File;
}

export default function ProductsEdit({
    product, divisions, categories, brands,
}: {
    product: Product;
    divisions: Pick<Division, 'id' | 'name'>[];
    categories: Pick<Category, 'id' | 'name' | 'division_id'>[];
    brands: (Pick<Brand, 'id' | 'name'> & { divisions?: { id: number }[] })[];
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Tableau de bord', href: '/dashboard' },
        { title: 'Produits', href: '/admin/products' },
        { title: product.name, href: `/admin/products/${product.id}/edit` },
    ];

    const { data, setData, post, processing, errors } = useForm<{
        content_mode: 'detailed' | 'brochure_only';
        division_id: string | number;
        category_id: string | number;
        brand_id: string | number;
        name: string; slug: string; short_description: string; description: string;
        featured_image: File | null; brochure_file: File | null; video_url: string;
        order: number; is_active: boolean; specifications: SpecEntry[];
        gallery: GalleryItem[]; meta_title: string; meta_description: string; og_image: File | null;
        _method: 'PUT';
    }>({
        content_mode: product.content_mode,
        division_id: product.division_id, category_id: product.category_id,
        brand_id: product.brand_id ?? '', name: product.name, slug: product.slug,
        short_description: product.short_description, description: product.description ?? '',
        featured_image: null, brochure_file: null, video_url: product.video_url ?? '',
        order: product.order, is_active: product.is_active,
        specifications: (product.specifications ?? []).map((s) => ({ label: s.label, value: s.value })),
        gallery: [], meta_title: product.seo?.meta_title ?? '',
        meta_description: product.seo?.meta_description ?? '', og_image: null, _method: 'PUT',
    });

    const [previews, setPreviews] = useState<Record<string, string>>({
        featured_image: product.featured_image ? `/storage/${product.featured_image}` : '',
        og_image: product.seo?.og_image ? `/storage/${product.seo.og_image}` : '',
        brochure_file: product.brochure_file ? product.brochure_file : '',
    });
    const mediaPicker = useMediaPicker();

    function openImagePicker(field: 'featured_image' | 'og_image', directory?: string) {
        mediaPicker.openPicker({
            type: 'image', directory,
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

    function openDocPicker(field: 'brochure_file', directory?: string) {
        mediaPicker.openPicker({
            type: 'document', directory,
            onSelect: (file) => {
                setData(field, file.path);
                setPreviews((p) => ({ ...p, [field]: file.name }));
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

    const filteredBrands = useMemo(
        () => brands.filter((b) => b.divisions?.some((d) => d.id === Number(data.division_id))),
        [brands, data.division_id],
    );

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        const galleryFiles = data.gallery.filter(isGalleryFile);
        let fileIdx = 0;
        const galleryOrder = data.gallery.map((item) =>
            isGalleryFile(item) ? { type: 'file' as const, index: fileIdx++ } : { type: 'path' as const, path: item.path }
        );
        post(`/admin/products/${product.id}`, {
            ...data,
            gallery: galleryFiles,
            gallery_order: JSON.stringify(galleryOrder),
        }, { forceFormData: true });
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
        if (!files) return;
        setData('gallery', [...data.gallery, ...Array.from(files)]);
    }
    function addGalleryFromMedia(file: { path: string; url: string }) {
        setData('gallery', [...data.gallery, { type: 'path', path: file.path, url: file.url }]);
    }
    function removeGalleryFile(index: number) {
        setData('gallery', data.gallery.filter((_, i) => i !== index));
    }
    function moveGallery(index: number, direction: -1 | 1) {
        const target = index + direction;
        if (target < 0 || target >= data.gallery.length) return;
        const updated = [...data.gallery];
        [updated[index], updated[target]] = [updated[target], updated[index]];
        setData('gallery', updated);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Modifier ${product.name}`} />
            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold tracking-tight">Modifier le produit</h1>
                    <Button variant="outline" asChild><Link href="/admin/products">Retour</Link></Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Product Type */}
                    <Card>
                        <CardHeader><CardTitle>Type de produit</CardTitle></CardHeader>
                        <CardContent>
                            <div className="flex gap-2">
                                <Button type="button" variant={data.content_mode === 'detailed' ? 'default' : 'outline'} onClick={() => setData('content_mode', 'detailed')}>Produit complet</Button>
                                <Button type="button" variant={data.content_mode === 'brochure_only' ? 'default' : 'outline'} onClick={() => setData('content_mode', 'brochure_only')}>Catalogue uniquement</Button>
                            </div>
                            <InputError message={errors.content_mode} />
                        </CardContent>
                    </Card>

                    {/* Common Fields */}
                    <Card>
                        <CardHeader><CardTitle>Détails du produit</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="division_id">Division *</Label>
                                    <select id="division_id" className={selectClass} value={data.division_id} onChange={(e) => { setData('division_id', e.target.value ? parseInt(e.target.value) : ''); setData('category_id', ''); setData('brand_id', ''); }} required>
                                        <option value="">Sélectionner une division</option>
                                        {divisions.map((d) => (<option key={d.id} value={d.id}>{d.name}</option>))}
                                    </select>
                                    <InputError message={errors.division_id} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="category_id">Catégorie *</Label>
                                    <select id="category_id" className={selectClass} value={data.category_id} onChange={(e) => setData('category_id', e.target.value ? parseInt(e.target.value) : '')} required>
                                        <option value="">Sélectionner une catégorie</option>
                                        {filteredCategories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                                    </select>
                                    <InputError message={errors.category_id} />
                                </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="brand_id">Marque</Label>
                                    <select id="brand_id" className={selectClass} value={data.brand_id} onChange={(e) => setData('brand_id', e.target.value ? parseInt(e.target.value) : '')}>
                                        <option value="">Aucune</option>
                                        {filteredBrands.map((b) => (<option key={b.id} value={b.id}>{b.name}</option>))}
                                    </select>
                                    <InputError message={errors.brand_id} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nom *</Label>
                                    <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                                    <InputError message={errors.name} />
                                </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="slug">Slug</Label>
                                    <Input id="slug" value={data.slug} onChange={(e) => setData('slug', e.target.value)} />
                                    <InputError message={errors.slug} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="order">Ordre</Label>
                                    <Input id="order" type="number" value={data.order} onChange={(e) => setData('order', parseInt(e.target.value) || 0)} />
                                    <InputError message={errors.order} />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="short_description">Description courte</Label>
                                <textarea
                                    id="short_description"
                                    className={textareaClass}
                                    value={data.short_description}
                                    onChange={(e) => setData('short_description', e.target.value)}
                                />
                                <InputError message={errors.short_description} />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                {/* Featured Image */}
                                <div className="grid gap-2">
                                    <Label>Image principale</Label>
                                    {previews.featured_image && (
                                        <img src={previews.featured_image} alt={product.name} className="h-24 w-40 rounded object-cover" />
                                    )}
                                    <Button type="button" variant="outline" className="w-fit gap-2" onClick={() => openImagePicker('featured_image', 'products')}>
                                        <ImageIcon className="h-4 w-4" />
                                        {previews.featured_image ? 'Changer l\'image' : 'Sélectionner une image'}
                                    </Button>
                                    <InputError message={errors.featured_image} />
                                </div>
                                <div className="flex items-end gap-2 pb-1">
                                    <Checkbox id="is_active" checked={data.is_active} onCheckedChange={(checked) => setData('is_active', checked === true)} />
                                    <Label htmlFor="is_active">Actif</Label>
                                    <InputError message={errors.is_active} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Detailed-only fields */}
                    {data.content_mode === 'detailed' && (
                        <>
                            <Card>
                                <CardHeader><CardTitle>Contenu détaillé</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="description">Description *</Label>
                                        <textarea id="description" className={textareaClass} style={{ minHeight: '120px' }} value={data.description} onChange={(e) => setData('description', e.target.value)} required />
                                        <InputError message={errors.description} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="video_url">URL vidéo</Label>
                                        <Input id="video_url" type="url" value={data.video_url} onChange={(e) => setData('video_url', e.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
                                        <InputError message={errors.video_url} />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Specifications */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        Spécifications
                                        <Button type="button" variant="outline" size="sm" onClick={addSpec}>Ajouter une spécification</Button>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {data.specifications.length === 0 && <p className="text-sm text-muted-foreground">Aucune spécification ajoutée.</p>}
                                    {data.specifications.map((spec, index) => (
                                        <div key={index} className="flex items-start gap-2">
                                            <div className="flex flex-col gap-1">
                                                <Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0" disabled={index === 0} onClick={() => moveSpec(index, -1)}>↑</Button>
                                                <Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0" disabled={index === data.specifications.length - 1} onClick={() => moveSpec(index, 1)}>↓</Button>
                                            </div>
                                            <div className="grid flex-1 gap-2 sm:grid-cols-2">
                                                <Input placeholder="Libellé" value={spec.label} onChange={(e) => updateSpec(index, 'label', e.target.value)} />
                                                <Input placeholder="Valeur" value={spec.value} onChange={(e) => updateSpec(index, 'value', e.target.value)} />
                                            </div>
                                            <Button type="button" variant="destructive" size="sm" onClick={() => removeSpec(index)}>Retirer</Button>
                                        </div>
                                    ))}
                                    <InputError message={errors.specifications} />
                                </CardContent>
                            </Card>

                            {/* Gallery */}
                            <Card>
                                <CardHeader><CardTitle>Galerie d'images</CardTitle></CardHeader>
                                <CardContent className="space-y-3">
                                    {product.images && product.images.length > 0 && (
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium">Images actuelles</p>
                                            <div className="grid grid-cols-4 gap-2">
                                                {product.images.map((img) => (
                                                    <div key={img.id} className="relative">
                                                        <img src={`/storage/${img.image_path}`} alt={`Gallery #${img.order}`} className="h-20 w-full rounded object-cover" />
                                                        <Badge variant="outline" className="absolute bottom-1 right-1 text-xs">#{img.order + 1}</Badge>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <div className="grid gap-2">
                                        <Label>Ajouter des images</Label>
                                        <div className="flex flex-wrap gap-2">
                                            <Input type="file" accept="image/*" multiple className="max-w-xs" onChange={(e) => addGalleryFiles(e.target.files)} />
                                            <Button type="button" variant="outline" size="sm" onClick={() => mediaPicker.openPicker({ type: 'image', directory: 'products/gallery', onSelect: (file) => { addGalleryFromMedia(file); mediaPicker.setOpen(false); }, onUpload: (file) => { setData('gallery', [...data.gallery, file]); mediaPicker.setOpen(false); } })}>
                                                <ImageIcon className="mr-1.5 size-4" />
                                                Choisir dans la médiathèque
                                            </Button>
                                        </div>
                                    </div>
                                    {data.gallery.length > 0 && (
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium">Nouvelles images à télécharger</p>
                                            {data.gallery.map((item, index) => (
                                                <div key={index} className="flex items-center gap-2 rounded border p-2">
                                                    <div className="flex flex-col gap-1">
                                                        <Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0" disabled={index === 0} onClick={() => moveGallery(index, -1)}>↑</Button>
                                                        <Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0" disabled={index === data.gallery.length - 1} onClick={() => moveGallery(index, 1)}>↓</Button>
                                                    </div>
                                                    <img src={isGalleryFile(item) ? URL.createObjectURL(item) : item.url} alt={`New ${index + 1}`} className="h-12 w-16 rounded object-cover shrink-0" />
                                                    <span className="flex-1 truncate text-sm">{isGalleryFile(item) ? item.name : item.path.split('/').pop() ?? item.path}</span>
                                                    <Button type="button" variant="destructive" size="sm" onClick={() => removeGalleryFile(index)}>Retirer</Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <InputError message={errors.gallery} />
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {/* Brochure */}
                    <Card>
                        <CardHeader><CardTitle>Brochure</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Fichier brochure (PDF){data.content_mode === 'brochure_only' ? ' *' : ''}</Label>
                                {previews.brochure_file && (
                                    <p className="text-sm text-muted-foreground">
                                        {product.brochure_file && !data.brochure_file ? (
                                            <a href={`/storage/${product.brochure_file}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Voir la brochure actuelle</a>
                                        ) : (
                                            <>Sélectionné : {previews.brochure_file}</>
                                        )}
                                    </p>
                                )}
                                <Button type="button" variant="outline" className="w-fit gap-2" onClick={() => openDocPicker('brochure_file', 'products')}>
                                    <FileIcon className="h-4 w-4" />
                                    {previews.brochure_file ? 'Changer le fichier' : 'Sélectionner un fichier'}
                                </Button>
                                <InputError message={errors.brochure_file} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* SEO */}
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
                                        <img src={previews.og_image} alt="OG image" className="h-16 w-28 rounded object-cover" />
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
                                <textarea id="meta_description" className={textareaClass} value={data.meta_description} onChange={(e) => setData('meta_description', e.target.value)} />
                                <InputError message={errors.meta_description} />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing}>{processing ? 'Enregistrement...' : 'Mettre à jour le produit'}</Button>
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
