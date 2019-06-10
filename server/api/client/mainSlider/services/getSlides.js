import { OKEY_STATUS_CODE, SERVER_ERROR_STATUS_CODE } from '../../../../constants/constants';
import getSliderQuery from '../queries/getSlider';
import createSlider from '../queries/createSlider';

const SLIDER_ID = 'slider_id';

export default function getSlides (req, res) {
    getSliderQuery(SLIDER_ID)
        .then(([slider]) => {
            if (!slider) {
                return createSlider({ slides: [], id: SLIDER_ID })
                    .then(slider => {
                        res.status(OKEY_STATUS_CODE).send(slider.slides);
                    })
                    .catch(() => {
                        res.status(SERVER_ERROR_STATUS_CODE).end();
                    });
            }

            res.status(OKEY_STATUS_CODE).send(slider.slides);
        })
        .catch(() => {
            res.status(SERVER_ERROR_STATUS_CODE).end();
        });
}
