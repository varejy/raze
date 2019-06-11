import express from 'express';

import getAvailableProductsByCategoryId from './services/getAvailableProductsByCategoryId';
import availableProductsSearch from './services/availableProductsSearch';

const router = express.Router();

router.route('/by-category-id')
    .get(getAvailableProductsByCategoryId);

router.route('/search')
    .get(availableProductsSearch);

export default router;
