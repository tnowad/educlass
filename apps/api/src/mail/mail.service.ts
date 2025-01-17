import { Injectable } from '@nestjs/common';
import { MailerService } from 'src/mailer/mailer.service';
import { MailData } from './interfaces/mail-data.interface';
import { join } from 'path';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async userSignUp(mailData: MailData<{ hash: string }>): Promise<void> {
    const url = new URL('http://localhost:3000/auth/confirm-email');
    url.searchParams.append('hash', mailData.data.hash);

    await this.mailerService.sendMail({
      to: mailData.to,
      subject: 'Confirm your email',
      templatePath: join('src', 'mail', 'templates', 'user-sign-up.hbs'),
      context: {
        title: 'Confirm your email',
        url: url.toString(),
        action: 'Confirm',
        appName: process.env.APP_NAME,
      },
    });
  }
}
