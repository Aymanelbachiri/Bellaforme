<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class PdfFileOrPath implements ValidationRule
{
    public function __construct(
        private readonly int $maxKilobytes = 61440,
    ) {}

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if ($value instanceof UploadedFile) {
            if (! $value->isValid()) {
                $fail("The $attribute must be a valid file.");
            }
            if ($value->getMimeType() !== 'application/pdf') {
                $fail("The $attribute must be a PDF file.");
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
            if (strtolower(pathinfo($value, PATHINFO_EXTENSION)) !== 'pdf') {
                $fail("The selected $attribute must be a PDF file.");
            }

            return;
        }

        $fail("The $attribute must be a PDF file or an existing media path.");
    }
}
