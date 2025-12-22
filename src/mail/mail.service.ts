import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendTestEmail(to: string) {
    return this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject: 'SMTP Test Email',
      text: 'Agar ye email aa rahi hai, SMTP bilkul sahi kaam kar raha hai 🎉',
    });
  }
}
