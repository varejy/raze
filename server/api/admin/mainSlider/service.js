import fs from 'fs';

import { SLIDE_FILE_FIELD_NAME_REGEX, OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../constants/constants';
import {
    getSlider as getSliderQuery,
    createSlider,
    updateSlider
} from './queries';
import multipart from '../../../helpers/multipart';

import noop from '@tinkoff/utils/function/noop';

const SLIDER_ID = 'slider_id';

const uploader = multipart(SLIDE_FILE_FIELD_NAME_REGEX);

export function getSlider (req, res) {
    getSliderQuery(SLIDER_ID)
        .then(([slider]) => {
            if (!slider) {
                return createSlider({ slides: [], id: SLIDER_ID })
                    .then(slider => {
                        res.status(OKEY_STATUS_CODE).send(slider);
                    })
                    .catch(() => {
                        res.status(SERVER_ERROR_STATUS_CODE).end();
                    });
            }

            res.status(OKEY_STATUS_CODE).send(slider);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}

export function updateSlides (req, res) {
    uploader(req, res, (err) => {
        if (err) {
            return res.status(SERVER_ERROR_STATUS_CODE).end();
        }

        const files = req.files;
        const slides = JSON.parse(req.body.slides);
        const removedSlides = JSON.parse(req.body.removedSlides);
        const resultSlides = slides.map((slide) => ({
            showed: slide.showed,
            path: slide.path
        }));

        files.forEach(file => {
            const index = file.fieldname.replace(SLIDE_FILE_FIELD_NAME_REGEX, '');

            resultSlides[index].path = `/${file.path.replace(/\\/g, '/')}`;
        });

        removedSlides.forEach(slide => {
            fs.unlink(slide.path.slice(1), noop);
        });

        updateSlider({ slides: resultSlides, id: SLIDER_ID })
            .then(slider => {
                res.status(OKEY_STATUS_CODE).send(slider);
            })
            .catch(() => {
                resultSlides.forEach(slide => {
                    fs.unlink(slide.path.slice(1), noop);
                });

                return res.status(SERVER_ERROR_STATUS_CODE).end();
            });
    });
}
