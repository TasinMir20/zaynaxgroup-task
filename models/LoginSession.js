const { Schema, model } = require("mongoose");

const LoginSessionSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		sessionName: {
			type: String,
			default: "LoginSession",
		},
		sessionUUID: {
			type: String,
			required: true,
		},
		expireDate: {
			type: Date,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const LoginSession = model("LoginSession", LoginSessionSchema);

module.exports = LoginSession;
