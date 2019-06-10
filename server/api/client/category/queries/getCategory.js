import Category from '../model';

export default function getCategory (id) {
    return Category.findOne({ id });
}
