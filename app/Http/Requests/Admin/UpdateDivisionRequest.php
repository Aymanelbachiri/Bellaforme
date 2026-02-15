<?php

namespace App\Http\Requests\Admin;

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
            'hero_image' => ['nullable', 'image', 'max:10240'],
            'homepage_image' => ['nullable', 'image', 'max:10240'],
            'hero_title' => ['required', 'string', 'max:255'],
            'hero_subtitle' => ['nullable', 'string', 'max:255'],
            'homepage_subtitle' => ['nullable', 'string', 'max:500'],
            'order' => ['integer'],
            'is_active' => ['boolean'],
            // SEO fields
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string'],
            'og_image' => ['nullable', 'image', 'max:10240'],
        ];
    }
}
