import { Head } from '@inertiajs/react';
import { Lightbulb, Award, Zap, HeartHandshake } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';
import SeoHead from '@/components/seo-head';
import type { SeoData } from '@/types/models';

const values = [
    { number: '1', label: 'Innovation', icon: Lightbulb },
    { number: '2', label: 'Qualité', icon: Award },
    { number: '3', label: 'Efficacité', icon: Zap },
    { number: '4', label: 'Respect et Service', icon: HeartHandshake },
];

const serviceIcons = ['icons-18.svg', 'icons-19.svg', 'icons-20.svg', 'icons-21.svg', 'icons-22.svg', 'icons-23.svg'];

const services = [
    { label: 'Consulting et Conception' },
    { label: 'Étude technique pré installation' },
    { label: 'Équipements par des marques premium' },
    { label: 'Livraison & Installation' },
    { label: 'Formation certifiante by Bella Forme Academy' },
    { label: 'Garantie & SAV' },
];

export default function About({ seo }: { seo: SeoData }) {
    return (
        <PublicLayout>
            <SeoHead {...seo} />
            <Head title="Qui sommes nous ?" />

            <section
                className="relative bg-black py-16"
                style={{ backgroundImage: "url('/images/Black-shape-bg.png')", backgroundSize: 'cover', backgroundPosition: 'center', transform: 'scaleX(-1)' }}
            >
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8" style={{ transform: 'scaleX(-1)' }}>
                    {/* Title */}
                    <h1
                        className="mb-12 text-4xl font-bold text-white glow-text md:text-6xl"
                        style={{ fontFamily: "'Manrope', sans-serif" }}
                    >
                        Qui sommes nous ?
                    </h1>

                    {/* Intro */}
                    <div className="space-y-4 text-md leading-relaxed font-myriad font-regular text-white ">
                        <p>
                            BELLA FORME GROUP est une référence reconnue depuis près de 30 ans au service des
                            professionnels du secteur du bien-être au Maroc.
                            <br />
                            <br />
                            Distributeur exclusif des marques américaines et européennes leaders dans les
                            équipements de fitness. BELLAFORME a la particularité d'apporter une solution complète
                            en termes d'équipements et services : Étude et consulting, conception d'espace,
                            fournitures de matériel, livraison, installation, formation, garantie et service après-vente)
                            à destination des professionnels (Hôtel & SPA, Club de Fitness, Centre médico-sportif,
                            résidences, entreprises et particulier…etc.)
                        </p>
                    </div>
                </div>
            </section>

            <section className="bg-black">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

                    {/* Notre équipe */}
                    <div className="mb-16">
                        <h2
                            className="mb-6 text-2xl font-black uppercase text-white md:text-3xl"
                            style={{ fontFamily: "'poppins', sans-serif" }}
                        >
                            Notre équipe :
                        </h2>
                        <div className="relative overflow-hidden rounded-2xl">
                            <img
                                src="/images/image-equipe.jpg"
                                alt="L'équipe Bella Forme"
                                className="w-full rounded-2xl object-cover"
                            />
                            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-black via-black/40 to-transparent" />
                        </div>
                        <p className="mt-6 text-md leading-relaxed text-white font-myriad font-regular">
                            Dirigeants expérimentés et de jeunes passionnés, animés par un esprit d'écoute, d'échange
                            et de service pour satisfaire avec professionnalisme et excellence les projets que nous réalisons.
                            L'expérience client avec satisfaction est au cœur de notre préoccupation.
                        </p>
                    </div>

                    {/* Nos valeurs */}
                    <div className="mb-16">
                        <h2
                            className="mb-8 text-2xl font-black uppercase text-white md:text-3xl"
                            style={{ fontFamily: "'poppins', sans-serif" }}
                        >
                            Nos valeurs :
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            {values.map((v) => (
                                <div
                                    key={v.number}
                                    className="group relative flex items-center"
                                >
                                    <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-full bg-[#1a1a1a] py-10 pl-2 pr-6 transition-all group-hover:bg-white group-hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                                        <span
                                            className="absolute left-0 top-1/2 -translate-y-1/2 text-[4rem] sm:text-[7rem] font-black text-black blur-[2px] transition-all group-hover:blur-none md:text-[10rem]"
                                            style={{ fontFamily: "'Poppins', sans-serif", lineHeight: 0.85 }}
                                        >
                                            {v.number}
                                        </span>
                                        <span className="relative z-10 ml-14 text-lg font-black uppercase text-white transition-colors group-hover:text-black md:ml-16 md:text-2xl" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 900 }}>
                                            {v.label}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Nos services experts */}
                    <div>
                        <h2
                            className="mb-8 text-2xl font-black uppercase text-white md:text-3xl"
                            style={{ fontFamily: "'poppins', sans-serif" }}
                        >
                            Nos services experts :
                        </h2>
                        <div className="space-y-3">
                            {services.map((s, index) => (
                                <div
                                    key={s.label}
                                    className="group flex items-center rounded-full bg-white/10 transition-all hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.7),0_0_40px_rgba(255,255,255,0.25)] [&:hover_.pill-text]:text-black"
                                >
                                    <div className="m-1 flex size-12 shrink-0 items-center justify-center rounded-full bg-black p-2 md:size-14 md:p-2.5">
                                        <img
                                            src={`/images/svg/${serviceIcons[index]}`}
                                            alt=""
                                            className="size-full object-contain"
                                            aria-hidden
                                        />
                                    </div>
                                    <span className="pill-text px-4 py-4 pl-3 text-sm font-normal uppercase text-white md:text-base transition-colors group-hover:font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>{s.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
