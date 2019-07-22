import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getComments from '../../../client/comment/queries/getComments';
import deleteByIdsQuery from '../../../client/comment/queries/deleteByIds';

export default function deleteByIds (req, res) {
    const { ids } = req.body;

    deleteByIdsQuery(ids)
        .then(() => {
            getComments()
                .then(commnets => {
                    res.status(OKEY_STATUS_CODE).send(commnets);
                });
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
