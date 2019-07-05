import Product from '../model';

export default function editProduct (product) {
    return Product.findOneAndUpdate({ id: product.id }, product, { new: true });
}
