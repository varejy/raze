import express from 'express';

import getAvailableProduct from './services/getAvailableProduct';
import getAvailableProductsByCategory from './services/getAvailableProductsByCategory';
import availableProductsSearch from './services/availableProductsSearch';

const router = express.Router();

router.route('/')
    .get(getAvailableProduct);

router.route('/by-category')
    .get(getAvailableProductsByCategory);

router.route('/search')
    .get(availableProductsSearch);

export default router;
