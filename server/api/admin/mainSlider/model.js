import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const mainSlider = new Schema({
    slides: [{
        image: { type: String, required: true }
    }]
});

export default mongoose.model('mainSlider', mainSlider);
