export interface SeoMetadata {
    id: number;
    meta_title: string | null;
    meta_description: string | null;
    og_image: string | null;
}

export interface Division {
    id: number;
    name: string;
    slug: string;
    homepage_image: string | null;
    hero_image: string;
    hero_title: string;
    hero_subtitle: string;
    homepage_subtitle: string | null;
    phone: string | null;
    facebook_url: string | null;
    instagram_url: string | null;
    linkedin_url: string | null;
    youtube_url: string | null;
    order: number;
    is_active: boolean;
    seo?: SeoMetadata | null;
}

export interface Category {
    id: number;
    division_id: number;
    name: string;
    slug: string;
    image: string;
    hero_image: string | null;
    video_cover: string | null;
    video_url: string | null;
    order: number;
    is_active: boolean;
    division?: Division;
    seo?: SeoMetadata | null;
}

export interface Brand {
    id: number;
    name: string;
    slug: string;
    logo: string;
    is_partner: boolean;
    is_reference: boolean;
    order: number;
    is_active: boolean;
    divisions?: Division[];
}

export interface ProductImage {
    id: number;
    product_id: number;
    image_path: string;
    order: number;
}

export interface ProductSpecification {
    id: number;
    product_id: number;
    label: string;
    value: string;
    order: number;
}

export interface Product {
    id: number;
    division_id: number;
    category_id: number;
    brand_id: number | null;
    content_mode: 'detailed' | 'brochure_only';
    name: string;
    slug: string;
    short_description: string;
    description: string | null;
    featured_image: string;
    brochure_file: string | null;
    video_url: string | null;
    is_active: boolean;
    order: number;
    division?: Division;
    category?: Category;
    brand?: Brand;
    images?: ProductImage[];
    specifications?: ProductSpecification[];
    seo?: SeoMetadata | null;
}

export interface HeroSlide {
    type: 'image' | 'video';
    media_url: string;
    title: string;
    subtitle: string;
    button_text: string;
    button_url: string;
}

export interface HomepageSettings {
    id: number;
    hero_image: string;
    hero_title: string;
    hero_subtitle: string;
    hero_slides: HeroSlide[];
    stats: Array<{ label: string; value: string }>;
}

export interface SeoData {
    meta_title: string;
    meta_description: string;
    og_image: string | null;
    canonical_url: string;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

export interface ContactMessage {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    city: string | null;
    activity_type: string | null;
    project_nature: string | null;
    equipment_timeline: string | null;
    request_reason: string | null;
    message: string;
    product_id: number | null;
    created_at: string;
    product?: Product;
}

export interface SolutionsSection {
    title: string;
    description: string;
    image: string;
    brochure: string;
}

export interface SolutionsSettings {
    id: number;
    hero_title: string;
    hero_subtitle: string;
    hero_image: string;
    sections: SolutionsSection[];
}

export interface EmailSettings {
    id: number;
    smtp_host: string;
    smtp_port: number;
    smtp_username: string | null;
    encryption: 'none' | 'tls' | 'ssl';
    from_address: string;
    from_name: string;
    has_password: boolean;
}
