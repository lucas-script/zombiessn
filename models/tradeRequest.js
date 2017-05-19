var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TradeRequestSchema = new Schema({
    requester: { type: Schema.Types.ObjectId, ref: 'User' },
    responder: { type: Schema.Types.ObjectId, ref: 'User' },
    requesterItems: [{
        _id: false, 
        item: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
        amount: { type: Number, required: true } 
    }],
    responderItems: [{
        _id: false,
        item: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
        amount: { type: Number, required: true } 
    }],
    status: { type: String, default: 'WAITING', enum: ['WAITING', 'DENIED', 'ACCEPTED'] },
    inactive: { type: Boolean, default: false },
    createdOn: { type: Date, default: Date.now },
    modifiedOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model('TradeRequest', TradeRequestSchema, 'tradeRequests');