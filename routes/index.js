const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  if (!req.session.userid) return res.render('index', {valid: false});
  res.render('index', {valid: true});
});

module.exports = router;
