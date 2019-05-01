import Product from './model';

export function getAllProducts () {
    return Product.find({});
}

export function saveProduct (product) {
    return Product.create(product);
}

export function editProduct (product) {
    return Product.findOneAndUpdate({ id: product.id }, product, { new: true });
}

export function deleteByIds (ids) {
    return Product.deleteMany({ id: { $in: ids } });
}

export function nullifyCategories (ids) {
    return Product.updateMany({ categoryId: { $in: ids } }, { categoryId: 'none' });
}

export function hideProductsByCategory (categoryId, hidden) {
    return Product.updateMany({ categoryId: categoryId }, { hidden });
}
