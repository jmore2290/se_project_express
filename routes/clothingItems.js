const router = require('express').Router();
const {createItem, getItems, updateItem, deleteItem, likeItem, dislikeItem} = require('../controllers/clothingItems');



router.post('/', createItem);

router.get('/', getItems);

router.put('/:itemId', updateItem);

router.put('/:itemId/likes', likeItem)

router.delete('/:itemId/likes', dislikeItem)

router.delete('/:itemId', deleteItem);




module.exports = router;