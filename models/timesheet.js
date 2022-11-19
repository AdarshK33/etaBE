const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const timesheetSchema = new Schema({
    timesheet_id: ObjectId,
    timesheet_Project_id:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: [true]
     },
     timesheet_Task_Id:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
        required: [true]
     },
     timesheet_startTime:   {
        type: String,
        required: [true]
     },
    timesheet_endTime:   {
        type: String,
        required: [true]
     },
    timesheet_totalTime:   {
        type: String,
        required: [true]
     },
     timesheet_comment:   {
        type: String,
        required: [true]
     },
    timesheet_Created_at: Date,
    timesheet_Updated_at: Date,
    timesheet_Deleted_at: Date
});

timesheetSchema.pre('save', function(next) {
    now = new Date();
    this.timesheet_Updated_at = now;
    if (!this.timesheet_Created_at) {
        this.timesheet_Created_at = now;
    }
    next();
});


module.exports = mongoose.model('Timesheet',timesheetSchema);