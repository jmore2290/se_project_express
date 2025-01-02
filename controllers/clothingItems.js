const ClothingItem = require("../models/clothingItem");
const BadRequestError = require("../errors/bad-request");
const NotFoundError = require("../errors/not-found");
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
         return next(error);
      } 
      console.log(e.name);
      return next(e);
      
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => {
      res.status(200).send(items);
    })
    .catch((err) => {
        next(err);
    });
};

const deleteItem = (req, res, next) => {
  ClothingItem.findById(req.params.itemId)
    .then((item) => {
      if (!item) {
        const error = new NotFoundError("Item Not Found");
         return next(error);
      }
      if (String(item.owner) !== req.user._id) {
        const error = new ForbiddenError("Unauthorized Item deletion");
        return next(error);
      }
      return item
        .deleteOne()
        .then(() => res.send({ message: "Item deleted." }));
    })
    .catch((e) => {
      if (e.name === "CastError") {
        const error = new BadRequestError("Invalid Data");
         return next(error);
      }
      return next(e);
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
        return next(error);
      }
      if (e.name === "CastError") {
        const error = new BadRequestError("Invalid Data");
         return next(error);
      }
       return next(e);
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
         return next(error);
      }
      if (e.name === "CastError") {
        const error = new BadRequestError("Invalid Data");
         return next(error);
      }
      return next(e);
    });
};

module.exports = { createItem, getItems, deleteItem, likeItem, dislikeItem };
