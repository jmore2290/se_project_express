const router = require('express').Router();
const userRouter = require("./users");
const clothingItem = require('./clothingItems');
const Error = require("../utils/errors");

router.use("/users", userRouter);
router.use('/items', clothingItem);

router.use((req, res) =>{
    res.status(Error.ERRORS.NOT_FOUND).send({message: 'Router not found'});
});



module.exports = router;