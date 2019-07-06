import express from 'express';

import verification from '../../../middlewares/verification';

import getOrders from './services/getOrders';

const router = express.Router();

router.use(verification);

router.route('/all')
    .get(getOrders);

export default router;
