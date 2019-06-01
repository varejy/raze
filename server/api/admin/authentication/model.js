import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Admin = new Schema({
    login: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    id: { type: String, required: true }
});

export default mongoose.model('Admin', Admin);
