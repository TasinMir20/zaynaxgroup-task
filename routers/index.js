const router = require("express").Router();

const frontEndRoutes = require("./frontEndRoutes");
const apiRoutes = require("../api/routes/index");

router.use("/api", apiRoutes); // rest api routes
router.use("/", frontEndRoutes); // Front-End render with ejs

// catch 404 and forward to error handler
router.use((req, res, next) => {
	return res.status(404).json({
		issue: {
			message: "404 | Resource not found.",
		},
	});
});

// error handler
router.use((err, req, res, next) => {
	console.error(err);

	const statusCode = err.status || 500;
	const issue = {};

	issue.message = `${statusCode} | ${err.message}`;
	issue.stack = process.env.NODE_ENV !== "production" ? err.stack : "You have no rights to see details.";

	return res.status(statusCode).json({ issue });
});

module.exports = router;
