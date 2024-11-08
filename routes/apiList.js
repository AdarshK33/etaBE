const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const auth= require('../middleware/auth')
const jwt = require("jsonwebtoken");

// const { body, validationResult } = require('express-validator');
 const { isAuth } = require('../authJWT');
 const Users = require("../models/user" );
 const Projects = require("../models/project" );
 const Tasks = require("../models/task" );
 const Tokens = require("../models/token" );
 const Timesheets = require("../models/timesheet" );

 const authenticateToken = require('../authenticateToken');

// console.log("hello isAuth",isAuth)

// const { Users,Project } = require("./../models");
const mongoose = require('mongoose');

/**
 * @swagger
 * /createUser:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 required:
 *                   - emp_id
 *                   - name
 *                   - email
 *                   - designation
 *                   - role_name
 *                   - role_id
 *                   - password
 *                 properties:
 *                   emp_id:
 *                     type: string
 *                     description: Employee ID
 *                   name:
 *                     type: string
 *                     description: Name of the employee
 *                   email:
 *                     type: string
 *                     description: Email address of the employee
 *                   designation:
 *                     type: string
 *                     description: Job title or role of the employee
 *                   role_name:
 *                     type: string
 *                     description: Role name (e.g., "admin", "ba", "emp")
 *                   role_id:
 *                     type: string
 *                     description: Role ID (e.g., "1" for admin, "2" for employee)
 *                   password:
 *                     type: string
 *                     description: Password for the new user (minimum 6 characters)
 *     responses:
 *       200:
 *         description: Successfully created the new user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 status_code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: new user saved successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     emp_id:
 *                       type: string
 *                       description: Employee ID
 *                     name:
 *                       type: string
 *                       description: Name of the employee
 *                     email:
 *                       type: string
 *                       description: Email of the employee
 *                     designation:
 *                       type: string
 *                       description: Job title of the employee
 *                     role_name:
 *                       type: string
 *                       description: Role of the employee
 *                     role_id:
 *                       type: string
 *                       description: Role ID of the employee
 *                     token:
 *                       type: string
 *                       description: JWT token for the new user
 *       400:
 *         description: Bad request, invalid or missing data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: bad request
 *                 status_code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Unable to create new user record
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - emp_id
 *         - name
 *         - email
 *         - role_name
 *         - role_id
 *         - password
 *       properties:
 *         emp_id:
 *           type: string
 *           description: Employee ID
 *         name:
 *           type: string
 *           description: Name of the employee
 *         email:
 *           type: string
 *           description: Email address of the employee
 *         designation:
 *           type: string
 *           description: Designation of the employee
 *         role_name:
 *           type: string
 *           description: Role of the employee (e.g., admin, ba, emp)
 *         role_id:
 *           type: string
 *           description: Role ID (e.g., 1 for admin, 2 for employee)
 *         password:
 *           type: string
 *           description: Password for the user
 *         token:
 *           type: string
 *           description: JWT token for authentication
 */



router.post('/createUser', async function(req, res) {
    // console.log("rrrr",req.body.data)
    try {
        const data = req.body.data;
        const newUserObj = await Users.create({
            // id: new mongoose.Types.ObjectId(),
            emp_id:data.emp_id,
            name:data.name,
            email: data.email,
            designation:data.designation,
            role_name :data.role_name,
            role_id:data.role_id,
            password:await bcrypt.hash(data.password,10),
        })
        const token = jwt.sign(
            { user_id: Users._id },
            process.env.JWT_KEY,
            {
              expiresIn: "2h",
            }
          );
          // save user token
          newUserObj.token = token;
        const new_user_result = await newUserObj.save();
        if (new_user_result) {
            return res.send({
                status: "success",
                status_code: 200,
                message: "new user saved successfully.",
                data: {  newUserObj }   
            });  
        } 
        throw new Error("Unable to create new user record");

    } catch (error) {
        res.send({
            status: "bad request",
            status_code: 400,
            message: error.message
        })
    }
});

router.post('/login',async function(req, res){
//     try {
//     const email = req.body.data.email;
//     const password = req.body.data.password;

//   Users.findOne({ email: email })
//                 .then(empDetails =>
//                     {
                        
            
//                         if( empDetails )
                      
//                         {
                          
//                         // if (new_token_result) {
//                         //     return res.send({
//                         //         status: "success",
//                         //         status_code: 200,
//                         //         message: "new Token saved successfully.",
//                         //         data: {  tokenObj }   
//                         //     });  
//                         // } 

//                          bcrypt.compare(password,empDetails.password).then(doMatch=>{
//                              if(doMatch){  
//                                 // req.session.user_id =empDetails._id    
//                           return res.send({
//                             status: `SuccessFully Login ${empDetails.role_name}`,
//                                status_code: 200,
//                                message: `${empDetails.role_name}is loggedIn`,
//                                emp_id:empDetails.emp_id,
//                                name:empDetails.name,
//                                email: empDetails.email,
//                                role_name :empDetails.role_name,
//                                role_id:empDetails.role_id,
//                                designation:empDetails.designation,
                
//                                      })
//                                  }
//                          }).catch(err=>{
//                                   res.send({
//                                              status: "bad request",
//                                              status_code: 401,
//                                              message: "*Please Enter correct Email And Password",
//                                              error: err
//                                          })
//                          })
                      
//                              }
                             
//                      else{
//                           res.send({
//                                      status: "Not found",
//                                      status_code: 404,
//                                      message: "User details not found ",
//                                      error: ""
//                                  })
//                              }
                        
                          
                       
//                     }) 
//             }
try {
    // Get user input
    const { email, password } = req.body.data;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const users = await Users.findOne({ email });

    if (users && (await bcrypt.compare(password, users.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: users._id },
        process.env.JWT_KEY,
        {
          expiresIn: "2h",
        }
      );
 
      // save user token
      users.token = token;

      // user
      return res.send({
                status: `SuccessFully Login ${users.role_name}`,
                    status_code: 200,
                    message: `${users.role_name}is loggedIn`,
                    emp_id:users.emp_id,
                    name:users.name,
                    email: users.email,
                    role_name :users.role_name,
                    role_id:users.role_id,
                    designation:users.designation,
    
                            })
      
    }
    res.status(400).send("Invalid Credentials");
  } 

    catch (error) {
        res.send({
            status: "server  failed",
            status_code: 500,
            message: error.message,
            error: ""
        })
    }
});
router.post('/logOut',async function(req, res){
    try {
    const email = req.body.data.email;
    const password = req.body.data.password;
     console.log("hello",req.body.data.email +"  "+ req.body.data.password)
        Users.findOne({ email: email })
                .then(empDetails =>
                    {
                        if( empDetails )
                        {
                         bcrypt.compare(password,empDetails.password).then(doMatch=>{
                             if(doMatch){ 
                                req.session.user_id =null     
                          return res.send({
                            status: `SuccessFully Logout ${empDetails.role_name}`,
                               status_code: 200,
                               message: `${empDetails.role_name}is loggedOut`,
                            //    emp_id:empDetails.emp_id,
                            //    name:empDetails.name,
                            //    email: empDetails.email,
                            //    role_name :empDetails.role_name,
                            //    role_id:empDetails.role_id,
                            //    designation:empDetails.designation,
                
                                     })
                                 }
                         }).catch(err=>{
                                  res.send({
                                             status: "bad request",
                                             status_code: 401,
                                             message: "*Please Enter correct Email And Password",
                                             error: err
                                         })
                         })
                      
                             }
                     else{
                          res.send({
                                     status: "Not found",
                                     status_code: 404,
                                     message: "User details not found ",
                                     error: ""
                                 })
                             }
                        
                          
                       
                    }) 
            
   }
    catch (error) {
        res.send({
            status: "server  failed",
            status_code: 500,
            message: error.message,
            error: ""
        })
    }
});
router.post('/searchUser',async function(req,res){
    const emp_id = req.body.data.emp_id;
    const name = req.body.data.name;


    try {
        Users.findOne({  emp_id: emp_id  })
        // Users.findOne({  emp_id: emp_id  })

        // { $or: [ { emp_id: {emp_id } }, { name: name } ] }
      .then(empDetails =>
        {
            if(empDetails.emp_id===emp_id ){
              return res.send({
                             status: `SuccessFully Search ${empDetails.emp_id}`,
                             status_code: 200,
                             emp_id:empDetails.emp_id,
                             name:empDetails.name,
                             email: empDetails.email,
                             role_name :empDetails.role_name,
                             role_id:empDetails.role_id,
                             designation:empDetails.designation,  
                         })
                        }       
                    }).catch(err=>{
                        res.send({
                            status: "no emp found",
                            status_code: 404,
                            message: err.message
                        })
                    })    
    }
    catch(err){
        res.send({
            status: "server  failed",
            status_code: 500,
            message: err.message,
            error: ""
        })
    }
});
router.put('/updateUser',async function(req, res) {
    // console.log("rrrr",req.body.data)
    try {
        const data = req.body.data;
      const updateUserObj=  await Users.findOne({  emp_id:data.emp_id  })
    //   updateUserObj.name = data.role_id;
    console.log(data.name)
      updateUserObj.emp_id=data.emp_id,
      updateUserObj.name =  data.name;
      updateUserObj.email =  data.email;
      updateUserObj.designation = data.designation;
      updateUserObj.role_name =  data.role_name;
      updateUserObj.role_id = data.role_id;
      updateUserObj.password = await bcrypt.hash(data.password,10);

    // console.log(updateUserObj)

      const update_user_result = await updateUserObj.save();
      if (update_user_result) {
          return res.send({
              status: "success",
              status_code: 200,
              message: "update User saved successfully.",
              data: {  updateUserObj }   
          });  
      } 
      else{
        res.send({
            status: "no emp found",
            status_code: 404,
            message: err.message
        })
      }
     
      

    } catch (error) {
        res.send({
            status: "bad request",
            status_code: 400,
            message: error.message
        })
    }
});
router.delete('/deleteUser', async function(req, res) {
    // console.log("rrrr",req.body.data)
    try {
        const data = req.body.data;
        // console.log(data)
      const deleteUserObj=  await Users.findOne({  emp_id:data.emp_id  })
   //  console.log(deleteUserObj)
   if(deleteUserObj.email==="admin@gmail.com"){
    return res.send({
        status: "UnAuthorised",
        status_code: 401,
        message: "No access."   
    });  
   }else{
    const delete_user_result = await deleteUserObj.remove();
    if (delete_user_result) {
        return res.send({
            status: "success",
            status_code: 200,
            message: "deleted User successfully.",
            data: { deleteUserObj }   
        });  
    } 
    else{
      res.send({
          status: "no emp found",
          status_code: 404,
          message: err.message
      })
    }
   }
   
     
     
      

    } catch (error) {
        res.send({
            status: "bad request",
            status_code: 400,
            message: error.message
        })
    }
});


/**
 * @swagger
 * /userDetails:
 *   get:
 *     summary: Retrieve the list of all employees
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []  # Use Bearer Token for authentication
 *     responses:
 *       200:
 *         description: Successfully retrieved employee list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 status_code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Get Emp successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     emp_list_result:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request, unable to retrieve employee list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: bad request
 *                 status_code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Unable to emp list record
 *                 error:
 *                   type: string
 *                   example: ""
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - emp_id
 *         - name
 *         - email
 *         - role_name
 *       properties:
 *         emp_id:
 *           type: string
 *           description: Employee ID
 *         name:
 *           type: string
 *           description: Name of the employee
 *         email:
 *           type: string
 *           description: Email address of the employee
 *         role_name:
 *           type: string
 *           description: Role of the employee (e.g., "admin", "ba", "emp")
 *         role_id:
 *           type: string
 *           description: Role ID of the employee
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     EmpListResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         status_code:
 *           type: integer
 *           example: 200
 *         message:
 *           type: string
 *           example: Get Emp successfully.
 *         data:
 *           type: object
 *           properties:
 *             emp_list_result:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: bad request
 *         status_code:
 *           type: integer
 *           example: 400
 *         message:
 *           type: string
 *           example: Unable to emp list record
 *         error:
 *           type: string
 *           example: ""
 */

/**
 * @swagger
 * /userDetails:
 *   get:
 *     summary: Fetch the list of all employees
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Employee list fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmpListResponse'
 *       400:
 *         description: Error occurred when fetching employee list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.get('/userDetails', authenticateToken, async function(req, res) {
    try {
        const emp_list_result = await Users.find().sort({ $natural: -1 });
        if (emp_list_result) {
            return res.send({
                status: "success",
                status_code: 200,
                message: "Get Emp successfully.",
                data: { emp_list_result }
            });
        }
        throw new Error("Unable to emp list record");
    } catch (error) {
        res.send({
            status: "bad request",
            status_code: 400,
            message: error.message,
            error: ""
        });
    }
});

// router.get('/userDetails',authenticateToken, async function(req, res) {

//     try {
//          const emp_list_result = await Users.find().sort({$natural:-1})
//            if (emp_list_result) {
//             return res.send({
//                 status: "success",
//                 status_code: 200,
//                 message: "Get Emp successfully.",
//                 data: {  emp_list_result }        
//             });  
//         }
//         throw new Error("Unable to emp list record");
//     } catch (error) {
//         res.send({
//             status: "bad request",
//             status_code: 400,
//             message: error.message,
//             error: ""
//         })
//     }
// });
router.get('/baDetails', async function(req, res) {

    try {
         const ba_details= await Users.find({ role_id:2 }).sort({$natural:-1})
           if (ba_details) {
            return res.send({
                status: "success",
                status_code: 200,
                message: "Get ba details successfully.",
                data: {  ba_details }        
            });  
        }
        throw new Error("Unable to find ba list record");
    } catch (error) {
        res.send({
            status: "bad request",
            status_code: 400,
            message: error.message,
            error: ""
        })
    }
});

//swagger

/**
 * @swagger
 * /empDetails:
 *   get:
 *     summary: Retrieve employee details
 *     tags: [Employees]
 *     responses:
 *       200:
 *         description: Successfully retrieved employee details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 status_code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Get emp details successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     emp_details:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request, unable to retrieve employee details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: bad request
 *                 status_code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Unable to find emp list record
 *                 error:
 *                   type: string
 *                   example: ""
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - emp_id
 *         - name
 *         - email
 *         - role_name
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the user
 *         emp_id:
 *           type: string
 *           description: Employee ID
 *         name:
 *           type: string
 *           description: User's name
 *         email:
 *           type: string
 *           description: User's email address
 *         role_name:
 *           type: string
 *           description: Role of the user (e.g., "admin", "ba", "emp")
 *         role_id:
 *           type: string
 *           description: Role ID of the user
 */

/**
 * @swagger
 * /empDetails:
 *   get:
 *     summary: Fetch employee details based on role_id=3
 *     tags: [Employees]
 *     responses:
 *       200:
 *         description: Employee details fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmpDetailsResponse'
 *       400:
 *         description: Error occurred when fetching employee details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     EmpDetailsResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         status_code:
 *           type: integer
 *           example: 200
 *         message:
 *           type: string
 *           example: Get emp details successfully.
 *         data:
 *           type: object
 *           properties:
 *             emp_details:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: bad request
 *         status_code:
 *           type: integer
 *           example: 400
 *         message:
 *           type: string
 *           example: Unable to find emp list record
 *         error:
 *           type: string
 *           example: ""
 */

router.get('/empDetails', async function(req, res) {
    try {
        const emp_details = await Users.find({ role_id: 3 }).sort({ $natural: -1 });
        if (emp_details) {
            return res.send({
                status: "success",
                status_code: 200,
                message: "Get emp details successfully.",
                data: { emp_details }
            });
        }
        throw new Error("Unable to find emp list record");
    } catch (error) {
        res.send({
            status: "bad request",
            status_code: 400,
            message: error.message,
            error: ""
        });
    }
});

//end swagger//
// router.get('/empDetails', async function(req, res) {

//     try {
//          const emp_details= await Users.find({ role_id:3 }).sort({$natural:-1})
//            if (emp_details) {
//             return res.send({
//                 status: "success",
//                 status_code: 200,
//                 message: "Get emp details successfully.",
//                 data: {  emp_details }        
//             });  
//         }
//         throw new Error("Unable to find emp list record");
//     } catch (error) {
//         res.send({
//             status: "bad request",
//             status_code: 400,
//             message: error.message,
//             error: ""
//         })
//     }
// });
router.get('/adminDetails', async function(req, res) {

    try {
         const admin_details= await Users.find({ role_id:1 }).sort({$natural:-1})
           if (admin_details) {
            return res.send({
                status: "success",
                status_code: 200,
                message: "Get admin details successfully.",
                data: {  admin_details }        
            });  
        }
        throw new Error("Unable to find admin list record");
    } catch (error) {
        res.send({
            status: "bad request",
            status_code: 400,
            message: error.message,
            error: ""
        })
    }
});
// ////////////////////////createProject/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/createProject', async function(req, res) {
    //console.log("rrrr",req.body.data)
       try {
                const data = req.body.data;
            const newProjectObj = new Projects({
                    // id: new mongoose.Types.ObjectId(),
               project_Name:data.project_Name,
               project_Client_Email:data.project_Client_Email,
               project_Client_Name:data.project_Client_Name,
               project_Client_Location:data.project_Client_Location,
               project_Ba_Id:data.project_Ba_Id

           })
        // const baDetails=  await Users.findOne({ _id:data.project_Ba_Id  })
        //  let baObj= { 
        //  name:baDetails.name,
        //  email: baDetails.email,
        //  designation: baDetails.designation,
        //  role_name:  baDetails.role_name,
        //  role_id: baDetails.role_id
        //  }
           const new_project_result= await newProjectObj.save();
           if (new_project_result) {
               return res.send({
                   status: "success",
                   status_code: 200,
                   message: "new project saved successfully.",
                //    data: {  newProjectObj,baObj} 
                data: {  newProjectObj}   
               });  
           } 
           throw new Error("Unable to create new Project record");
   
       } catch (error) {
           res.send({
               status: "bad request",
               status_code: 400,
               message: error.message
           })
       }
   });
router.post('/searchProject',async function(req,res){
    const projectName = req.body.data.project_Name;
    //const name = req.body.data.name;
    // console.log(req.body.data.project_Name)
    try {
        Projects.findOne({  project_Name: projectName  })
      .then(projectDetails =>
        {
            if(projectDetails.project_Name===projectName ){
              return res.send({
                             status: `SuccessFully Search ${projectDetails.project_Name}`,
                             status_code: 200,
                             project_Name:projectDetails.project_Name,
                             project_Client_Name:projectDetails.project_Client_Name,
                             project_Client_Email: projectDetails.project_Client_Email,
                             project_Client_Location :projectDetails.project_Client_Location,
                             project_Ba_Id:projectDetails.project_Ba_Id
                            //  role_id:projectDetails.role_id
                         })
                        }       
                    }).catch(err=>{
                        res.send({
                            status: "no project found",
                            status_code: 404,
                            message: err.message
                        })
                    })    
    }
    catch(err){
        res.send({
            status: "server failed",
            status_code: 500,
            message: err.message,
            error: ""
        })
    }
});
router.put('/updateProject', async function(req, res) {
    console.log("rrrr",req.body.data)
    try {
        const data = req.body.data;
    const updateProjectObj=  await Projects.findOne({  project_Name:data.project_Name  })
    //   updateUserObj.name = data.role_id;
    //  console.log(updateProjectObj)
    updateProjectObj.project_Name = data.project_Name,
    updateProjectObj.project_Client_Name =data.project_Client_Name;
    updateProjectObj.project_Client_Email =  data.project_Client_Email;
    updateProjectObj.project_Client_Location = data.project_Client_Location;
    updateProjectObj.project_Ba_Id=data.project_Ba_Id

    // console.log(updateUserObj)
    const baDetails=  await Users.findOne({ _id:data.project_Ba_Id  })
    let baObj= { 
    name:baDetails.name,
    email: baDetails.email,
    designation: baDetails.designation,
    role_name:  baDetails.role_name,
    role_id: baDetails.role_id
    }
      const update_project_result = await updateProjectObj.save();
      if (update_project_result) {
          return res.send({
              status: "success",
              status_code: 200,
              message: "update project saved successfully.",
              data: {  updateProjectObj ,baObj}   
          });  
      } 
      else{
        res.send({
            status: "no emp found",
            status_code: 404,
            message: err.message
        })
      }
     
      

    } catch (error) {
        res.send({
            status: "bad request",
            status_code: 400,
            message: error.message
        })
    }
   });
router.delete('/deleteProject', async function(req, res) {
    // console.log("rrrr",req.body.data)
    try {
        const data = req.body.data;
         console.log(data.project_Name)
      const deleteProjectObj=  await Projects.findOne({  project_Name:data.project_Name  })

    const delete_user_result = await deleteProjectObj.remove();
    if (delete_user_result) {
        return res.send({
            status: "success",
            status_code: 200,
            message: "deleted Project successfully.",
            data: { deleteProjectObj }   
        });  
    } 
    else{
      res.send({
          status: "no emp found",
          status_code: 404,
          message: err.message
      })
    }


    } catch (error) {
        res.send({
            status: "bad request",
            status_code: 400,
            message: error.message
        })
    }
});
router.get('/getProject', async function(req, res) {

    try {
       let projectData= await  Projects.aggregate([
            {
              $lookup: {
                from: "users",
                localField: "project_Ba_Id",
                foreignField: "_id",
                as: "userOnproject"
              }
            }
          ])

        //  const project_list_result = await Projects.find().sort({$natural:-1})
           if (projectData) {
            return res.send({
                status: "success",
                status_code: 200,
                message: "Get project list result successfully.",
                data: {  projectData}        
            });  
        }
        throw new Error("Unable to project list result  record");
    } catch (error) {
        res.send({
            status: "bad request",
            status_code: 400,
            message: error.message,
            error: ""
        })
    }
});    
////////////////////////////assignTask//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post('/createTask', async function(req, res) {
    //console.log("rrrr",req.body.data)
       try {
                const data = req.body.data;
            const newTaskObj = new Tasks({
                    // id: new mongoose.Types.ObjectId(),
                    project_Id:data.project_Id,
                    user_Id:data.user_Id,
                    user_Email:data.user_Email,
                    task_comment:data.task_comment

           })
        const user_Details=  await Users.findOne({ _id:data.user_Id  })
        const Project_Details=  await Projects.findOne({ _id:data.project_Id  })

         let userDetailsObj= { 
         name:user_Details.name,
         email: user_Details.email,
         designation: user_Details.designation,
         role_name:  user_Details.role_name,
         role_id: user_Details.role_id
         }
         let ProjectDetailsObj= { 
            project_Name:Project_Details.project_Name,
            project_Client_Name: Project_Details.project_Client_Name,
            project_Client_Email: Project_Details.project_Client_Email,
            project_Client_Location:  Project_Details.project_Client_Location,
            }
         let create_Task={
            userDetailsObj,
            ProjectDetailsObj
         }
           const new_Task_result= await newTaskObj.save();
           if (new_Task_result) {
               return res.send({
                   status: "success",
                   status_code: 200,
                   message: "new Task saved successfully.",
                   data: { new_Task_result,create_Task}   
               });  
           } 
           throw new Error("Unable to create new Project record");
   
       } catch (error) {
           res.send({
               status: "bad request",
               status_code: 400,
               message: error.message
           })
       }
   });
router.get('/getTask', async function(req, res) {
    try {
        let task_list= await Tasks.aggregate([
            {
              $lookup: {
                from: "users",
                localField: "user_Id",
                foreignField: "_id",
                as: "user_task"
              }},
              {$unwind : "$user_task"},
              {
                $lookup: {
                  from: "projects",
                  localField: "project_Id",
                  foreignField: "_id",
                  as: "projects_task"
                }
              },
              {$unwind : "$projects_task"},
          ])
        //   let projects_details_task= await Tasks.aggregate([
        //     {
        //       $lookup: {
        //         from: "projects",
        //         localField: "project_Id",
        //         foreignField: "_id",
        //         as: "projects_task"
        //       }
        //     }
        //   ])

        // const task_list = await Tasks.find().sort({$natural:-1})
//         const user_details_task=  await Users.find().sort({$natural:-1})
//         const Project_Details=  await Projects.find().sort({$natural:-1})
// console.log("Project_Details",Project_Details);

           if (task_list) {
            return res.send({
                status: "success",
                status_code: 200,
                message: "Get task list result successfully.",
                data: {task_list }        
            });  
        }
        throw new Error("Unable to find task list result  record");
    } catch (error) {
        res.send({
            status: "bad request",
            status_code: 400,
            message: error.message,
            error: ""
        })
    }
});
router.delete('/deleteTask', async function(req, res) {
    // console.log("rrrr",req.body.data)
    try {
        const data = req.body.data;
         console.log(data.project_Name)
      const deleteTaskObj=  await Tasks.findOne({  user_Id:data.user_Id  })

    const delete_task_result = await deleteTaskObj.remove();
    if (delete_task_result) {
        return res.send({
            status: "success",
            status_code: 200,
            message: "deleted Task successfully.",
            data: { deleteTaskObj }   
        });  
    } 
    else{
      res.send({
          status: "no emp found",
          status_code: 404,
          message: err.message
      })
    }


    } catch (error) {
        res.send({
            status: "bad request",
            status_code: 400,
            message: error.message
        })
    }
});
////////////////////////////////////timesheet APIs//////////////////////////////////////////////////


// router.post('/findTimesheet',async function(req,res){
//     // const projectName = req.body.data.project_Name;
//     const project_Created = req.body.data.project_Created_at;
//             console.log(projectName)
//             console.log(project_Created)
   
// });

router.post('/createTimesheet', async function(req, res) {
    //console.log("rrrr",req.body.data)
       try {
            const data = req.body.data;
            const newTimesheetsObj = new Timesheets({
                    // id: new mongoose.Types.ObjectId(),
                    timesheet_Project_id:data.timesheet_Project_id,
                    timesheet_Task_Id:data.timesheet_Task_Id,
                    timesheet_startTime:data.timesheet_startTime,
                    timesheet_endTime:data.timesheet_endTime,
                    timesheet_totalTime:data.timesheet_totalTime,
                    timesheet_comment:data.timesheet_comment
           })
        // const user_Details=  await Users.findOne({ _id:data.user_Id  })
        // const Project_Details=  await Projects.findOne({ _id:data.project_Id  })

        //  let userDetailsObj= { 
        //  name:user_Details.name,
        //  email: user_Details.email,
        //  designation: user_Details.designation,
        //  role_name:  user_Details.role_name,
        //  role_id: user_Details.role_id
        //  }
        //  let ProjectDetailsObj= { 
        //     project_Name:Project_Details.project_Name,
        //     project_Client_Name: Project_Details.project_Client_Name,
        //     project_Client_Email: Project_Details.project_Client_Email,
        //     project_Client_Location:  Project_Details.project_Client_Location,
        //     }
        //  let create_Task={
        //     userDetailsObj,
        //     ProjectDetailsObj
        //  }
           const new_Timesheets_result= await newTimesheetsObj.save();
           if (new_Timesheets_result) {
               return res.send({
                   status: "success",
                   status_code: 200,
                   message: "new Timesheets result saved successfully.",
                   data: {new_Timesheets_result }   
               });  
           } 
           throw new Error("Unable to create new Timesheets result record");
   
       } catch (error) {
           res.send({
               status: "bad request",
               status_code: 400,
               message: error.message
           })
       }
   });

router.get('/getTimesheet', async function(req, res) {
    try {
        let timesheets_list= await Timesheets.aggregate([
            {
              $lookup: {
                from: "projects",
                localField: "timesheet_Project_id",
                foreignField: "_id",
                as: "timesheetsOnProject"
              }},
              {$unwind : "$timesheetsOnProject"},
              {
                $lookup: {
                  from: "tasks",
                  localField: "timesheet_Task_Id",
                  foreignField: "_id",
                  as: "timesheetsOnTask" 
                }
              },
              {$unwind : "$timesheetsOnTask"},
          ])
           if (timesheets_list) {
            return res.send({
                status: "success",
                status_code: 200,
                message: "Get timesheets list result successfully.",
                data: {timesheets_list }        
            });  
        }
        throw new Error("Unable to find timesheets list result  record");
    } catch (error) {
        res.send({
            status: "bad request",
            status_code: 400,
            message: error.message,
            error: ""
        })
    }
});
module.exports = router;
