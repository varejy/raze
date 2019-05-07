import express from 'express';

import verification from '../../../middlewares/verification';

import { getSlider, updateSlides } from './service';

const router = express.Router();

router.use(verification);

router.route('/')
    .get(getSlider);

router.route('/update-slides')
    .post(updateSlides);

export default router;
