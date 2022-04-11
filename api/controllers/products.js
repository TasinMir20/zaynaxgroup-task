const { isValidObjectId } = require("mongoose");
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

			const foundProducts = await Product.find({ $and: [{ active: "yes" }, { name: KeyWordRegExp }] })
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit);
			return res.json({ products: foundProducts });
		} else {
			const getProduct = await Product.find({ active: "yes" }).sort({ createdAt: -1 }).skip(skip).limit(limit);
			return res.json({ products: getProduct });
		}
	} catch (err) {
		next(err);
	}
};

exports.cartList = async (req, res, next) => {
	try {
		let { skip, limit, productIds } = req.query;

		skip = parseInt(skip, 10) || 0;
		limit = parseInt(limit, 10) || 20;

		productIds = productIds.replace(/]+/g, "").replace(/\[+/g, "").replace(/"+/g, "");
		productIds = productIds.split(",");

		const validIds = [];
		for (const productId of productIds) {
			if (isValidObjectId(productId)) {
				validIds.push(productId);
			}
		}

		const getProduct = await Product.find({ _id: { $in: validIds } })
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit);

		return res.json({ products: getProduct });
	} catch (err) {
		next(err);
	}
};
