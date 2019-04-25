import express from 'express';

import { getCategories, saveCategory } from './service';

const router = express.Router();

router.route('/all')
    .get(getCategories);

router.route('/save')
    .post(saveCategory);

export default router;
