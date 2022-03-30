const express = require('express');
const router = express();
const User = require('../models/user');

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

// Create route
router.post('/', async (req, res)=>{
    try {
        // get request from body and use create method to add it to db
        const newUser = await User.create(req.body);
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