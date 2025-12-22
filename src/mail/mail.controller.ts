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
        otp: { type: 'string', example: '12345' }, // OTP input for testing
      },
    },
  })
  async sendTest(@Body('email') email: string, @Body('otp') otp: string) {
    await this.mailService.sendOtpEmail(email, otp);
    return { message: 'Email sent successfully' };
  }
}
