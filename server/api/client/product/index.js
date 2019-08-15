import express from 'express';

import getAvailableProduct from './services/getAvailableProduct';
import getAvailableProductsByIds from './services/getAvailableProductsByIds';
import getAvailableProductsByCategory from './services/getAvailableProductsByCategory';
import availableProductsSearch from './services/availableProductsSearch';
import saveEmail from './services/saveEmail';
import getTopProducts from './services/getTopProducts';

const router = express.Router();

router.route('/')
    .get(getAvailableProduct);

router.route('/by-ids')
    .post(getAvailableProductsByIds);

router.route('/by-category')
    .get(getAvailableProductsByCategory);

router.route('/top')
    .get(getTopProducts);

router.route('/saveEmail')
    .post(saveEmail);

router.route('/search')
    .get(availableProductsSearch);

export default router;
