const mongoose = require('mongoose');
const validator = require("validator");
const User = require("./user");

const clothingItem = mongoose.Schema({
    name: {
       type: String, 
       required: true,
       minlength: 2, 
       maxlength: 30
    }, 
    weather: {
       type: String,
       required: true, 
       enum: ["hot", "warm", "cold"],
    },
    imageUrl: {
        type: String,
       required: true,
       validate: {
        validator(value) {
            return validator.isURL(value);
        },
        message: "Link is not valid",
    },
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    likes:{
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
        default: [],
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("clothingItem", clothingItem);