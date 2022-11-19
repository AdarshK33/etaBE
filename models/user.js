const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const JWT_KEY = process.env.JWT_KEY; //token
const JWT_EXPIRE_TIME = process.env.JWT_EXPIRE_TIME;

const userSchema = new Schema({
    user_id: ObjectId,
    // emp_id: {
    //     type: String,
    //     required: [true]
    //},
    emp_id: {
        type: String,
        required: [true]
     },
    name: {
        type: String,
        required: [true]
     },
    email: {
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
    password: {
        type: String,
        validate: {
            validator: (Password) =>
                Password.length > 6,

            message: 'Password must be longer than 6 characters '
        },
        required: [true, 'Password is required']
    },
    designation: {
        type: String,
        required: [true]
     },
     role_name: {
        type: String,
        enum: [ "admin", "ba", "emp"],
        required: [true, 'role is required']
     },
     role_id: {
        type: String,
        enum: [ "1", "2", "3"],
        required: [true, 'role is required']
     },
    token: { type: String },
    user_Created_at: Date,
    user_Updated_at: Date,
    user_Deleted_at: Date
});
// userSchema.statics.findByCredentials = async function(patientId,password) {

//     const patient = await User.findOne({email:patientId})

//     if(!patient) {
//         throw new Error ('No Such User Exists')
//     }

//     if(password !== patient.password) {
//         throw new Error ('Incorrect Password !')
//     } else {
//         return patient
//     }

// }

userSchema.statics.findByCredentials = async function(email,password) {
       console.log("eeeeeeee",email,password)
    const patient = await User.findOne({email})

    if(!patient) {
        throw new Error ('No Such Patient Exists')
    }

    if(password !== patient.password) {
        throw new Error ('Incorrect Password !')
    } else {
        return patient
    }
}

userSchema.pre('save', function(next) {
    now = new Date();
    this.user_Updated_at = now;
    if (!this.user_Created_at) {
        this.user_Created_at = now;
    }
    next();
});

userSchema.methods.createJWT = function() {
    const payload = {
      userId: this.user_id,
      email: this.email,
      role: this.role
    };
  
    return jwt.sign(payload, JWT_KEY, {
      expiresIn: JWT_EXPIRE_TIME
    });
  };
  

module.exports = mongoose.model('User', userSchema);



// const User = mongoose.model('User', userSchema )
// module.exports = {User}