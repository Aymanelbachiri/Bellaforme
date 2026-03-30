import { Head } from '@inertiajs/react';

const messages: Record<number, { title: string; description: string }> = {
    404: {
        title: 'Page introuvable',
        description: 'La page que vous recherchez n\'existe pas ou a été déplacée.',
    },
    500: {
        title: 'Erreur serveur',
        description: 'Une erreur interne est survenue. Veuillez réessayer plus tard.',
    },
    503: {
        title: 'Service indisponible',
        description: 'Le site est en maintenance. Veuillez réessayer dans quelques instants.',
    },
};

export default function Error({ status }: { status: number }) {
    const { title, description } = messages[status] ?? {
        title: 'Erreur',
        description: 'Une erreur est survenue.',
    };

    return (
        <>
            <Head title={`${status} — ${title}`} />
            <div className="flex min-h-screen items-center justify-center bg-black px-4">
                <div className="text-center">
                    <h1
                        className="text-[8rem] font-bold leading-none text-white glow-text md:text-[12rem]"
                        style={{ fontFamily: "'Manrope', sans-serif" }}
                    >
                        {status}
                    </h1>
                    <h2
                        className="mt-4 text-2xl font-bold text-white md:text-3xl"
                        style={{ fontFamily: "'Manrope', sans-serif" }}
                    >
                        {title}
                    </h2>
                    <p className="mx-auto mt-3 max-w-md font-light text-white/60">
                        {description}
                    </p>
                    <a
                        href="/"
                        className="glow-btn mt-8 inline-block rounded-full bg-white px-8 py-3 text-sm font-semibold text-black transition-colors hover:bg-white/80"
                    >
                        Retour à l'accueil
                    </a>
                </div>
            </div>
        </>
    );
}
