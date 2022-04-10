const router = require("express").Router();

const authRoutes = require("./auth");
const customerRoutes = require("./customer");
const adminRoutes = require("./admin");

const { userAuthorization, adminAuthorization } = require("../../middleware/authorization");
const { products } = require("../controllers/products");

router.use("/auth", authRoutes);
router.use("/customer", userAuthorization, customerRoutes);
router.use("/admin", adminAuthorization, adminRoutes);
router.get("/home", products);

module.exports = router;
