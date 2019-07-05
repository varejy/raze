import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Comment = new Schema({
    id: { type: String, required: true },
    productId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    text: { type: String, required: true },
    rating: { type: Number, required: true },
    date: { type: Number, required: true }
});

export default mongoose.model('Comment', Comment);
