const express = require("express");
const router = express.Router();
const path = require("path");

router.get("^/$|index(.html)?", (req, res) => {
    // res.sendFile(path.join(__dirname, "..", "views", "index.html"));
    fetch(
        `https://sync-testnet.vechain.org/transactions/0x1632e04adf50ba96cd02c646d098405784674c1e8728243b0c88de2012b77b9f/receipt`
    )
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data);
            res.json(data);
        });
});

module.exports = router;
