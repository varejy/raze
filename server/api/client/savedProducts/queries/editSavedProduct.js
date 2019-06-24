import SavedProducts from '../model';

export default function editSavedProduct (savedProducts) {
    return SavedProducts.findOneAndUpdate({ id: savedProducts.id }, savedProducts, { new: true });
}
