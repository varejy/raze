import Product from '../model';

export default function deleteByIds (ids) {
    return Product.deleteMany({ id: { $in: ids } });
}
