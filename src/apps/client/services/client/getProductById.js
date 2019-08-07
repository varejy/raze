import request from 'superagent';
import base from '../base';

import setProductToMap from '../../actions/setProductToMap';

export default function getProductById (id) {
    return dispatch => {
        return base(
            request
                .get(`/api/client/product`)
                .query({ id })
        )
            .then(product => {
                dispatch(setProductToMap({
                    [product.id]: product
                }));
            })
            .catch(() => {
                dispatch(setProductToMap({
                    [id]: null
                }));
            });
    };
}
