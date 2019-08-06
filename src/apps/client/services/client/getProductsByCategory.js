import request from 'superagent';
import base from '../base';

import setProductsToMap from '../../actions/setProductsToMap';
import checkingRemainingTime from '../../utils/checkingRemainingTime';

export default function getProductsByCategory (name) {
    return dispatch => {
        return base(
            request
                .get(`/api/client/product/by-category`)
                .query({ name })
        )
            .then(products => {
                const checkingProductsDiscountTime = products.map(product => {
                    if (!product.discountTime) {
                        return product;
                    } else {
                        if (checkingRemainingTime(product.discountTime).length) {
                            return product;
                        } else {
                            product.discountPrice = '';
                            return product;
                        }
                    }
                });

                dispatch(setProductsToMap({
                    [name]: checkingProductsDiscountTime
                }));
            })
    };
}
