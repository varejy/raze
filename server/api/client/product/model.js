import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Product = new Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    company: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    features: [{
        prop: { type: String, required: true },
        value: { type: String, required: true }
    }],
    avatar: { type: String, required: true },
    files: [{ type: String, required: true }],
    hidden: { type: Boolean, required: true },
    categoryId: { type: String, required: true }
});

export default mongoose.model('Product', Product);
