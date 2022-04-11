const { Schema, model } = require("mongoose");

const ProductSchema = new Schema(
	{
		uniqueId: {
			type: Number,
			required: true,
		},
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		image: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		price: {
			type: String,
			required: true,
		},
		discountRate: {
			type: Number,
			required: true,
		},
		shippingCharge: {
			type: Number,
			required: true,
		},
		color: {
			type: String,
			required: true,
		},
		size: {
			type: String,
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

const Product = model("Product", ProductSchema);

module.exports = Product;
