const frontEndRouter = require("express").Router();

frontEndRouter.get("/", (req, res, next) => {
	res.redirect("/home");
});

frontEndRouter.get("/home", (req, res, next) => {
	try {
		res.render("pages/home");
	} catch (e) {
		next(e);
	}
});

frontEndRouter.get("/home/*", (req, res, next) => {
	try {
		res.render("pages/home");
	} catch (e) {
		next(e);
	}
});

frontEndRouter.get("/admin", (req, res, next) => {
	try {
		res.render("pages/admin");
	} catch (e) {
		next(e);
	}
});

frontEndRouter.get("/admin/*", (req, res, next) => {
	try {
		res.render("pages/admin");
	} catch (e) {
		next(e);
	}
});

module.exports = frontEndRouter;
