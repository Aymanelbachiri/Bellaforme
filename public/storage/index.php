<?php
$basePath = dirname(__DIR__, 2) . '/storage/app/public';
$uri = urldecode($_SERVER['REQUEST_URI']);
$filePath = preg_replace('#^/storage/#', '', $uri);
$filePath = strtok($filePath, '?');
$fullPath = $basePath . '/' . $filePath;

$realBase = realpath($basePath);
$realFile = realpath($fullPath);

if (!$realFile || strpos($realFile, $realBase) !== 0 || !is_file($realFile)) {
    http_response_code(404);
    exit('Not found');
}

$ext = strtolower(pathinfo($realFile, PATHINFO_EXTENSION));
$types = [
    'jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg',
    'png' => 'image/png', 'gif' => 'image/gif',
    'webp' => 'image/webp', 'avif' => 'image/avif',
    'svg' => 'image/svg+xml',
    'pdf' => 'application/pdf',
    'mp4' => 'video/mp4', 'webm' => 'video/webm',
];

header('Content-Type: ' . ($types[$ext] ?? 'application/octet-stream'));
header('Content-Length: ' . filesize($realFile));
header('Cache-Control: public, max-age=31536000, immutable');
readfile($realFile);
