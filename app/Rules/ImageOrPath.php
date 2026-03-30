<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ImageOrPath implements ValidationRule
{
    public function __construct(
        private readonly int $maxKilobytes = 10240,
    ) {}

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if ($value instanceof UploadedFile) {
            if (! $value->isValid() || ! str_starts_with($value->getMimeType() ?? '', 'image/')) {
                $fail("The $attribute must be a valid image file.");
            }
            if ($value->getSize() > $this->maxKilobytes * 1024) {
                $fail("The $attribute must not be larger than {$this->maxKilobytes} KB.");
            }

            return;
        }

        if (is_string($value)) {
            if (! Storage::disk('public')->exists($value)) {
                $fail("The selected $attribute does not exist in storage.");
            }

            return;
        }

        $fail("The $attribute must be an image file or an existing media path.");
    }
}
