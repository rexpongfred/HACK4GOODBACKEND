const express = require("express");
const router = express.Router();
// const path = require("path");

router.get("^/$|index(.html)?", (req, res) => {
    // res.sendFile(path.join(__dirname, "..", "views", "index.html"));
    fetch(
        `https://sync-testnet.vechain.org/transactions/0xe815175e54e37000ad79c73b111c3711d4987c8efeb8d2ef30876cbcdc758516/receipt`
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
