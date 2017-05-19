var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var InfectionReportSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    reports: { type: Number, require: true, default: 0 },
    reporters: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    inactive: { type: Boolean, default: false },
    createdOn: { type: Date, default: Date.now },
    modifiedOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model('InfectionReport', InfectionReportSchema, 'infectionReports');