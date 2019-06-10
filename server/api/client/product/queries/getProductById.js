import Product from '../model';

export default function getProductById (id) {
    return Product.find({ id });
}
