const customerRouter = require("express").Router();

const { customer } = require("../controllers/customer");

customerRouter.get("/", customer);

module.exports = customerRouter;
