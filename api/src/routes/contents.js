const express = require('express');
const { sequelize } = require('../models');
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

router.get('/regist', async function(req, res, next) {
  const user_id = req.query.user_id;
  const title = req.query.title;
  const comment = req.query.comment;
  const category_id = req.query.category_id;
  const record_ymd =  req.query.record_ymd;
  const color_code = req.query.color_code;
  const today = new Date();
  const createdAt = [
    today.getFullYear(),
    ('0' + (today.getMonth() + 1)).slice(-2),
    ('0' + today.getDate()).slice(-2)
  ].join('');;
  try{
    const registContent = await db.sequelize.query(`INSERT INTO Contents(user_id, category_id, title, color_code, comment, record_ymd, createdAt, updatedAt)VALUES(${user_id}, ${category_id}, '${title}', '#${color_code}', '${comment}', '${record_ymd}', '${createdAt}', '${createdAt}');`,{type: sequelize.QueryTypes.INSERT});
    console.log(registContent);
    res.send([registContent[0]]);
  }catch(e){
    console.error(e);
  }
});

router.get('/edit', async function(req, res, next) {
  const content_id = req.query.content_id;
  const title = req.query.title;
  const comment = req.query.comment;
  const category_id = req.query.category_id;
  const record_ymd =  req.query.record_ymd;
  const color_code = req.query.color_code;
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
    console.log(editContent);
    res.send([editContent[0]]);
  }catch(e){
    console.error(e);
  }
});
module.exports = router;
