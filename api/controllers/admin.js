const { isValidObjectId } = require("mongoose");
const Product = require("../../models/Product");
const PromoCode = require("../../models/PromoCode");
const Order = require("../../models/Order");

const { imageCheck, upload } = require("../../utils/file");

exports.admin = async (req, res, next) => {
	try {
		return res.json({ user: req.user });
	} catch (err) {
		next(err);
	}
};

exports.productsAdd = async (req, res, next) => {
	const user = req.user;

	let { name, price, discountRate, shippingCharge, color, size, active } = req.body;
	try {
		const issue = {};

		let isValidName, isValidPrice, isValidDiscountRate, isValidShippingCharge, isValidColor, isValidSize, isValidActive;

		// product name validation
		if (name) {
			isValidName = true;
		} else {
			issue.name = "Please provide product name!";
		}

		// product price validation
		if (price) {
			if (String(Number(price)) !== "NaN") {
				price = Math.abs(price);
				isValidPrice = true;
			} else {
				issue.price = "Invalid product price!";
			}
		} else {
			issue.price = "Please provide product price!";
		}

		// product discountRate validation
		if (discountRate !== undefined && discountRate !== "") {
			if (String(Number(discountRate)) !== "NaN") {
				discountRate = Math.abs(discountRate);
				if (discountRate <= 100 && discountRate >= 0) {
					isValidDiscountRate = true;
				} else {
					issue.discountRate = "Discount rate could be 0 - 100!";
				}
			} else {
				issue.discountRate = "Invalid discount rate!";
			}
		} else {
			issue.discountRate = "Please provide product discount rate!";
		}

		// product shippingCharge validation
		if (shippingCharge !== undefined && shippingCharge !== "") {
			if (String(Number(shippingCharge)) !== "NaN") {
				shippingCharge = Math.abs(shippingCharge);
				isValidShippingCharge = true;
			} else {
				issue.shippingCharge = "Invalid shipping charge!";
			}
		} else {
			issue.shippingCharge = "Please provide product shipping charge!";
		}

		// product color validation
		if (color) {
			if (String(Number(color)) === "NaN") {
				isValidColor = true;
			} else {
				issue.color = "Invalid product color!";
			}
		} else {
			issue.color = "Please provide product color!";
		}

		// product size validation
		if (size) {
			if (String(Number(size)) === "NaN") {
				isValidSize = true;
			} else {
				issue.size = "Invalid product size!";
			}
		} else {
			issue.size = "Please provide product size!";
		}

		// product active validation
		active = active ? active.toLowerCase() : active;
		if (["yes", "no"].includes(active) || active === undefined || active === "") {
			isValidActive = true;
		} else {
			issue.active = "Invalid product active key!";
		}

		const productPropertiesValid = isValidName && isValidPrice && isValidDiscountRate && isValidShippingCharge && isValidColor && isValidSize && isValidActive;

		if (productPropertiesValid) {
			let productImageOk;

			if (req.files) {
				const files = req.files;
				let image;
				if (Array.isArray(files.image)) {
					for (const file of files.image) {
						if (file.size > 0) {
							image = file;
							break;
						}
					}
				} else {
					image = files.image;
				}

				// product image upload to third-party server - cloudinary
				if (image) {
					const isImage = imageCheck(image);
					if (isImage.accept) {
						const resp = await upload(image.path);
						var imageUrl = resp.secure_url;
						productImageOk = true;
					} else {
						issue.image = isImage.message;
					}
				} else {
					issue.image = "Please upload product image.";
				}
			} else {
				issue.image = "Please upload product image.";
			}

			if (productImageOk) {
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
						const exist = await Product.exists({ uniqueId: num });

						if (!exist) {
							break;
						}
						console.log("Looping to generate random unique id for Product");
					}

					return num;
				}
				const uniqueRandomId = await getUniqueRandNum();

				const productStructure = new Product({
					uniqueId: uniqueRandomId,
					createdBy: user._id,
					image: imageUrl,
					name,
					price,
					discountRate,
					shippingCharge,
					color,
					size,
					active,
				});

				const productSave = await productStructure.save();

				return res.status(201).json({ addedProduct: productSave });
			}
		}
		return res.status(400).json({ issue });
	} catch (err) {
		next(err);
	}
};

exports.promoCodes = async (req, res, next) => {
	try {
		let { skip, limit } = req.query;

		skip = parseInt(skip, 10) || 0;
		limit = parseInt(limit, 10) || 20;

		const getPromoCode = await PromoCode.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit);
		return res.json({ promoCode: getPromoCode });
	} catch (err) {
		next(err);
	}
};

exports.promoCodesAdd = async (req, res, next) => {
	let { theCode, startDate, endDate, discountRate, useTimeLimit, active } = req.body;
	try {
		const issue = {};

		let isValidTheCode, isValidStartDate, isValidEndDate, isValidDiscountRate, isValidUseTimeLimit, isValidActive;

		// Promo Code validation
		if (theCode) {
			const isExistSamePromoCode = await PromoCode.exists({ code: theCode });

			if (!isExistSamePromoCode) {
				isValidTheCode = true;
			} else {
				issue.theCode = "The same Promo Code is already created!";
			}
		} else {
			issue.theCode = "Please provide Promo Code !";
		}

		// startDate date time validation
		if (startDate) {
			if (String(Number(startDate)) !== "NaN") {
				startDate = Number(startDate);
			}
			const validTimestamp = new Date(startDate).getTime() > 0;
			if (validTimestamp) {
				isValidStartDate = true;
			} else {
				issue.startDate = "Please provide a valid start date of the promo code!";
			}
		} else {
			issue.startDate = "Please provide promo code using start date!";
		}

		// endDate date time validation
		if (endDate) {
			if (String(Number(endDate)) !== "NaN") {
				endDate = Number(endDate);
			}

			const validTimestamp = new Date(endDate).getTime() > 0;
			if (validTimestamp) {
				isValidEndDate = true;
			} else {
				issue.endDate = "Please provide a valid end date of the promo code";
			}
		} else {
			issue.endDate = "Please provide promo code using end date!";
		}

		// discountRate validation
		if (discountRate !== undefined && discountRate !== "") {
			if (String(Number(discountRate)) !== "NaN") {
				discountRate = Math.abs(discountRate);
				if (discountRate <= 100 && discountRate >= 0) {
					isValidDiscountRate = true;
				} else {
					issue.discountRate = "Discount rate could be 0 - 100!";
				}
			} else {
				issue.discountRate = "Invalid discount rate!";
			}
		} else {
			issue.discountRate = "Please provide promo code discount rate!";
		}

		// promo code use Time Limit validation
		if (useTimeLimit !== undefined && useTimeLimit !== "") {
			if (String(Number(useTimeLimit)) !== "NaN") {
				useTimeLimit = Math.abs(useTimeLimit);
				isValidUseTimeLimit = true;
			} else {
				issue.useTimeLimit = "Invalid use time!";
			}
		} else {
			issue.useTimeLimit = "Please provide use time!";
		}

		// promo code active validation
		active = active ? active.toLowerCase() : active;
		if (["yes", "no"].includes(active) || active === undefined || active === "") {
			isValidActive = true;
		} else {
			issue.active = "Invalid promo code active key!";
		}

		const promoCodePropertiesValid = isValidTheCode && isValidStartDate && isValidEndDate && isValidDiscountRate && isValidUseTimeLimit && isValidActive;

		if (promoCodePropertiesValid) {
			const promoCodeStructure = new PromoCode({
				code: theCode,
				startDate,
				endDate,
				discountRate,
				useTimeLimit,
				active,
			});

			const promoCodeSave = await promoCodeStructure.save();

			return res.status(201).json({ addedPromoCode: promoCodeSave });
		}
		return res.status(400).json({ issue });
	} catch (err) {
		next(err);
	}
};

exports.promoCodesEdit = async (req, res, next) => {
	let { endDate, discountRate, useTimeLimit } = req.body;
	let { promoCodeId } = req.params;
	try {
		const issue = {};

		let isValidPromoCodeId, isValidEndDate, isValidDiscountRate, isValidUseTimeLimit;

		if (isValidObjectId(promoCodeId)) {
			const isExistPromoCode = await PromoCode.exists({ _id: promoCodeId });

			if (isExistPromoCode) {
				isValidPromoCodeId = true;
			} else {
				issue.promoCodeId = "Promo code doesn't exists!";
			}
		} else {
			issue.promoCodeId = "Invalid promo code id!";
		}

		// endDate date time validation
		if (endDate) {
			if (String(Number(endDate)) !== "NaN") {
				endDate = Number(endDate);
			}

			const validTimestamp = new Date(endDate).getTime() > 0;
			if (validTimestamp) {
				isValidEndDate = true;
			} else {
				issue.endDate = "Please provide a valid end date of the promo code";
			}
		} else {
			issue.endDate = "Please provide promo code using end date!";
		}

		// discountRate validation
		if (discountRate !== undefined && discountRate !== "") {
			if (String(Number(discountRate)) !== "NaN") {
				discountRate = Math.abs(discountRate);
				if (discountRate <= 100 && discountRate >= 0) {
					isValidDiscountRate = true;
				} else {
					issue.discountRate = "Discount rate could be 0 - 100!";
				}
			} else {
				issue.discountRate = "Invalid discount rate!";
			}
		} else {
			issue.discountRate = "Please provide promo code discount rate!";
		}

		// promo code use Time Limit validation

		if (useTimeLimit !== undefined && useTimeLimit !== "") {
			if (String(Number(useTimeLimit)) !== "NaN") {
				useTimeLimit = Math.abs(useTimeLimit);
				isValidUseTimeLimit = true;
			} else {
				issue.useTimeLimit = "Invalid use time!";
			}
		} else {
			issue.useTimeLimit = "Please provide use time!";
		}

		const promoCodePropertiesValid = isValidPromoCodeId && isValidEndDate && isValidDiscountRate && isValidUseTimeLimit;

		if (promoCodePropertiesValid) {
			const promoCodeUpdate = await PromoCode.updateOne({ _id: promoCodeId }, { endDate, discountRate, useTimeLimit });
			if (promoCodeUpdate.modifiedCount) {
				return res.json({ message: "Promo code update successfully!" });
			} else {
				issue.message = "Failed to update!";
			}
		}
		return res.status(400).json({ issue });
	} catch (err) {
		next(err);
	}
};

exports.promoCodesActiveDeactive = async (req, res, next) => {
	let { active } = req.body;
	let { promoCodeId } = req.params;
	try {
		const issue = {};

		let isValidPromoCodeId, isValidActive;

		if (isValidObjectId(promoCodeId)) {
			const isExistPromoCode = await PromoCode.exists({ _id: promoCodeId });

			if (isExistPromoCode) {
				isValidPromoCodeId = true;
			} else {
				issue.promoCodeId = "Promo code doesn't exists!";
			}
		} else {
			issue.promoCodeId = "Invalid promo code id!";
		}

		// promo code active validation
		active = active ? active.toLowerCase() : active;
		if (active) {
			if (["yes", "no"].includes(active)) {
				isValidActive = true;
			} else {
				issue.active = "Invalid promo code active key!";
			}
		} else {
			issue.active = "Please provide promo code active keyword!";
		}

		const propertiesValid = isValidPromoCodeId && isValidActive;

		if (propertiesValid) {
			const promoCodeUpdate = await PromoCode.updateOne({ _id: promoCodeId }, { active });
			if (promoCodeUpdate.modifiedCount) {
				const state = active === "yes" ? "activated" : "deactivated";
				return res.json({ message: `Promo code successfully ${state}!`, msg: state });
			} else {
				issue.message = "Failed to update!";
			}
		}
		return res.status(400).json({ issue });
	} catch (err) {
		next(err);
	}
};

exports.orders = async (req, res, next) => {
	let { skip, limit, status } = req.query;
	try {
		const issue = {};
		skip = parseInt(skip, 10) || 0;
		limit = parseInt(limit, 10) || 100;

		status = status ? status.toLowerCase() : status;
		if (status) {
			if (["pending", "confirmed", "canceled"].includes(status)) {
				const getOrder = await Order.find({ status }).sort({ createdAt: -1 }).skip(skip).limit(limit);
				return res.json({ order: getOrder });
			} else {
				issue.message = "Invalid status keyword!- allowed status query keyword is- pending, confirmed, canceled";
			}
		} else {
			const getOrder = await Order.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit);
			return res.json({ order: getOrder });
		}

		return res.status(400).json({ issue });
	} catch (err) {
		next(err);
	}
};

exports.ordersAction = async (req, res, next) => {
	const user = req.user;
	let { orderObjId, status } = req.params;
	try {
		const issue = {};

		if (isValidObjectId(orderObjId)) {
			status = status ? status.toLowerCase() : status;
			if (status) {
				if (["confirmed", "confirm", "canceled", "cancel"].includes(status)) {
					status = status === "cancel" ? "canceled" : status;
					status = status === "confirm" ? "confirmed" : status;

					const orderUpdate = await Order.updateOne({ _id: orderObjId }, { status, reviewedBy: user._id });

					if (orderUpdate.modifiedCount) {
						return res.json({ message: `Order successfully ${status}!` });
					}
				} else {
					issue.message = "Invalid status keyword!- allowed status query keyword is- confirmed, canceled";
				}
			} else {
				issue.message = "Please provide status keyword!";
			}
		} else {
			issue.message = "Invalid order id!";
		}

		return res.status(400).json({ issue });
	} catch (err) {
		next(err);
	}
};

exports.products = async (req, res, next) => {
	try {
		let { skip, limit, search } = req.query;

		skip = parseInt(skip, 10) || 0;
		limit = parseInt(limit, 10) || 100;

		let foundProducts = await Product.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit);
		foundProducts = JSON.parse(JSON.stringify(foundProducts));

		for (const product of foundProducts) {
			product.priceAfterDiscount = product.price - (product.discountRate / 100) * product.price;
		}

		return res.json({ products: foundProducts });
	} catch (err) {
		next(err);
	}
};
