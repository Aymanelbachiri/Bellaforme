<?php

namespace App\Console\Commands;

use App\Models\Category;
use App\Models\Division;
use App\Models\Product;
use App\Models\SeoMetadata;
use Illuminate\Console\Command;

class SeedSeoDefaults extends Command
{
    protected $signature = 'seo:seed-defaults';
    protected $description = 'Seed optimized SEO defaults for all pages, divisions, categories, and products';

    public function handle(): int
    {
        // Static pages
        $pages = [
            [1, 'Bella Forme Group | Equipements professionnels Fitness, Beauty & Medical au Maroc', 'Bella Forme Group, leader marocain en équipements professionnels pour le fitness, la beauté et le médical. Plus de 30 ans d\'expertise au service des professionnels.'],
            [2, 'Contactez-nous | Bella Forme Group', 'Contactez Bella Forme Group pour vos projets d\'équipement fitness, beauté et médical. Showrooms à Casablanca, service client dédié.'],
            [3, 'Qui sommes-nous | Bella Forme Group', 'Découvrez Bella Forme Group, référence depuis plus de 30 ans dans l\'équipement professionnel au Maroc. Fitness, beauté, médical et wellness.'],
            [10, 'Nos Marques Partenaires | Bella Forme Group', 'Découvrez les marques internationales distribuées par Bella Forme Group : Life Fitness, Hammer Strength, Cybex, et bien d\'autres.'],
            [11, 'Nos Références & Réalisations | Bella Forme Group', 'Découvrez les projets réalisés par Bella Forme Group : hôtels, centres de fitness, cliniques, spas et salons de beauté au Maroc.'],
            [12, 'Nos Catalogues | Bella Forme Group', 'Consultez et téléchargez les catalogues de nos équipements professionnels : fitness, beauté, médical et wellness.'],
            [13, 'Nos Solutions à vos Projets | Bella Forme Group', 'Bella Forme Group vous accompagne dans vos projets : consulting, conception, équipement, installation, formation et SAV.'],
        ];

        foreach ($pages as [$id, $title, $description]) {
            SeoMetadata::updateOrCreate(
                ['seoable_type' => 'page', 'seoable_id' => $id],
                ['meta_title' => $title, 'meta_description' => $description]
            );
        }
        $this->info('Seeded ' . count($pages) . ' static page SEO entries.');

        // Divisions — fill in missing or empty SEO
        $divisions = Division::all();
        foreach ($divisions as $division) {
            $seo = SeoMetadata::firstOrNew(
                ['seoable_type' => Division::class, 'seoable_id' => $division->id],
            );
            if (empty($seo->meta_title)) {
                $seo->meta_title = "{$division->name} | Bella Forme Group";
            }
            if (empty($seo->meta_description)) {
                $seo->meta_description = "Découvrez notre gamme {$division->name} : équipements professionnels de qualité. Bella Forme Group, votre partenaire au Maroc.";
            }
            $seo->save();
        }
        $this->info("Seeded {$divisions->count()} division SEO entries.");

        // Categories — fill in missing or empty SEO
        $categories = Category::with('division')->get();
        foreach ($categories as $category) {
            $divName = $category->division?->name ?? '';
            $seo = SeoMetadata::firstOrNew(
                ['seoable_type' => Category::class, 'seoable_id' => $category->id],
            );
            if (empty($seo->meta_title)) {
                $seo->meta_title = "{$category->name} - {$divName} | Bella Forme Group";
            }
            if (empty($seo->meta_description)) {
                $seo->meta_description = "Explorez notre sélection {$category->name} dans l'univers {$divName}. Équipements professionnels disponibles chez Bella Forme Group.";
            }
            $seo->save();
        }
        $this->info("Seeded {$categories->count()} category SEO entries.");

        // Products — fill in missing or empty SEO
        $products = Product::with('category.division')->get();
        foreach ($products as $product) {
            $catName = $product->category?->name ?? '';
            $seo = SeoMetadata::firstOrNew(
                ['seoable_type' => Product::class, 'seoable_id' => $product->id],
            );
            if (empty($seo->meta_title)) {
                $seo->meta_title = "{$product->name} - {$catName} | Bella Forme Group";
            }
            if (empty($seo->meta_description)) {
                $seo->meta_description = $product->short_description ?: "Découvrez {$product->name} chez Bella Forme Group. Équipement professionnel {$catName} de qualité au Maroc.";
            }
            $seo->save();
        }
        $this->info("Seeded {$products->count()} product SEO entries.");

        $this->info('Done! All SEO defaults have been seeded.');
        return 0;
    }
}
