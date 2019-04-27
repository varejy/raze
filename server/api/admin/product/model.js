import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Product = new Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    categoryId: { type: String, required: true }
});

export default mongoose.model('Product', Product);
