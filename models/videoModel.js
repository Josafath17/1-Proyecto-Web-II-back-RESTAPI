const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const video = new Schema({
  name: { type: String },
  url: { type: String },
  description: { type: String },
  playlist: {
    type: mongoose.ObjectId,
    ref: "Playlist",
  },
});

module.exports = mongoose.model("Video", video);
