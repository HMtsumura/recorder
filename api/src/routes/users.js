const express = require('express');
const router = express.Router();
const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const config = require("../config/jwt.config");
const verifyToken = require("../middlewares/verifyToken");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/signIn', async function(req, res) {
  const user_name = req.query.user_name;
  const password = req.query.password;
  const user = await db.User.findAll({where: {
    user_name: user_name,
  }});

  if(user.length !== 0){
    if(bcrypt.compareSync(password, user[0].password)){
      const payload = {
        userId: user[0].id,
        user_name: user[0].user_name
      };

      const token = jwt.sign(payload, config.jwt.secret, config.jwt.options);

      res.cookie("jwtToken", token, {
        //webサーバーのみがアクセス可能
        httpOnly: true,
        //cookieの有効期限は2日間に設定
        expires: new Date(Date.now()),
      }).json({
        isSuccess: true,
        token: token,
      });
    }else{
      res.status(404).json({
        isSucess: false,
        message: 'wrong password'
      });
    }
  }else{
    res.status(404).json({
      isSuccess: false,
      message: 'not found'
    });
  }
});
router.get('/signUp', async function(req, res, next) {
  const user_name = req.query.user_name;
  const password = req.query.password;
  const repassword = req.query.repassword;

  const hashPassword = await bcrypt.hash(password, 10);
  const user = await db.User.findAll({where: {
      user_name: user_name,
      password: hashPassword
  }});
  if(user.length !== 0){
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
    res.status(404).send({ERROR_MESSAGE: 'password unmatched'});
  }
});
module.exports = router;
