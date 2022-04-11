const { isValidObjectId } = require("mongoose");
const Product = require("../../models/Product");
const PromoCode = require("../../models/PromoCode");
const Order = require("../../models/Order");

exports.customer = async (req, res, next) => {
	try {
		return res.json({ user: req.user });
	} catch (err) {
		next(err);
	}
};

exports.applyPromoCode = async (req, res, next) => {
	try {
		let { thePromoCode } = req.body;

		const issue = {};
		if (thePromoCode) {
			const getPromoCode = await PromoCode.findOne({ code: thePromoCode });

			if (getPromoCode) {
				if (getPromoCode.active === "yes") {
					if (getPromoCode.startDate < Date.now()) {
						if (getPromoCode.endDate > Date.now()) {
							if (getPromoCode.useTimeLimit > getPromoCode.usedTime) {
								return res.json({ discountRate: getPromoCode.discountRate });
							} else {
								issue.message = "The promo code is used limit exceed!";
							}
						} else {
							issue.message = "The promo code is expired!";
						}
					} else {
						const date = new Date(Math.floor(new Date(getPromoCode.startDate).getTime())).toLocaleDateString();
						issue.message = `This promo code will be useable on ${date}!`;
					}
				} else {
					issue.message = "This promo code is unable to use now!";
				}
			} else {
				issue.message = "Invalid promo code!";
			}
		} else {
			issue.message = "Please Enter promo code!";
		}

		return res.status(400).json({ issue });
	} catch (err) {
		next(err);
	}
};

exports.checkout = async (req, res, next) => {
	const { products, promoCode } = req.body;
	const user = req.user;
	try {
		const issue = {};
		if (Array.isArray(products) && products.length > 0) {
			let orderPlacedCount = 0;
			for (const product of products) {
				if (isValidObjectId(product.id)) {
					const findProduct = await Product.findOne({ _id: product.id });

					if (findProduct) {
						// unique Id generate
						async function getUniqueRandNum() {
							function randomGen() {
								const length = 6;
								let randNum = "";
								const characters = "0123456789";
								const charactersLength = characters.length;
								for (let i = 0; i < length; i++) {
									randNum += characters.charAt(Math.floor(Math.random() * charactersLength));
								}
								return Number(randNum);
							}
							let num;
							while (true) {
								num = randomGen();
								const exist = await Order.exists({ orderId: num });
								if (!exist) {
									break;
								}
								console.log("Looping to generate random unique id Order");
							}
							return num;
						}
						const uniqueRandomId = await getUniqueRandNum();

						const orderStructure = new Order({
							orderId: uniqueRandomId,
							sl: Math.abs(parseInt(product.quantity, 10) || 1),
							product: findProduct._id,
							price: findProduct.price,
							orderBy: user._id,
						});

						await orderStructure.save();
						orderPlacedCount++;

						// promo code usedTime increment
						if (promoCode) {
							await PromoCode.updateOne({ code: promoCode }, { $inc: { usedTime: 1 } });
						}
					} else {
						issue.message = "Your chosen product no more exists!";
					}
				} else {
					issue.message = "Invalid order id!";
				}
			}

			if (orderPlacedCount) {
				return res.status(201).json({ message: "Order successfully placed!" });
			}
		} else {
			issue.message = "Please provide a products";
		}

		return res.status(400).json({ issue });
	} catch (err) {
		next(err);
	}
};
