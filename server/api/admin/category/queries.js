import Category from './model';

export function getAllCategories () {
    return Category.find({});
}

export function getCategory (id) {
    return Category.findOne({ id });
}

export function saveCategory (category) {
    return Category.create(category);
}

export function editCategory (category) {
    return Category.updateOne({ id: category.id }, category);
}

export function deleteByIds (ids) {
    return Category.deleteMany({ id: { $in: ids } });
}
