require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("./models/userModel");

const express = require("express");
const app = express();

// database connection
const mongoose = require("mongoose");
const db = mongoose.connect("mongodb://127.0.0.1:27017/proyecto2", {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

transporter
  .verify()
  .then(() => {
    console.log("Ready for send emails");
  })
  .catch((err) => {
    console.log({ Error: err });
  });

const theSecretKey = process.env.JWT_SECRET;

const {
  addplaylsit,
  deletedplaylist,
  accountPatch,
  accountPost,
  accountGet,
  accountDelete,
} = require("./controllers/accountController.js");

const {
  playlistPatch,
  playlistPost,
  playlistGet,
  playlistDelete,
} = require("./controllers/playlistController.js");

const {
  confirmuser,
  userPatch,
  userPost,
  userGet,
  userDelete,
} = require("./controllers/userController.js");

const {
  videoPatch,
  videoPost,
  videoGet,
  videoDelete,
} = require("./controllers/videoController.js");

// parser for the request body (required for the POST and PUT methods)
const bodyParser = require("body-parser");

app.use(bodyParser.json());

// check for cors
const cors = require("cors");
app.use(
  cors({
    domains: "*",
    methods: "*",
  })
);

app.patch("/api/usersconfirm", confirmuser);

app.post("/api/users", (req, res) => {
  userPost(req, res)
    .then(async (response) => {
      if (response) {
        const mailoptions = {
          from: "TubeKids Pro",
          to: response.username,
          subject: "Confirm Account",
          text: "Confirm Account!",
          html: `
          <div style="display: flex; justify-content: center; padding-top: 1rem;">
            <a
              href="http://localhost:3000/ConfirmAccount/${response.id}"
              style="background-color: #00BFA6; color: #fff; padding: 14px 40px; border-radius: 10px; border: 2px dashed #00BFA6; cursor: pointer; text-transform: uppercase; font-size: 1.2rem; transition: .4s; box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;"
              onmouseover="this.style.backgroundColor='#fff'; this.style.color='#00BFA6';  this.style.transition='.4s'; this.style.border='2px dashed #00BFA6';"
              onmouseout="this.style.backgroundColor='#00BFA6'; this.style.color='#fff'; this.style.transition='.4s'; this.style.border='2px dashed #00BFA6';"
            >
            Confirm Account
            </a>
          </div>
        `,
        };
        await transporter.sendMail(mailoptions, (error, info) => {
          if (error) {
            console.log(error);
          }
          console.log(info)
        });
        console.log("exito?");
      }
    })
    .catch((error) => {
      console.error("Hubo un error en la operación de usuario:", error);
    });
});

// login with JWT
app.post("/api/session", function (req, res) {
  User.find({ state: "confirm" })
    .then(async (users) => {
      const user = users.filter(
        (user) =>
          user.username === req.body.username &&
          user.password === req.body.password
      );
      if (!user) {
        res.status(422);
        res.json({ error: "Invalid username or password" });
        return;
      }
      const data = user[0];
      const token = jwt.sign(
        {
          id: data._id,
          name: data.name,
          permission: ["create", "edit", "delete"],
          pin: data.pin,
          lastName: data.lastName,
        },
        theSecretKey
      );

      res.status(201);
      res.json(token);
    })
    .catch((err) => {
      res.status(500);
      res.json({ "Internal server error": err });
    });
});

// JWT Authentication middleware
app.use(function (req, res, next) {
  if (req.headers["authorization"]) {
    const authToken = req.headers["authorization"].split(" ")[1];
    try {
      jwt.verify(authToken, theSecretKey, (err, decodedToken) => {
        if (err || !decodedToken) {
          res.status(401);
          res.send({
            error: "Unauthorized",
          });
          return;
        }
        next();
      });
    } catch (e) {
      console.error("There was an error", e);
      res
        .send({
          error: "Unauthorized ",
        })
        .status(401);
    }
  } else {
    res.status(401);
    res.send({
      error: "Unauthorized ",
    });
  }
});

// listen to the task request
app.post("/api/accountsplaylists", addplaylsit);
app.delete("/api/accountsplaylists", deletedplaylist);
app.get("/api/accounts", accountGet);
app.post("/api/accounts", accountPost);
app.patch("/api/accounts", accountPatch);
app.put("/api/accounts", accountPatch);
app.delete("/api/accounts", accountDelete);

app.get("/api/playlists", playlistGet);
app.post("/api/playlists", playlistPost);
app.patch("/api/playlists", playlistPatch);
app.put("/api/playlists", playlistPatch);
app.delete("/api/playlists", playlistDelete);

app.get("/api/users", userGet);
app.patch("/api/users", userPatch);
app.put("/api/users", userPatch);
app.delete("/api/users", userDelete);

app.get("/api/videos", videoGet);
app.post("/api/videos", videoPost);
app.patch("/api/videos", videoPatch);
app.put("/api/videos", videoPatch);
app.delete("/api/videos", videoDelete);

app.listen(3000, () => console.log(`Example app listening on port 3000!`));
