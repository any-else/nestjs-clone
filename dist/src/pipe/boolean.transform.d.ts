import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
export declare class OptionalParseBooleanPipe implements PipeTransform<string | undefined> {
    transform(value: string | undefined, metadata: ArgumentMetadata): string | undefined;
}
