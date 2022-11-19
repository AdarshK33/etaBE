const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const roleSchema = new Schema({
    role_id: ObjectId,
    role_Name: String,
    role_designation:String,
    role_Project_name:String,
    role_Created_at: Date,
    role_Updated_at: Date,
    role_Deleted_at: Date
});

roleSchema.pre('save', function(next) {
    now = new Date();
    this.role_Updated_at = now;
    if (!this.role_Created_at) {
        this.role_Created_at = now;
    }
    next();
});


module.exports = mongoose.model('Role', roleSchema);