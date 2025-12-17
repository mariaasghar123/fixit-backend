import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty()
  full_name: string;

  @ApiProperty({ example: 'maria@gmail.com' })
  email: string;

  @ApiProperty({ example: 'Maria' })
  name: string;

  @ApiProperty({ example: 'hashedpassword123' })
  password: string;

  @ApiProperty({ example: 'user' })
  role: 'user' | 'contractor';
}
