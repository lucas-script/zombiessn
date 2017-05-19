var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TradeSchema = new Schema({
    tradeRequest: { type: Schema.Types.ObjectId, ref: 'TradeRequest' },
    inactive: { type: Boolean, default: false },
    createdOn: { type: Date, default: Date.now },
    modifiedOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Trade', TradeSchema, 'trades');