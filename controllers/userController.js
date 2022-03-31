const express = require('express');
const router = express();
const User = require('../models/user');
const bcrypt = require('bcryptjs');

//// Don't need to create routes that will be forms

// Index route
router.get('/', async (req,res)=>{
    try{
        // the data we will send will come from the Schema database
        const users = await User.find();
        // if we are able to access this route, send a good status and show the data
        res.send ({
            status: 200,
            data: users
        })
    } catch (err) {
        // if we are unable to access this route, show a 500 error and data equal to the error that occurs
        res.send ({
            status: 500,
            data: err.message
        });
    };
});

// login route
router.post("/login", async (req, res)=>{
    try{
        // Grab the user from the database with the username from the form
        res.send ({
            status: 500,
            data: 'before possible user'
        });
        const possibleUser = await User.findOne({username: req.body.username})
        res.send ({
            status: 500,
            data: 'right after first thing'
        });
        if(possibleUser){
            // There is a user with this username!
            // Compare the password from the form with the database password
            if(bcrypt.compareSync(req.body.password, possibleUser.password)){
                res.send ({
                    status: 500,
                    data: 'after compare sync'
                });
                // It's a match! Successful login!
                req.session.isLoggedIn = true;
                console.log(req.session.userId);
                req.session.userId = possibleUser._id;
                res.send ({
                    status: 500,
                    data: 'after req.session.userId'
                });
                // redirect to home page
                res.redirect("/")
            }else{
                res.redirect("/users/login")
            }
            res.send({
                status: 200,
                data: newUser
            });
        }else{
            res.send ({
                status: 500,
                data: 'not a possible user'
            });
        }
    }catch(err){
        console.log(err);
        res.send ({
            status: 500,
            data: 'in catch'
        });
    }
})

// Create route
router.post('/', async (req, res)=>{
    try {
        const hashedPassword = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
        console.log(hashedPassword);
        req.body.password = hashedPassword;
        // get request from body and use create method to add it to db
        const newUser = await User.create(req.body);
        console.log(newUser);
        // send back JSON response
        res.send({
            status: 200,
            data: newUser
        });
    } catch (err) {
        res.send({
            status: 500,
            data: err.message
        });
    };
});

// Show route
router.get('/:id', async (req, res)=>{
    try {
        // find the item that was clicked on
        const user = await User.findById(req.params.id);
        // Check if the item exists in the first place
        if (!user) {
            throw new Error('No item by that id here');
        };
        res.send({
            status: 200,
            data: user
        });
    } catch (err) {
        res.send({
            status: 500,
            data: err.message
        });
    };
});

// Update/PUT route
router.put('/:id', async (req, res)=>{
    try {
        // find the item that was clicked on
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.send({
            status: 200,
            data: user
        });
    } catch (err) {
        res.send({
            status: 500,
            data: err.message
        });
    };
});

// Delete route
router.delete('/:id', async (req, res)=>{
    try {
        // find the item that was clicked on
        const user = await User.findByIdAndDelete(req.params.id);
        res.send({
            status: 200,
            data: user
        });
    } catch (err) {
        res.send({
            status: 500,
            data: err
        });
    };
});

module.exports = router;