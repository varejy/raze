import request from 'superagent';
import base from '../base';

import { SAVED_PRODUCTS_ID_COOKIE } from '../../constants/constants';

import setBasket from '../../actions/setBasket';
import setLiked from '../../actions/setLiked';
import setViewed from '../../actions/setViewed';

const YEARS = 100;

export default function getSavedProducts (req, res) {
    return dispatch => {
        const host = req.get('host');
        const id = req.cookies[SAVED_PRODUCTS_ID_COOKIE];

        return base(
            request
                .get(`${host}/api/client/saved-products`)
                .query({ id })
                .timeout({
                    deadline: 2000
                })
        )
            .then(({ id, basket, liked, viewed }) => {
                const expires = new Date();

                expires.setFullYear(expires.getFullYear() + YEARS);
                res.cookie(SAVED_PRODUCTS_ID_COOKIE, id, { expires });

                dispatch(setBasket(basket));
                dispatch(setLiked(liked));
                dispatch(setViewed(viewed));
            })
            .catch(() => {
                dispatch(setBasket([]));
                dispatch(setLiked([]));
                dispatch(setViewed([]));
            });
    };
}
