import Product from '../model';

export default function nullifyCategories (ids) {
    return Product.find({ id: { $in: ids } });
}
