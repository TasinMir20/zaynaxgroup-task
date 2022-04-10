exports.products = async (req, res, next) => {
	try {
		return res.json({ products: [] });
	} catch (err) {
		next(err);
	}
};
