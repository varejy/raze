import SavedProducts from '../model';

export default function saveSavedProduct (savedProducts) {
    return SavedProducts.create(savedProducts);
}
