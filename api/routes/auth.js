const authRouter = require("express").Router();

const { loginRegister, adminLogin } = require("../controllers/auth");

authRouter.post("/", loginRegister);
authRouter.post("/admin", adminLogin);

module.exports = authRouter;
