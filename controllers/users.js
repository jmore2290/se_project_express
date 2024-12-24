const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Error = require("../utils/errors");
const { JWT_SECRET }= require("../utils/config");
const User = require("../models/user");
const BadRequestError = require("../errors/bad-request");
const ConflictError = require("../errors/conflict");
const ForbiddenError = require("../errors/forbidden");
const UnauthorizedError = require("../errors/unauthorized");
const NotFoundError = require("../errors/not-found");

const createUser = (req, res, next ) => {
  const { name, avatar, email, password } = req.body;
  console.log("does this get called");
  User.findOne({ email }).then((userExists) => {
    if (userExists) {
      const error = new ConflictError("Email already exists in database");
        return next(error);
      
    }

    return bcrypt.hash(password, 10).then((hash) => {
      User.create({ name, avatar, email, password: hash })
        .then((user) => {
          console.log("here95");
          const userData = user.toObject();
          delete userData.password;
          return res.status(201).send({ user: userData });
        })
        .catch((err) => {
          if (err.name === "ValidationError") {
            const error = new BadRequestError("The email and password fields are required");
            next(error);
          }
          console.log("here88");
          next(err);
          //return res
            //.status(Error.ERRORS.DEFAULT_ERROR)
            //.send({ message: "An error has occurred on the server" });
        });
    })
    .catch((err) =>{
      console.log("here67");
      next(err);
        //res
          // .status(Error.ERRORS.DEFAULT_ERROR)
           //.send({message: "An error has occured on the server"});
    });
  });
};



const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email);
  console.log(password);
  if (!email || !password) {
    const error = new BadRequestError("The email and password fields are required");
    next(error);
  }

   return User.findUserByCredentials(email, password)
    .then((user) => {
      // authentication successful! user is in the user variable
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      console.log(JWT_SECRET);
      res.send({token, user});
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        const error = new UnauthorizedError("Authorization Required");
         next(error);
      }
      console.log(err.message);
      //return res.status(Error.ERRORS.DEFAULT_ERROR).send({ message: err.message });
      next(err);
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
      next(err);
      //return res
        //.status(Error.ERRORS.DEFAULT_ERROR)
        //.send({ message: "An error has occurred on the server" });
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
      next(err);
      //return res
        //.status(Error.ERRORS.DEFAULT_ERROR)
        //.send({ message: "An error has occurred on the server" });
    });
};

module.exports = { createUser, getCurrentUser, loginUser, updateCurentUser };
