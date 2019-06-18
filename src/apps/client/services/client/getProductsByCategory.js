import request from 'superagent';
import base from '../base';

import setProductsToMap from '../../actions/setProductsToMap';

export default function getProductsByCategory (name) {
    return dispatch => {
        return base(
            request
                .get(`/api/client/product/by-category`)
                .query({ name })
        )
            .then(products => {
                dispatch(setProductsToMap({
                    [name]: products
                }));
            });
    };
}
