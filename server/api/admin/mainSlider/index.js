import express from 'express';

import verification from '../../../middlewares/verification';

import { getSlider, editSlider } from './service';

const router = express.Router();

router.use(verification);

router.route('/')
    .get(getSlider);

router.route('/edit')
    .post(editSlider);

export default router;
