'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var toDoItemSchema = Schema( {
  item: String,
  amount: Number,
  category: String,
  date: Date,
  userId: {type:ObjectId, ref:'user' }
} );

module.exports = mongoose.model( 'Transactions', toDoItemSchema );
