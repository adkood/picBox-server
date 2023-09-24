const express = require('express');
const router = express.Router();
const demand = require("../controllers/demandController");

router.get("/getAllDemands",demand.getAllDemands);
router.get("/getResolved",demand.getResolvedDemands);
router.get("/getUnresolved",demand.getUnresolvedDemands);
router.post("/createDemand",demand.createDemand);
router.patch("/updateDemand",demand.updateDemand);

module.exports = router;