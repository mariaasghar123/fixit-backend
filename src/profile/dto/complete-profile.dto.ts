import { ApiProperty } from "@nestjs/swagger";
export class CompleteProfileDto {
  @ApiProperty({
    example: true,
    description: 'Confirm profile completion',
  })
  confirm: boolean;
}
