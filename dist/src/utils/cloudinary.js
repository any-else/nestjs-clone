"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImageCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const uploadImageCloudinary = async (file) => {
    const { originalname, buffer, fieldname } = file;
    return new Promise((resolve, reject) => {
        cloudinary_1.v2.uploader
            .upload_stream({
            folder: 'my_image_product_amazon',
            public_id: originalname.split('.')[0],
            resource_type: 'image',
        }, (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        })
            .end(buffer);
    });
};
exports.uploadImageCloudinary = uploadImageCloudinary;
//# sourceMappingURL=cloudinary.js.map