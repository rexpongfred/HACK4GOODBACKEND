const express = require("express");
const router = express.Router();
const walletsController = require("../../controllers/walletsController");

router.route("/").post(walletsController.addWalletAddress);

router
    .route("/wallet/:walletaddress")
    .get(walletsController.getContractsofaddress)
    .post(walletsController.addContracttoaddress);

module.exports = router;
