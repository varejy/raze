import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';
import getAllCategories from '../queries/getAllCategories';

export default function getAvailableCategories (req, res) {
    getAllCategories()
        .then(categories => {
            const availableCategories = categories
                .filter(category => !category.hidden)
                .sort((oldCateg, newCateg) => oldCateg.positionIndex - newCateg.positionIndex);

            res.status(OKEY_STATUS_CODE).send(availableCategories);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
