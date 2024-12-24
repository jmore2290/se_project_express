const ClothingItem = require("../models/clothingItem");
const Error = require("../utils/errors");
const BadRequestError = require("../errors/bad-request");
const NotFoundError = require("../errors/not-found");
const UnauthorizedError = require("../errors/unauthorized");
const ForbiddenError = require("../errors/forbidden");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  console.log(req.user._id);
  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((e) => {
      if (e.name === "ValidationError") {
        const error = new BadRequestError("The email and password fields are required");
         next(error);
      } else {
        //res
          //.status(Error.ERRORS.DEFAULT_ERROR)
          //.send({ message: "An error has occurred on the server" });
        console.log(e.name);
        next(e);
      }
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => {
      res.status(200).send(items);
    })
    .catch((err) => {
      //res
       // .status(Error.ERRORS.DEFAULT_ERROR)
        //.send({ message: "An error has occurred on the server" });
        next(err);
    });
};

const deleteItem = (req, res, next) => {
  ClothingItem.findById(req.params.itemId)
    .then((item) => {
      if (!item) {
        const error = new NotFoundError("Item Not Found");
         next(error);
        //return res
          //.status(Error.ERRORS.NOT_FOUND)
          //.send({ message: "Item Not Found" });
      }
      if (String(item.owner) !== req.user._id) {
        const error = new ForbiddenError("Unauthorized Item deletion");
        next(error);
        //return res
          //.status(Error.ERRORS.FORBIDDEN_ERROR)
          //.send({ message: "Unauthorized item deletion" });
      }
      return item
        .deleteOne()
        .then(() => res.send({ message: "Item deleted." }));
    })
    .catch((e) => {
      if (e.name === "CastError") {
        const error = new BadRequestError("Invalid Data");
         next(error);
        //return res
          //.status(Error.ERRORS.INVALID_DATA)
          //.send({ message: "Invalid data" });
      }
      next(e);
      //return res
        //.status(Error.ERRORS.DEFAULT_ERROR)
        //.send({ message: "An error has occurred on the server" });
    });
};

const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        const error = new NotFoundError("Document Not Found");
         next(error);
        //return res
          //.status(Error.ERRORS.NOT_FOUND)
          //.send({ message: "Document not found" });
      }
      if (e.name === "CastError") {
        const error = new BadRequestError("Invalid Data");
         next(error);
        //return res
          //.status(Error.ERRORS.INVALID_DATA)
          //.send({ message: "Invalid data" });
      }
       next(e);
      //return res
        //.status(Error.ERRORS.DEFAULT_ERROR)
        //.send({ message: "An error has occurred on the server" });
    });
};

const dislikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        const error = new NotFoundError("Document Not Found");
         next(error);
        //return res
          //.status(Error.ERRORS.NOT_FOUND)
          //.send({ message: "Document not found" });
      }
      if (e.name === "CastError") {
        const error = new BadRequestError("Invalid Data");
         next(error);
        //return res
          //.status(Error.ERRORS.INVALID_DATA)
          //.send({ message: "Invalid data" });
      }
      next(e);
      //return res
        //.status(Error.ERRORS.DEFAULT_ERROR)
        //.send({ message: "An error has occurred on the server" });
    });
};

module.exports = { createItem, getItems, deleteItem, likeItem, dislikeItem };
