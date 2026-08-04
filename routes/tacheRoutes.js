const express = require("express");

const router = express.Router();

const {
    createTache,
    getTaches,
    updateTache,
    deleteTache

} = require("../controllers/tacheController");


const {protect}=require("../middleware/authMiddleware");



router.post(
    "/",
    protect,
    createTache
);


router.get(
    "/",
    protect,
    getTaches
);


router.put(
    "/:id",
    protect,
    updateTache
);


router.delete(
    "/:id",
    protect,
    deleteTache
);



module.exports = router;