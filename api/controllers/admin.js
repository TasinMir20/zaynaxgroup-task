exports.admin = async (req, res, next) => {
	try {
		return res.json({ user: req.user });
	} catch (err) {
		next(err);
	}
};
