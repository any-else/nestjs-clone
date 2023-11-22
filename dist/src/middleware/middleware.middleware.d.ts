import { NestMiddleware } from '@nestjs/common';
export declare class MiddlewareMiddleware implements NestMiddleware {
    use(req: any, res: any, next: () => void): void;
}
