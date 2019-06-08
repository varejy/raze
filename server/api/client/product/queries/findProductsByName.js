import Product from '../model';

export default function findProductsByName (text) {
    return Product.find({ '$or': [
        { name: { $regex: text, $options: 'i' } },
        { company: { $regex: text, $options: 'i' } }
    ]});
}
