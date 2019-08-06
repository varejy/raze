import request from 'superagent';
import base from '../base';

import { matchPath } from 'react-router';

import checkingRemainingTime from '../../utils/checkingRemainingTime';
import setProductsToMap from '../../actions/setProductsToMap';

const CATEGORY_PATH = '/:category/';

export default function getProductsByCategory (req) {
    return dispatch => {
        const match = matchPath(req.path, { path: CATEGORY_PATH, exact: true });

        if (!match) {
            return dispatch(setProductsToMap({}));
        }

        const host = req.get('host');

        return base(
            request
                .get(`${host}/api/client/product/by-category`)
                .query({ name: match.params.category })
                .timeout({
                    deadline: 2000
                })
        )
            .then(products => {
                const checkingProductsDiscountTime = products.map(product => {
                    if (!product.discountTime) {
                        return product;
                    } else {
                        if(checkingRemainingTime(product.discountTime).length) {
                            return product;
                        } else {
                            product.discountPrice = '';
                            return product;
                        }
                    }
                });

                dispatch(setProductsToMap({
                    [match.params.category]: checkingProductsDiscountTime
                }));
            })
            .catch(() => {
                return dispatch(setProductsToMap({}));
            });
    };
}
