const { isValidObjectId } = require("mongoose");
const Product = require("../../models/Product");

exports.products = async (req, res, next) => {
	try {
		let { skip, limit, search } = req.query;

		skip = parseInt(skip, 10) || 0;
		limit = parseInt(limit, 10) || 100;

		let foundProducts = [];
		if (search) {
			function es(str) {
				return str.replace(/[-\/\\^$*+?()|[\]{}]/g, "");
			}
			const KeyWordRegExp = new RegExp(".*" + es(search) + ".*", "i");

			foundProducts = await Product.find({ $and: [{ active: "yes" }, { name: KeyWordRegExp }] })
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit);
		} else {
			foundProducts = await Product.find({ active: "yes" }).sort({ createdAt: -1 }).skip(skip).limit(limit);
		}

		foundProducts = JSON.parse(JSON.stringify(foundProducts));
		for (const product of foundProducts) {
			product.priceAfterDiscount = product.price - (product.discountRate / 100) * product.price;
		}

		return res.json({ products: foundProducts });
	} catch (err) {
		next(err);
	}
};

exports.cartList = async (req, res, next) => {
	try {
		let { skip, limit, productIds } = req.query;

		skip = parseInt(skip, 10) || 0;
		limit = parseInt(limit, 10) || 200;

		productIds = productIds.replace(/]+/g, "").replace(/\[+/g, "").replace(/"+/g, "");
		productIds = productIds.split(",");

		const validIds = [];
		for (const productId of productIds) {
			if (isValidObjectId(productId)) {
				validIds.push(productId);
			}
		}

		let getProduct = await Product.find({ _id: { $in: validIds } })
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit);

		getProduct = JSON.parse(JSON.stringify(getProduct));
		for (const product of getProduct) {
			product.priceAfterDiscount = product.price - (product.discountRate / 100) * product.price;
		}

		return res.json({ products: getProduct });
	} catch (err) {
		next(err);
	}
};
