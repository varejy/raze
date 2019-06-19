import Category from '../model';

export default function getCategoriesByPath (path) {
    return Category.find({ path });
}
