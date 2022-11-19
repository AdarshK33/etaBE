const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require("path");
const bodyParser = require("body-parser");
const multer = require("multer");

var cors = require('cors'); 
const { body, validationResult } = require('express-validator');
const session=require('express-session');
// const MongoDBStore = require('connect-mongodb-session')(session);
// const DB = process.env.database;

// const store = new MongoDBStore({
//     uri: DB,
//     collection: 'sessions'
//   });

// const csrf = require('csurf');


require('dotenv').config();
const app = express();


// app.use(
//     session({
//       secret: 'my secret',
//       resave: false,
//       saveUninitialized: false,
//       store: store
//     })
//   );
const port = process.env.port;
//port
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require('./db/conn')//db connection

// const csrfProtection = csrf();


// app.use(csrfProtection);

//routes
 app.use(require('./routes/apiList')); 

//app.use(require('./routes/projectList')); 

////////////////////////end routes ////////////////////////////////////















// app.use(require('./routes/adminLogin')); 
// app.use((req, res, next) => {
//     if (!req.session.user) {
//       return next();
//     }
//     User.findById(req.session.user._id)
//       .then(user => {
//         req.user = user;
//         next();
//       })
//       .catch(err => console.log(err));
//   });
  
//   app.use((req, res, next) => {
//     res.locals.isAuthenticated = req.session.isLoggedIn;
//     res.locals.csrfToken = req.csrfToken();
//     next();
//   });









//server run On
app.listen(port, () => {
    console.log(`My Demo app listening at http://localhost:${port}`)
})