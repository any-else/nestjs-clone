import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  ParseBoolPipe,
} from '@nestjs/common';

@Injectable()
export class OptionalParseBooleanPipe
  implements PipeTransform<string | undefined>
{
  transform(
    value: string | undefined,
    metadata: ArgumentMetadata,
  ): string | undefined {
    if (value === undefined || value === null) {
      return undefined;
    }
    return value;
  }
}
