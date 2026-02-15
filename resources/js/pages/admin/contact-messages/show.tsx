import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, ContactMessage } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Contact Messages', href: '/admin/contact-messages' },
    { title: 'View Message', href: '#' },
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
            <Head title={`Message from ${contactMessage.name}`} />

            <div className="space-y-6 p-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/admin/contact-messages">← Back to list</Link>
                    </Button>
                    <h1 className="text-xl font-semibold tracking-tight">
                        Message from {contactMessage.name}
                    </h1>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <dl className="space-y-4">
                                <Field label="Name" value={contactMessage.name} />
                                <Field label="Email" value={contactMessage.email} />
                                <Field label="Phone" value={contactMessage.phone} />
                                <Field label="City" value={contactMessage.city} />
                            </dl>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Request Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <dl className="space-y-4">
                                <Field label="Activity Type" value={contactMessage.activity_type} />
                                <Field label="Project Nature" value={contactMessage.project_nature} />
                                <Field label="Equipment Timeline" value={contactMessage.equipment_timeline} />
                                <Field label="Request Reason" value={contactMessage.request_reason} />
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
                            <CardTitle>Linked Product</CardTitle>
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
                    Received on{' '}
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
