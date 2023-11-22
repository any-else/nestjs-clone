import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class OptionalParseIntPipe
  implements PipeTransform<string | undefined, number | undefined>
{
  transform(
    value: string | undefined,
    metadata: ArgumentMetadata,
  ): number | undefined {
    if (value === undefined || value === null) {
      return undefined;
    }
    const parsedValue = parseInt(value, 10);
    if (isNaN(parsedValue)) {
      return undefined;
    }
    return parsedValue;
  }
}
