import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFile } from 'fs';
import Handlebars from 'handlebars';
import { createTransport, SendMailOptions, Transporter } from 'nodemailer';
import { AllConfigType } from 'src/config/app.type';

@Injectable()
export class MailerService {
  private readonly transporter: Transporter;

  constructor(private readonly configService: ConfigService<AllConfigType>) {
    this.transporter = createTransport({
      host: this.configService.get('mail').host,
      port: this.configService.get('mail').port,
      secure: this.configService.get('mail').secure,
      auth: {
        user: this.configService.get('mail').user,
        pass: this.configService.get('mail').password,
      },
    });
  }

  async sendMail({
    templatePath,
    context,
    ...mailOptions
  }: SendMailOptions & {
    templatePath: string;
    context: Record<string, unknown>;
  }): Promise<void> {
    let html: string | undefined;
    if (templatePath) {
      html = await new Promise<string>((resolve, reject) => {
        readFile(templatePath, 'utf8', (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });

      const template = Handlebars.compile(html);
      html = template(context);
    }

    await this.transporter.sendMail({
      ...mailOptions,
      from: mailOptions.from
        ? mailOptions.from
        : `${process.env.SMTP_NAME} <${process.env.SMTP_USER}>`,
      html: mailOptions.html ? mailOptions.html : html,
    });
  }
}
