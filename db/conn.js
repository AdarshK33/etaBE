const mongoose = require('mongoose')
const DB = process.env.database;
try {
    mongoose.connect(DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }).then(result => {
        console.log("db connection successful")
    })
} catch (error) {
    res.send({
        status: "No database connection",
        status_code: 400,
        message: error.message,
        error: ""
    })

}