import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';
import getAllCategories from '../../../client/category/queries/getAllCategories';

export default function getCategories (req, res) {
    getAllCategories()
        .then(categories => {
            res.status(OKEY_STATUS_CODE).send(categories);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
