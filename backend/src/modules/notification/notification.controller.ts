import { Controller, Get, Post, Put, Body } from '@nestjs/common';
import { NotificationService } from './services/notification.service';
import { NotificationPreferencesDto } from './notification.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  /**
   * Get notification preferences for current user
   */
  @Get('preferences')
  async getPreferences() {
    // In a real app, get userId from request context
    const userId = 'current-user-id';
    return this.notificationService.getPreferences(userId);
  }

  /**
   * Update notification preferences
   */
  @Put('preferences')
  async updatePreferences(@Body() dto: NotificationPreferencesDto) {
    const userId = 'current-user-id';
    await this.notificationService.updatePreferences(userId, dto);
    return { success: true, message: 'Preferences updated' };
  }

  /**
   * Send test email
   */
  @Post('test-email')
  async sendTestEmail(@Body('email') email: string) {
    await this.notificationService.sendWelcomeEmail(email, 'Test User');
    return { success: true, message: 'Test email sent' };
  }
}
