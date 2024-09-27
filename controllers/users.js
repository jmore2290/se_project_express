const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Error = require("../utils/errors");
const JWT_SECRET = require("../utils/config");
const User = require("../models/user");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  User.findOne({ email }).then((userExists) => {
    if (userExists) {
      return res
        .status(Error.ERRORS.CONFLICT_ERROR)
        .send({ message: "Email already exists in database" });
    }

    return bcrypt.hash(password, 10).then((hash) => {
      User.create({ name, avatar, email, password: hash })
        .then((user) => {
          const userData = user.toObject();
          delete userData.password;
          return res.status(201).send({ user: userData });
        })
        .catch((err) => {
          if (err.name === "ValidationError") {
            return res
              .status(Error.ERRORS.INVALID_DATA)
              .send({ message: err.message });
          }
          return res
            .status(Error.ERRORS.DEFAULT_ERROR)
            .send({ message: "An error has occurred on the server" });
        });
    });
  });
};

const loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(Error.ERRORS.INVALID_DATA)
      .send({ message: "The email and passowrd fields are required" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // authentication successful! user is in the user variable
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        res
          .status(Error.ERRORS.UNAUTHORIZED)
          .send({ message: "Authorization Required" });
      }

      res.status(Error.ERRORS.DEFAULT_ERROR).send({ message: err.message });
    });
};

const getCurrentUser = (req, res) => {
  const id = req.user._id;
  console.log(id);
  User.findById(id)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(Error.ERRORS.NOT_FOUND)
          .send({ message: "Document Not Found" });
      }
      return res
        .status(Error.ERRORS.DEFAULT_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const updateCurentUser = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  })
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(Error.ERRORS.INVALID_DATA)
          .send({ message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(Error.ERRORS.NOT_FOUND)
          .send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res
          .status(Error.ERRORS.INVALID_DATA)
          .send({ message: err.message });
      }

      return res
        .status(Error.ERRORS.DEFAULT_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = { createUser, getCurrentUser, loginUser, updateCurentUser };
