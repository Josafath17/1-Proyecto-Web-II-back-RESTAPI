const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const account = new Schema({
  firstName: { type: String },
  pin: { type: Number }, 
  age: { type: String },
  avatar: { type: String },



  user: {
    type: mongoose.ObjectId,
    ref: 'User'
  }






});

module.exports = mongoose.model('Account', account);