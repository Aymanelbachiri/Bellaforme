import { useForm, usePage } from '@inertiajs/react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { type FormEvent } from 'react';
import SeoHead from '@/components/seo-head';
import PublicLayout from '@/layouts/public-layout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
                        <h1 className="text-4xl font-bold glow-text text-white md:text-4xl">Contactez-nous</h1>
                        <p className="mt-3 text-white font-manrope font-light">
                            Besoin d'informations ou de conseils ?
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
            <section className="bg-[#1a1a1a] py-12">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:divide-x md:divide-white/20">
                        {/* Showroom Beauty & Medical */}
                        <div>
                            <h3 className="mb-4 text-lg font-bold text-white" style={{ fontFamily: "'Manrope', sans-serif" }}>
                                Showroom Beauty & medical :
                            </h3>
                            <ul className="space-y-2 text-sm text-white/80">
                                <li className="flex items-start gap-2">
                                    <Phone className="mt-0.5 size-4 shrink-0" />
                                    <a href="tel:+212522258481" className="hover:text-[#d5ab70] transition-colors">+212 522 258 481</a>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Mail className="mt-0.5 size-4 shrink-0" />
                                    <a href="mailto:Serviceclient@bellaforme.ma" className="hover:text-[#d5ab70] transition-colors">Serviceclient@bellaforme.ma</a>
                                </li>
                                <li className="flex items-start gap-2">
                                    <MapPin className="mt-0.5 size-4 shrink-0" />
                                    <a href="https://maps.google.com/?q=20100+Angle+rue+Ibnou+Katir+et+Ibnou+Habous+Maarif+Casablanca+MAROC" target="_blank" rel="noopener noreferrer" className="hover:text-[#d5ab70] transition-colors">20100, Angle rue Ibnou Katir et Ibnou Habous Maârif. Casablanca | MAROC</a>
                                </li>
                            </ul>
                        </div>

                        {/* Showroom Fitness */}
                        <div className="md:pl-8">
                            <h3 className="mb-4 text-lg font-bold text-white" style={{ fontFamily: "'Manrope', sans-serif" }}>
                                Showroom Fitness :
                            </h3>
                            <ul className="space-y-2 text-sm text-white/80">
                                <li className="flex items-start gap-2">
                                    <Phone className="mt-0.5 size-4 shrink-0" />
                                    <a href="tel:+21252235767" className="hover:text-[#d5ab70] transition-colors">05 222-35767</a>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Mail className="mt-0.5 size-4 shrink-0" />
                                    <a href="mailto:serviceclient@bellaforme.ma" className="hover:text-[#d5ab70] transition-colors">serviceclient@bellaforme.ma</a>
                                </li>
                                <li className="flex items-start gap-2">
                                    <MapPin className="mt-0.5 size-4 shrink-0" />
                                    <a href="https://maps.google.com/?q=29+Rue+Ali+Abderrazak+Casablanca+20250" target="_blank" rel="noopener noreferrer" className="hover:text-[#d5ab70] transition-colors">29 Rue Ali Abderrazak, à côté de pharmacie hyper, Casablanca 20250</a>
                                </li>
                            </ul>
                        </div>

                        {/* Service après vente */}
                        <div className="md:pl-8">
                            <h3 className="mb-4 text-lg font-bold text-white" style={{ fontFamily: "'Manrope', sans-serif" }}>
                                Service après vente :
                            </h3>
                            <ul className="space-y-2 text-sm text-white/80">
                                <li className="flex items-center gap-2">
                                    <Phone className="size-4 shrink-0" />
                                </li>
                                <li className="flex items-center gap-2">
                                    <Mail className="size-4 shrink-0" />
                                </li>
                                <li className="flex items-center gap-2">
                                    <MapPin className="size-4 shrink-0" />
                                </li>
                            </ul>
                        </div>
                    </div>
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
                <div className="sm:col-span-1">
                    <input
                        id="name"
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="w-full font-poppins font-light rounded-full border border-white-400 bg-[#1a1a1a] px-8 py-2.5 text-sm text-white transition-colors focus:outline-none"
                        placeholder='Nom & prénom *'
                        required
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                {/* Phone */}
                <div className="sm:col-span-1">
                    <input
                        id="phone"
                        type="tel"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        className="w-full font-poppins font-light rounded-full border border-white-400 bg-[#1a1a1a] px-8 py-2.5 text-sm text-white transition-colors focus:outline-none"
                        placeholder='Téléphone *'
                    />
                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>

                {/* Email */}
                <div>
                    <input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="w-full font-poppins font-light rounded-full border border-white-400 bg-[#1a1a1a] px-8 py-2.5 text-sm text-white transition-colors focus:outline-none"
                        placeholder="E-mail *"
                        required
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                {/* City */}
                <div>
                    <input
                        id="city"
                        type="text"
                        value={data.city}
                        onChange={(e) => setData('city', e.target.value)}
                        className="w-full font-poppins font-light rounded-full border border-white-400 bg-[#1a1a1a] px-8 py-2.5 text-sm text-white transition-colors focus:outline-none"
                        placeholder="Ville"
                    />
                    {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                </div>

                {/* Activity Type */}
                <div>
                    <Select value={data.activity_type} onValueChange={(val) => setData('activity_type', val)}>
                        <SelectTrigger className="h-auto min-h-[44px] font-poppins font-light w-full rounded-full border-white-400 bg-[#1a1a1a] px-8 py-2.5 text-sm text-white shadow-none focus:outline-none focus:ring-0">
                            <SelectValue placeholder="Type d'activité" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-white-400 bg-[#1a1a1a] text-white">
                            {ACTIVITY_TYPES.map((type) => (
                                <SelectItem key={type} value={type} className="focus:bg-white focus:text-black">{type}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.activity_type && <p className="mt-1 text-sm text-red-600">{errors.activity_type}</p>}
                </div>

                {/* Project Nature */}
                <div>
                    <Select value={data.project_nature} onValueChange={(val) => setData('project_nature', val)}>
                        <SelectTrigger className="h-auto min-h-[44px] font-poppins font-light w-full rounded-full border-white-400 bg-[#1a1a1a] px-8 py-2.5 text-sm text-white shadow-none focus:outline-none focus:ring-0">
                            <SelectValue placeholder="Nature du projet" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-white-400 bg-[#1a1a1a] text-white">
                            {PROJECT_NATURES.map((nature) => (
                                <SelectItem key={nature} value={nature} className="focus:bg-white focus:text-black">{nature}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.project_nature && <p className="mt-1 text-sm text-red-600">{errors.project_nature}</p>}
                </div>

                {/* Equipment Timeline */}
                <div>
                    <Select value={data.equipment_timeline} onValueChange={(val) => setData('equipment_timeline', val)}>
                        <SelectTrigger className="h-auto min-h-[44px] font-poppins font-light w-full rounded-full border-white-400 bg-[#1a1a1a] px-8 py-2.5 text-sm text-white shadow-none focus:outline-none focus:ring-0">
                            <SelectValue placeholder="Délai d'équipement" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-white-400 bg-[#1a1a1a] text-white">
                            {EQUIPMENT_TIMELINES.map((timeline) => (
                                <SelectItem key={timeline} value={timeline} className="focus:bg-white focus:text-black">{timeline}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.equipment_timeline && <p className="mt-1 text-sm text-red-600">{errors.equipment_timeline}</p>}
                </div>

                {/* Request Reason */}
                <div>
                    <Select value={data.request_reason} onValueChange={(val) => setData('request_reason', val)}>
                        <SelectTrigger className="h-auto min-h-[44px] font-poppins font-light w-full rounded-full border-white-400 bg-[#1a1a1a] px-8 py-2.5 text-sm text-white shadow-none focus:outline-none focus:ring-0">
                            <SelectValue placeholder="Motif de la demande" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-white-400 bg-[#1a1a1a] text-white">
                            {REQUEST_REASONS.map((reason) => (
                                <SelectItem key={reason} value={reason} className="focus:bg-white focus:text-black">{reason}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.request_reason && <p className="mt-1 text-sm text-red-600">{errors.request_reason}</p>}
                </div>

                {/* Message */}
                <div className="sm:col-span-2">
                    <textarea
                        id="message"
                        rows={5}
                        value={data.message}
                        onChange={(e) => setData('message', e.target.value)}
                        className="w-full font-poppins font-light rounded-2xl border border-white-400 bg-[#1a1a1a] px-8 py-4 text-sm text-white transition-colors focus:outline-none"
                        placeholder="Précisez ici votre message / Dis-nous en plus sur ta demande"
                        required
                    />
                    {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
                </div>
            </div>

            {data.product_id && (
                <input type="hidden" name="product_id" value={data.product_id} />
            )}

            <div className="mt-8 flex">
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full sm:w-[25%] sm:ml-auto font-poppins font-bold glow-btn rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-[#d5ab70] hover:text-white disabled:opacity-50"
                >
                    {processing ? 'Envoi en cours...' : 'Envoyer'}
                </button>
            </div>
        </form>
    );
}
