import Product from '../model';

export default function getProductsByCategory (categoryId) {
    return Product.find({ categoryId });
}
