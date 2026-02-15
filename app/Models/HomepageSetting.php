<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HomepageSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'hero_image',
        'hero_title',
        'hero_subtitle',
        'hero_slides',
        'stats',
    ];

    protected function casts(): array
    {
        return [
            'hero_slides' => 'array',
            'stats' => 'array',
        ];
    }
}
