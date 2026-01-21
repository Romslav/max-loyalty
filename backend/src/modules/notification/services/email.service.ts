import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SendEmailDto } from '../notification.dto';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private logger = new Logger('EmailService');

  constructor() {
    // Initialize email transporter
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      ...(process.env.EMAIL_HOST && {
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_SECURE === 'true',
      }),
    });
  }

  /**
   * Send email
   */
  async sendEmail(dto: SendEmailDto): Promise<void> {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: dto.to,
        subject: dto.subject,
        html: dto.html,
        text: dto.text || '',
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent to ${dto.to}: ${dto.subject}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${dto.to}:`, error);
      throw error;
    }
  }

  /**
   * Send bulk emails
   */
  async sendBulkEmails(emails: SendEmailDto[]): Promise<void> {
    const promises = emails.map((email) => this.sendEmail(email));
    await Promise.allSettled(promises);
  }

  /**
   * Verify connection
   */
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      this.logger.log('Email service connected successfully');
      return true;
    } catch (error) {
      this.logger.error('Email service connection failed:', error);
      return false;
    }
  }
}
