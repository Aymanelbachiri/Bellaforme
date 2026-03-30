import DivisionController from './DivisionController'
import CategoryController from './CategoryController'
import BrandController from './BrandController'
import ProductController from './ProductController'
import ContactMessageController from './ContactMessageController'
import NewsletterController from './NewsletterController'
import HomepageController from './HomepageController'
import EmailSettingsController from './EmailSettingsController'
import SolutionsController from './SolutionsController'
import SeoController from './SeoController'
import MediaController from './MediaController'
const Admin = {
    DivisionController: Object.assign(DivisionController, DivisionController),
CategoryController: Object.assign(CategoryController, CategoryController),
BrandController: Object.assign(BrandController, BrandController),
ProductController: Object.assign(ProductController, ProductController),
ContactMessageController: Object.assign(ContactMessageController, ContactMessageController),
NewsletterController: Object.assign(NewsletterController, NewsletterController),
HomepageController: Object.assign(HomepageController, HomepageController),
EmailSettingsController: Object.assign(EmailSettingsController, EmailSettingsController),
SolutionsController: Object.assign(SolutionsController, SolutionsController),
SeoController: Object.assign(SeoController, SeoController),
MediaController: Object.assign(MediaController, MediaController),
}

export default Admin