import express from 'express';

import { getSlider } from './service';

const router = express.Router();

router.route('/')
    .get(getSlider);

export default router;
