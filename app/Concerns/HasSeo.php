<?php

namespace App\Concerns;

use App\Models\SeoMetadata;
use Illuminate\Database\Eloquent\Relations\MorphOne;

trait HasSeo
{
    public function seo(): MorphOne
    {
        return $this->morphOne(SeoMetadata::class, 'seoable');
    }

    /**
     * Get SEO data with fallback defaults from the entity's own fields.
     *
     * @return array{meta_title: string, meta_description: string, og_image: string|null}
     */
    public function getSeoData(): array
    {
        $seo = $this->seo;

        $metaTitle = $seo->meta_title ?? null;
        $metaDescription = $seo->meta_description ?? null;
        $ogImage = $seo->og_image ?? null;

        // Fallback: meta_title from entity name
        if (empty($metaTitle)) {
            $metaTitle = $this->name ?? '';
        }

        // Fallback: meta_description from short_description or hero_subtitle
        if (empty($metaDescription)) {
            if (isset($this->short_description)) {
                $metaDescription = $this->short_description ?? '';
            } elseif (isset($this->hero_subtitle)) {
                $metaDescription = $this->hero_subtitle ?? '';
            } else {
                $metaDescription = '';
            }
        }

        // Fallback: og_image from featured_image or hero_image
        if (empty($ogImage)) {
            if (isset($this->featured_image)) {
                $ogImage = $this->featured_image;
            } elseif (isset($this->hero_image)) {
                $ogImage = $this->hero_image;
            } else {
                $ogImage = null;
            }
        }

        return [
            'meta_title' => $metaTitle,
            'meta_description' => $metaDescription,
            'og_image' => $ogImage,
        ];
    }
}
