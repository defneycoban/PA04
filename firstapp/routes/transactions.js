const express = require('express');
const router = express.Router();

router.get('/transactions', function(req, res, next) {
  res.render('transactions');
});

module.exports = router;
