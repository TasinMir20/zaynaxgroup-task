const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
	{
		fullName: {
			type: String,
		},
		username: {
			type: String,
		},
		phone: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
			select: false,
		},
		role: {
			type: String,
			enum: ["customer", "admin"],
			default: "customer",
		},
	},
	{
		timestamps: true,
	}
);

const User = model("User", UserSchema);

module.exports = User;
