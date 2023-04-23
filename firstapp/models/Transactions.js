const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transactions');

// Get all transactions
router.get('/transactions', async function(req, res, next) {
  try {
    const transactions = await Transaction.find({});
    res.render('transactions', { transactions });
  } catch (err) {
    next(err);
  }
});

// Create a new transaction
router.post('/transactions', async function(req, res, next) {
  try {
    const newTransaction = new Transaction(req.body);
    await newTransaction.save();
    res.redirect('/transactions');
  } catch (err) {
    next(err);
  }
});

// Delete a transaction
router.delete('/transactions/:id', async function(req, res, next) {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.redirect('/transactions');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
