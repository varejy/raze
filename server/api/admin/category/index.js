import express from 'express';

import { getCategories, saveCategory, editCategory, deleteByIds } from './service';

const router = express.Router();

router.route('/all')
    .get(getCategories);

router.route('/save')
    .post(saveCategory);

router.route('/edit')
    .post(editCategory);

router.route('/delete-few')
    .post(deleteByIds);

export default router;
