import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
export declare class OptionalParseIntArrayPipe implements PipeTransform<string[] | undefined, number[] | undefined> {
    transform(value: string[] | undefined, metadata: ArgumentMetadata): number[] | undefined;
}
