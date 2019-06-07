import express from 'express';

import getAvailableCategories from './services/getAvailableCategories';

const router = express.Router();

router.route('/')
    .get(getAvailableCategories);

export default router;
