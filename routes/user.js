// users.js

const express = require('express');
const router = express.Router();
const userHelpers = require('../helpers/user-helpers');

router.get('/', function(req, res, next) {
    // Fetching products logic
});

router.get('/login', (req, res) => {
    res.render('user/login');
});

router.get('/signup', (req, res) => {
    res.render('user/signup');
});

router.post('/signup', (req, res) => {
    // Extract user data from request body
    const userData = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };

    // Call helper function to signup user
    userHelpers.doSignup(userData)
        .then((response) => {
            console.log(response);
            res.redirect('/'); // Redirect to homepage or login page
        })
        .catch((err) => {
            console.error(err);
            res.render('user/signup'); // Render signup page with error handling
        });
});

module.exports = router;
