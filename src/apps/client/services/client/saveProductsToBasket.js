import request from 'superagent';
import base from '../base';
import Cookies from 'js-cookie';
import { SAVED_PRODUCTS_ID_COOKIE } from '../../constants/constants';

export default function saveProductsToBasket (productsIds) {
    return () => {
        const id = Cookies.get(SAVED_PRODUCTS_ID_COOKIE);

        return base(
            request
                .post(`/api/client/saved-products/save-basket`)
                .query({ id })
                .send(productsIds)
        );
    };
}
