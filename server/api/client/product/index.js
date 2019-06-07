import express from 'express';

import { getAvailableProducts } from './service';

const router = express.Router();

router.route('/')
    .get(getAvailableProducts);

export default router;
