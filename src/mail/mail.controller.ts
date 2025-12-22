import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { MailService } from './mail.service';

@ApiTags('Email Test')
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('test')
  @ApiBody({
    schema: {
      properties: {
        email: { type: 'string', example: 'maria@gmail.com' },
      },
    },
  })
  async sendTest(@Body('email') email: string) {
    await this.mailService.sendTestEmail(email);
    return { message: 'Email sent successfully' };
  }
}
