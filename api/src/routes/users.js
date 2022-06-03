const express = require('express');
const router = express.Router();
const db = require('../models');
const bcrypt = require('bcrypt');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/signIn', async function(req, res, next) {
  const user_name = req.query.user_name;
  const password = req.query.password;
  const user = await db.User.findAll({where: {
    user_name: user_name,
  }});
  console.log(user[0].id);  
if(user.length !== 0){
    if(bcrypt.compareSync(password, user[0].password)){
      res.send([user[0].id]);  
    }else{
      res.send(['wrong password']);
    }
  }else{
    res.send(['not found']);
  }
});
router.get('/signUp', async function(req, res, next) {
  const user_name = req.query.user_name;
  const password = req.query.password;
  const repassword = req.query.repassword;
  console.log(user_name,password);
  // const password = req.body.password;
  const hashPassword = await bcrypt.hash(password, 10);
  const user = await db.User.findAll({where: {
      user_name: user_name,
      password: hashPassword
  }});
  if(user.length !== 0){
    // res.render("signup", {
    //     title: "Sign up",
    //     errorMessage: ["このユーザ名は既に使われています"],
    // });
    res.send('already existed');
  }else if(password === repassword){
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = db.User.build({
        user_name: user_name,
        password: hashPassword
      });
      await newUser.save();
      console.log(newUser.id);
      // req.session.userid = newUser.id;
      res.send([newUser.id]);
  } else {
    res.send('password unmatched');
    // res.render("signup", {
    //   title: "Sign up",
    //   errorMessage: ["パスワードが一致しません"],
    // });
  }
});
module.exports = router;
