import { Injectable } from '@nestjs/common';
import { readFile } from 'fs';
import Handlebars from 'handlebars';
import { createTransport, SendMailOptions, Transporter } from 'nodemailer';

@Injectable()
export class MailerService {
  private readonly transporter: Transporter;

  constructor() {
    this.transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
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
