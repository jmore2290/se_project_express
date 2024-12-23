const router = require("express").Router();
const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");
const {validateIds, validateCardBody} = require("../middlewares/validation");

router.post("/", auth, validateCardBody, createItem);

router.get("/", getItems);

router.put("/:itemId/likes", auth, validateIds, likeItem);

router.delete("/:itemId/likes", auth, validateIds, dislikeItem);

router.delete("/:itemId", auth, validateIds,  deleteItem);

module.exports = router;
