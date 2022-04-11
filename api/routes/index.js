const router = require("express").Router();

const authRoutes = require("./auth");
const customerRoutes = require("./customer");
const adminRoutes = require("./admin");
const publicRoutes = require("./publicRoues");

const { userAuthorization, adminAuthorization } = require("../../middleware/authorization");

router.use("/auth", authRoutes);
router.use("/home", publicRoutes);
router.use("/customer", userAuthorization, customerRoutes);
router.use("/admin", adminAuthorization, adminRoutes);

module.exports = router;
