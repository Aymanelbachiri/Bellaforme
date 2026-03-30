import { Head, Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import OptimizedImage, { getAvifUrl } from '@/components/optimized-image';
import SeoHead from '@/components/seo-head';
import PublicLayout from '@/layouts/public-layout';
import type { Division, HeroSlide, HomepageSettings, SeoData } from '@/types/models';

interface HomeProps {
    settings: HomepageSettings | null;
    divisions: Division[];
    seo: SeoData;
}

export default function Home({ settings, divisions, seo }: HomeProps) {
    const firstSlide = settings?.hero_slides?.[0];
    const firstSlideAvif =
        firstSlide?.type === 'image' && firstSlide?.media_url
            ? getAvifUrl(`/storage/${firstSlide.media_url}`)
            : null;

    return (
        <PublicLayout>
            <SeoHead {...seo} />
            {firstSlideAvif && (
                <Head>
                    <link rel="preload" href={firstSlideAvif} as="image" type="image/avif" />
                </Head>
            )}
            <HeroSection settings={settings} />
            <DivisionShowcase divisions={divisions} />
            <StatsSection stats={settings?.stats ?? []} />
        </PublicLayout>
    );
}

/* ------------------------------------------------------------------ */
/*  Hero Slider                                                        */
/* ------------------------------------------------------------------ */

function getEmbedUrl(url: string): string | null {
    const ytMatch = url.match(
        /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    );
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${ytMatch[1]}&controls=0&showinfo=0`;

    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&muted=1&loop=1&background=1`;

    return null;
}

function SlideBackground({ slide, isFirst }: { slide: HeroSlide; isFirst?: boolean }) {
    if (slide.type === 'video') {
        const embedUrl = getEmbedUrl(slide.media_url);
        if (embedUrl) {
            return (
                <div className="absolute inset-0 overflow-hidden">
                    <iframe
                        src={embedUrl}
                        title="Hero video"
                        className="absolute left-1/2 top-1/2 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2"
                        style={{ border: 'none', pointerEvents: 'none', aspectRatio: '16/9', width: 'max(100%, 177.78vh)', height: 'max(100%, 56.25vw)' }}
                        allow="autoplay; muted; encrypted-media"
                        allowFullScreen={false}
                    />
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black via-black/30 to-transparent" />
                </div>
            );
        }
        if (slide.media_url) {
            const videoSrc = slide.media_url.startsWith('http') ? slide.media_url : `/storage/${slide.media_url}`;
            return (
                <div className="absolute inset-0 overflow-hidden">
                    <video src={videoSrc} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black via-black/30 to-transparent" />
                </div>
            );
        }
    }
    if (slide.media_url) {
        return (
            <div className="absolute inset-0">
                <OptimizedImage src={`/storage/${slide.media_url}`} alt={slide.title || 'Hero background'} loading="eager" fetchPriority={isFirst ? 'high' : undefined} className="h-full w-full object-cover opacity-70" sizes="100vw" />
                <div className="absolute inset-0 bg-gradient-to-b from-black via-black/30 to-transparent" />
            </div>
        );
    }
    return null;
}

function HeroSection({ settings }: { settings: HomepageSettings | null }) {
    const slides = settings?.hero_slides ?? [];
    if (slides.length === 0) return <LegacyHero settings={settings} />;

    const sliderSettings = {
        dots: true, infinite: true, speed: 800, slidesToShow: 1, slidesToScroll: 1,
        autoplay: true, autoplaySpeed: 6000, fade: true, pauseOnHover: false, arrows: slides.length > 1,
    };

    return (
        <section className="hero-slider relative bg-black overflow-hidden md:rounded-b-[42px] rounded-b-[18px]">
            <Slider {...sliderSettings}>
                {slides.map((slide, index) => (
                    <div key={index}>
                        <div className="relative flex min-h-[50vh] sm:min-h-[70vh] items-center justify-center bg-black">
                            <SlideBackground slide={slide} isFirst={index === 0} />
                            <div className="relative z-10 mx-auto max-w-4xl px-4 text-center text-white entrance-fade-up">
                                {slide.title && (
                                    <h2 className="mb-4 text-2xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-6xl glow-text" style={{ fontFamily: "'Manrope', sans-serif" }}>
                                        {slide.title}
                                    </h2>
                                )}
                                {slide.subtitle && (
                                    <p className="mx-auto max-w-2xl text-base text-white sm:text-lg" style={{ fontFamily: "'Myriad Pro', 'Segoe UI', Helvetica, Arial, sans-serif" }}>
                                        {slide.subtitle}
                                    </p>
                                )}
                                {slide.button_text && (
                                    <a
                                        href={slide.button_url || '/contact'}
                                        className="glow-btn mt-8 inline-block rounded-full bg-white px-8 py-3 text-sm text-black transition-colors hover:bg-[#d5ab70] hover:text-white"
                                        style={{ fontFamily: "'Myriad Pro', 'Segoe UI', Helvetica, Arial, sans-serif", fontWeight: 700 }}
                                    >
                                        {slide.button_text}
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
            {/* Decorative shape + play button at bottom of hero slider */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 overflow-hidden hidden sm:block">
                <div className="relative">
                    <img
                        src="/images/shape-2.png"
                        alt=""
                        className="pointer-events-none"
                        style={{ minWidth: '900px' }}
                        aria-hidden="true"
                    />
                    
                    <button
                        type="button"
                        className="hero-play-btn absolute left-1/2 bottom-5 translate-y-1/2 md:bottom-[-0.3rem] md:-translate-y-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-black shadow-lg transition-transform hover:scale-110 "
                        aria-label="Play video"
                        style={{ boxShadow: "0 0 10px rgba(255, 255, 255, 0.8)" }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 ml-0.5">
                            <path d="M8 5.14v14l11-7-11-7z" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
}

function LegacyHero({ settings }: { settings: HomepageSettings | null }) {
    const bgImage = settings?.hero_image ? `/storage/${settings.hero_image}` : '';
    return (
        <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-black">
            {bgImage && (
                <div className="absolute inset-0">
                    <OptimizedImage src={bgImage} alt="Hero background" loading="eager" className="h-full w-full object-cover opacity-60" sizes="100vw" />
                </div>
            )}
            <div className="relative z-10 mx-auto max-w-4xl px-4 text-center text-white entrance-fade-up">
                {settings?.hero_title && (
                    <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl" style={{ fontFamily: "'Manrope', sans-serif" }}>
                        {settings.hero_title}
                    </h1>
                )}
                {settings?.hero_subtitle && (
                    <p className="mx-auto max-w-2xl text-lg text-white md:text-xl" style={{ fontFamily: "'Myriad Pro', 'Segoe UI', Helvetica, Arial, sans-serif" }}>
                        {settings.hero_subtitle}
                    </p>
                )}
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/*  Division Showcase — full-width image cards with overlay            */
/* ------------------------------------------------------------------ */

function DivisionShowcase({ divisions }: { divisions: Division[] }) {
    if (divisions.length === 0) return null;
    return (
        <section className="bg-black">
            {divisions.map((division, index) => (
                <DivisionCard key={division.id} division={division} isRight={index % 2 === 1} />
            ))}
        </section>
    );
}

function DivisionCard({ division, isRight }: { division: Division; isRight: boolean }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const el = cardRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(el);
                }
            },
            { threshold: 0.15 },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const bgImage = division.homepage_image || division.hero_image;
    return (
        <div
            ref={cardRef}
            className="relative flex min-h-[45vh] sm:min-h-[65vh] items-end overflow-hidden my-2 transition-all duration-[1200ms] ease-out"
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(60px)',
            }}
        >
            {bgImage ? (
                <div className="absolute inset-0">
                    <OptimizedImage
                        src={`/storage/${bgImage}`}
                        alt={division.name}
                        className="h-full w-full object-cover"
                        sizes="100vw"
                    />
                    <div className={`absolute inset-0 ${isRight ? 'bg-gradient-to-l from-black/70 via-black/40 to-transparent' : 'bg-gradient-to-r from-black/70 via-black/40 to-transparent'}`} />
                </div>
            ) : (
                <div className="absolute inset-0 bg-black" />
            )}
            <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
                <div className={`max-w-lg ${isRight ? 'ml-auto text-right' : ''}`}>
                    <h3
                        className="mb-3 text-2xl font-bold uppercase tracking-wide text-white md:text-3xl"
                        style={{ fontFamily: "'Manrope', sans-serif" }}
                    >
                        {division.name}
                    </h3>
                    {(division.homepage_subtitle || division.hero_subtitle) && (
                        <p
                            className="mb-8 text-sm leading-relaxed text-white md:mb-18 md:text-base"
                            style={{ fontFamily: "'Myriad Pro', 'Segoe UI', Helvetica, Arial, sans-serif" }}
                        >
                            {division.homepage_subtitle || division.hero_subtitle}
                        </p>
                    )}
                    <div className={`flex flex-wrap gap-3 ${isRight ? 'justify-end' : ''}`}>
                        <Link
                            href={`/${division.slug}`}
                            className="glow-btn rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#d5ab70] hover:text-white"
                            style={{ fontFamily: "'Myriad Pro', 'Segoe UI', Helvetica, Arial, sans-serif" }}
                        >
                            Découvrir
                        </Link>
                        <Link
                            href="/contact"
                            className="px-6 py-2.5 text-sm font-regular text-white transition-colors"
                            style={{ fontFamily: "'Myriad Pro', 'Segoe UI', Helvetica, Arial, sans-serif" }}
                        >
                            Contactez-nous &nbsp; &gt;
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Stats                                                              */
/* ------------------------------------------------------------------ */

function StatsSection({ stats }: { stats: Array<{ label: string; value: string }> }) {
    const sectionRef = useRef<HTMLElement>(null);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                }
            },
            { threshold: 0.3 },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [hasAnimated]);

    if (stats.length === 0) return null;
    return (
        <section ref={sectionRef} className="bg-black py-14 sm:py-24">
            <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
                <h2
                    className="mb-1 text-sm font-bold uppercase tracking-[0.25em] text-white"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                    Notre engagement
                </h2>
                <p
                    className="mb-14 text-sm font-bold uppercase tracking-[0.25em] text-white"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                    Pour une efficacité visible et mesurée
                </p>
                <div className="grid grid-cols-1 gap-0 sm:grid-cols-3">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className={`border-y-0 px-8 py-12 sm:[border-image:linear-gradient(to_bottom,transparent_25%,_#fff_75%,_transparent_100%)_1] ${
                                index === 0 ? '' : 'sm:border-l'
                            } ${index === stats.length - 2 ? 'sm:border-r' : ''}`}
                            style={{ borderStyle: 'solid' }}
                        >
                            <p className="text-4xl font-bold text-white md:text-5xl" style={{ fontFamily: "'Manrope', sans-serif" }}>
                                <CountUp value={stat.value} animate={hasAnimated} />
                            </p>
                            <p className="mt-3 text-xs uppercase tracking-wider text-white" style={{ fontFamily: "'Myriad Pro', 'Segoe UI', Helvetica, Arial, sans-serif" }}>
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function CountUp({ value, animate }: { value: string; animate: boolean }) {
    // Parse prefix (e.g. "+"), number, and suffix (e.g. "%", "M", " ans")
    const match = value.match(/^([^\d]*)([\d]+)(.*)$/);
    const prefix = match?.[1] ?? '';
    const target = match ? parseInt(match[2], 10) : 0;
    const suffix = match?.[3] ?? '';

    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!animate || target === 0) return;
        const duration = 5000;
        const steps = 60;
        const increment = target / steps;
        let frame = 0;

        const timer = setInterval(() => {
            frame++;
            if (frame >= steps) {
                setCurrent(target);
                clearInterval(timer);
            } else {
                // Ease-out curve
                const progress = frame / steps;
                const eased = 1 - Math.pow(1 - progress, 3);
                setCurrent(Math.round(eased * target));
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [animate, target]);

    if (!match) return <>{value}</>;
    return <>{prefix}{animate ? current : 0}{suffix}</>;
}