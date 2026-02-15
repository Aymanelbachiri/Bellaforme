<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\ContactMessage;
use App\Models\Division;
use App\Models\EmailSetting;
use App\Models\HomepageSetting;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductSpecification;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Truncate all tables for idempotency
        DB::statement('PRAGMA foreign_keys = OFF');
        ProductSpecification::truncate();
        ProductImage::truncate();
        ContactMessage::truncate();
        Product::truncate();
        Category::truncate();
        Division::truncate();
        Brand::truncate();
        HomepageSetting::truncate();
        EmailSetting::truncate();
        User::truncate();
        DB::statement('PRAGMA foreign_keys = ON');

        // --- Admin User ---
        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@bellaformegroup.com',
            'password' => bcrypt('password'),
        ]);

        // --- Divisions ---
        $esthetique = Division::create([
            'name' => 'Esthétique & Médical',
            'slug' => 'esthetique-medical',
            'hero_image' => 'divisions/esthetique.jpg',
            'hero_title' => 'Solutions Esthétiques & Médicales',
            'hero_subtitle' => 'Découvrez notre gamme complète d\'équipements pour les professionnels de l\'esthétique et du médical.',
            'order' => 1,
            'is_active' => true,
        ]);

        $sport = Division::create([
            'name' => 'Sport & Fitness',
            'slug' => 'sport-fitness',
            'hero_image' => 'divisions/sport.jpg',
            'hero_title' => 'Équipements Sport & Fitness',
            'hero_subtitle' => 'Des équipements professionnels pour les salles de sport et centres de remise en forme.',
            'order' => 2,
            'is_active' => true,
        ]);

        $coiffure = Division::create([
            'name' => 'Coiffure & Spa',
            'slug' => 'coiffure-spa',
            'hero_image' => 'divisions/coiffure.jpg',
            'hero_title' => 'Univers Coiffure & Spa',
            'hero_subtitle' => 'Mobilier et équipements haut de gamme pour salons de coiffure et espaces spa.',
            'order' => 3,
            'is_active' => true,
        ]);

        // --- Categories ---
        $catDiagnostique = Category::create([
            'division_id' => $esthetique->id,
            'name' => 'Appareils diagnostique',
            'slug' => 'appareils-diagnostique',
            'image' => 'categories/diagnostique.jpg',
            'order' => 1,
            'is_active' => true,
        ]);

        $catLaser = Category::create([
            'division_id' => $esthetique->id,
            'name' => 'Laser & Lumière pulsée',
            'slug' => 'laser-lumiere-pulsee',
            'image' => 'categories/laser.jpg',
            'order' => 2,
            'is_active' => true,
        ]);

        $catSoinsCorps = Category::create([
            'division_id' => $esthetique->id,
            'name' => 'Soins du corps',
            'slug' => 'soins-du-corps',
            'image' => 'categories/soins-corps.jpg',
            'order' => 3,
            'is_active' => true,
        ]);

        $catCardio = Category::create([
            'division_id' => $sport->id,
            'name' => 'Cardio Training',
            'slug' => 'cardio-training',
            'image' => 'categories/cardio.jpg',
            'order' => 1,
            'is_active' => true,
        ]);

        $catMusculation = Category::create([
            'division_id' => $sport->id,
            'name' => 'Musculation',
            'slug' => 'musculation',
            'image' => 'categories/musculation.jpg',
            'order' => 2,
            'is_active' => true,
        ]);

        $catMobilierCoiffure = Category::create([
            'division_id' => $coiffure->id,
            'name' => 'Mobilier de coiffure',
            'slug' => 'mobilier-coiffure',
            'image' => 'categories/mobilier-coiffure.jpg',
            'order' => 1,
            'is_active' => true,
        ]);

        $catEquipementSpa = Category::create([
            'division_id' => $coiffure->id,
            'name' => 'Équipement Spa',
            'slug' => 'equipement-spa',
            'image' => 'categories/equipement-spa.jpg',
            'order' => 2,
            'is_active' => true,
        ]);

        // --- Brands ---
        $brandDermatech = Brand::create([
            'name' => 'DermaTech Pro',
            'slug' => 'dermatech-pro',
            'logo' => 'brands/dermatech.png',
            'is_partner' => true,
            'is_reference' => true,
            'order' => 1,
            'is_active' => true,
        ]);

        $brandFitElite = Brand::create([
            'name' => 'FitElite',
            'slug' => 'fitelite',
            'logo' => 'brands/fitelite.png',
            'is_partner' => true,
            'is_reference' => false,
            'order' => 2,
            'is_active' => true,
        ]);

        $brandLuxSpa = Brand::create([
            'name' => 'LuxSpa',
            'slug' => 'luxspa',
            'logo' => 'brands/luxspa.png',
            'is_partner' => false,
            'is_reference' => true,
            'order' => 3,
            'is_active' => true,
        ]);

        $brandMediLight = Brand::create([
            'name' => 'MediLight',
            'slug' => 'medilight',
            'logo' => 'brands/medilight.png',
            'is_partner' => true,
            'is_reference' => true,
            'order' => 4,
            'is_active' => true,
        ]);

        $brandProGym = Brand::create([
            'name' => 'ProGym',
            'slug' => 'progym',
            'logo' => 'brands/progym.png',
            'is_partner' => false,
            'is_reference' => true,
            'order' => 5,
            'is_active' => true,
        ]);

        $brandStylePro = Brand::create([
            'name' => 'StylePro',
            'slug' => 'stylepro',
            'logo' => 'brands/stylepro.png',
            'is_partner' => true,
            'is_reference' => false,
            'order' => 6,
            'is_active' => true,
        ]);

        $brandVitalCare = Brand::create([
            'name' => 'VitalCare',
            'slug' => 'vitalcare',
            'logo' => 'brands/vitalcare.png',
            'is_partner' => false,
            'is_reference' => true,
            'order' => 7,
            'is_active' => true,
        ]);

        // --- Products ---
        // Helper to create a detailed product with specs and gallery images
        $createDetailed = function (array $attrs, array $specs, int $imageCount = 3) {
            $product = Product::create(array_merge([
                'content_mode' => 'detailed',
                'is_active' => true,
            ], $attrs));

            foreach ($specs as $i => $spec) {
                ProductSpecification::create([
                    'product_id' => $product->id,
                    'label' => $spec[0],
                    'value' => $spec[1],
                    'order' => $i + 1,
                ]);
            }

            for ($i = 1; $i <= $imageCount; $i++) {
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => "products/gallery/{$product->slug}-{$i}.jpg",
                    'order' => $i,
                ]);
            }

            return $product;
        };

        $createBrochure = function (array $attrs) {
            return Product::create(array_merge([
                'content_mode' => 'brochure_only',
                'description' => null,
                'is_active' => true,
            ], $attrs));
        };

        // -- Esthétique & Médical products --
        $createDetailed([
            'division_id' => $esthetique->id,
            'category_id' => $catDiagnostique->id,
            'brand_id' => $brandDermatech->id,
            'name' => 'SkinAnalyzer Pro 3000',
            'slug' => 'skinanalyzer-pro-3000',
            'short_description' => 'Analyseur cutané professionnel avec imagerie haute résolution.',
            'description' => "Le SkinAnalyzer Pro 3000 est un appareil de diagnostic cutané de dernière génération. Grâce à sa technologie d'imagerie avancée, il permet une analyse complète de la peau en quelques secondes.\n\nIdéal pour les dermatologues et les centres esthétiques, cet appareil offre des rapports détaillés et personnalisables.",
            'featured_image' => 'products/skinanalyzer-pro.jpg',
            'video_url' => 'https://www.youtube.com/watch?v=example1',
            'order' => 1,
        ], [
            ['Résolution', '4K Ultra HD'],
            ['Modes d\'analyse', '12 modes'],
            ['Écran', '10 pouces tactile'],
            ['Poids', '3.5 kg'],
            ['Garantie', '3 ans'],
        ], 4);

        $createDetailed([
            'division_id' => $esthetique->id,
            'category_id' => $catDiagnostique->id,
            'brand_id' => $brandMediLight->id,
            'name' => 'DermaScope Digital',
            'slug' => 'dermascope-digital',
            'short_description' => 'Dermatoscope numérique portable pour examens dermatologiques.',
            'description' => "Le DermaScope Digital combine portabilité et précision pour les examens dermatologiques quotidiens. Son capteur haute définition et son éclairage LED polarisé garantissent des images nettes.",
            'featured_image' => 'products/dermascope.jpg',
            'order' => 2,
        ], [
            ['Grossissement', 'x20 à x200'],
            ['Capteur', '12 MP'],
            ['Batterie', '8 heures d\'autonomie'],
        ], 3);

        $createBrochure([
            'division_id' => $esthetique->id,
            'category_id' => $catDiagnostique->id,
            'brand_id' => $brandVitalCare->id,
            'name' => 'Catalogue Diagnostique 2024',
            'slug' => 'catalogue-diagnostique-2024',
            'short_description' => 'Catalogue complet des appareils de diagnostic disponibles.',
            'featured_image' => 'products/catalogue-diagnostique.jpg',
            'brochure_file' => 'brochures/catalogue-diagnostique-2024.pdf',
            'order' => 3,
        ]);

        $createDetailed([
            'division_id' => $esthetique->id,
            'category_id' => $catLaser->id,
            'brand_id' => $brandMediLight->id,
            'name' => 'LaserPulse X500',
            'slug' => 'laserpulse-x500',
            'short_description' => 'Laser à diode haute puissance pour épilation définitive.',
            'description' => "Le LaserPulse X500 est un laser à diode de dernière génération offrant des traitements d'épilation rapides et efficaces. Sa technologie de refroidissement intégrée assure le confort du patient.",
            'featured_image' => 'products/laserpulse.jpg',
            'video_url' => 'https://www.youtube.com/watch?v=example2',
            'order' => 1,
        ], [
            ['Longueur d\'onde', '808 nm'],
            ['Puissance', '1200W'],
            ['Taille du spot', '12x24 mm'],
            ['Refroidissement', 'Contact -5°C'],
        ], 4);

        $createDetailed([
            'division_id' => $esthetique->id,
            'category_id' => $catLaser->id,
            'brand_id' => $brandDermatech->id,
            'name' => 'IPL PhotoRejuv',
            'slug' => 'ipl-photorejuv',
            'short_description' => 'Système IPL pour le photorajeunissement et le traitement des lésions pigmentaires.',
            'description' => "L'IPL PhotoRejuv utilise la lumière pulsée intense pour traiter un large éventail de conditions cutanées. Polyvalent et performant, il s'adapte à tous les phototypes.",
            'featured_image' => 'products/ipl-photorejuv.jpg',
            'order' => 2,
        ], [
            ['Spectre', '530-1200 nm'],
            ['Énergie', '50 J/cm²'],
            ['Filtres', '6 filtres interchangeables'],
        ], 3);

        $createBrochure([
            'division_id' => $esthetique->id,
            'category_id' => $catSoinsCorps->id,
            'brand_id' => $brandDermatech->id,
            'name' => 'Brochure Soins Corps',
            'slug' => 'brochure-soins-corps',
            'short_description' => 'Brochure complète de nos solutions de soins du corps.',
            'featured_image' => 'products/brochure-soins.jpg',
            'brochure_file' => 'brochures/soins-corps-2024.pdf',
            'order' => 1,
        ]);

        $createDetailed([
            'division_id' => $esthetique->id,
            'category_id' => $catSoinsCorps->id,
            'brand_id' => $brandVitalCare->id,
            'name' => 'CryoSculpt 360',
            'slug' => 'cryosculpt-360',
            'short_description' => 'Appareil de cryolipolyse pour le remodelage corporel non invasif.',
            'description' => "Le CryoSculpt 360 offre un traitement de cryolipolyse avancé avec 4 applicateurs simultanés. Résultats visibles dès la première séance pour la réduction des amas graisseux localisés.",
            'featured_image' => 'products/cryosculpt.jpg',
            'order' => 2,
        ], [
            ['Applicateurs', '4 simultanés'],
            ['Température', '-11°C à +45°C'],
            ['Durée de traitement', '35-60 minutes'],
            ['Technologie', 'Cryolipolyse 360°'],
        ], 3);

        // -- Sport & Fitness products --
        $createDetailed([
            'division_id' => $sport->id,
            'category_id' => $catCardio->id,
            'brand_id' => $brandFitElite->id,
            'name' => 'Tapis de course FitElite T900',
            'slug' => 'tapis-course-fitelite-t900',
            'short_description' => 'Tapis de course professionnel avec écran tactile intégré.',
            'description' => "Le FitElite T900 est conçu pour un usage intensif en salle de sport. Son moteur puissant et sa surface de course extra-large offrent une expérience d'entraînement optimale.",
            'featured_image' => 'products/tapis-t900.jpg',
            'order' => 1,
        ], [
            ['Vitesse max', '25 km/h'],
            ['Inclinaison', '0-20%'],
            ['Surface de course', '155 x 55 cm'],
            ['Moteur', '5 CV continu'],
            ['Poids max utilisateur', '180 kg'],
        ], 4);

        $createDetailed([
            'division_id' => $sport->id,
            'category_id' => $catCardio->id,
            'brand_id' => $brandProGym->id,
            'name' => 'Vélo elliptique ProGym E700',
            'slug' => 'velo-elliptique-progym-e700',
            'short_description' => 'Vélo elliptique professionnel à résistance magnétique.',
            'description' => "Le ProGym E700 offre un mouvement fluide et naturel grâce à sa roue d'inertie de 15 kg. Idéal pour les entraînements cardio à faible impact.",
            'featured_image' => 'products/elliptique-e700.jpg',
            'order' => 2,
        ], [
            ['Roue d\'inertie', '15 kg'],
            ['Niveaux de résistance', '24'],
            ['Programmes', '12 prédéfinis'],
        ], 3);

        $createBrochure([
            'division_id' => $sport->id,
            'category_id' => $catCardio->id,
            'brand_id' => $brandFitElite->id,
            'name' => 'Catalogue Cardio FitElite 2024',
            'slug' => 'catalogue-cardio-fitelite-2024',
            'short_description' => 'Gamme complète d\'équipements cardio FitElite.',
            'featured_image' => 'products/catalogue-cardio.jpg',
            'brochure_file' => 'brochures/catalogue-cardio-fitelite-2024.pdf',
            'order' => 3,
        ]);

        $createDetailed([
            'division_id' => $sport->id,
            'category_id' => $catMusculation->id,
            'brand_id' => $brandProGym->id,
            'name' => 'Station de musculation ProGym MultiPress',
            'slug' => 'station-musculation-progym-multipress',
            'short_description' => 'Station multifonction pour entraînement complet du corps.',
            'description' => "La station ProGym MultiPress combine presse à cuisses, développé couché et tirage dans un seul appareil compact. Construction en acier renforcé pour une durabilité maximale.",
            'featured_image' => 'products/multipress.jpg',
            'order' => 1,
        ], [
            ['Charge max', '200 kg'],
            ['Postes', '4 postes'],
            ['Dimensions', '220 x 180 x 210 cm'],
            ['Poids', '350 kg'],
        ], 3);

        $createDetailed([
            'division_id' => $sport->id,
            'category_id' => $catMusculation->id,
            'brand_id' => $brandFitElite->id,
            'name' => 'Banc réglable FitElite B300',
            'slug' => 'banc-reglable-fitelite-b300',
            'short_description' => 'Banc de musculation réglable multi-positions.',
            'description' => "Le FitElite B300 offre 7 positions d'inclinaison pour un entraînement varié. Son rembourrage haute densité et sa structure en acier garantissent confort et stabilité.",
            'featured_image' => 'products/banc-b300.jpg',
            'order' => 2,
        ], [
            ['Positions', '7 inclinaisons'],
            ['Charge max', '350 kg'],
            ['Poids', '32 kg'],
        ], 2);

        $createBrochure([
            'division_id' => $sport->id,
            'category_id' => $catMusculation->id,
            'brand_id' => $brandProGym->id,
            'name' => 'Guide Musculation ProGym',
            'slug' => 'guide-musculation-progym',
            'short_description' => 'Guide complet des équipements de musculation ProGym.',
            'featured_image' => 'products/guide-musculation.jpg',
            'brochure_file' => 'brochures/guide-musculation-progym.pdf',
            'order' => 3,
        ]);

        // -- Coiffure & Spa products --
        $createDetailed([
            'division_id' => $coiffure->id,
            'category_id' => $catMobilierCoiffure->id,
            'brand_id' => $brandStylePro->id,
            'name' => 'Fauteuil de coiffure StylePro Elegance',
            'slug' => 'fauteuil-coiffure-stylepro-elegance',
            'short_description' => 'Fauteuil de coiffure hydraulique design contemporain.',
            'description' => "Le fauteuil StylePro Elegance allie esthétique moderne et fonctionnalité. Sa pompe hydraulique robuste et son assise ergonomique offrent un confort optimal pour le client et le coiffeur.",
            'featured_image' => 'products/fauteuil-elegance.jpg',
            'order' => 1,
        ], [
            ['Hauteur réglable', '45-60 cm'],
            ['Rotation', '360°'],
            ['Revêtement', 'Similicuir premium'],
            ['Poids', '18 kg'],
        ], 3);

        $createDetailed([
            'division_id' => $coiffure->id,
            'category_id' => $catMobilierCoiffure->id,
            'brand_id' => $brandStylePro->id,
            'name' => 'Bac à shampoing StylePro Confort',
            'slug' => 'bac-shampoing-stylepro-confort',
            'short_description' => 'Bac à shampoing ergonomique avec repose-nuque ajustable.',
            'description' => "Le bac StylePro Confort est conçu pour offrir une expérience de lavage agréable. Son repose-nuque en gel et sa vasque profonde facilitent le travail du coiffeur.",
            'featured_image' => 'products/bac-shampoing.jpg',
            'order' => 2,
        ], [
            ['Vasque', 'Céramique blanche'],
            ['Repose-nuque', 'Gel ajustable'],
            ['Mitigeur', 'Inclus'],
        ], 2);

        $createBrochure([
            'division_id' => $coiffure->id,
            'category_id' => $catMobilierCoiffure->id,
            'brand_id' => $brandStylePro->id,
            'name' => 'Catalogue Mobilier StylePro',
            'slug' => 'catalogue-mobilier-stylepro',
            'short_description' => 'Catalogue complet du mobilier de coiffure StylePro.',
            'featured_image' => 'products/catalogue-mobilier.jpg',
            'brochure_file' => 'brochures/catalogue-mobilier-stylepro.pdf',
            'order' => 3,
        ]);

        $createDetailed([
            'division_id' => $coiffure->id,
            'category_id' => $catEquipementSpa->id,
            'brand_id' => $brandLuxSpa->id,
            'name' => 'Table de massage LuxSpa Zen',
            'slug' => 'table-massage-luxspa-zen',
            'short_description' => 'Table de massage électrique multi-positions pour instituts.',
            'description' => "La table LuxSpa Zen offre 3 moteurs électriques pour un réglage précis de la hauteur, de l'inclinaison du dossier et des jambes. Son matelas haute densité assure un confort exceptionnel.",
            'featured_image' => 'products/table-zen.jpg',
            'video_url' => 'https://www.youtube.com/watch?v=example3',
            'order' => 1,
        ], [
            ['Moteurs', '3 électriques'],
            ['Hauteur', '50-90 cm'],
            ['Charge max', '250 kg'],
            ['Dimensions', '200 x 70 cm'],
            ['Poids', '65 kg'],
        ], 4);

        $createDetailed([
            'division_id' => $coiffure->id,
            'category_id' => $catEquipementSpa->id,
            'brand_id' => $brandLuxSpa->id,
            'name' => 'Hammam Portable LuxSpa Oasis',
            'slug' => 'hammam-portable-luxspa-oasis',
            'short_description' => 'Cabine hammam portable pour espaces spa et bien-être.',
            'description' => "Le LuxSpa Oasis est une cabine hammam portable facile à installer. Sa technologie de vapeur à basse pression offre une expérience de détente authentique sans travaux d'installation lourds.",
            'featured_image' => 'products/hammam-oasis.jpg',
            'order' => 2,
        ], [
            ['Capacité', '1 personne'],
            ['Température max', '50°C'],
            ['Temps de chauffe', '10 minutes'],
            ['Puissance', '1000W'],
        ], 3);

        // --- Homepage Settings ---
        HomepageSetting::create([
            'hero_image' => 'homepage/hero.jpg',
            'hero_title' => 'Votre espace professionnel',
            'hero_subtitle' => 'Bella Forme Group, votre partenaire de confiance pour l\'équipement professionnel depuis plus de 30 ans.',
            'hero_slides' => [
                [
                    'type' => 'image',
                    'media_url' => 'homepage/hero.jpg',
                    'title' => 'Votre espace professionnel',
                    'subtitle' => 'Bella Forme Group, votre partenaire de confiance pour l\'équipement professionnel depuis plus de 30 ans.',
                ],
                [
                    'type' => 'image',
                    'media_url' => 'homepage/hero.jpg',
                    'title' => 'Équipements de qualité',
                    'subtitle' => 'Découvrez notre gamme complète de solutions professionnelles pour votre activité.',
                ],
                [
                    'type' => 'video',
                    'media_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                    'title' => 'Notre savoir-faire en vidéo',
                    'subtitle' => 'Plus de 30 ans d\'expertise au service de votre réussite.',
                ],
            ],
            'stats' => [
                ['label' => 'Ans d\'expérience', 'value' => '+30'],
                ['label' => 'Marques internationales', 'value' => '+50'],
                ['label' => 'Clients satisfaits', 'value' => '+3,000'],
                ['label' => 'Produits disponibles', 'value' => '+500'],
            ],
        ]);

        // --- Contact Messages ---
        ContactMessage::factory()->count(8)->create();

        // --- Email Settings ---
        EmailSetting::create([
            'smtp_host' => 'smtp.example.com',
            'smtp_port' => 587,
            'smtp_username' => 'noreply@bellaformegroup.com',
            'smtp_password' => 'sample-password-not-real',
            'encryption' => 'tls',
            'from_address' => 'contact@bellaformegroup.com',
            'from_name' => 'Bella Forme Group',
        ]);
    }
}
