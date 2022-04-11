const adminRouter = require("express").Router();

const acceptFile = require("connect-multiparty");

const { admin, productsAdd } = require("../controllers/admin");

adminRouter.get("/", admin);
adminRouter.post("/products-add", acceptFile(), productsAdd);

module.exports = adminRouter;
