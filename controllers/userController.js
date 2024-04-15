const User = require("../models/userModel");


/**
 * Creates a user
 *
 * @param {*} req
 * @param {*} res
 */
const userPost = async (req, res) => {
  const user = new User();



  user.username = req.body.username;
  user.password = req.body.password;
  user.pin = req.body.pin;
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.country = req.body.country;
  user.birth_date = req.body.birth_date;

  
  if (user.username && user.password && user.pin && user.country && user.birth_date && user.firstName && user.lastName) {

    //validar Email /username
    const validEmail = async (email) => {
      const validEmail = await User.findOne({ username: email });
      if (validEmail) {
        return { valid: false, error: "Invalid email" };
      }

      const emailFormat = /^\S+@\S+\.\S+$/;
      if (!emailFormat.test(email)) {
        return { valid: false, error: "Invalid email format" };
      }

      return { valid: true };
    };

    const validationResult = await validEmail(user.username);
    if (!validationResult.valid) {
      res.json({ error: validationResult.error });
      return;
    }

    // Valida la edad del usuario
    const today = new Date();
    const birthdate = new Date(user.birth_date);
    
    const operador =

      today.getMonth() < birthdate.getMonth() ||
      (today.getMonth() === birthdate.getMonth() &&
        today.getDate() < birthdate.getDate());
    const age =
      18 <=
      today.getFullYear() - birthdate.getFullYear() - (operador ? 1 : 0);
    if (!age) {

      res.status(422);
      res.json({ error: "Users must be over 18 years old." });
      return;
    }
    



    await user.save()
      .then(data => {
        res.status(201); // CREATED
        res.header({
          'location': `/api/users/?id=${data.id}`
        
        });
       
        res.json(data);
      })
      .catch(err => {
        res.status(422);
        console.log('error while saving the user', err);
        res.json({
          error_code: 1233,
          error: 'There was an error saving the user'
        });
      });
  } else {
    res.status(422);
    console.log('error while saving the user')
    res.json({
      error: 'No valid data provided for user'
    });
  }
};

/**
 * Get all Users
 *
 * @param {*} req
 * @param {*} res
 */
const userGet = (req, res) => {
  // if an specific user is required
  if (req.query && req.query.id) {
    User.findById(req.query.id)
      .then(user => {
        res.status(200);
        res.json(user);
      })
      .catch(err => {
        res.status(404);
        res.json({ error: "user doesnt exist" })
      });

  } else {

    User.find()
      .then(users => {
        res.json(users);
      })
      .catch(err => {
        res.status(422);
        res.json({ "error": err });
      });
  }
};

/**
 * Delete one user
 *
 * @param {*} req
 * @param {*} res
 */
const userDelete = (req, res) => {
  // if an specific user is required
  if (req.query && req.query.id) {
    User.findById(req.query.id, function (err, user) {
      if (err || !user) {
        res.status(500);
        console.log('error while queryting the user', err)
        res.json({ error: "user doesnt exist" })
        return;
      }
      user.deleteOne(function (err) {
        if (err) {
          res.status(422);
          console.log('error while deleting the User', err)
          res.json({
            error: 'There was an error deleting the User'
          });
        }
        res.status(204); //No content
        res.json({});
      });
    });
  } else {
    res.status(404);
    res.json({ error: "User doesnt exist" })
  }
};
/**
 * Updates a user
 *
 * @param {*} req
 * @param {*} res
 */
const userPatch = (req, res) => {
  // get user by id
  if (req.query && req.query.id) {
    User.findById(req.query.id, function (err, user) {
      if (err || !user) {
        res.status(404);
        console.log('error while queryting the user', err)
        res.json({ error: "user doesnt exist" })
        return;
      }

      // update the user object (patch)
      user.username = req.body.username ? req.body.username : user.username;
      user.password = req.body.password ? req.body.password : user.password;
      user.pin = req.body.pin ? req.body.pin : user.pin;
      user.firstName = req.body.firstName ? req.body.firstName : user.firstName;
      user.lastName = req.body.lastName ? req.body.lastName : user.lastName;
      user.country = req.body.country ? req.body.country : user.country;
      user.birth_date = req.body.birth_date ? req.body.birth_date : user.birth_date;



      // update the user object (put)
      // user.title = req.body.title
      // user.detail = req.body.detail

      user.save(function (err) {
        if (err) {
          res.status(422);
          console.log('error while saving the user', err)
          res.json({
            error: 'There was an error saving the user'
          });
        }
        res.status(200); // OK
        res.json(user);
      });
    });
  } else {
    res.status(404);
    res.json({ error: "user doesnt exist" })
  }
};

module.exports = {
  userGet,
  userPost,
  userPatch,
  userDelete
}