const express = require('express');
const router = express.Router();
const db = require('../models');

/* GET home page. */
router.get('/', async function(req, res, next) {
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

  const categories = await db.sequelize.query(`select 
                                                ca.id
                                              , ca.category_name
                                              from  Categories  AS  ca
                                              where ca.user_id  = '1'`);
  console.log(categories);
  res.send([contents[0], categories[0]]);
});

router.get('/categorized', async function(req, res, next) {
  const category_id = req.query.id;
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
                                        and   co.category_id = ca.id
                                        and   co.category_id = '${category_id}';`);

  const categories = await db.sequelize.query(`select 
                                                ca.id
                                              , ca.category_name
                                              from  Categories  AS  ca
                                              where ca.user_id  = '1'`);
  console.log(contents);
  res.send([contents[0], categories[0]]);
});

module.exports = router;
