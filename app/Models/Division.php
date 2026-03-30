<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use App\Concerns\HasSeo;
use App\Concerns\HasSlug;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Division extends Model
{
    use HasFactory, HasSeo, HasSlug;

    protected $fillable = [
        'name',
        'slug',
        'homepage_image',
        'hero_image',
        'hero_title',
        'hero_subtitle',
        'homepage_subtitle',
        'phone',
        'facebook_url',
        'instagram_url',
        'linkedin_url',
        'youtube_url',
        'order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'order' => 'integer',
        ];
    }

    public function categories(): HasMany
    {
        return $this->hasMany(Category::class);
    }

    public function brands(): BelongsToMany
    {
        return $this->belongsToMany(Brand::class);
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true)->orderBy('order', 'asc');
    }
}
