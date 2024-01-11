const userApi = require('../app/user/user.Controller') 
const productApi = require('../app/product/product.Controller') 
const auth = require('../Auth/auth')
var express = require('express');
var router = express.Router();
require('express-group-routes')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.group('/user',(user)=>{
  user.post('/sign-up',userApi.signUp)
  user.post('/sign-in',userApi.signIn)
  user.post('/changePassword',auth,userApi.changepassword)
  user.post('/addProduct',auth,productApi.addProduct)
  user.post('/searching',auth,productApi.searching)

})

module.exports = router;
