const Video = require("../models/videoModel");
const Playlist = require("../models/playlistModel");

/**
 * Creates a video
 *
 * @param {*} req
 * @param {*} res
 */
/* function verificadorURL(url) {
  const urls =
    /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  return urls.test(url);
}

const validadorurl= verificadorURL(req.body.url);
 */
/*   if(!validadorurl){
    res.status(400);
    res.json({error: "Invalid video URL"});
    return;
  } */

const videoPost = async (req, res) => {
  var video = new Video();

  video.name = req.body.name;
  video.url = req.body.url;
  video.description = req.body.description;
  video.playlist = req.body.playlist;
  const playlist = await Playlist.findById(req.body.playlist);

  if (video.name && video.url && !!playlist) {
    video.save(function (err) {
      if (err) {
        res.status(422);
        console.log("error while saving the video", err);
        res.json({
          error: "There was an error saving the video",
        });
      }
      res.status(201); //CREATED
      res.header({
        location: `http://localhost:3000/api/videos/?id=${video.id}`,
      });
      res.json(video);
    });
  } else {
    res.status(422);
    console.log("error while saving the video");
    res.json({
      error: "No valid data provided for video",
    });
  }
};

/**
 * Get all accounts
 *
 * @param {*} req
 * @param {*} res
 */

const videoGet = (req, res) => {
  if (req.query) {
    if (req.query.id) {
      Video.findById(req.query.id)

        .then((video) => {
          res.status(200);
          res.json(video);
        })
        .catch((err) => {
          res.status(404);
          res.json({ error: "video doesnt exist" });
          console.log("error while queryting the video", err);
        });
    } else if (req.query.playlistid) {
      Video.find({ playlist: req.query.playlistid })
        .then((videos) => {
          res.json(videos);
        })
        .catch((err) => {
          res.status(422);
          res.json({ error: err });
        });
    } else {
      res.status(422);
      res.json({ "No se encontro el playlistid": err });
    }

    // if an specific video is required
  } else {
    // get all videos
    Video.find(function (err, videos) {
      if (err) {
        res.status(422);
        res.json({ error: err });
      }
      res.json(videos);
    });
  }
};

/**
 * Delete one video
 *
 * @param {*} req
 * @param {*} res
 */
const videoDelete = (req, res) => {
  // if an specific video is required
  if (req.query && req.query.id) {
    Video.findById(req.query.id, function (err, video) {
      if (err) {
        res.status(500);
        console.log("error while queryting the video", err);
        res.json({ error: "video doesnt exist" });
      }
      //if the video exists
      if (video) {
        video.remove(function (err) {
          if (err) {
            res
              .status(500)
              .json({ message: "There was an error deleting the video" });
          }
          res.status(204).json({});
        });
      } else {
        res.status(404);
        console.log("error while queryting the video", err);
        res.json({ error: "video doesnt exist" });
      }
    });
  } else {
    res.status(404).json({ error: "You must provide a video ID" });
  }
};

/**
 * Updates a video
 *
 * @param {*} req
 * @param {*} res
 */
const videoPatch = (req, res) => {
  // get video by id
  if (req.query && req.query.id) {
    Video.findById(req.query.id, function (err, video) {
      if (err) {
        res.status(404);
        console.log("error while queryting the video", err);
        res.json({ error: "video doesnt exist" });
      }

      // update the video object (patch)
      video.name = req.body.name ? req.body.name : video.name;
      video.url = req.body.url ? req.body.url : video.url;
      video.description = req.body.description
        ? req.body.description
        : video.description;
      // update the video object (put)
      // video.title = req.body.title
      // video.detail = req.body.detail

      video.save(function (err) {
        if (err) {
          res.status(422);
          console.log("error while saving the video", err);
          res.json({
            error: "There was an error saving the video",
          });
        }
        res.status(200); // OK
        res.json(video);
      });
    });
  } else {
    res.status(404);
    res.json({ error: "video doesnt exist" });
  }
};

module.exports = {
  videoGet,
  videoPost,
  videoPatch,
  videoDelete,
};
