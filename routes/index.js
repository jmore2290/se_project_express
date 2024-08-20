const router = require('express').Router();
const userRouter = require("./users.js");
const clothingItem = require('./clothingItems.js');

router.use("/users", userRouter);
router.use('/items', clothingItem);

router.use((req, res) =>{
    res.status(500).send({message: 'Router not found'});
});



module.exports = router;