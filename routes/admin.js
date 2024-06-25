var express = require('express');
var router = express.Router();
var productHelper = require('../helpers/product-helpers');
const productHelpers = require('../helpers/product-helpers');
var objectId = require('mongodb')
/* GET users listing. */
router.get('/', function(req, res) {
  productHelpers.getAllProducts().then((products)=>{
    console.log(products);
    res.render('admin/view-products', { admin:true , products});
  })
});
router.get('/add-product',function(req,res){
  res.render('admin/add-product')
})
router.post('/add-product',(req,res)=>{
  productHelpers.addProduct(req.body,(id)=>{
    let image=req.files.image
    image.mv('./public/product-images/'+id+'.jpg',(err,done)=>{
          if(!err){
            res.render('admin/add-product')
          }
          else{
            console.log(err)
          }
      })
    res.render("admin/add-product")
  })
})
router.get('/delete-product/:id',(req,res)=>{
  let prodId=req.params.id
  console.log(prodId)
  productHelpers.deleteProduct(prodId).then((response)=>{
    res.redirect('/admin/')
  })
})

router.get('/edit-product/:id',async(req,res)=>{
  let product=productHelpers.getProductDetails(req.params.id)
  console.log(product)
  res.render('admin/edit-product',{product})
})
module.exports = router;
