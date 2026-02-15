import { Link, usePage } from '@inertiajs/react';
import { Menu, X, Facebook, Instagram, Linkedin, Youtube, Phone, Mail, MapPin } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import type { SharedData } from '@/types';

interface PublicLayoutProps {
    children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
    const { divisions, name } = usePage<SharedData>().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="flex min-h-screen flex-col bg-black">
            <Navbar
                divisions={divisions}
                appName={name}
                mobileMenuOpen={mobileMenuOpen}
                onToggleMobile={() => setMobileMenuOpen(!mobileMenuOpen)}
            />
            <main className="flex-1">{children}</main>
            <TaglineSection />
            <ContactCTA />
            <Footer appName={name} />
        </div>
    );
}

interface NavbarProps {
    divisions: SharedData['divisions'];
    appName: string;
    mobileMenuOpen: boolean;
    onToggleMobile: () => void;
}

function Navbar({ divisions, mobileMenuOpen, onToggleMobile }: NavbarProps) {
    return (
        <header className="sticky top-0 z-50 border-b border-gray-800 bg-black font-[Poppins,sans-serif]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex shrink-0 items-center">
                        <img src="/images/Logo.png" alt="Bella Forme Group" className="h-12 w-auto" />
                    </Link>

                    {/* Desktop navigation — centered */}
                    <nav className="hidden flex-1 items-center justify-center gap-6 md:flex">
                        {divisions.map((division) => (
                            <Link
                                key={division.id}
                                href={`/${division.slug}`}
                                className="whitespace-nowrap text-sm font-normal text-white transition-opacity hover:opacity-80"
                            >
                                {division.name}
                            </Link>
                        ))}
                        <a
                            href="https://bellaforme.academy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="whitespace-nowrap text-sm font-normal text-white transition-opacity hover:opacity-80"
                        >
                            Academy
                        </a>
                        <Link
                            href="/contact"
                            className="whitespace-nowrap text-sm font-normal text-white transition-opacity hover:opacity-80"
                        >
                            Contactez-nous
                        </Link>
                    </nav>

                    {/* Home gym button — right side */}
                    <a
                        href="https://expertfit.ma"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden shrink-0 rounded-full bg-white px-5 py-1.5 text-sm font-normal text-black transition-colors glow-btn hover:bg-white/80 md:inline-block"
                    >
                        Home gym
                    </a>

                    {/* Mobile menu button */}
                    <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-gray-800 md:hidden"
                        onClick={onToggleMobile}
                        aria-expanded={mobileMenuOpen}
                        aria-label="Toggle navigation menu"
                    >
                        {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile navigation */}
            {mobileMenuOpen && (
                <nav className="border-t border-gray-800 bg-black md:hidden">
                    <div className="space-y-1 px-4 py-3">
                        {divisions.map((division) => (
                            <Link
                                key={division.id}
                                href={`/${division.slug}`}
                                className="block rounded-md px-3 py-2 text-base font-normal text-white hover:bg-gray-800"
                            >
                                {division.name}
                            </Link>
                        ))}
                        <a
                            href="https://bellaforme.academy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block rounded-md px-3 py-2 text-base font-normal text-white hover:bg-gray-800"
                        >
                            Academy
                        </a>
                        <Link
                            href="/contact"
                            className="block rounded-md px-3 py-2 text-base font-normal text-white hover:bg-gray-800"
                        >
                            Contactez-nous
                        </Link>
                        <a
                            href="https://expertfit.ma"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 block rounded-full bg-white px-3 py-2 text-center text-base font-normal text-black transition-colors hover:bg-white/80"
                        >
                            Home gym
                        </a>
                    </div>
                </nav>
            )}
        </header>
    );
}

interface FooterProps {
    appName: string;
}

function Footer({ appName }: FooterProps) {
    const { divisions } = usePage<SharedData>().props;

    const SocialIcons = () => (
        <div className="flex gap-2">
            <a href="#" aria-label="Phone" className="rounded-full border border-gray-600 p-1.5 text-white transition-opacity hover:opacity-80">
                <Phone className="size-3.5" />
            </a>
            <a href="#" aria-label="LinkedIn" className="rounded-full border border-gray-600 p-1.5 text-white transition-opacity hover:opacity-80">
                <Linkedin className="size-3.5" />
            </a>
            <a href="#" aria-label="Facebook" className="rounded-full border border-gray-600 p-1.5 text-white transition-opacity hover:opacity-80">
                <Facebook className="size-3.5" />
            </a>
            <a href="#" aria-label="Instagram" className="rounded-full border border-gray-600 p-1.5 text-white transition-opacity hover:opacity-80">
                <Instagram className="size-3.5" />
            </a>
            <a href="#" aria-label="YouTube" className="rounded-full border border-gray-600 p-1.5 text-white transition-opacity hover:opacity-80">
                <Youtube className="size-3.5" />
            </a>
        </div>
    );

    return (
        <footer className="bg-gradient-to-b from-[#1a1a1a] to-black text-white" style={{ fontFamily: "'Myriad Pro', 'Segoe UI', Helvetica, Arial, sans-serif" }}>
            {/* Top section: 3 columns */}
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                    {/* À PROPOS */}
                    <div>
                        <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            À propos :
                        </h3>
                        <ul className="space-y-2.5 text-sm">
                            <li><Link href="/" className="transition-colors hover:text-white">Qui sommes-nous ?</Link></li>
                            <li><Link href="/" className="transition-colors hover:text-white">Nos marques</Link></li>
                            <li><Link href="/" className="transition-colors hover:text-white">Nos références & réalisations</Link></li>
                            <li><Link href="/" className="transition-colors hover:text-white">Nos solutions à vos projets</Link></li>
                        </ul>
                    </div>

                    {/* SOLUTIONS ET ACCOMPAGNEMENT */}
                    <div>
                        <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            Solutions et accompagnement :
                        </h3>
                        <ul className="space-y-2.5 text-sm">
                            <li><Link href="/" className="transition-colors hover:text-white">Nos catalogues</Link></li>
                            <li><Link href="/" className="transition-colors hover:text-white">Démonstration et formation</Link></li>
                            <li>
                                <a href="https://bellaforme.academy" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
                                    Academy
                                </a>
                            </li>
                            <li><Link href="/" className="transition-colors hover:text-white">Support publicitaire</Link></li>
                        </ul>
                    </div>

                    {/* SUPPORT D'AIDE & CONTACT */}
                    <div>
                        <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            Support d'aide & contact :
                        </h3>
                        <ul className="space-y-2.5 text-sm">
                            <li><Link href="/contact" className="transition-colors hover:text-white">Conditions de vente</Link></li>
                            <li><span>Besoin d'aide ?</span></li>
                            <li className="flex items-center gap-2">
                                <Phone className="size-3.5 shrink-0 text-white" />
                                <span>+212 522 258 481</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="size-3.5 shrink-0 text-white" />
                                <span>Serviceclient@bellaforme.ma</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <MapPin className="mt-0.5 size-3.5 shrink-0 text-white" />
                                <span>20100, Angle rue Ibnou Katir et Ibnou Habous Maarif. Casablanca | MAROC</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom section: divisions with social icons + newsletter */}
            <div className="">
                <div className="w-[90%] border-t m-auto border-white"></div>
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 items-end gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {divisions.map((division) => (
                            <div key={division.id}>
                                <p className="mb-3 text-sm font-medium text-white">{division.name}</p>
                                <SocialIcons />
                            </div>
                        ))}
                        {/* Newsletter */}
                        <div>
                            <p className="mb-3 text-sm font-medium text-white">Abonnez-vous à la newsletter</p>
                            <form onSubmit={(e) => e.preventDefault()} className="flex">
                                <div className='flex bg-white rounded-full'>
                                <input
                                    type="email"
                                    placeholder="Email *"
                                    className="flex-1 rounded-l-full bg-white px-4 py-2 text-sm text-black placeholder-gray-500 focus:border-white outline-none"
                                />
                                <button
                                    type="submit"
                                    className="rounded-full bg-black m-1 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-black"
                                >
                                    Subscribe
                                </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright bar */}
            <div className="border-t border-gray-800 py-4" style={{ backgroundColor: '#d5ab70' }}>
                <p className="text-center text-xs text-white">
                    Tous droits réservés &copy; {new Date().getFullYear()} - {appName}
                </p>
            </div>
        </footer>
    );
}

/* ------------------------------------------------------------------ */
/*  Tagline                                                            */
/* ------------------------------------------------------------------ */

function TaglineSection() {
    return (
        <section
            className="relative bg-black py-28"
            style={{ backgroundImage: "url('/images/Black-shape-bg.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
            <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
                <img src="/images/Logo-2.png" alt="Bella Forme Group" className="mx-auto mb-8 h-24 w-auto" />
                <p
                    className="text-3xl text-white md:text-4xl"
                    style={{ fontFamily: "'DistilleryScript', cursive" }}
                >
                    Un partenaire de confiance… Une histoire d'excellence
                </p>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/*  Contact CTA                                                        */
/* ------------------------------------------------------------------ */

function ContactCTA() {
    return (
        <section className="relative pt-32 pb-24" style={{ backgroundColor: '#1a1a1a' }}>
            {/* CSS mask overlay at top center */}
            <div
                className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[150px]"
                style={{
                    backgroundColor: '#000000',
                    WebkitMaskImage: "url('/images/shape.png')",
                    maskImage: "url('/images/shape.png')",
                    WebkitMaskSize: 'contain',
                    maskSize: 'contain',
                    WebkitMaskRepeat: 'no-repeat',
                    maskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center top',
                    maskPosition: 'center top',
                }}
                aria-hidden="true"
            />
            <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
                <h2
                    className="mb-2 text-2xl font-black uppercase text-white md:text-3xl"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                    Une question ?
                </h2>
                <p
                    className="mb-4 text-2xl font-black uppercase text-white md:text-3xl"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                    Contactez-nous
                </p>
                <p
                    className="mx-auto mb-10 max-w-xl text-sm text-white"
                    style={{ fontFamily: "'Myriad Pro', 'Segoe UI', Helvetica, Arial, sans-serif" }}
                >
                    Nos équipes sont disponibles pour trouver les réponses à vos questions.
                </p>
                <Link
                    href="/contact"
                    className="glow-btn inline-block rounded-full bg-white px-10 py-3 text-sm font-semibold text-black transition-colors hover:bg-white/80"
                    style={{ fontFamily: "'Myriad Pro', 'Segoe UI', Helvetica, Arial, sans-serif" }}
                >
                    Nous contacter
                </Link>
            </div>
        </section>
    );
}
