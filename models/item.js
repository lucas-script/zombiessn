var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ItemSchema = new Schema({
    name: { type: String, required: true },
    points: { type: Number, require: true },
    inactive: { type: Boolean, default: false },
    createdOn: { type: Date, default: Date.now },
    modifiedOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Item', ItemSchema, 'items');