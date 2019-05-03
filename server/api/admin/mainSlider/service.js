import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../constants/constants';
import {
    getSlider as getSliderQuery,
    createSlider,
    editSlider as editSliderQuery
} from './queries';

export function getSlider (req, res) {
    getSliderQuery()
        .then(([slider]) => {
            if (!slider) {
                return createSlider({ slides: [] })
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

export function editSlider (req, res) {
    const { slides } = req.body;

    editSliderQuery({ slides })
        .then(slider => {
            res.status(OKEY_STATUS_CODE).send(slider);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
