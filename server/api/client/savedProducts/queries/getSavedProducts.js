import SavedProducts from '../model';

export default function getSavedProducts (id) {
    return SavedProducts.find({ id });
}
