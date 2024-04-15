const express = require('express');
const app = express();
// database connection
const mongoose = require("mongoose");
const db = mongoose.connect("mongodb://127.0.0.1:27017/proyecto", {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const {
  accountPatch,
  accountPost,
  accountGet,
  accountDelete
} = require("./controllers/accountController.js");

const {
  playlistPatch,
  playlistPost,
  playlistGet,
  playlistDelete
} = require("./controllers/playlistController.js");

const {
  userPatch,
  userPost,
  userGet,
  userDelete
} = require("./controllers/userController.js");

const {
  videoPatch,
  videoPost,
  videoGet,
  videoDelete
} = require("./controllers/videoController.js");

// parser for the request body (required for the POST and PUT methods)
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// check for cors
const cors = require("cors");
app.use(cors({
  domains: '*',
  methods: "*"
}));


// listen to the task request
app.get("/api/accounts", accountGet);
app.post("/api/accounts", accountPost);
app.patch("/api/accounts", accountPatch);
app.put("/api/accounts", accountPatch);
app.delete("/api/accounts", accountDelete);

app.get("/api/playlists", playlistGet);
app.post("/api/playlists", playlistPost);
// app.patch("/api/playlists", playlistPatch);
// app.put("/api/playlists", playlistPatch);
app.delete("/api/playlists", playlistDelete);

app.get("/api/users", userGet);
app.post("/api/users", userPost);
app.patch("/api/users", userPatch);
app.put("/api/users", userPatch);
app.delete("/api/users", userDelete);

app.get("/api/videos", videoGet);
app.post("/api/videos", videoPost);
app.patch("/api/videos", videoPatch);
app.put("/api/videos", videoPatch);
app.delete("/api/videos", videoDelete);


app.listen(3000, () => console.log(`Example app listening on port 3000!`))
