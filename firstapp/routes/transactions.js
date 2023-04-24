const express = require('express');
const router = express.Router();
const ToDoItem = require('../models/Transactions')
const User = require('../models/User')


isLoggedIn = (req,res,next) => {
  if (res.locals.loggedIn) {
    next()
  } else {
    res.redirect('/login')
  }
}

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

router.get('/transactions/delete/:itemID', isLoggedIn, async (req, res, next) => {
  await Transaction.deleteOne({_id:req.params.itemID});
  res.redirect('/transactions');
});


// Delete a transaction
// router.delete('/transactions/:id', isLoggedIn, async (req, res, next) => {
//   try {
//     const transactionId = req.params.id;
//     const deletedTransaction = await Transaction.findByIdAndDelete(transactionId);
//     res.send(deletedTransaction);
//     console.log(`Transaction with ID ${transactionId} has been deleted.`);
//     res.redirect('/transactions');
//   } catch (error) {
//     console.log(error);
//     res.status(500).send('Internal Server Error');
//   }
//   console.log("Received DELETE request for transaction with ID:", transactionId);
// });

module.exports = router;
