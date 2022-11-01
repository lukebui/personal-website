import { ApiProperty } from '@nestjs/swagger';

export class CreateParentTypeDto {
  @ApiProperty()
  type: string;
}
