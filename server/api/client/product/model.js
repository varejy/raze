import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Product = new Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    company: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    discountTime: { type: String },
    description: { type: String, required: true },
    features: [{
        prop: { type: String, required: true },
        value: { type: String, required: true }
    }],
    avatar: { type: String },
    filters: [{
        id: { type: String, required: true },
        value: { type: String, required: true }
    }],
    files: [{ type: String, required: true }],
    rating: { type: Number },
    notAvailable: { type: Boolean, required: true },
    hidden: { type: Boolean, required: true },
    tags: [{ type: String, required: true }],
    categoryId: { type: String, required: true },
    date: { type: Number, required: true },
    views: { type: Number, required: true },
    metaTitle: { type: String },
    metaDescription: { type: String },
    keywords: { type: String }
});

export default mongoose.model('Product', Product);
