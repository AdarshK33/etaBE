const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const tokenSchema = new Schema({
    token_id: ObjectId,
    user_id: 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true]
    },
    token: String,
    token_Created_at: Date,
    token_Updated_at: Date,
    token_Deleted_at: Date
});


tokenSchema.pre('save', function(next) {
    now = new Date();
    this.token_Updated_at = now;
    if (!this.token_Created_at) {
        this.token_Created_at = now;
    }
    next();
});


module.exports = mongoose.model('Token', tokenSchema);