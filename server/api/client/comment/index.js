import express from 'express';

import saveComment from './services/saveComment';

const router = express.Router();

router.route('/save')
    .post(saveComment);

export default router;
