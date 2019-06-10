import request from 'superagent';
import base from '../base';

import setProductsToMap from '../../actions/setProductsToMap';

export default function getProductsByCategoryId (id) {
    return dispatch => {
        return base(
            request
                .get(`/api/client/product/by-category-id`)
                .query({ id })
                .timeout({
                    deadline: 1000
                })
        )
            .then(products => {
                dispatch(setProductsToMap({
                    [id]: products
                }));
            });
    };
}
