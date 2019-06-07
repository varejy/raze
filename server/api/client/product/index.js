import express from 'express';

import getAvailableProducts from './services/getAvailableProducts';

const router = express.Router();

router.route('/')
    .get(getAvailableProducts);

export default router;
