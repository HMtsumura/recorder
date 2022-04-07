const express = require('express');
const router = express.Router();
const db = require('../models');

/* GET home page. */
router.get('/', async function(req, res, next) {
  contents = await db.sequelize.query(`select 
                                          co.id
                                        , co.comment
                                        , ca.category_name
                                        , t.title_name
                                        , t.color_code                              
                                        from  Contents AS co
                                        ,     Categories AS ca
                                        ,     Users AS u
                                        ,     Titles As t
                                        where co.category_id = ca.id
                                        and   co.user_id = u.id
                                        and   co.title_id = t.id;`);
  // const contents = await db.Content.findAll({
  //   where: {
  //     id: [1]
    // },
  // include: [{
  //   model: db.Category,
  //   required: false
  // }]
// });
  const categories = await db.sequelize.query('select * from Categories'); 
  Object.keys(contents).forEach(key =>{
    console.log(key);
    contents[key].forEach(content=>{
      console.log(content)
    });
  });

  res.render('index', { title: 'Record', contents: contents[0] });
});

module.exports = router;
