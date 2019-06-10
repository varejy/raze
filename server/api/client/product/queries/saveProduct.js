import Product from '../model';

export default function saveProduct (product) {
    return Product.create(product);
}
