const adminRouter = require("express").Router();
const acceptFile = require("connect-multiparty");
const { admin, productsAdd, promoCodes, promoCodesAdd, promoCodesEdit, promoCodesActiveDeactive, orders, ordersAction } = require("../controllers/admin");

adminRouter.get("/", admin);
adminRouter.post("/products-add", acceptFile(), productsAdd);
adminRouter.get("/promo-codes", promoCodes);
adminRouter.post("/promo-codes", promoCodesAdd);
adminRouter.patch("/promo-codes/:promoCodeId", promoCodesEdit);
adminRouter.put("/promo-codes/:promoCodeId", promoCodesActiveDeactive);
adminRouter.get("/orders", orders);
adminRouter.patch("/orders-action/:orderObjId/:status", ordersAction);

module.exports = adminRouter;
