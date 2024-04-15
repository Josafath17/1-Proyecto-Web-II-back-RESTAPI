const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playlist = new Schema({
  
  user: {
    type: mongoose.ObjectId,
    ref: 'User'
  },
 
});

module.exports = mongoose.model('Playlist', playlist);