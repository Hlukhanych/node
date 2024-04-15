const usersService = require('../services/orders.service');
const authService = require('../services/auth.service');

const signin = async (req, res, next) => {
    try {
        const { email } = req.body;

        const order = await usersService.findOne({ email });

        const accessToken = await authService.signAccessToken(order);

        res.cookie("access_token", accessToken, { httpOnly: true })
            .status(201)
            .json({
                status: 201,
                data: { accessToken },
            });
    } catch (err) {
        next(err);
    }
};

const signout = async (req, res, next) => {
    try {
        res.clearCookie("access_token")
            .status(200)
            .json({
                status: 200,
            });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    signin,
    signout,
};