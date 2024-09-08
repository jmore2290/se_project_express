const router = require('express').Router();
const userRouter = require("./users");
const clothingItem = require('./clothingItems');
const Error = require("../utils/errors");
const {loginUser, createUser} = require("../controllers/users");
const auth = require('../middlewares/auth');

router.use("/users", userRouter);
router.use('/items', clothingItem);
router.use('/signin', loginUser);
router.use('/signup', createUser);

router.use((req, res) =>{
    res.status(Error.ERRORS.NOT_FOUND).send({message: 'Router not found'});
});



module.exports = router;