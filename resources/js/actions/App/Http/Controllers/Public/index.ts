import HomeController from './HomeController'
import ProductController from './ProductController'
import ContactController from './ContactController'
import DivisionController from './DivisionController'
import CategoryController from './CategoryController'
const Public = {
    HomeController: Object.assign(HomeController, HomeController),
ProductController: Object.assign(ProductController, ProductController),
ContactController: Object.assign(ContactController, ContactController),
DivisionController: Object.assign(DivisionController, DivisionController),
CategoryController: Object.assign(CategoryController, CategoryController),
}

export default Public