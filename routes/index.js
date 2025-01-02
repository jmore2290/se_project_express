const router = require("express").Router();
const userRouter = require("./users");
const NotFoundError = require("../errors/not-found");
const clothingItem = require("./clothingItems");
const {validateLogin, validateUserInfo} = require("../middlewares/validation");

const { loginUser, createUser } = require("../controllers/users");

router.use("/users", userRouter);
router.use("/items", clothingItem);
router.use("/signin",validateLogin, loginUser);
router.use("/signup",validateUserInfo, createUser);

router.use((req, res, next) => {
  next(new NotFoundError("Router not found"));
});

module.exports = router;
