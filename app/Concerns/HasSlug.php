<?php

namespace App\Concerns;

use Illuminate\Support\Str;

trait HasSlug
{
    public static function bootHasSlug(): void
    {
        // Ensure slug is always populated before saving (create or update)
        static::saving(function ($model) {
            if (empty($model->slug) && ! empty($model->name)) {
                $base = Str::slug($model->name);
                $slug = $base;
                $i = 1;

                while (static::where('slug', $slug)->where('id', '!=', $model->id ?? 0)->exists()) {
                    $slug = "{$base}-{$i}";
                    $i++;
                }

                $model->slug = $slug;
            }
        });
    }
}
