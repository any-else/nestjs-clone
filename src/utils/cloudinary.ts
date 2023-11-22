import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
export const uploadImageCloudinary = async (file: Express.Multer.File) => {
  const { originalname, buffer, fieldname } = file;
  return new Promise((resolve, reject) => {
    v2.uploader
      .upload_stream(
        {
          folder: 'my_image_product_amazon',
          public_id: originalname.split('.')[0],
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      )
      .end(buffer);
  });
};
