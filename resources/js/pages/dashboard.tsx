import { Head, Link, router, usePage } from '@inertiajs/react';
import { Award, FolderTree, ImageIcon, Layers, MessageSquare, Package, Plus } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

interface ContactMessage {
    id: number;
    name: string;
    email: string;
    created_at: string;
}

interface DashboardProps {
    stats: {
        divisions: number;
        categories: number;
        brands: number;
        products: number;
    };
    recentMessages: ContactMessage[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    const { stats, recentMessages } = usePage<{ props: DashboardProps }>().props as unknown as DashboardProps;
    const flash = (usePage().props as Record<string, unknown>).flash as { success?: string } | undefined;

    const statCards = [
        { label: 'Divisions', value: stats.divisions, icon: Layers, href: '/admin/divisions' },
        { label: 'Categories', value: stats.categories, icon: FolderTree, href: '/admin/categories' },
        { label: 'Brands', value: stats.brands, icon: Award, href: '/admin/brands' },
        { label: 'Products', value: stats.products, icon: Package, href: '/admin/products' },
    ];

    const quickActions = [
        { label: 'New Division', href: '/admin/divisions/create' },
        { label: 'New Category', href: '/admin/categories/create' },
        { label: 'New Brand', href: '/admin/brands/create' },
        { label: 'New Product', href: '/admin/products/create' },
    ];

    const [regenerating, setRegenerating] = useState(false);

    function handleRegenerate() {
        if (regenerating) return;
        setRegenerating(true);
        router.post('/admin/regenerate-images', {}, {
            onFinish: () => setRegenerating(false),
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Flash message */}
                {flash?.success && (
                    <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                        {flash.success}
                    </div>
                )}
                {/* Stat Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((stat) => (
                        <Link key={stat.label} href={stat.href}>
                            <Card className="transition-shadow hover:shadow-md">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-muted-foreground text-sm font-medium">{stat.label}</CardTitle>
                                    <stat.icon className="text-muted-foreground h-4 w-4" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    {/* Recent Contact Messages */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" />
                                Recent Contact Messages
                            </CardTitle>
                            <Link href="/admin/contact-messages" className="text-muted-foreground text-sm hover:underline">
                                View all
                            </Link>
                        </CardHeader>
                        <CardContent>
                            {recentMessages.length === 0 ? (
                                <p className="text-muted-foreground text-sm">No messages yet.</p>
                            ) : (
                                <div className="space-y-3">
                                    {recentMessages.map((msg) => (
                                        <div key={msg.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                                            <div>
                                                <p className="text-sm font-medium">{msg.name}</p>
                                                <p className="text-muted-foreground text-xs">{msg.email}</p>
                                            </div>
                                            <p className="text-muted-foreground text-xs">
                                                {new Date(msg.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-3">
                                {quickActions.map((action) => (
                                    <Link
                                        key={action.label}
                                        href={action.href}
                                        className="border-input hover:bg-accent flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors"
                                    >
                                        <Plus className="h-4 w-4" />
                                        {action.label}
                                    </Link>
                                ))}
                            </div>
                            <div className="mt-4 border-t pt-4">
                                <button
                                    onClick={handleRegenerate}
                                    disabled={regenerating}
                                    className="border-input hover:bg-accent flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors disabled:opacity-50"
                                >
                                    <ImageIcon className="h-4 w-4" />
                                    {regenerating ? 'Regenerating…' : 'Regenerate All Images'}
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
