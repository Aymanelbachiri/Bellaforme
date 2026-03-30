import { Link, router, usePage } from '@inertiajs/react';
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
                onCloseMobile={() => setMobileMenuOpen(false)}
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
    onCloseMobile: () => void;
}

function Navbar({ divisions, mobileMenuOpen, onToggleMobile, onCloseMobile }: NavbarProps) {
    const currentPath = usePage().url.split('?')[0];
    const isActive = (href: string) => currentPath === href || currentPath.startsWith(href + '/');

    return (
        <header className="sticky top-0 z-50 border-gray-800 bg-black font-[Poppins,sans-serif]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex shrink-0 items-center">
                        <img src="/images/Logo.png" alt="Bella Forme Group" className="h-[3.25rem] w-auto" />
                    </Link>

                    {/* Desktop navigation — centered */}
                    <nav className="hidden flex-1 items-center justify-center gap-4 lg:flex xl:gap-6">
                        {divisions.map((division) => (
                            <Link
                                key={division.id}
                                href={`/${division.slug}`}
                                className={`whitespace-nowrap text-sm transition-colors hover:text-[#d5ab70] ${isActive(`/${division.slug}`) ? 'font-bold text-[#d5ab70]' : 'font-normal text-white'}`}
                            >
                                {division.name}
                            </Link>
                        ))}
                        <a
                            href="https://bellaforme.academy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="whitespace-nowrap text-sm font-normal text-white transition-colors hover:text-[#d5ab70]"
                        >
                            Academy
                        </a>
                        <Link
                            href="/contact"
                            className={`whitespace-nowrap text-sm transition-colors hover:text-[#d5ab70] ${isActive('/contact') ? 'font-bold text-[#d5ab70]' : 'font-normal text-white'}`}
                        >
                            Contactez-nous
                        </Link>
                    </nav>

                    {/* Home gym button — right side */}
                    <a
                        href="https://expertfit.ma"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden shrink-0 rounded-full bg-white px-5 py-1.5 text-sm font-normal text-black transition-colors glow-btn hover:bg-[#d5ab70] hover:text-white lg:inline-block"
                    >
                        Home gym
                    </a>

                    {/* Mobile/tablet menu button */}
                    <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-gray-800 lg:hidden"
                        onClick={onToggleMobile}
                        aria-expanded={mobileMenuOpen}
                        aria-label="Toggle navigation menu"
                    >
                        {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile/tablet navigation — overlay */}
            <nav
                className={`absolute left-0 right-0 top-full overflow-hidden border-t border-gray-800 bg-black transition-all duration-300 ease-in-out lg:hidden ${
                    mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 border-t-transparent'
                }`}
            >
                <div className="space-y-1 px-4 py-3">
                    {divisions.map((division) => (
                        <Link
                            key={division.id}
                            href={`/${division.slug}`}
                            onClick={onCloseMobile}
                            className={`block rounded-md px-3 py-3 min-h-[44px] text-base transition-colors hover:text-[#d5ab70] ${isActive(`/${division.slug}`) ? 'font-bold text-[#d5ab70]' : 'font-normal text-white'}`}
                        >
                            {division.name}
                        </Link>
                    ))}
                    <a
                        href="https://bellaforme.academy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-md px-3 py-3 min-h-[44px] text-base font-normal text-white transition-colors hover:text-[#d5ab70]"
                    >
                        Academy
                    </a>
                    <Link
                        href="/contact"
                        onClick={onCloseMobile}
                        className={`block rounded-md px-3 py-3 min-h-[44px] text-base transition-colors hover:text-[#d5ab70] ${isActive('/contact') ? 'font-bold text-[#d5ab70]' : 'font-normal text-white'}`}
                    >
                        Contactez-nous
                    </Link>
                    <a
                        href="https://expertfit.ma"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 block rounded-full bg-white px-3 py-3 min-h-[44px] text-center text-base font-normal text-black transition-colors hover:bg-[#d5ab70] hover:text-white"
                    >
                        Home gym
                    </a>
                </div>
            </nav>
        </header>
    );
}

interface FooterProps {
    appName: string;
}

function Footer({ appName }: FooterProps) {
    const { divisions } = usePage<SharedData>().props;

    const SocialIcons = ({ division }: { division: SharedData['divisions'][number] }) => {
        const hasAny = division.phone || division.linkedin_url || division.facebook_url || division.instagram_url || division.youtube_url;
        if (!hasAny) return null;

        return (
            <div className="flex gap-2">
                {division.phone && (
                    <a href={`tel:${division.phone}`} aria-label="Phone" className="rounded-full border bg-white text-black p-1.5 transition-colors hover:bg-[#d5ab70] hover:border-[#d5ab70] hover:text-white">
                        <Phone className="size-3.5" />
                    </a>
                )}
                {division.linkedin_url && (
                    <a href={division.linkedin_url} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="rounded-full border bg-white text-black p-1.5 transition-colors hover:bg-[#d5ab70] hover:border-[#d5ab70] hover:text-white">
                        <Linkedin className="size-3.5" />
                    </a>
                )}
                {division.facebook_url && (
                    <a href={division.facebook_url} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="rounded-full border bg-white text-black p-1.5 transition-colors hover:bg-[#d5ab70] hover:border-[#d5ab70] hover:text-white">
                        <Facebook className="size-3.5" />
                    </a>
                )}
                {division.instagram_url && (
                    <a href={division.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="rounded-full border bg-white text-black p-1.5 transition-colors hover:bg-[#d5ab70] hover:border-[#d5ab70] hover:text-white">
                        <Instagram className="size-3.5" />
                    </a>
                )}
                {division.youtube_url && (
                    <a href={division.youtube_url} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="rounded-full border bg-white text-black p-1.5 transition-colors hover:bg-[#d5ab70] hover:border-[#d5ab70] hover:text-white">
                        <Youtube className="size-3.5" />
                    </a>
                )}
            </div>
        );
    };

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
                            <li><Link href="/qui-sommes-nous" className="transition-colors hover:text-[#d5ab70]">Qui sommes-nous ?</Link></li>
                            <li><Link href="/nos-marques" className="transition-colors hover:text-[#d5ab70]">Nos marques</Link></li>
                            <li><Link href="/nos-references" className="transition-colors hover:text-[#d5ab70]">Nos références & réalisations</Link></li>
                        </ul>
                    </div>

                    {/* SOLUTIONS ET ACCOMPAGNEMENT */}
                    <div>
                        <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            Solutions et accompagnement :
                        </h3>
                        <ul className="space-y-2.5 text-sm">
                            <li><Link href="/nos-catalogues" className="transition-colors hover:text-[#d5ab70]">Nos catalogues</Link></li>
                            <li>
                                <a href="https://bellaforme.academy" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[#d5ab70]">
                                    Academy
                                </a>
                            </li>
                            <li><Link href="/nos-solutions" className="transition-colors hover:text-[#d5ab70]">Nos solutions à vos projets</Link></li>
                        </ul>
                    </div>

                    {/* SUPPORT D'AIDE & CONTACT */}
                    <div>
                        <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            Support d'aide & contact :
                        </h3>
                        <ul className="space-y-2.5 text-sm break-words">
                            <li><Link href="/contact" className="transition-colors hover:text-[#d5ab70]">Conditions de vente</Link></li>
                            <li className="flex items-center gap-2">
                                <Phone className="size-3.5 shrink-0 text-white" />
                                <span>+212 522 258 481</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="size-3.5 shrink-0 text-white" />
                                <span className="break-all">Serviceclient@bellaforme.ma</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <MapPin className="mt-0.5 size-3.5 shrink-0 text-white" />
                                <span>Angle rue Ibnou Katir et Ibnou Habous Maarif, Casablanca</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom section: divisions with social icons + newsletter */}
            <div className="">
                <div className="w-[90%] border-t m-auto border-white"></div>
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 items-end gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
                        {divisions.map((division) => (
                            <div key={division.id}>
                                <p className="mb-3 text-sm font-medium text-white">{division.name}</p>
                                <SocialIcons division={division} />
                            </div>
                        ))}
                        {/* Newsletter */}
                        <div className="sm:col-span-2 lg:col-span-1">
                            <p className="mb-3 text-sm font-medium text-white">Abonnez-vous à la newsletter</p>
                            <NewsletterForm />
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
            className="relative bg-black py-14 sm:py-28"
            style={{ backgroundImage: "url('/images/Black-shape-bg.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
            <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
                <img src="/images/Logo.png" alt="Bella Forme Group" className="mx-auto mb-6 h-16 w-auto sm:mb-8 sm:h-24" />
                <p
                    className="text-2xl text-white sm:text-3xl md:text-4xl"
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
        <section className="relative pt-20 pb-16 sm:pt-32 sm:pb-24" style={{ backgroundColor: '#1a1a1a' }}>
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
                    className="glow-btn inline-block rounded-full bg-white px-10 py-3 text-sm font-semibold text-black transition-colors hover:bg-[#d5ab70] hover:text-white"
                    style={{ fontFamily: "'Myriad Pro', 'Segoe UI', Helvetica, Arial, sans-serif" }}
                >
                    Nous contacter
                </Link>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/*  Newsletter Form                                                    */
/* ------------------------------------------------------------------ */

function NewsletterForm() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setStatus('sending');
        setErrorMsg('');

        router.post('/newsletter', { email }, {
            preserveScroll: true,
            onSuccess: () => {
                setStatus('success');
                setEmail('');
                setTimeout(() => setStatus('idle'), 4000);
            },
            onError: (errors) => {
                setStatus('error');
                setErrorMsg(errors.email ?? 'Une erreur est survenue.');
                setTimeout(() => setStatus('idle'), 4000);
            },
        });
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="flex">
                <div className="flex w-full items-center overflow-hidden rounded-full bg-white">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email *"
                        required
                        className="min-w-0 flex-1 rounded-l-full bg-white px-4 py-2 text-sm text-black placeholder-gray-500 outline-none"
                    />
                    <button
                        type="submit"
                        disabled={status === 'sending'}
                        className="m-1 shrink-0 whitespace-nowrap rounded-full bg-black px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-black disabled:opacity-50"
                    >
                        {status === 'sending' ? '...' : "S'inscrire"}
                    </button>
                </div>
            </form>
            {status === 'success' && (
                <p className="mt-2 text-xs text-green-400">Merci pour votre inscription !</p>
            )}
            {status === 'error' && (
                <p className="mt-2 text-xs text-red-400">{errorMsg}</p>
            )}
        </div>
    );
}
