import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // 🔍 SMTP connection test (ONLY for debugging)
    this.transporter.verify((error, success) => {
      if (error) {
        console.log('SMTP ERROR:', error);
      } else {
        console.log('SMTP READY ✅');
      }
    });
  }
  

  // OTP ko argument me receive karenge
  async sendOtpEmail(email: string, otp: string) {
    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Verify your account',
      html: `<h3>Your OTP is: ${otp}</h3>`,
    });
  }
}
