const bcrypt = require("bcrypt");
const { phone: phoneNumberValidator } = require("phone");
const { v4: uuid } = require("uuid");

const User = require("../../models/User");
const LoginSession = require("../../models/LoginSession");
const { createToken } = require("../../utils/jwt");

/**
 * Login or Sing up
 *
 * @param {express.Request} req Express request object
 * @param {express.Response} res Express response object
 * @param {() => } next Express callback
 ***/
exports.loginRegister = async (req, res, next) => {
	try {
		let issue = {};
		const { phone, password } = req.body;
		let phoneNumber = phone;

		if (phoneNumber && password) {
			const validateNumber = phoneNumberValidator(phoneNumber);

			if (validateNumber.isValid) {
				phoneNumber = validateNumber.phoneNumber;

				let user;
				let userExits = await User.findOne({ phone: phoneNumber }).select("+password");
				userExits = JSON.parse(JSON.stringify(userExits));
				if (userExits) {
					const matched = bcrypt.compareSync(password, userExits.password);
					if (matched) {
						userExits.password = undefined;
						user = userExits;
					} else {
						issue.password = "Password is wrong!";
					}
				} else {
					if (password.length >= 8 && password.length <= 32) {
						const strongPasswordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/;
						const passwordStrong = password.match(strongPasswordRegex);
						if (passwordStrong) {
							const salt = bcrypt.genSaltSync(11);
							const encryptsPassword = bcrypt.hashSync(password, salt);

							const userInsertStructure = new User({
								phone: phoneNumber,
								password: encryptsPassword,
							});

							const saveUserData = await userInsertStructure.save();
							saveUserData.password = undefined;
							user = saveUserData;
						} else {
							issue.password = "Please enter strong password!";
						}
					} else {
						issue.password = "Password length should be 8 to 32 characters long!";
					}
				}

				if (user) {
					const sessionUUID = uuid();
					const expireDate = new Date();
					expireDate.setDate(expireDate.getDate() + 30);

					const sessionStructure = new LoginSession({
						user: user._id,
						sessionUUID,
						expireDate,
					});

					const session = await sessionStructure.save();

					const jwtToken = createToken(session._id, sessionUUID);
					return res.json({ jwtToken });
				}
			} else {
				issue.phone = "Invalid phone number!";
			}
		} else {
			if (!phoneNumber) {
				issue.phone = "Please enter your phone number!";
			}

			if (!password) {
				issue.phone = "Please enter password!";
			}
		}

		return res.status(400).json({ issue });
	} catch (err) {
		next(err);
	}
};
