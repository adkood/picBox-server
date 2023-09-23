const express = require("express");

const CountController = require("../controllers/countController");
const router = express.Router();

router.get("/getCount", CountController.getCount);
router.post("/createCount", CountController.createDocument);
router.post("/increaseDownloadCount", CountController.increaseDownloadCount);
router.post(
  "/increaseTransactionCount",
  CountController.increaseTransactionCount
);
router.post("/increasePostCount", CountController.increasePostCount);
router.put(
  "/updateBiggestTransaction",
  CountController.updateBiggestTransaction
);

module.exports = router;
