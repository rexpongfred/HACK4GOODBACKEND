const User = require("../model/User");

const handleLogout = async (req, res) => {
    // On client also delete accessToken

    const cookies = req.cookies;
    if (!cookies?.jwt)
        return res.status(200).json({ message: "no cookie found" }); //No content
    const refreshToken = cookies.jwt;

    // Is RefreshToken in DB
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "None",
            secure: true,
        });
        return res.status(200).json({ message: "no user found" });
    }

    // Delete refreshtoken in db
    foundUser.refreshToken = "";
    const result = await foundUser.save();
    console.log(result);

    res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        //secure:true
    });
    res.status(200).json({ message: `${foundUser.username} logged out` });
};

module.exports = { handleLogout };
