const Playlist = require("../models/playlistModel");
const User = require("../models/userModel");

/**
 * Creates a playlist
 *
 * @param {*} req
 * @param {*} res
 */
const playlistPost = async (req, res) => {
  const playlist = new Playlist();
  playlist.user = req.body.user;

  const user = await User.findById(req.body.user);

  if (!!user) {
    await playlist.save()
      .then(data => {
        res.status(201); // CREATED
        res.header({
          'location': `/api/playlist/?id=${data.id}`
        });
        res.json(data);
      })
      .catch(err => {
        res.status(422);
        console.log('error while saving the playlists', err);
        res.json({
          error_code: 1233,
          error: 'There was an error saving the playlist'
        });
      });
  } else {
    res.status(422);
    console.log('error while saving the playlist')
    res.json({
      error: 'No valid data provided for playlist'
    });
  }
};

/**
 * Get all playlists
 *
 * @param {*} req
 * @param {*} res
 */

const playlistGet = (req, res) => {

  // if an specific playlist is required

  if (req.query && (req.query.id || req.query.userid)) {
    if (req.query.id) {

      Playlist.findById(req.query.id)


        .then(playlist => {
          res.status(200);
          res.json(playlist);
        })
        .catch(err => {
          res.status(404);
          res.json({ error: "playlist doesnt exist" })


        });
    }

    else if (req.query.userid) {
      Playlist.find()
        .then(playlists => {
          const playlist = playlists.filter(playlist => playlist.user == req.query.userid)
          res.json(playlist);
        })
        .catch(err => {
          res.status(422);
          res.json({ "error": err });
        });
    } else {
      res.status(422);
      res.json({ "error":"No se encontro el userid"});

    }

  } else {
    // get all playlists
    Playlist.find()
      .then(playlists => {
        res.json(playlists);
      })
      .catch(err => {
        res.status(422);
        res.json({ "error": err });
      });
  }
}

/**
 * Delete one playlist
 *
 * @param {*} req
 * @param {*} res
 */
const playlistDelete = (req, res) => {
  // if an specific playlist is required
  if (req.query && req.query.id) {
    Playlist.findById(req.query.id, function (err, playlist) {
      if (err || !playlist) {
        res.status(500);
        console.log('error while queryting the playlist', err)
        res.json({ error: "playlist doesnt exist" })
        return;
      }

      //if the playlist exists
      playlist.deleteOne(function (err) {
        if (err) {
          res.status(422);
          console.log('error while deleting the playlist', err)
          res.json({
            error: 'There was an error deleting the playlist'
          });
        }
        res.status(204); //No content
        res.json({});
      });
    });
  } else {
    res.status(404);
    res.json({ error: "playlist doesnt exist" })
  }
};

/* *
 * Updates a playlist
 *
 * @param {*} req
 * @param {*} res
 */
/* const playlistPatch = (req, res) => {
  // get playlist by id
  if (req.query && req.query.id) {
    Playlist.findById(req.query.id, function (err, playlist) {
      if (err || !playlist) {
        res.status(404);
        console.log('error while queryting the playlist', err)
        res.json({ error: "playlist doesnt exist" })
        return
      }

      // update the playlist object (patch)
      playlist.username = req.body.username ? req.body.username : playlist.username;
      playlist.pin = req.body.pin ? req.body.pin : playlist.pin;
      playlist.firstName = req.body.firstName ? req.body.firstName : playlist.firstName;
      playlist.lastName = req.body.lastName ? req.body.lastName : playlist.lastName;
      playlist.birth_date = req.body.birth_date ? req.body.birth_date : playlist.birth_date;


      // update the playlist object (put)
      // playlist.title = req.body.title
      // playlist.detail = req.body.detail

      playlist.save(function (err) {
        if (err) {
          res.status(422);
          console.log('error while saving the playlist', err)
          res.json({
            error: 'There was an error saving the playlist'
          });
        }
        res.status(200); // OK
        res.json(playlist);
      });
    });
  } else {
    res.status(404);
    res.json({ error: "playlist doesnt exist" })
  }
}; */

module.exports = {
  playlistGet,
  playlistPost,
  //playlistPatch,
  playlistDelete
}