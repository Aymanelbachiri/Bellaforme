<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreContactMessageRequest extends FormRequest
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
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'city' => ['nullable', 'string', 'max:255'],
            'activity_type' => ['nullable', 'string', 'max:255'],
            'project_nature' => ['nullable', 'string', 'max:255'],
            'equipment_timeline' => ['nullable', 'string', 'max:255'],
            'request_reason' => ['nullable', 'string', 'max:255'],
            'message' => ['required', 'string'],
            'product_id' => ['nullable', 'integer', 'exists:products,id'],
        ];
    }
}
