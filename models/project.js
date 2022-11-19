const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const projectSchema = new Schema({
    project_id: ObjectId,
    project_Name:  {
        type: String,
        required: [true] 
     },
    project_Client_Name:  {
        type: String,
        required: [true]
     },
    project_Client_Email: {
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
    project_Client_Location: String,
    project_Ba_Id: 
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: [true]
        },
    project_Created_at: Date,
    project_Updated_at: Date,
    project_Deleted_at: Date
});

projectSchema.pre('save', function(next) {
    now = new Date();
    this.project_Updated_at = now;
    if (!this.project_Created_at) {
        this.project_Created_at = now;
    }
    next();
});


module.exports = mongoose.model('Project', projectSchema);