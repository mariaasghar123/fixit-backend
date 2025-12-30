import { IsArray, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProfileAvailabilityDto {
  @ApiProperty({
    example: ['Mon', 'Tue', 'Wed'],
    description: 'Available working days',
    type: [String],
  })
  @IsArray()
  @IsNotEmpty()
  available_days: string[];

  @ApiProperty({
    example: ['09:00-17:00', '18:00-21:00'],
    description: 'Available time slots',
    type: [String],
  })
  @IsArray()
  @IsNotEmpty()
  time_slots: string[];
}
