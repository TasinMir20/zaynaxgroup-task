const cloudinary = require("cloudinary").v2;

/**
 * Check file is an image or not
 *
 * @param {File} file File object
 */
const imageCheck = (image) => {
	let accept, message;
	if (image.size) {
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
	} else {
		accept = false;
		message = `Please upload an product image!`;
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
	return await cloudinary.uploader.upload(filePath, { width: 500, height: 500 });
};

module.exports = { imageCheck, upload };
