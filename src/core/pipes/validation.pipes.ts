import {
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  ValidationPipe,
  UnprocessableEntityException,
} from '@nestjs/common';

@Injectable()
export class ValidateInputPipe extends ValidationPipe {
  async transform(value, metadata: ArgumentMetadata) {
    console.log(value);
    try {
      return await super.transform(value, metadata);
    } catch (e) {
      if (e instanceof BadRequestException) {
        throw new UnprocessableEntityException(
          ValidateInputPipe.handleError(e.getResponse()),
        );
      }
    }
  }

  private static handleError(errors) {
    const mappedErrors = errors.message.map((error) => error);
    return mappedErrors[0];
  }
}
