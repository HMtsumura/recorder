const express = require('express');
const { sequelize } = require('../models');
const router = express.Router();
const db = require('../models');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/regist', async function(req, res, next) {
    const user_id = req.query.user_id;
    const category_name = req.query.category_name;
    const today = new Date();
    const createdAt = [
      today.getFullYear(),
      ('0' + (today.getMonth() + 1)).slice(-2),
      ('0' + today.getDate()).slice(-2)
    ].join('');
    try{
        const registCategory = await db.sequelize.query(`INSERT INTO Categories(
                                                            user_id, 
                                                            category_name,
                                                            createdAt, 
                                                            updatedAt)
                                                        VALUES(
                                                            ${user_id}, 
                                                            '${category_name}', 
                                                            '${createdAt}', 
                                                            '${createdAt}');`
                                                        ,{type: sequelize.QueryTypes.INSERT}
                                                    );
        const selectCategories = await db.sequelize.query(`SELECT
                                                            ca.id AS value
                                                        ,   ca.category_name as label
                                                         FROM
                                                            Categories AS ca
                                                         WHERE
                                                            user_id = ${user_id};`
                                                        ,{type: sequelize.QueryTypes.SELECT}
                                                    );           
      // console.log(registCategory);
      // console.log(selectCategories);
      res.send([selectCategories, registCategory]);
    }catch(e){
      console.error(e);
    }
  });

module.exports = router;
