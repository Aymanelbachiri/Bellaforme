import DivisionController from './DivisionController'
import CategoryController from './CategoryController'
import BrandController from './BrandController'
import ProductController from './ProductController'
import ContactMessageController from './ContactMessageController'
import HomepageController from './HomepageController'
import EmailSettingsController from './EmailSettingsController'
import SeoController from './SeoController'
const Admin = {
    DivisionController: Object.assign(DivisionController, DivisionController),
CategoryController: Object.assign(CategoryController, CategoryController),
BrandController: Object.assign(BrandController, BrandController),
ProductController: Object.assign(ProductController, ProductController),
ContactMessageController: Object.assign(ContactMessageController, ContactMessageController),
HomepageController: Object.assign(HomepageController, HomepageController),
EmailSettingsController: Object.assign(EmailSettingsController, EmailSettingsController),
SeoController: Object.assign(SeoController, SeoController),
}

export default Admin