import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Category = new Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    path: { type: String, required: true },
    hidden: { type: Boolean, required: true },
    filters: [{
        id: { type: String, required: true },
        name: { type: String, required: true },
        type: { type: String, required: true }
    }],
    metaTitle: { type: String },
    metaDescription: { type: String }
});

export default mongoose.model('Category', Category);
