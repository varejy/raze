import { OKEY_STATUS_CODE, NOT_FOUND_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import uniqid from 'uniqid';

import getSavedProductsQuery from '../queries/getSavedProducts';
import saveSavedProduct from '../queries/saveSavedProduct';
import editSavedProduct from '../queries/editSavedProduct';

export default function saveViewedProducts (req, res) {
    const { id } = req.query;
    const viewed = req.body;

    if (!id) {
        return saveSavedProduct({
            viewed,
            liked: [],
            basket: [],
            id: uniqid()
        })
            .then((savedProducts) => {
                res.status(OKEY_STATUS_CODE).send(savedProducts.id);
            });
    }

    getSavedProductsQuery(id)
        .then(([savedProducts]) => {
            if (!savedProducts) {
                return res.status(NOT_FOUND_STATUS_CODE).end();
            }

            const { basket, liked, id } = savedProducts;

            editSavedProduct({
                viewed,
                liked,
                basket,
                id
            })
                .then((savedProducts) => {
                    res.status(OKEY_STATUS_CODE).send(savedProducts.id);
                });
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
