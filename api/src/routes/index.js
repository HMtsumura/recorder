const express = require('express');
const router = express.Router();
const db = require('../models');
const verifyToken = require("../middlewares/verifyToken");

/* GET home page. */
router.post('/', verifyToken, async function(req, res, next) {
  const contents = await db.sequelize.query(`select 
                                              co.id
                                            , co.title
                                            , co.color_code
                                            , co.comment
                                            , co.record_ymd
                                            , u.user_name
                                            , ca.category_name
                                        from  Contents AS co
                                        ,     Users AS u
                                        ,     Categories ca
                                        where co.user_id = u.id
                                        and   co.category_id = ca.id;`);

  const categories = await db.sequelize.query('select * from Categories');
  // console.log(categories);
  Object.keys(contents).forEach(key =>{
    // console.log(key);
    contents[key].forEach(content=>{
      console.log(contents[0]);
    });
  });

  res.render('index', { title: 'Record', contents: contents[0] });
});

module.exports = router;
