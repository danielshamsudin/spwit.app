const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    qty: {
        type: Number,
        default: 1
    }
});

const eventSchema = new mongoose.Schema({
    event: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    items: [itemSchema],
    tax: {
        type: Number,
        default: 0.0
    }
});

eventSchema.methods.calculateTotalWithTax = function() {
    const totalItemPrice = this.items.reduce((total, item) => total + (item.price * item.qty), 0);

    const totalWithTax = totalItemPrice + (totalItemPrice * this.tax);
    return totalWithTax;
};

module.exports = mongoose.model('Event', eventSchema);
