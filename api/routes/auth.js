const authRouter = require("express").Router();

const { loginRegister } = require("../controllers/auth");

authRouter.post("/", loginRegister);

module.exports = authRouter;
