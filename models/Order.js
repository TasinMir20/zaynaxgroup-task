const { Schema, model } = require("mongoose");

const OrderSchema = new Schema(
	{
		orderId: {
			type: Number,
			required: true,
		},
		sl: {
			type: Number,
			required: true,
		},
		product: {
			type: Schema.Types.ObjectId,
			ref: "Product",
			required: true,
		},
		price: {
			type: String,
			required: true,
		},
		orderBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		reviewedBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		status: {
			type: String,
			enum: ["pending", "confirmed", "canceled"],
			default: "pending",
		},
	},
	{
		timestamps: true,
	}
);

const Order = model("Order", OrderSchema);

module.exports = Order;
