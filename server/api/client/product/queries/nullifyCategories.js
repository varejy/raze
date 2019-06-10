import Product from '../model';

export default function nullifyCategories (ids) {
    return Product.updateMany({ categoryId: { $in: ids } }, { categoryId: 'none' });
}
