import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getProductById from '../queries/getProductById';
import editProduct from '../queries/editProduct';
import includes from '@tinkoff/utils/array/includes';
import noop from '@tinkoff/utils/function/noop';

export default function saveEmail (req, res) {
    const { email } = req.body
    const { id } = req.query;

    getProductById(id)
        .then(([product]) => {
            if (includes(email, product.emailsForNotifications)) {
                return res.status(SERVER_ERROR_STATUS_CODE).end();
            }

            product.emailsForNotifications = [ ...product.emailsForNotifications, email ];

            editProduct(product)
                .then(noop)

            res.status(OKEY_STATUS_CODE).end();
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}