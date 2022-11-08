const express = require('express');
const { sequelize } = require('../models');
const router = express.Router();
const db = require('../models');
const verifyToken = require("../middlewares/verifyToken");

/* GET home page. */
router.post('/', verifyToken, async function(req, res, next) {
  const userId = req.decoded['userId'];
  const contents = await db.sequelize.query(`select 
                                              co.id
                                            , co.title
                                            , co.color_code
                                            , co.comment
                                            , co.record_ymd
                                            , u.user_name
                                            , ca.category_name
                                            , ca.id AS category_id
                                        from  Contents AS co
                                        ,     Users AS u
                                        ,     Categories ca
                                        where co.user_id = u.id
                                        and   co.category_id = ca.id
                                        and   co.user_id = '${userId}';`);

  const categories = await db.sequelize.query(`select 
                                                ca.id AS value
                                              , ca.category_name as label
                                              from  Categories  AS  ca
                                              where ca.user_id  = '${userId}';`);
  res.send([contents[0], categories[0]]);
});

router.post('/categorized', verifyToken, async function(req, res, next) {
  const category_id = req.body.params.id;
  const user_id = req.decoded['userId'];
  const contents = await db.sequelize.query(`select 
                                              co.id
                                            , co.title
                                            , co.color_code
                                            , co.comment
                                            , co.record_ymd
                                            , u.user_name
                                            , ca.category_name
                                            , ca.id AS category_id
                                        from  Contents AS co
                                        ,     Users AS u
                                        ,     Categories ca
                                        where co.user_id = u.id
                                        and   co.category_id = ca.id
                                        and   co.category_id = '${category_id}'
                                        and   co.user_id = '${user_id}';`);

  const categories = await db.sequelize.query(`select 
                                                ca.id AS value
                                              , ca.category_name  AS label
                                              from  Categories  AS  ca
                                              where ca.user_id  = '${user_id}';`);
  res.send([contents[0], categories[0]]);
});

router.post('/contentById', verifyToken, async function(req, res, next) {
  const content_id = req.body.params.content_id;
  const contents = await db.sequelize.query(`select 
                                              co.id
                                            , co.title
                                            , co.color_code
                                            , co.comment
                                            , co.record_ymd
                                            , u.user_name
                                            , ca.category_name AS label
                                            , ca.id AS value
                                        from  Contents AS co
                                        ,     Users AS u
                                        ,     Categories ca
                                        where co.user_id = u.id
                                        and   co.category_id = ca.id
                                        and   co.id = '${content_id}';`);
  res.send([contents[0]]);
});

router.post('/regist', verifyToken, async function(req, res, next) {
  
  const user_id = req.decoded['userId'];
  const title = req.body.params.title;
  const comment = req.body.params.comment;
  const category_id = req.body.params.category_id;
  const record_ymd =  req.body.params.record_ymd;
  const color_code = req.body.params.color_code;
  const today = new Date();
  const createdAt = [
    today.getFullYear(),
    ('0' + (today.getMonth() + 1)).slice(-2),
    ('0' + today.getDate()).slice(-2)
  ].join('');
  
  try{
    const registContent = await db.sequelize.query(`INSERT INTO Contents(user_id, category_id, title, color_code, comment, record_ymd, createdAt, updatedAt)VALUES(${user_id}, ${category_id}, '${title}', '#${color_code}', '${comment}', '${record_ymd}', '${createdAt}', '${createdAt}');`,{type: sequelize.QueryTypes.INSERT});
    res.send([registContent[0]]);
  }catch(e){
    console.error(e);
  }
});

router.post('/edit', verifyToken, async function(req, res, next) {
  const content_id = req.body.params.content_id;
  const title = req.body.params.title;
  const comment = req.body.params.comment;
  const category_id = req.body.params.category_id;
  const record_ymd =  req.body.params.record_ymd;
  const color_code = req.body.params.color_code;
  const today = new Date();
  const updatedAt = [
    today.getFullYear(),
    ('0' + (today.getMonth() + 1)).slice(-2),
    ('0' + today.getDate()).slice(-2)
  ].join('');;
  try{
    const editContent = await db.sequelize.query(`
                                UPDATE Contents 
                                SET category_id = ${category_id},
                                    title = '${title}',
                                    color_code  = '#${color_code}',
                                    comment = '${comment}',
                                    record_ymd  = '${record_ymd}',
                                    updatedAt = '${updatedAt}'
                                WHERE id  = ${content_id};`,{type: sequelize.QueryTypes.UPDATE});
    res.send([editContent[0]]);
  }catch(e){
    console.error(e);
  }
});

router.post('/delete', verifyToken, async function(req, res, next) {
  const content_id = req.body.params.content_id;
  try{
    const deleteContent = await db.sequelize.query(`
                                DELETE  FROM Contents
                                WHERE id  = ${content_id};`,
                                {type: sequelize.QueryTypes.DELETE});
    
    res.send('DELETED');
  }catch(e){
    console.error(e);
  }
});
module.exports = router;
