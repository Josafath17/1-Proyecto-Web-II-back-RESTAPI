const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//Se agrego la lista de playlist
const account = new Schema({
  firstName: { type: String },
  pin: { type: Number },
  age: { type: String },
  avatar: { type: String },
  playlists: [],
  user: {
    type: mongoose.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Account", account);
