const express = require('express');
const router = express.Router();
const userHelpers = require('../helpers/user-helpers');
const productHelpers = require('../helpers/product-helpers')
const verifylogin=(req,res,next)=>{
    if(req.session.loggedIn){
        next()
    }
    else{
        res.redirect('/login')
    }
}
router.get('/', (req, res) => {
    let user=req.session.user
    productHelpers.getAllProducts().then((products) => {
      res.render('user/view-products', {products,user});
    }).catch((err) => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
  });

router.get('/login', (req, res) => {
    if(req.session.loggedIn){
        res.redirect('/')
    }
    else{
        res.render('user/login',{"loginErr":req.session.loginErr});
        req.session.loginErr=false;

    }
    
});

router.get('/signup', (req, res) => {
    res.render('user/signup');
});

router.post('/signup', (req, res) => {
   
    const userData = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };

    
    userHelpers.doSignup(userData)
        .then((response) => {
            console.log(response);           
            req.session.loggedIn=true
            req.session.user=response//bcz direct user obtained
            res.redirect('/'); 
        })
        .catch((err) => {
            console.error(err);
            res.render('user/signup');
        });
});

router.post('/login', (req, res) => {
    console.time('Login Request Time');
    userHelpers.doLogin(req.body)
        .then((response) => {
            console.timeEnd('Login Request Time');
            if (response.status) {
                console.log('Login successful, redirecting to /');
                req.session.loggedIn=true
                req.session.user=response.user
                res.redirect('/');

            } else {
                req.session.loginErr=true
                console.log('Login failed, redirecting to /login');
                res.redirect('/login',);
            }
        })
        .catch((err) => {
            console.error('Error logging in:', err);
            console.timeEnd('Login Request Time');
            res.redirect('/login');
        });
});
router.get('/logout',(req,res)=>{
    req.session.destroy()
    res.redirect('/')
})

router.get('/cart',verifylogin,async(req,res)=>{
    let products=await userHelpers.getcartproducts(req.session.user._id)
    console.log(products)
    res.render('user/cart')
})
router.get('/add-to-cart/:id',verifylogin,(req,res)=>{
    userHelpers.addtocart(req.params.id,req.session.user._id).then(()=>{
        res.redirect('/')
    })
})
module.exports = router;
