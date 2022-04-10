const adminRouter = require("express").Router();

const { admin } = require("../controllers/admin");

adminRouter.get("/", admin);

module.exports = adminRouter;
