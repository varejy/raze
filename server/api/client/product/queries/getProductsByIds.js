import Product from '../model';

export default function getProductsByIds (ids) {
    return Product.find({ id: { $in: ids } });
}
