import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class OptionalParseIntArrayPipe
  implements PipeTransform<string[] | undefined, number[] | undefined>
{
  transform(
    value: string[] | undefined,
    metadata: ArgumentMetadata,
  ): number[] | undefined {
    console.log(value);
    if (value === undefined || value === null) {
      return undefined;
    }

    if (Array.isArray(value)) {
      const parsedValues = value.map((v) => {
        const parsedValue = parseInt(v, 10);
        return isNaN(parsedValue) ? undefined : parsedValue;
      });

      return parsedValues;
    } else {
      const parsedValue = parseInt(value, 10);
      return isNaN(parsedValue) ? undefined : [parsedValue];
    }
  }
}
