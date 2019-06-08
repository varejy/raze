import Product from '../model';

export default function getAllProducts () {
    return Product.find({});
}
