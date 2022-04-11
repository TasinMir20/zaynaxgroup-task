const Product = require("../../models/Product");

exports.products = async (req, res, next) => {
	try {
		let { skip, limit } = req.query;

		skip = parseInt(skip, 10) || 0;
		limit = parseInt(limit, 10) || 20;

		const getProduct = await Product.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit);
		return res.json({ products: getProduct });
	} catch (err) {
		next(err);
	}
};
