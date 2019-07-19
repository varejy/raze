import express from 'express';

import verification from '../../../middlewares/verification';

import getComments from './services/getComments';
import deleteByIds from './services/deleteByIds';
import editComment from './services/editComment';

const router = express.Router();

router.use(verification);

router.route('/all')
    .get(getComments);

router.route('/delete')
    .post(deleteByIds);

router.route('/edit')
    .post(editComment);

export default router;
