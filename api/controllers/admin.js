const Product = require("../../models/Product");

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
		if (discountRate) {
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
		if (shippingCharge) {
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
