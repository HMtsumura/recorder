var express = require('express');
var router = express.Router();

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
      const registCategory = await db.sequelize.query(`INSERT INTO Contents(
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
      console.log(registCategory);
      res.send([registContent[0]]);
    }catch(e){
      console.error(e);
    }
    res.send('respond with a resource');
  });

module.exports = router;
