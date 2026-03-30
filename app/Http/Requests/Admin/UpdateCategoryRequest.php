<?php

namespace App\Http\Requests\Admin;

use App\Rules\ImageOrPath;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCategoryRequest extends FormRequest
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
            'division_id' => ['required', 'exists:divisions,id'],
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('categories', 'slug')->ignore($this->route('category'))],
            'image' => ['nullable', new ImageOrPath],
            'hero_image' => ['nullable', new ImageOrPath],
            'video_cover' => ['nullable', new ImageOrPath],
            'video_url' => ['nullable', 'string', 'url', 'max:500'],
            'order' => ['integer'],
            'is_active' => ['boolean'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string'],
            'og_image' => ['nullable', new ImageOrPath],
        ];
    }
}
