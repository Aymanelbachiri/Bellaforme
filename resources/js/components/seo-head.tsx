import { Head } from '@inertiajs/react';

import type { SeoData } from '@/types/models';

export default function SeoHead({ meta_title, meta_description, og_image, canonical_url }: SeoData) {
    return (
        <Head>
            <title>{meta_title}</title>
            <meta name="description" content={meta_description} />
            <meta property="og:title" content={meta_title} />
            <meta property="og:description" content={meta_description} />
            {og_image && <meta property="og:image" content={og_image} />}
            <link rel="canonical" href={canonical_url} />
        </Head>
    );
}
