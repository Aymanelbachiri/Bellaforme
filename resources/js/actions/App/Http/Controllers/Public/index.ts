import HomeController from './HomeController'
import ProductController from './ProductController'
import ContactController from './ContactController'
import NewsletterController from './NewsletterController'
import BrandsController from './BrandsController'
import ReferencesController from './ReferencesController'
import CataloguesController from './CataloguesController'
import SolutionsController from './SolutionsController'
import DivisionController from './DivisionController'
import CategoryController from './CategoryController'
const Public = {
    HomeController: Object.assign(HomeController, HomeController),
ProductController: Object.assign(ProductController, ProductController),
ContactController: Object.assign(ContactController, ContactController),
NewsletterController: Object.assign(NewsletterController, NewsletterController),
BrandsController: Object.assign(BrandsController, BrandsController),
ReferencesController: Object.assign(ReferencesController, ReferencesController),
CataloguesController: Object.assign(CataloguesController, CataloguesController),
SolutionsController: Object.assign(SolutionsController, SolutionsController),
DivisionController: Object.assign(DivisionController, DivisionController),
CategoryController: Object.assign(CategoryController, CategoryController),
}

export default Public