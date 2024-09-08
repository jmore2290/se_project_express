const router = require('express').Router();
const {createItem, getItems, deleteItem, likeItem, dislikeItem} = require('../controllers/clothingItems');
const auth = require('../middlewares/auth');



router.post('/', auth, createItem);

router.get('/', getItems);

router.put('/:itemId/likes', auth,  likeItem)

router.delete('/:itemId/likes', auth, dislikeItem)

router.delete("/:itemId", auth,  deleteItem);




module.exports = router;