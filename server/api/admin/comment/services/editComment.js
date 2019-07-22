import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';

import prepareComment from '../utils/prepareComment';

import editCommentQuery from '../../../client/comment/queries/editComment';

export default function editComment (req, res) {
    const comment = prepareComment(req.body);

    editCommentQuery(comment)
        .then(comment => {
            res.status(OKEY_STATUS_CODE).send(comment);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
