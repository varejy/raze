import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const mainSlider = new Schema({
    id: { type: String, required: true },
    slides: [{
        path: { type: String, required: true },
        showed: { type: Boolean, required: true }
    }]
});

export default mongoose.model('mainSlider', mainSlider);
