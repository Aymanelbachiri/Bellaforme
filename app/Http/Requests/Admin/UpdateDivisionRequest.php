<?php

namespace App\Http\Requests\Admin;

use App\Rules\ImageOrPath;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDivisionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('divisions', 'slug')->ignore($this->route('division'))],
            'hero_image' => ['nullable', new ImageOrPath],
            'homepage_image' => ['nullable', new ImageOrPath],
            'hero_title' => ['required', 'string', 'max:255'],
            'hero_subtitle' => ['nullable', 'string', 'max:255'],
            'homepage_subtitle' => ['nullable', 'string', 'max:500'],
            'phone' => ['nullable', 'string', 'max:255'],
            'facebook_url' => ['nullable', 'string', 'max:255', 'url'],
            'instagram_url' => ['nullable', 'string', 'max:255', 'url'],
            'linkedin_url' => ['nullable', 'string', 'max:255', 'url'],
            'youtube_url' => ['nullable', 'string', 'max:255', 'url'],
            'order' => ['integer'],
            'is_active' => ['boolean'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string'],
            'og_image' => ['nullable', new ImageOrPath],
        ];
    }
}
