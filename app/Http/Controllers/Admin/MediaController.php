<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\ImageOptimizer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class MediaController extends Controller
{
    public function __construct(
        private readonly ImageOptimizer $imageOptimizer,
    ) {}

    public function index(Request $request): Response
    {
        return Inertia::render('admin/media/index');
    }

    /**
     * List files as JSON (for AJAX fetching with filters).
     */
    public function list(Request $request): JsonResponse
    {
        $disk = Storage::disk('public');
        $directory = $request->query('directory', '');
        $type = $request->query('type', 'all');

        $imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif'];
        $videoExtensions = ['mp4', 'webm', 'mov', 'avi'];
        $docExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];
        $optimizedExtensions = ['avif', 'webp'];

        $allowedExtensions = match ($type) {
            'image' => $imageExtensions,
            'video' => $videoExtensions,
            'document' => $docExtensions,
            default => array_merge($imageExtensions, $videoExtensions, $docExtensions),
        };

        // Discover all top-level directories dynamically
        $allTopDirs = $disk->directories('');
        // Filter out hidden/system dirs
        $allTopDirs = array_values(array_filter($allTopDirs, fn ($d) => ! str_starts_with(basename($d), '.')));

        $scanDirs = $directory ? [$directory] : $allTopDirs;

        // First pass: collect all file paths and build an index of basenames per directory
        $allFilePaths = [];
        $basenameIndex = [];

        foreach ($scanDirs as $dir) {
            if (! $disk->exists($dir)) {
                continue;
            }

            $subDirs = $disk->directories($dir);
            $dirsToScan = array_merge([$dir], $subDirs);

            foreach ($dirsToScan as $scanDir) {
                foreach ($disk->files($scanDir) as $file) {
                    $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
                    if (! in_array($ext, $allowedExtensions)) {
                        continue;
                    }
                    $allFilePaths[] = $file;
                    $basename = pathinfo($file, PATHINFO_FILENAME);
                    $fileDir = dirname($file);
                    $basenameIndex[$fileDir][$basename][] = $ext;
                }
            }
        }

        // Second pass: build file list, skipping optimization variants
        $files = [];

        foreach ($allFilePaths as $file) {
            $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));

            if ($ext === 'webp' && preg_match('/-(thumb|medium|large|xlarge)\.webp$/', $file)) {
                continue;
            }

            if (in_array($ext, $optimizedExtensions)) {
                $basename = pathinfo($file, PATHINFO_FILENAME);
                $fileDir = dirname($file);
                $siblings = $basenameIndex[$fileDir][$basename] ?? [];
                $hasOriginal = !empty(array_diff($siblings, $optimizedExtensions));
                if ($hasOriginal) {
                    continue;
                }
            }

            $fileType = 'document';
            if (in_array($ext, $imageExtensions)) {
                $fileType = 'image';
            } elseif (in_array($ext, $videoExtensions)) {
                $fileType = 'video';
            }

            $files[] = [
                'path' => $file,
                'url' => $disk->url($file),
                'name' => basename($file),
                'directory' => dirname($file),
                'size' => $disk->size($file),
                'modified' => $disk->lastModified($file),
                'extension' => $ext,
                'type' => $fileType,
            ];
        }

        usort($files, fn ($a, $b) => $b['modified'] - $a['modified']);

        $availableDirs = array_values(array_map(fn ($d) => basename($d), $allTopDirs));

        return response()->json([
            'files' => $files,
            'directories' => $availableDirs,
        ]);
    }

    /**
     * Upload files.
     */
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'files' => ['required', 'array'],
            'files.*' => ['file', 'max:51200'], // 50MB max per file
            'directory' => ['required', 'string', 'max:255'],
        ]);

        $disk = Storage::disk('public');
        $directory = $request->input('directory', 'media');
        $uploaded = [];

        foreach ($request->file('files') as $file) {
            $ext = strtolower($file->getClientOriginalExtension());
            $imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];

            if (in_array($ext, $imageExtensions) && ! in_array($ext, ['svg', 'webp', 'gif'])) {
                $path = $this->imageOptimizer->optimize($file, $directory);
            } else {
                $originalName = $file->getClientOriginalName();
                $name = pathinfo($originalName, PATHINFO_FILENAME);
                $name = preg_replace('/[^a-zA-Z0-9._-]/', '_', $name);

                $finalName = $name.'.'.$ext;
                $counter = 1;
                while ($disk->exists($directory.'/'.$finalName)) {
                    $finalName = $name.'-'.$counter.'.'.$ext;
                    $counter++;
                }

                $path = $file->storeAs($directory, $finalName, 'public');
            }

            $uploaded[] = [
                'path' => $path,
                'url' => $disk->url($path),
                'name' => basename($path),
                'directory' => $directory,
                'size' => $disk->size($path),
                'modified' => $disk->lastModified($path),
                'extension' => $ext,
            ];
        }

        return response()->json(['uploaded' => $uploaded]);
    }

    /**
     * Delete a file.
     */
    public function destroy(Request $request): JsonResponse
    {
        $request->validate([
            'path' => ['required', 'string'],
        ]);

        $path = $request->input('path');
        $disk = Storage::disk('public');

        if (! $disk->exists($path)) {
            return response()->json(['error' => 'File not found'], 404);
        }

        // If it's an image, also delete optimized variants
        $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        $imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
        if (in_array($ext, $imageExtensions)) {
            $this->imageOptimizer->delete($path);
        } else {
            $disk->delete($path);
        }

        return response()->json(['success' => true]);
    }

    /**
     * Create a new directory.
     */
    public function createDirectory(Request $request): JsonResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255', 'regex:/^[a-z0-9\-_]+$/'],
        ]);

        $disk = Storage::disk('public');
        $name = $request->input('name');

        if ($disk->exists($name)) {
            return response()->json(['error' => 'Directory already exists'], 422);
        }

        $disk->makeDirectory($name);

        return response()->json(['success' => true, 'directory' => $name]);
    }

    /**
     * Delete a directory and all its contents.
     */
    public function deleteDirectory(Request $request): JsonResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $disk = Storage::disk('public');
        $name = $request->input('name');

        if (! $disk->exists($name)) {
            return response()->json(['error' => 'Directory not found'], 404);
        }

        // Delete all files inside (including optimized variants)
        foreach ($disk->allFiles($name) as $file) {
            $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
            if (in_array($ext, ['jpg', 'jpeg', 'png', 'gif'])) {
                $this->imageOptimizer->delete($file);
            } else {
                $disk->delete($file);
            }
        }

        $disk->deleteDirectory($name);

        return response()->json(['success' => true]);
    }

}
