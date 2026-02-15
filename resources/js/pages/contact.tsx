import { useForm, usePage } from '@inertiajs/react';
import { type FormEvent } from 'react';
import SeoHead from '@/components/seo-head';
import PublicLayout from '@/layouts/public-layout';
import type { SeoData } from '@/types/models';

interface ContactProps {
    product_id: number | null;
    seo: SeoData;
}

const ACTIVITY_TYPES = [
    'Centre esthétique',
    'Clinique médicale',
    'Salle de sport',
    'Salon de coiffure',
    'Spa / Bien-être',
    'Hôtel',
    'Autre',
];

const PROJECT_NATURES = [
    'Création d\'établissement',
    'Rénovation',
    'Extension',
    'Remplacement d\'équipement',
    'Autre',
];

const EQUIPMENT_TIMELINES = [
    'Immédiat',
    'Moins de 3 mois',
    '3 à 6 mois',
    '6 à 12 mois',
    'Plus de 12 mois',
];

const REQUEST_REASONS = [
    'Demande de devis',
    'Demande d\'information',
    'Demande de démonstration',
    'Service après-vente',
    'Autre',
];

export default function Contact({ product_id, seo }: ContactProps) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;

    return (
        <PublicLayout>
            <SeoHead {...seo} />
            <section className="bg-black py-16">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-10 text-center">
                        <h1 className="text-3xl font-bold text-white md:text-4xl">Contactez-nous</h1>
                        <p className="mt-3 text-gray-400">
                            Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
                        </p>
                    </div>

                    {flash?.success && (
                        <div className="mb-8 rounded-lg border border-green-700 bg-green-900/30 p-4 text-center text-green-400" role="alert">
                            {flash.success}
                        </div>
                    )}

                    <ContactForm productId={product_id} />
                </div>
            </section>
        </PublicLayout>
    );
}

function ContactForm({ productId }: { productId: number | null }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        phone: '',
        email: '',
        city: '',
        activity_type: '',
        project_nature: '',
        equipment_timeline: '',
        request_reason: '',
        message: '',
        product_id: productId ?? '',
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        post('/contact', {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    }

    return (
        <form onSubmit={handleSubmit} className="rounded-xl bg-black p-6 shadow-sm sm:p-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Name */}
                <div className="sm:col-span-2">
                    <input
                        id="name"
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="w-[half] rounded-full border border-white-400 bg-[#1a1a1a] px-4 py-2.5 text-sm text-white transition-colors focus:outline-none"
                        placeholder='Nom & prénom *'
                        required
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}

                    {/* Phone */}
                    <input
                        id="phone"
                        type="tel"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        className="w-[half] rounded-full border border-white-400 bg-[#1a1a1a] px-4 py-2.5 text-sm text-white transition-colors focus:outline-none"
                        placeholder='Téléphone *'
                    />
                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-300">
                        E-mail <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        required
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                {/* City */}
                <div>
                    <label htmlFor="city" className="mb-1.5 block text-sm font-medium text-gray-300">
                        Ville
                    </label>
                    <input
                        id="city"
                        type="text"
                        value={data.city}
                        onChange={(e) => setData('city', e.target.value)}
                        className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                </div>

                {/* Activity Type */}
                <div>
                    <label htmlFor="activity_type" className="mb-1.5 block text-sm font-medium text-gray-300">
                        Type d'activité
                    </label>
                    <select
                        id="activity_type"
                        value={data.activity_type}
                        onChange={(e) => setData('activity_type', e.target.value)}
                        className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                        <option value="">Sélectionnez...</option>
                        {ACTIVITY_TYPES.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    {errors.activity_type && <p className="mt-1 text-sm text-red-600">{errors.activity_type}</p>}
                </div>

                {/* Project Nature */}
                <div>
                    <label htmlFor="project_nature" className="mb-1.5 block text-sm font-medium text-gray-300">
                        Nature du projet
                    </label>
                    <select
                        id="project_nature"
                        value={data.project_nature}
                        onChange={(e) => setData('project_nature', e.target.value)}
                        className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                        <option value="">Sélectionnez...</option>
                        {PROJECT_NATURES.map((nature) => (
                            <option key={nature} value={nature}>{nature}</option>
                        ))}
                    </select>
                    {errors.project_nature && <p className="mt-1 text-sm text-red-600">{errors.project_nature}</p>}
                </div>

                {/* Equipment Timeline */}
                <div>
                    <label htmlFor="equipment_timeline" className="mb-1.5 block text-sm font-medium text-gray-300">
                        Délai d'équipement
                    </label>
                    <select
                        id="equipment_timeline"
                        value={data.equipment_timeline}
                        onChange={(e) => setData('equipment_timeline', e.target.value)}
                        className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                        <option value="">Sélectionnez...</option>
                        {EQUIPMENT_TIMELINES.map((timeline) => (
                            <option key={timeline} value={timeline}>{timeline}</option>
                        ))}
                    </select>
                    {errors.equipment_timeline && <p className="mt-1 text-sm text-red-600">{errors.equipment_timeline}</p>}
                </div>

                {/* Request Reason */}
                <div>
                    <label htmlFor="request_reason" className="mb-1.5 block text-sm font-medium text-gray-300">
                        Motif de la demande
                    </label>
                    <select
                        id="request_reason"
                        value={data.request_reason}
                        onChange={(e) => setData('request_reason', e.target.value)}
                        className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                        <option value="">Sélectionnez...</option>
                        {REQUEST_REASONS.map((reason) => (
                            <option key={reason} value={reason}>{reason}</option>
                        ))}
                    </select>
                    {errors.request_reason && <p className="mt-1 text-sm text-red-600">{errors.request_reason}</p>}
                </div>

                {/* Message */}
                <div className="sm:col-span-2">
                    <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-gray-300">
                        Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="message"
                        rows={5}
                        value={data.message}
                        onChange={(e) => setData('message', e.target.value)}
                        className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        required
                    />
                    {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
                </div>
            </div>

            {data.product_id && (
                <input type="hidden" name="product_id" value={data.product_id} />
            )}

            <div className="mt-8">
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-white/80 disabled:opacity-50"
                >
                    {processing ? 'Envoi en cours...' : 'Envoyer le message'}
                </button>
            </div>
        </form>
    );
}
