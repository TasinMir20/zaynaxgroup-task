const cloudinary = require("cloudinary").v2;

/**
 * Check file is an image or not
 *
 * @param {File} file File object
 */
const imageCheck = (image) => {
	let accept, message;
	if (image.type) {
		const isImage = image.type.startsWith("image/");
		if (!isImage) {
			message = "Please upload only image files.";
			return { accept: false, message };
		} else {
			accept = true;
		}
	} else {
		accept = false;
		message = `${image.fieldName} field is empty!`;
	}

	return { accept, message };
};

/**
 * Upload a file
 *
 * @param {string} filePath Path of the file
 * @returns promise
 */
const upload = async (filePath) => {
	return await cloudinary.uploader.upload(filePath);
};

module.exports = { imageCheck, upload };
