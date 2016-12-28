var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: { type: String, required: true },
    birthday: { type: Date, required: true },
    gender: {type: String, required: true, enum: ['Male', 'Female'] },
    lastLocation: {
        lng: Number,
        lat: Number
    },
    inventory: [{
        product: { type: Schema.Types.ObjectId, ref: 'Product' },
        amount: { type: Number }
    }],
    infected: { type: Boolean, default: false },
    inactive: { type: Boolean, default: false },
    createdOn: { type: Date, default: Date.now },
    modifiedOn: { type: Date, default: Date.now },
    lastLogin: { type: Date }
});

module.exports = mongoose.model('User', UserSchema, 'users');