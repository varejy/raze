import express from 'express';

import getSlider from './services/getSlider';

const router = express.Router();

router.route('/')
    .get(getSlider);

export default router;
