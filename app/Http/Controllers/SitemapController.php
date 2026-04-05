<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Division;
use App\Models\Product;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function __invoke(): Response
    {
        $divisions = Division::where('is_active', true)->get();
        $categories = Category::where('is_active', true)->with('division')->get();
        $products = Product::where('is_active', true)->with('category.division')->get();

        $urls = collect();

        // Static pages
        $staticPages = [
            ['loc' => '/', 'priority' => '1.0', 'changefreq' => 'daily'],
            ['loc' => '/contact', 'priority' => '0.6', 'changefreq' => 'monthly'],
            ['loc' => '/qui-sommes-nous', 'priority' => '0.6', 'changefreq' => 'monthly'],
            ['loc' => '/nos-marques', 'priority' => '0.7', 'changefreq' => 'weekly'],
            ['loc' => '/nos-references', 'priority' => '0.6', 'changefreq' => 'monthly'],
            ['loc' => '/nos-catalogues', 'priority' => '0.7', 'changefreq' => 'weekly'],
            ['loc' => '/nos-solutions', 'priority' => '0.6', 'changefreq' => 'monthly'],
        ];

        foreach ($staticPages as $page) {
            $urls->push($page);
        }

        // Divisions
        foreach ($divisions as $division) {
            $urls->push([
                'loc' => "/{$division->slug}",
                'lastmod' => $division->updated_at->toW3cString(),
                'priority' => '0.8',
                'changefreq' => 'weekly',
            ]);
        }

        // Categories
        foreach ($categories as $category) {
            if (! $category->division || ! $category->division->is_active) {
                continue;
            }
            $urls->push([
                'loc' => "/{$category->division->slug}/category/{$category->slug}",
                'lastmod' => $category->updated_at->toW3cString(),
                'priority' => '0.7',
                'changefreq' => 'weekly',
            ]);
        }

        // Products
        foreach ($products as $product) {
            $urls->push([
                'loc' => "/product/{$product->slug}",
                'lastmod' => $product->updated_at->toW3cString(),
                'priority' => '0.6',
                'changefreq' => 'weekly',
            ]);
        }

        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

        foreach ($urls as $url) {
            $xml .= '  <url>' . "\n";
            $xml .= '    <loc>' . url($url['loc']) . '</loc>' . "\n";
            if (isset($url['lastmod'])) {
                $xml .= '    <lastmod>' . $url['lastmod'] . '</lastmod>' . "\n";
            }
            $xml .= '    <changefreq>' . $url['changefreq'] . '</changefreq>' . "\n";
            $xml .= '    <priority>' . $url['priority'] . '</priority>' . "\n";
            $xml .= '  </url>' . "\n";
        }

        $xml .= '</urlset>';

        return response($xml, 200, [
            'Content-Type' => 'application/xml',
        ]);
    }
}
