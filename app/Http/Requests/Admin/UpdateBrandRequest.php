<?php

namespace App\Http\Requests\Admin;

use App\Rules\ImageOrPath;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBrandRequest extends FormRequest
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
            'division_ids' => ['nullable', 'array'],
            'division_ids.*' => ['exists:divisions,id'],
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('brands', 'slug')->ignore($this->route('brand'))],
            'logo' => ['nullable', new ImageOrPath],
            'is_partner' => ['boolean'],
            'is_reference' => ['boolean'],
            'order' => ['integer'],
            'is_active' => ['boolean'],
        ];
    }
}
