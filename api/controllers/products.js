const Product = require("../../models/Product");

exports.products = async (req, res, next) => {
	try {
		let { skip, limit, search } = req.query;

		skip = parseInt(skip, 10) || 0;
		limit = parseInt(limit, 10) || 20;

		if (search) {
			function es(str) {
				return str.replace(/[-\/\\^$*+?()|[\]{}]/g, "");
			}
			const KeyWordRegExp = new RegExp(".*" + es(search) + ".*", "i");

			const foundProducts = await Product.find({ name: KeyWordRegExp }).sort({ createdAt: -1 }).skip(skip).limit(limit);
			return res.json({ products: foundProducts });
		} else {
			const getProduct = await Product.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit);
			return res.json({ products: getProduct });
		}
	} catch (err) {
		next(err);
	}
};
