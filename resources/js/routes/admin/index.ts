import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import divisions from './divisions'
import categories from './categories'
import brands from './brands'
import products from './products'
import contactMessages from './contact-messages'
import homepage from './homepage'
import emailSettings from './email-settings'
import seo from './seo'
/**
 * @see routes/web.php:62
 * @route '/admin/regenerate-images'
 */
export const regenerateImages = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: regenerateImages.url(options),
    method: 'post',
})

regenerateImages.definition = {
    methods: ["post"],
    url: '/admin/regenerate-images',
} satisfies RouteDefinition<["post"]>

/**
 * @see routes/web.php:62
 * @route '/admin/regenerate-images'
 */
regenerateImages.url = (options?: RouteQueryOptions) => {
    return regenerateImages.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:62
 * @route '/admin/regenerate-images'
 */
regenerateImages.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: regenerateImages.url(options),
    method: 'post',
})

    /**
 * @see routes/web.php:62
 * @route '/admin/regenerate-images'
 */
    const regenerateImagesForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: regenerateImages.url(options),
        method: 'post',
    })

            /**
 * @see routes/web.php:62
 * @route '/admin/regenerate-images'
 */
        regenerateImagesForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: regenerateImages.url(options),
            method: 'post',
        })
    
    regenerateImages.form = regenerateImagesForm
const admin = {
    divisions: Object.assign(divisions, divisions),
categories: Object.assign(categories, categories),
brands: Object.assign(brands, brands),
products: Object.assign(products, products),
contactMessages: Object.assign(contactMessages, contactMessages),
homepage: Object.assign(homepage, homepage),
emailSettings: Object.assign(emailSettings, emailSettings),
seo: Object.assign(seo, seo),
regenerateImages: Object.assign(regenerateImages, regenerateImages),
}

export default admin