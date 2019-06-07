import express from 'express';

import { getAvailableCategories } from './service';

const router = express.Router();

router.route('/')
    .get(getAvailableCategories);

export default router;
