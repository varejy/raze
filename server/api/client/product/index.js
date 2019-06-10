import express from 'express';

import getAvailableProductsByCategoryId from './services/getAvailableProductsByCategoryId';

const router = express.Router();

router.route('/by-category-id')
    .get(getAvailableProductsByCategoryId);

export default router;
