const User = require("../model/User");

// use the contract passed in the parameter and the username to find the contracts own by the wallet
const getContractsofaddress = async (req, res) => {
    const user = await User.findOne({ username: req.user }).exec();
    if (!user) return res.status(204).json({ message: "No users found" });
    // const subset = (({owned, editor}) => )
    if (!req?.params?.address)
        return res.status(400).json({ message: "Wallet Address required" });
    const foundwallet = user.wallets.find(
        (wallet) => wallet.address == req.params.address
    );
    res.json(foundwallet);
};

// find the user of the account and the model for it and add the wallet address to the account
const addWalletAddress = async (req, res) => {
    if (!req?.body?.address)
        return res.status(400).json({ message: "contract address required" });
    const user = await User.findOne({ username: req.user }).exec();
    if (!user) {
        return res.status(204).json({ message: `User not found` });
    }
    console.log(req.body.address);
    user.wallets.push({ address: req.body.address });
    const updated = await user.save();
    res.json(updated);
};

module.exports = {
    getContractsofaddress,
    addWalletAddress,
    // addContracttoaddress,
};
