import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const SavedProducts = new Schema({
    id: { type: String, required: true },
    basket: [{ type: String, required: true }],
    liked: [{ type: String, required: true }],
    viewed: [{ type: String, required: true }]
});

export default mongoose.model('SavedProducts', SavedProducts);
