import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
export declare class OptionalParseIntPipe implements PipeTransform<string | undefined, number | undefined> {
    transform(value: string | undefined, metadata: ArgumentMetadata): number | undefined;
}
