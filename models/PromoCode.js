const { Schema, model } = require("mongoose");

const PromoCodeSchema = new Schema(
	{
		code: {
			type: String,
			required: true,
			unique: true,
		},
		startDate: {
			type: Date,
			required: true,
		},
		endDate: {
			type: Date,
			required: true,
		},
		discountRate: {
			type: Number,
			required: true,
		},
		useTimeLimit: {
			type: Number,
			required: true,
		},
		active: {
			type: String,
			enum: ["yes", "no"],
			default: "yes",
		},
	},
	{
		timestamps: true,
	}
);

const PromoCode = model("PromoCode", PromoCodeSchema);

module.exports = PromoCode;
