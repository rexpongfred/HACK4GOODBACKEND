const User = require("../model/User");

const getContractsofaddress = async (req, res) => {
    const user = await User.findOne({ username: req.user }).exec();
    if (!user) return res.status(204).json({ message: "No users found" });
    // const subset = (({owned, editor}) => )
    if (!req?.params?.address)
        return res.status(400).json({ message: "Wallet Address required" });
    const wallet = user.wallets.findOne({ address: req.body.address }).exec();
    res.json(wallet);
};

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
};
