const express = require('express');
const router = express.Router();
const db = require('../models');

/* GET home page. */
router.get('/', async function(req, res, next) {
  const contents = await db.Content.findAll();
  res.render('index', { title: 'Record', contents });
});

module.exports = router;
