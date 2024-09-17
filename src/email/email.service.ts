import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmailService {
  private transporter: any;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'shubhamjain0176@gmail.com',
        pass: 'ezuqjxhkacdgavwy',
      },
    });
  }

  async sendMail(
    to: string,
    subject: string,
    text?: string,
    htmlFilePath?: string,
  ): Promise<void> {
    try {
      let htmlContent: string | undefined;

      // If the HTML file path is provided, read the HTML template from the file system
      if (htmlFilePath) {
        const templatePath = path.resolve(htmlFilePath); // Use absolute path
        htmlContent = fs.readFileSync(templatePath, 'utf-8');
      }

      // Send the email with text, html, or both
      await this.transporter.sendMail({
        from: 'shubhamjain0176@gmail.com',
        to,
        subject,
        text: text || undefined,
        html: htmlContent || undefined,
      });

      console.log(`Email sent to ${to}: ${subject}`);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }
}
