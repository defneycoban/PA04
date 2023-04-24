const express = require('express');
const router = express.Router();
const Transactions = require('../models/Transactions')
const User = require('../models/User')


isLoggedIn = (req,res,next) => {
  if (res.locals.loggedIn) {
    next()
  } else {
    res.redirect('/login')
  }
}

// Normalize the formatting of dates
function normalizeDate(date) {
   const year = date.getFullYear();
   const month = (date.getMonth() + 1).toString().padStart(2, "0");
   const day = date.getDate().toString().padStart(2, "0");
   return `${year}-${month}-${day}`;
 }

// router.get('/', isLoggedIn, async (req, res) => {
//   let items = await Transactions.find({ userId: req.user._id });

//   res.render('transactions', {
//       items: items,
//       locals: { normalizeDate: normalizeDate } // Pass the normalizeDate function to the view
//   });
// });

//Get all transcations
router.get('/transactions/', isLoggedIn, async (req, res, next) => {
        const sortColumn = req.query.sortBy || "date";
        let data;

    switch (sortColumn) {
        case "description":
            data = {
            description: 1,
            date: -1,
        };
        break;
        case "amount":
            data = {
            amount: 1,
            date: -1,
        };
        break;
        case "category":
            data = {
            category: 1,
            date: -1,
        };
        break;
        default:
            data = {
            date: -1,
            description: 1,
        };
        break;
    }

  let items = await Transactions.find({ userId: req.user._id })
    .sort(data)
    .collation({ locale: "en", strength: 2 });

    //console.log(items); // Log the items object
    res.render("transactions", { items, normalizeDate });
});

// Create a new transaction
router.post("/transactions", isLoggedIn, async (req, res, next) => {
        const t = new Transactions(
            {description: req.body.description,
            amount: req.body.amount,
            category: req.body.category,
            date: req.body.date,
            userId: req.user._id,
        });
        console.log(req.body);
        await t.save();
        res.redirect("/transactions");
});

//Delete a transaction
router.get('/transactions/delete/:itemID', isLoggedIn, async (req, res, next) => {
  await Transactions.deleteOne({_id:req.params.itemID});
  res.redirect('/transactions');
});

//Edit a transaction
router.get("/transactions/edit/:itemId", isLoggedIn, async (req, res, next) => {
    console.log("inside /transactions/edit/:itemId");
    const tr = await Transactions.findById(req.params.itemId);
    res.locals.item = tr;
    res.render("editTrans", { normalizeDate });
});

//Update a transaction
router.post("/transactions/updateTransaction", isLoggedIn, async (req, res, next) => {
    const { itemId, description, amount, category, date } = req.body;
    //console.log("inside /transactions/updateTransaction");
    await Transactions.findOneAndUpdate(
      { _id: itemId },
      { $set: { description, amount, category, date } }
    );
    res.redirect("/transactions");
  }
);

router.get('/transactions/groupByCategory', isLoggedIn, async (req, res, next) => {
    console.log("inside /transactions/groupByCategory")
    const userId = req.user._id
      let results =
            await Transactions.aggregate( //gonna have to change that later
                [ 
                  {$match:{
                    userId: userId}},
                  {$group:{
                    _id:'$category',
                    total:{$sum:1}
                    }},
                  {$sort:{total:-1}},              
                ])
        res.render('groupByCategory', {results})
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
