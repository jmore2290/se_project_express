const router = require("express").Router();
const { getCurrentUser, updateCurentUser } = require("../controllers/users");
const auth = require("../middlewares/auth");
const {validateUpdateUser} = require("../middlewares/validation");

/*
router.get("/", getUsers);
router.get("/:userId", getUser);
router.post("/", createUser);
*/
router.get("/me", auth, getCurrentUser);
//router.patch("/me", auth, updateCurentUser);
router.patch("/me", auth, validateUpdateUser, updateCurentUser);

module.exports = router;
