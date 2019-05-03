import mainSlider from './model';

export function getSlider () {
    return mainSlider.find({});
}

export function createSlider (slider) {
    return mainSlider.create(slider);
}

export function editSlider (slider) {
    return mainSlider.findOneAndUpdate({}, slider, { new: true });
}
