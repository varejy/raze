import Product from '../model';

export default function hideProductsByCategory (categoryId, hidden) {
    return Product.updateMany({ categoryId: categoryId }, { hidden });
}
