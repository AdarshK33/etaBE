const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const projectSchema = new Schema({
    report_id: ObjectId,
    report_Name: String,
    report_Status:String,
    report_Created_at: Date,
    report_Updated_at: Date,
    report_Deleted_at: Date
});

projectSchema.pre('save', function(next) {
    now = new Date();
    this.report_Updated_at = now;
    if (!this.project_Created_at) {
        this.project_Created_at = now;
    }
    next();
});


module.exports = mongoose.model('Project', projectSchema);