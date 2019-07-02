import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const SavedProducts = new Schema({
    id: { type: String, required: true },
    basket: [{
        id: { type: String, required: true },
        count: { type: Number, required: true }
    }],
    liked: [{ type: String, required: true }],
    viewed: [{ type: String, required: true }]
});

export default mongoose.model('SavedProducts', SavedProducts);
