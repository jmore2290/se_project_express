const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET }= require("../utils/config");
const User = require("../models/user");
const BadRequestError = require("../errors/bad-request");
const ConflictError = require("../errors/conflict");
const UnauthorizedError = require("../errors/unauthorized");
const NotFoundError = require("../errors/not-found");

const createUser = (req, res, next ) => {
  const { name, avatar, email, password } = req.body;
  User.findOne({ email }).then((userExists) => {
    if (userExists) {
      const error = new ConflictError("Email already exists in database");
        return next(error);
      
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
            const error = new BadRequestError("The email and password fields are required");
            return next(error);
          }
          return next(err);
        });
    })
    .catch((err) =>{
      next(err);
    });
  });
};



const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    const error = new BadRequestError("The email and password fields are required");
    return next(error);
  }

   return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({token});
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        const error = new UnauthorizedError("Authorization Required");
         return next(error);
      }
      return next(err);
    });
    
};



const getCurrentUser = (req, res, next) => {
  const id = req.user._id;
  console.log(id);
  User.findById(id)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        const error = new NotFoundError("Authorization Required");
        return next(error);
      }
      return next(err);
    });
};

const updateCurentUser = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, req.body, {
    new: true, 
    runValidators: true,
  })
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        const error = new BadRequestError("The email and password fields are required");
        return next(error);
      }
      if (err.name === "DocumentNotFoundError") {
        const error = new NotFoundError("Authorization Required");
        return next(error);
      }
      if (err.name === "CastError") {
        const error = new BadRequestError(err.message);
        return next(error);
      }
      return next(err);
    });
};

module.exports = { createUser, getCurrentUser, loginUser, updateCurentUser };
