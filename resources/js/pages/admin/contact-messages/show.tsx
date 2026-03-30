import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, ContactMessage } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tableau de bord', href: '/dashboard' },
    { title: 'Messages de contact', href: '/admin/contact-messages' },
    { title: 'Voir le message', href: '#' },
];

function Field({ label, value }: { label: string; value: string | null | undefined }) {
    if (!value) return null;
    return (
        <div>
            <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
            <dd className="mt-1 text-sm">{value}</dd>
        </div>
    );
}

export default function ContactMessageShow({
    contactMessage,
}: {
    contactMessage: ContactMessage;
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Message de ${contactMessage.name}`} />

            <div className="space-y-6 p-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/admin/contact-messages">← Retour à la liste</Link>
                    </Button>
                    <h1 className="text-xl font-semibold tracking-tight">
                        Message de {contactMessage.name}
                    </h1>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations de contact</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <dl className="space-y-4">
                                <Field label="Nom" value={contactMessage.name} />
                                <Field label="E-mail" value={contactMessage.email} />
                                <Field label="Téléphone" value={contactMessage.phone} />
                                <Field label="Ville" value={contactMessage.city} />
                            </dl>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Détails de la demande</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <dl className="space-y-4">
                                <Field label="Type d'activité" value={contactMessage.activity_type} />
                                <Field label="Nature du projet" value={contactMessage.project_nature} />
                                <Field label="Délai d'équipement" value={contactMessage.equipment_timeline} />
                                <Field label="Motif de la demande" value={contactMessage.request_reason} />
                            </dl>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Message</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="whitespace-pre-wrap text-sm">{contactMessage.message}</p>
                    </CardContent>
                </Card>

                {contactMessage.product && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Produit associé</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                {contactMessage.product.featured_image && (
                                    <img
                                        src={`/storage/${contactMessage.product.featured_image}`}
                                        alt={contactMessage.product.name}
                                        className="h-16 w-24 rounded object-cover"
                                    />
                                )}
                                <div>
                                    <p className="font-medium">{contactMessage.product.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        /product/{contactMessage.product.slug}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="text-sm text-muted-foreground">
                    Reçu le{' '}
                    {new Date(contactMessage.created_at).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </div>
            </div>
        </AppLayout>
    );
}
