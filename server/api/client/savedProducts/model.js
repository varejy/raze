import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const SavedProducts = new Schema({
    id: { type: String, required: true },
    basket: [{
        product: { type: String, required: true },
        count: { type: Number, required: true }
    }],
    liked: [{
        product: { type: String, required: true },
        count: { type: Number, required: true }
    }],
    viewed: [{ type: String, required: true }]
});

export default mongoose.model('SavedProducts', SavedProducts);
