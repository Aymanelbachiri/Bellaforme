<?php

namespace App\Models;

use App\Concerns\HasSlug;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Brand extends Model
{
    use HasFactory, HasSlug;

    protected $fillable = [
        'name',
        'slug',
        'logo',
        'is_partner',
        'is_reference',
        'order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_partner' => 'boolean',
            'is_reference' => 'boolean',
            'is_active' => 'boolean',
            'order' => 'integer',
        ];
    }

    public function divisions(): BelongsToMany
    {
        return $this->belongsToMany(Division::class);
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}
