import divisions from './divisions'
import categories from './categories'
import brands from './brands'
import products from './products'
import contactMessages from './contact-messages'
import newsletter from './newsletter'
import homepage from './homepage'
import emailSettings from './email-settings'
import solutions from './solutions'
import seo from './seo'
import media from './media'
import regenerateImages from './regenerate-images'
const admin = {
    divisions: Object.assign(divisions, divisions),
categories: Object.assign(categories, categories),
brands: Object.assign(brands, brands),
products: Object.assign(products, products),
contactMessages: Object.assign(contactMessages, contactMessages),
newsletter: Object.assign(newsletter, newsletter),
homepage: Object.assign(homepage, homepage),
emailSettings: Object.assign(emailSettings, emailSettings),
solutions: Object.assign(solutions, solutions),
seo: Object.assign(seo, seo),
media: Object.assign(media, media),
regenerateImages: Object.assign(regenerateImages, regenerateImages),
}

export default admin