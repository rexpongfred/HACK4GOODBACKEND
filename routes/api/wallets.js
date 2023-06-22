const express = require("express");
const router = express.Router();
const walletsController = require("../../controllers/walletsController");

router.route("/").post(walletsController.addWalletAddress);

router
    .route("/contracts/:address")
    .get(walletsController.getContractsofaddress);

router.route("/addcontract").post(walletsController.addContracttoaddress);

// router.route("/editor").post(walletsController.addEditor);

module.exports = router;
