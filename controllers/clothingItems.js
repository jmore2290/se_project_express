const ClothingItem = require("../models/clothingItem");
const Error = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  console.log(req.user._id);
  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((e) => {
      if (e.name === "ValidationError") {
        res.status(Error.ERRORS.INVALID_DATA).send({ message: "Invalid data" });
      } else {
        res
          .status(Error.ERRORS.DEFAULT_ERROR)
          .send({ message: "An error has occurred on the server" });
        console.log(e.name);
      }
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => {
      res.status(200).send(items);
    })
    .catch(() => {
      res
        .status(Error.ERRORS.DEFAULT_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const deleteItem = (req, res) => {
  ClothingItem.findById(req.params.itemId)
    .then((item) => {
      if (!item) {
        return res
          .status(Error.ERRORS.NOT_FOUND)
          .send({ message: "Item Not Found" });
      }
      if (String(item.owner) !== req.user._id) {
        return res
          .status(Error.ERRORS.FORBIDDEN_ERROR)
          .send({ message: "Unauthorized item deletion" });
      }
      return item
        .deleteOne()
        .then(() => res.send({ message: "Item deleted." }));
    })
    .catch((e) => {
      if (e.name === "CastError") {
        return res
          .status(Error.ERRORS.INVALID_DATA)
          .send({ message: "Invalid data" });
      }
      return res
        .status(Error.ERRORS.DEFAULT_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const likeItem = (req, res) => {
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
        return res
          .status(Error.ERRORS.NOT_FOUND)
          .send({ message: "Document not found" });
      }
      if (e.name === "CastError") {
        return res
          .status(Error.ERRORS.INVALID_DATA)
          .send({ message: "Invalid data" });
      }

      return res
        .status(Error.ERRORS.DEFAULT_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const dislikeItem = (req, res) => {
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
        return res
          .status(Error.ERRORS.NOT_FOUND)
          .send({ message: "Document not found" });
      }
      if (e.name === "CastError") {
        return res
          .status(Error.ERRORS.INVALID_DATA)
          .send({ message: "Invalid data" });
      }
      return res
        .status(Error.ERRORS.DEFAULT_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = { createItem, getItems, deleteItem, likeItem, dislikeItem };
