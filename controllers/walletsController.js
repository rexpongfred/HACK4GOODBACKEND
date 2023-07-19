const Contract = require("../model/Contract");
const User = require("../model/User");
const axios = require("axios");

const getAllWallet = async (req, res) => {
    const user = await User.findOne({ username: req.user }).exec();
    if (!user) return res.status(204).json({ message: "No users found" });
    res.json(user.wallets);
};

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
        return res.status(400).json({ message: "wallet address required" });
    const user = await User.findOne({ username: req.user }).exec();
    if (!user) {
        return res.status(204).json({ message: `User not found` });
    }
    console.log(req.body.address);
    user.wallets.push({ address: req.body.address });
    const updated = await user.save();
    res.json(updated);
};

// find the user of the account and the model for it then find the wallet then add the contract to the wallet
const addContracttoaddress = async (req, res) => {
    if (!req?.body?.walletaddress)
        return res.status(400).json({ message: "wallet address required" });
    const user = await User.findOne({ username: req.user }).exec();
    if (!user) {
        return res.status(204).json({ message: `User not found` });
    }
    const index = user.wallets.findIndex(
        (wallet) => wallet.address == req.body.walletaddress
    );
    if (index == -1)
        return res.status(400).json({ messgae: "invalid wallet address" });
    if (!req?.body?.contractaddress)
        return res.status(400).json({ message: "contract address required" });
    user.wallets[index].owned.push(req.body.contractaddress);
    const updated = await user.save();
    // ContractDB
    try {
        const result = await Contract.create({
            contractAddress: req.body.contractaddress,
            owner: {
                username: req.user,
                walletAddress: req.body.walletaddress,
            },
            addedUsers: [],
        });

        console.log(result);
        res.json(updated);
        //res.status(201).json({ success: "New contract Created " });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// find the user of the account and the model for it then find the wallet then add the contract to the wallet
const addEditor = async (req, res) => {
    if (!req?.body?.editor)
        return res.status(400).json({ message: "username required" });
    if (!req?.body?.walletaddress)
        return res.status(400).json({ message: "wallet address required" });
    const user = await User.findOne({ username: req.body.editor }).exec();
    if (!user) {
        return res.status(204).json({ message: `User not found` });
    }
    const index = user.wallets.findIndex(
        (wallet) => wallet.address == req.body.walletaddress
    );
    if (index == -1)
        return res.status(400).json({ messgae: "invalid wallet address" });
    if (!req?.body?.contractaddress)
        return res.status(400).json({ message: "contract address required" });
    user.wallets[index].editor.push(req.body.contractaddress);
    const updated = await user.save();
    // ContractDB
    try {
        const foundContract = await Contract.findOne({
            contractAddress: req.body.contractaddress,
        });
        if (!foundContract) {
            return res.status(204).json({ message: `Contract not found` });
        }
        founduser = foundContract.addedUsers.find(
            (user) => user.username === req.body.editor
        );
        if (founduser) {
            return res.status(400).json({ message: "user already exist" });
        }
        foundContract.addedUsers.push({
            username: req.body.editor,
            walletAddress: req.body.walletaddress,
        });
        const updated = await foundContract.save();
        console.log(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    res.json(updated);
};

const getContractAddress = async (req, res) => {
    if (!req?.params?.txid)
        return res.status(400).json({ message: "txid required" });
    try {
        const resp = await axios.get(
            `https://sync-testnet.vechain.org/transactions/${req.params.txid}/receipt`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        console.log(resp.data.outputs[0].contractAddress);
        res.json(resp.data.outputs[0].contractAddress);
    } catch (err) {
        console.log(err);
    }
};

const gettxJson = async (req, res) => {
    if (!req?.params?.txid)
        return res.status(400).json({ message: "txid required" });
    try {
        const resp = await axios.get(
            `https://sync-testnet.vechain.org/transactions/${req.params.txid}/receipt`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        console.log(resp.data);
        res.json(resp.data);
    } catch (err) {
        console.log(err);
    }
};

const getTransactions = async (req, res) => {
    if (!req?.params?.walletaddress)
        return res.status(400).json({ message: "wallet address required" });
    try {
        const resp = await axios.get(
            `https://explore-testnet.vechain.org/api/accounts/${req.params.walletaddress}/transactions`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        console.log(resp.data);
        res.json(resp.data);
    } catch (err) {
        console.log(err);
    }
};

const getContractUsers = async (req, res) => {
    if (!req?.params?.contractaddress)
        return res.status(400).json({ message: "contract address required" });
    try {
        const foundContract = await Contract.findOne({
            contractAddress: req.params.contractaddress,
        });
        const userarray = [foundContract.owner, ...foundContract.addedUsers];
        console.log(foundContract);
        res.json(userarray);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// const addContractDB = async (req, res) => {
//     if (!req?.body?.contractaddress)
//         return res.status(400).json({ message: "contract address required" });
//     if (!req?.body?.walletaddress)
//         return res.status(400).json({ message: "wallet address required" });
//     try {
//         const result = await Contract.create({
//             contractAddress: req.body.contractaddress,
//             owner: {
//                 username: req.user,
//                 walletAddress: req.body.walletaddress,
//             },
//             addedUsers: [],
//         });

//         console.log(result);
//         //res.status(201).json({ success: "New contract Created " });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// const AddUserContractDB = async (req, res) => {
//     if (!req?.body?.contractaddress)
//         return res.status(400).json({ message: "contract address required" });
//     if (!req?.body?.walletaddress)
//         return res.status(400).json({ message: "wallet address required" });
//     if (!req?.body?.username)
//         return res.status(400).json({ message: "username required" });
//     try {
//         const foundContract = await Contract.findOne({
//             contractAddress: req.body.contractaddress,
//         });
//         if (!foundContract) {
//             return res.status(204).json({ message: `Contract not found` });
//         }
//         founduser = foundContract.addedUsers.find(
//             (user) => user.username === req.body.username
//         );
//         if (founduser) {
//             return res.status(400).json({ message: "user already exist" });
//         }
//         foundContract.addedUsers.push({
//             username: req.body.username,
//             walletAddress: req.body.walletaddress,
//         });
//         const updated = await foundContract.save();
//         console.log(updated);
//         res.status(201).json({ success: "New user added!" });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

module.exports = {
    getAllWallet,
    getContractsofaddress,
    addWalletAddress,
    addContracttoaddress,
    addEditor,
    getContractAddress,
    getTransactions,
    gettxJson,
    getContractUsers,
};
