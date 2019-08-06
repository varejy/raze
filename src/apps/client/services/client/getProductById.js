import request from 'superagent';
import base from '../base';

import setProductToMap from '../../actions/setProductToMap';
import checkingRemainingTime from '../../utils/checkingRemainingTime';

export default function getProductById (id) {
    return dispatch => {
        return base(
            request
                .get(`/api/client/product`)
                .query({ id })
        )
            .then(product => {
                if (!product.discountTime) {
                    dispatch(setProductToMap({
                        [product.id]: product
                    }));
                } else {
                    if (checkingRemainingTime(product.discountTime).length) {
                        dispatch(setProductToMap({
                            [product.id]: product
                        }));
                    } else {
                        product.discountPrice = '';
                        dispatch(setProductToMap({
                            [product.id]: product
                        }));
                    }
                }
            })
            .catch(() => {
                dispatch(setProductToMap({
                    [id]: null
                }));
            });
    };
}
