import express from 'express';

import { getCategories, saveCategory, deleteByIds } from './service';

const router = express.Router();

router.route('/all')
    .get(getCategories);

router.route('/save')
    .post(saveCategory);

router.route('/delete-few')
    .post(deleteByIds);

export default router;
