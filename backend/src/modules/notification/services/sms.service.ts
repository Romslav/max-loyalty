import { Injectable, Logger } from '@nestjs/common';
import { SendSMSDto } from '../notification.dto';

@Injectable()
export class SMSService {
  private logger = new Logger('SMSService');
  private twilioClient: any;

  constructor() {
    // Initialize Twilio (optional)
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      try {
        const twilio = require('twilio');
        this.twilioClient = twilio(
          process.env.TWILIO_ACCOUNT_SID,
          process.env.TWILIO_AUTH_TOKEN,
        );
      } catch (error) {
        this.logger.warn('Twilio not installed or not configured');
      }
    }
  }

  /**
   * Send SMS via Twilio
   */
  async sendSMS(dto: SendSMSDto): Promise<void> {
    try {
      if (!this.twilioClient) {
        this.logger.warn(
          'SMS service not configured. Logging message instead.',
        );
        this.logger.log(
          `[SMS Mock] To: ${dto.phoneNumber}, Message: ${dto.message}`,
        );
        return;
      }

      const message = await this.twilioClient.messages.create({
        body: dto.message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: dto.phoneNumber,
      });

      this.logger.log(`SMS sent to ${dto.phoneNumber}: ${message.sid}`);
    } catch (error) {
      this.logger.error(`Failed to send SMS to ${dto.phoneNumber}:`, error);
      throw error;
    }
  }

  /**
   * Send bulk SMS
   */
  async sendBulkSMS(messages: SendSMSDto[]): Promise<void> {
    const promises = messages.map((msg) => this.sendSMS(msg));
    await Promise.allSettled(promises);
  }
}
