import fs from 'fs';
import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE, PRODUCT_AVATAR_FIELD_NAME_REGEX } from '../../../../constants/constants';

import editProductQuery from '../../../client/product/queries/editProduct';
import getProductById from '../../../client/product/queries/getProductById';

import multipart from '../../../../helpers/multipart';

import noop from '@tinkoff/utils/function/noop';

const uploader = multipart(PRODUCT_AVATAR_FIELD_NAME_REGEX);

export default function updateAvatar (req, res) {
    const { id } = req.query;

    getProductById(id)
        .then(([product]) => {
            uploader(req, res, (err) => {
                if (err) {
                    return res.status(SERVER_ERROR_STATUS_CODE).end();
                }

                product.avatar && fs.unlink(product.avatar.slice(1), noop);

                const files = req.files;
                const avatar = `/${files[0].path.replace(/\\/g, '/')}`

                editProductQuery({ avatar, id })
                    .then(product => {
                        res.status(OKEY_STATUS_CODE).send(product);
                    })
                    .catch(() => {
                        fs.unlink(avatar.slice(1), noop);

                        return res.status(SERVER_ERROR_STATUS_CODE).end();
                    });
            });
        })
        .catch(() => {
            return res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
