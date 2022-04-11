const adminRouter = require("express").Router();

const acceptFile = require("connect-multiparty");

const { admin, productsAdd, promoCodesAdd } = require("../controllers/admin");

adminRouter.get("/", admin);
adminRouter.post("/products-add", acceptFile(), productsAdd);
adminRouter.post("/promo-codes-add", promoCodesAdd);

module.exports = adminRouter;
