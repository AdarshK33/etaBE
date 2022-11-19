const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const taskSchema = new Schema({
    task_id: ObjectId,
    project_Id:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: [true]
     },
    user_Id:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true]
     },
    user_Email: {
        type: String,
        trim: true,
        lowercase:true,
        unique:true,
        validate: {
            validator: function(v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: "Please enter a valid email"
        },
        required: [true,'Email Is Required']
      },
    task_comment:{
        type: String,
        required: [true]
    },
    task_Created_at: Date,
    task_Updated_at: Date,
    task_Deleted_at: Date
});

taskSchema.pre('save', function(next) {
    now = new Date();
    this.task_Updated_at = now;
    if (!this.task_Created_at) {
        this.task_Created_at = now;
    }
    next();
});

module.exports = mongoose.model('Task', taskSchema);