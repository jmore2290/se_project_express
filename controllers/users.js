const User = require("../models/user");
const Error = require("../utils/errors");

const getUsers = (req, res) => {
    User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
        console.error(err)
        return res.status(Error.ERRORS.DEFAULT_ERROR).send({message: err.message})
    });
} 

const createUser = (req, res) =>{
    const { name, avatar } = req.body;
  
    User.create({name, avatar})
    .then((user) => res.status(201).send(user))
    .catch((err) => {
        console.error(err)
        if (err.name === "ValidationError"){
            return res.status(Error.ERRORS.INVALID_DATA).send({message: err.message})
        }
        return res.status(Error.ERRORS.DEFAULT_ERROR).send({message: err.message})
    });
}

const getUser = (req, res) =>{
   const {userId} = req.params;

   User.findById(userId)
   .orFail()
   .then((user) => res.status(200).send(user))
    .catch((err) => {
        console.error(err)
        if (err.name === "DocumentNotFoundError"){
            return res.status(Error.ERRORS.NOT_FOUND).send({message: err.message});
        } 
        if (err.name === "CastError"){
            return res.status(Error.ERRORS.INVALID_DATA).send({message: err.message});
        }
           
      return res.status(Error.ERRORS.DEFAULT_ERROR).send({message: err.message});

    });

}

module.exports = {getUsers, createUser, getUser};