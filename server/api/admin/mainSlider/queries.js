import mainSlider from './model';

export function getSlider (id) {
    return mainSlider.find({ id });
}

export function createSlider (slider) {
    return mainSlider.create(slider);
}

export function updateSlider (slider) {
    return mainSlider.findOneAndUpdate({ id: slider.id }, slider, { new: true });
}
