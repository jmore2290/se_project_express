const ClothingItem = require("../models/clothingItem.js");
const Error = require("../utils/errors.js");

const createItem = (req, res) =>{

    const {name, weather, imageUrl} = req.body;
    console.log(req.user._id);
    ClothingItem.create({name, weather, imageUrl, owner: req.user._id})
    .then((item) =>{
        res.status(200).send({data: item});
    }).catch((e) =>{
        if (e.name === "ValidationError") {
            res
              .status(Error.ERRORS.INVALID_DATA)
              .send({ message: "Validation Error" });
        }
        else if (e.name === "TypeError"){
            res
            .status(Error.ERRORS.INVALID_DATA)
            .send({ message: e.message });
        }
        else{
          res.status(Error.ERRORS.DEFAULT_ERROR).send({message: 'Error from createItem', e});
          console.log(e.name);
    }
    });
}

const getItems = (req, res) =>{

    ClothingItem.find({}).then((items) => {
        res.status(200).send(items);
    }).catch((e) =>{
        res.status(Error.ERRORS.DEFAULT_ERROR).send({message: "Error from getItems", e})
    })
}

const updateItem = (req, res) =>{
    const {itemId} = req.params;
    const {imageURL} = req.body;

    ClothingItem.findByIdAndUpdate(itemId, {$set: {imageUrl}}).orFail().then((item) => {
        res.status(200).send({data: item});
    }).catch((e) =>{
        res.status(Error.ERRORS.DEFAULT_ERROR).send({message: "Error from updateItem", e})
    })
}

const deleteItem = (req, res) =>{
    const {itemId} = req.params;

    ClothingItem.findByIdAndDelete(itemId).orFail().then((item) => {
        res.status(200).send({});
    }).catch((e) =>{
        if (e.name === "DocumentNotFoundError") {
            return res.status(Error.ERRORS.NOT_FOUND).send({ message: "Document not found" });
          }
          if (e.name === "CastError") {
            return res.status(Error.ERRORS.INVALID_DATA).send({message: "Invalid data"})
          }
        res.status(Error.ERRORS.DEFAULT_ERROR).send({message: "Error from deleteItem", e})
    })
}

const likeItem = (req, res) =>  {
    ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true },
  ).orFail().then((item) => {
    res.status(200).send({data: item});
}).catch((e) =>{
    if (e.name === "DocumentNotFoundError") {
        res
          .status(Error.ERRORS.NOT_FOUND)
          .send({ message: "Validation Error" });
    }
    else if (e.name ==="CastError"){
        res
          .status(Error.ERRORS.INVALID_DATA)
          .send({ message: "Cast Error" });
    }
    else{
        res.status(Error.ERRORS.DEFAULT_ERROR).send({message: "Error from likeItem", e})
    }
   
})
}

 const  dislikeItem = (req, res) => {
     ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true },
  ).orFail().then((item) => {
    res.status(200).send({});
}).catch((e) =>{
    if (e.name === "DocumentNotFoundError") {
        return res.status(Error.ERRORS.NOT_FOUND).send({ message: "Document not found" });
      }
      if (e.name === "CastError") {
        return res.status(Error.ERRORS.INVALID_DATA).send({message: "Invalid data"})
      }
    res.status(Error.ERRORS.DEFAULT_ERROR).send({message: "Error from dislikeItem", e})
})
}

module.exports = {createItem, getItems, updateItem, deleteItem, likeItem, dislikeItem};