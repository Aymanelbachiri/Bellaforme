import { Head, Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, ContactMessage, PaginatedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Contact Messages', href: '/admin/contact-messages' },
];

export default function ContactMessagesIndex({
    contactMessages,
}: {
    contactMessages: PaginatedData<ContactMessage>;
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Contact Messages" />

            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold tracking-tight">
                        Contact Messages
                    </h1>
                    <Badge variant="secondary">
                        {contactMessages.total} message{contactMessages.total !== 1 ? 's' : ''}
                    </Badge>
                </div>

                <div className="overflow-hidden rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/50">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">Name</th>
                                <th className="px-4 py-3 text-left font-medium">Email</th>
                                <th className="px-4 py-3 text-left font-medium">Message</th>
                                <th className="px-4 py-3 text-left font-medium">Product</th>
                                <th className="px-4 py-3 text-left font-medium">Date</th>
                                <th className="px-4 py-3 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {contactMessages.data.map((msg) => (
                                <tr key={msg.id}>
                                    <td className="px-4 py-3 font-medium">{msg.name}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{msg.email}</td>
                                    <td className="max-w-xs truncate px-4 py-3 text-muted-foreground">
                                        {msg.message.length > 80
                                            ? msg.message.substring(0, 80) + '…'
                                            : msg.message}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {msg.product?.name ?? '—'}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                                        {new Date(msg.created_at).toLocaleDateString('fr-FR', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/admin/contact-messages/${msg.id}`}>
                                                View
                                            </Link>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {contactMessages.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-4 py-8 text-center text-muted-foreground"
                                    >
                                        No contact messages found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {contactMessages.last_page > 1 && (
                    <div className="flex items-center justify-center gap-1">
                        {contactMessages.links.map((link, i) => (
                            <Button
                                key={i}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                asChild={!!link.url}
                            >
                                {link.url ? (
                                    <Link
                                        href={link.url}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                )}
                            </Button>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
