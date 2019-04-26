import Category from './model';

export function getAllCategories () {
    return Category.find({});
}

export function saveCategoryQuery (category) {
    return Category.create(category);
}

export function deleteByIdsQuery (ids) {
    return Category.deleteMany({ id: { $in: ids } });
}
