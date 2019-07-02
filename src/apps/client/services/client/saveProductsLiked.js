import request from 'superagent';
import base from '../base';
import Cookies from 'js-cookie';
import { SAVED_PRODUCTS_ID_COOKIE } from '../../constants/constants';

export default function saveProductsLiked (productsIds) {
    return () => {
        const id = Cookies.get(SAVED_PRODUCTS_ID_COOKIE);

        return base(
            request
                .post(`/api/client/saved-products/save-liked`)
                .query({ id })
                .send(productsIds)
        );
    };
}
