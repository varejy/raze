import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import getComments from '../../../client/comment/queries/getComments';

export default function getAllComments (req, res) {
    getComments()
        .then(comments => {
            res.status(OKEY_STATUS_CODE).send(comments);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
