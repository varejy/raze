import { OKEY_STATUS_CODE, NOT_FOUND_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import uniqid from 'uniqid';

import getSavedProductsQuery from '../queries/getSavedProducts';
import getProductsByIds from '../../product/queries/getProductsByIds';
import saveSavedProduct from '../queries/saveSavedProduct';

export default function getSavedProducts (req, res) {
    const { id } = req.query;

    if (!id) {
        return saveSavedProduct({
            basket: [],
            liked: [],
            viewed: [],
            id: uniqid()
        })
            .then((savedProducts) => {
                res.status(OKEY_STATUS_CODE).send(savedProducts);
            });
    }

    getSavedProductsQuery(id)
        .then(([savedProducts]) => {
            if (!savedProducts) {
                return res.status(NOT_FOUND_STATUS_CODE).end();
            }

            const { basket, liked, viewed, id } = savedProducts;

            Promise.all([
                getProductsByIds(basket),
                getProductsByIds(liked),
                getProductsByIds(viewed)
            ])
                .then(([baskedProducts, likedProducts, viewedProducts]) => {
                    return [
                        baskedProducts.filter(product => !product.hidden),
                        likedProducts.filter(product => !product.hidden),
                        viewedProducts.filter(product => !product.hidden)
                    ];
                })
                .then(([baskedProducts, likedProducts, viewedProducts]) => {
                    res.status(OKEY_STATUS_CODE).send({
                        basket: baskedProducts,
                        liked: likedProducts,
                        viewed: viewedProducts,
                        id
                    });
                });
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
