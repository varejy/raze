import express from 'express';

import getSavedProducts from './services/getSavedProducts';
import saveBasketProducts from './services/saveBasketProducts';
import saveLikedProducts from './services/saveLikedProducts';
import saveViewedProducts from './services/saveViewedProducts';

const router = express.Router();

router.route('/')
    .get(getSavedProducts);

router.route('/save-basket')
    .post(saveBasketProducts);

router.route('/save-liked')
    .post(saveLikedProducts);

router.route('/save-viewed')
    .post(saveViewedProducts);

export default router;
