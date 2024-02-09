const User = require("../model/User");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd)
        return res
            .status(400)
            .json({ message: "Username and password are required." });

    const foundUser = await User.findOne({ username: user }).exec();
    if (!foundUser) return res.sendStatus(401); //Unauthorized
    // evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        // const roles = Object.values(foundUser.role).filter(Boolean);
        // create JWT
        const accessToken = jwt.sign(
            {
                UserInfo: {
                    username: foundUser.username,
                    role: foundUser.role,
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15h" }
        );
        const refreshToken = jwt.sign(
            {
                username: foundUser.username,
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "1d" }
        );
        // Saving refreshToken with current user
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        console.log(result);
        console.log(foundUser.role);

        // Creates Secure Cookie with refresh token
        res.cookie("jwt", refreshToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.json({ accessToken });
        //res.json({ success: `User ${user} is logged in!` });
    } else {
        res.sendStatus(401);
    }
};

module.exports = { handleLogin };
