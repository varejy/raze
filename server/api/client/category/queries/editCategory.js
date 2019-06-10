import Category from '../model';

export default function editCategory (category) {
    return Category.updateOne({ id: category.id }, category);
}
