import { Head, useForm, router, usePage } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, EmailSettings } from '@/types';

export default function EmailSettingsEdit({
    settings,
}: {
    settings: EmailSettings;
}) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Email Settings', href: '/admin/email-settings' },
    ];

    const { data, setData, put, processing, errors } = useForm({
        smtp_host: settings.smtp_host ?? '',
        smtp_port: settings.smtp_port ?? 587,
        smtp_username: settings.smtp_username ?? '',
        smtp_password: '',
        encryption: settings.encryption ?? 'tls',
        from_address: settings.from_address ?? '',
        from_name: settings.from_name ?? '',
    });

    const [testEmail, setTestEmail] = useState('');
    const [testProcessing, setTestProcessing] = useState(false);
    const [testMessage, setTestMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        put('/admin/email-settings');
    }

    function handleTestEmail(e: FormEvent) {
        e.preventDefault();
        setTestProcessing(true);
        setTestMessage(null);

        router.post('/admin/email-settings/test', { test_email: testEmail }, {
            preserveScroll: true,
            onSuccess: (page) => {
                const props = page.props as Record<string, unknown>;
                const flashData = props.flash as { success?: string; error?: string } | undefined;
                if (flashData?.success) {
                    setTestMessage({ type: 'success', text: flashData.success });
                } else if (flashData?.error) {
                    setTestMessage({ type: 'error', text: flashData.error });
                }
                setTestProcessing(false);
            },
            onError: () => {
                setTestMessage({ type: 'error', text: 'Failed to send test email.' });
                setTestProcessing(false);
            },
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Email Settings" />

            <div className="space-y-6 p-4">
                <h1 className="text-xl font-semibold tracking-tight">
                    Email Settings
                </h1>

                {flash?.success && (
                    <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                        {flash.error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>SMTP Configuration</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="smtp_host">SMTP Host</Label>
                                    <Input
                                        id="smtp_host"
                                        value={data.smtp_host}
                                        onChange={(e) => setData('smtp_host', e.target.value)}
                                        placeholder="smtp.example.com"
                                    />
                                    <InputError message={errors.smtp_host} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="smtp_port">SMTP Port</Label>
                                    <Input
                                        id="smtp_port"
                                        type="number"
                                        value={data.smtp_port}
                                        onChange={(e) => setData('smtp_port', parseInt(e.target.value) || 0)}
                                    />
                                    <InputError message={errors.smtp_port} />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="smtp_username">SMTP Username</Label>
                                    <Input
                                        id="smtp_username"
                                        value={data.smtp_username}
                                        onChange={(e) => setData('smtp_username', e.target.value)}
                                        placeholder="user@example.com"
                                    />
                                    <InputError message={errors.smtp_username} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="smtp_password">SMTP Password</Label>
                                    <Input
                                        id="smtp_password"
                                        type="password"
                                        value={data.smtp_password}
                                        onChange={(e) => setData('smtp_password', e.target.value)}
                                        placeholder={settings.has_password ? 'Leave blank to keep current' : 'Enter password'}
                                    />
                                    <InputError message={errors.smtp_password} />
                                </div>
                            </div>

                            <div className="grid gap-2 md:max-w-xs">
                                <Label htmlFor="encryption">Encryption</Label>
                                <Select
                                    value={data.encryption}
                                    onValueChange={(value) => setData('encryption', value as 'none' | 'tls' | 'ssl')}
                                >
                                    <SelectTrigger id="encryption">
                                        <SelectValue placeholder="Select encryption" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">None</SelectItem>
                                        <SelectItem value="tls">TLS</SelectItem>
                                        <SelectItem value="ssl">SSL</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.encryption} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Sender Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="from_address">From Address</Label>
                                    <Input
                                        id="from_address"
                                        type="email"
                                        value={data.from_address}
                                        onChange={(e) => setData('from_address', e.target.value)}
                                        placeholder="noreply@example.com"
                                    />
                                    <InputError message={errors.from_address} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="from_name">From Name</Label>
                                    <Input
                                        id="from_name"
                                        value={data.from_name}
                                        onChange={(e) => setData('from_name', e.target.value)}
                                        placeholder="Bella Forme Group"
                                    />
                                    <InputError message={errors.from_name} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Settings'}
                        </Button>
                    </div>
                </form>

                <Card>
                    <CardHeader>
                        <CardTitle>Send Test Email</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleTestEmail} className="space-y-4">
                            {testMessage && (
                                <div
                                    className={`rounded-md p-3 text-sm ${
                                        testMessage.type === 'success'
                                            ? 'bg-green-50 text-green-700'
                                            : 'bg-red-50 text-red-700'
                                    }`}
                                >
                                    {testMessage.text}
                                </div>
                            )}
                            <div className="flex items-end gap-3">
                                <div className="grid flex-1 gap-2">
                                    <Label htmlFor="test_email">Recipient Email</Label>
                                    <Input
                                        id="test_email"
                                        type="email"
                                        value={testEmail}
                                        onChange={(e) => setTestEmail(e.target.value)}
                                        placeholder="test@example.com"
                                        required
                                    />
                                </div>
                                <Button type="submit" variant="outline" disabled={testProcessing}>
                                    {testProcessing ? 'Sending...' : 'Send Test Email'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
