const PromoCode = require("../../models/PromoCode");

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
