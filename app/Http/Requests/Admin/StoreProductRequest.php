<?php

namespace App\Http\Requests\Admin;

use App\Rules\ImageOrPath;
use App\Rules\PdfFileOrPath;
use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->input('content_mode') === 'brochure_only') {
            $this->merge([
                'specifications' => null,
                'gallery' => null,
                'description' => null,
                'video_url' => null,
            ]);
        }
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'content_mode' => ['required', 'in:detailed,brochure_only'],
            'division_id' => ['required', 'exists:divisions,id'],
            'category_id' => ['required', 'exists:categories,id'],
            'brand_id' => ['nullable', 'exists:brands,id'],
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:products,slug'],
            'short_description' => ['nullable', 'string'],
            'featured_image' => ['required', new ImageOrPath],
            'description' => ['nullable', 'string'],
            'brochure_file' => ['required_if:content_mode,brochure_only', 'nullable', new PdfFileOrPath],
            'video_url' => ['nullable', 'url'],
            'is_active' => ['boolean'],
            'order' => ['integer'],
            'specifications' => ['nullable', 'array'],
            'specifications.*.label' => ['required_with:specifications', 'string'],
            'specifications.*.value' => ['required_with:specifications', 'string'],
            'gallery' => ['nullable', 'array'],
            'gallery.*' => ['image'],
            'gallery_order' => ['nullable', 'string'],
            // SEO fields
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string'],
            'og_image' => ['nullable', new ImageOrPath],
        ];
    }
}
