"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiddlewareMiddleware = void 0;
const common_1 = require("@nestjs/common");
const multer = require("multer");
let MiddlewareMiddleware = class MiddlewareMiddleware {
    use(req, res, next) {
        try {
            console.log('hhhh');
            const storage = multer.memoryStorage();
            const imageFilter = function (req, file, cb) {
                if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|avif|AVIF|webp|WEBP)$/)) {
                    req.fileValidationError = 'Only image files are allowed!';
                    return cb(new Error('Only image files are allowed!'), false);
                }
                cb(null, true);
            };
            const upload = multer({ storage: storage, fileFilter: imageFilter });
            upload.any();
            next();
        }
        catch (err) {
            console.log(err);
            throw new common_1.HttpException({ status: 'error', message: 'Something went wrong in server side' }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
MiddlewareMiddleware = __decorate([
    (0, common_1.Injectable)()
], MiddlewareMiddleware);
exports.MiddlewareMiddleware = MiddlewareMiddleware;
//# sourceMappingURL=middleware.middleware.js.map