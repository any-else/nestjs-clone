import {
  Injectable,
  NestMiddleware,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as multer from 'multer';

@Injectable()
export class MiddlewareMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    try {
      console.log('hhhh');

      const storage = multer.memoryStorage();
      const imageFilter = function (req: any, file: any, cb: any) {
        if (
          !file.originalname.match(
            /\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|avif|AVIF|webp|WEBP)$/,
          )
        ) {
          req.fileValidationError = 'Only image files are allowed!';
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      };

      const upload = multer({ storage: storage, fileFilter: imageFilter });
      upload.any();
      next();
    } catch (err) {
      console.log(err);
      throw new HttpException(
        { status: 'error', message: 'Something went wrong in server side' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
