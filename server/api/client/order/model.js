import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Order = new Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    orderType: { type: String, required: true },
    paymentType: { type: String, required: true },
    products: [{
        id: { type: String, required: true },
        name: { type: String, required: true },
        count: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    city: { type: String, required: true },
    department: { type: String, required: true },
    date: { type: Number, required: true },
    comment: { type: String, required: false },
    status: { type: String, required: true }
});

export default mongoose.model('Order', Order);
