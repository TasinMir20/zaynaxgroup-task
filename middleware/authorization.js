const { isValidObjectId } = require("mongoose");

const LoginSession = require("../models/LoginSession");
const { parseJWT } = require("../utils/jwt");

exports.userAuthorization = async (req, res, next) => {
	try {
		const issue = {};
		let token = req.headers.authorization;
		if (token) {
			token = token.split(" ")[1];
			const jwt_payload = parseJWT(token);

			if (isValidObjectId(jwt_payload.sessionId)) {
				const loginSession = await LoginSession.findOne({
					$and: [{ _id: jwt_payload.sessionId }, { sessionUUID: jwt_payload.sessionUUID }],
				}).populate("user");

				if (loginSession) {
					if (loginSession.user) {
						const user = loginSession.user;
						req.user = user;
						return next();
					} else {
						issue.message = "Illegal request!";
					}
				} else {
					issue.message = "Invalid token!";
				}
			} else {
				issue.message = "Invalid token";
			}
		} else {
			issue.message = "Please provide token";
		}

		return res.status(401).json({ issue });
	} catch (err) {
		next(err);
	}
};

exports.adminAuthorization = async (req, res, next) => {
	try {
		const issue = {};
		let token = req.headers.authorization;
		if (token) {
			token = token.split(" ")[1];
			const jwt_payload = parseJWT(token);

			if (isValidObjectId(jwt_payload.sessionId)) {
				const loginSession = await LoginSession.findOne({
					$and: [{ _id: jwt_payload.sessionId }, { sessionUUID: jwt_payload.sessionUUID }],
				}).populate("user");

				if (loginSession) {
					if (loginSession.user) {
						const user = loginSession.user;
						if (user.role === "admin") {
							req.user = user;
							return next();
						} else {
							issue.message = "This route only allow for admin!";
						}
					} else {
						issue.message = "Illegal request!";
					}
				} else {
					issue.message = "Invalid token!";
				}
			} else {
				issue.message = "Invalid token";
			}
		} else {
			issue.message = "Please provide token";
		}

		return res.status(401).json({ issue });
	} catch (err) {
		next(err);
	}
};

exports.anonymousOrNot = async (req, res, next) => {
	try {
		const issue = {};
		let token = req.headers.authorization;
		if (token) {
			token = token.split(" ")[1];
			const jwt_payload = parseJWT(token);

			if (isValidObjectId(jwt_payload.sessionId)) {
				const loginSession = await LoginSession.findOne({
					$and: [{ _id: jwt_payload.sessionId }, { sessionUUID: jwt_payload.sessionUUID }],
				}).populate({
					path: "user",
					select: "+emailVerified +phoneVerified",
				});

				if (loginSession) {
					if (loginSession.user) {
						const user = loginSession.user;
						req.user = user;
					}
				}
			}
		}

		return next();
	} catch (err) {
		next(err);
	}
};
