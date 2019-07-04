import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Product = new Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    company: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    description: { type: String, required: true },
    features: [{
        prop: { type: String, required: true },
        value: { type: String, required: true }
    }],
    avatar: { type: String },
    files: [{ type: String, required: true }],
    rating: { type: Number, required: true },
    notAvailable: { type: Boolean, required: true },
    hidden: { type: Boolean, required: true },
    tags: [{ type: String, required: true }],
    categoryId: { type: String, required: true },
    date: { type: Date, required: true },
    views: { type: Number, required: true }
});

export default mongoose.model('Product', Product);
