import { Injectable } from '@nestjs/common';
import * as handlebars from 'handlebars';
import {
  TierUpgradeNotificationDto,
  PointsEarnedNotificationDto,
  RewardNotificationDto,
} from '../notification.dto';

@Injectable()
export class TemplateService {
  /**
   * Tier upgrade email template
   */
  getTierUpgradeTemplate(data: TierUpgradeNotificationDto): string {
    const template = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px; }
            .content { padding: 20px; background: #f9f9f9; margin: 20px 0; border-radius: 8px; }
            .tier-badge { display: inline-block; padding: 10px 20px; background: #FFD700; color: #333; border-radius: 20px; font-weight: bold; font-size: 18px; }
            .features { list-style: none; padding: 0; }
            .features li { padding: 8px 0; margin-left: 20px; }
            .features li:before { content: "✓ "; color: #10B981; font-weight: bold; margin-right: 8px; }
            .button { display: inline-block; padding: 12px 30px; background: #3B82F6; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
            .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Congratulations!</h1>
              <p>You've reached a new tier!</p>
            </div>
            
            <div class="content">
              <p>Hi {{userName}},</p>
              <p>We're excited to announce that you've been upgraded to:</p>
              
              <div style="text-align: center; margin: 20px 0;">
                <div class="tier-badge">⭐ {{tierName}} (Level {{tierLevel}})</div>
              </div>
              
              <h3>Your New Benefits:</h3>
              <ul class="features">
                <li>{{#each features}}{{this}}{{#unless @last}}</li><li>{{/unless}}{{/each}}</li>
              </ul>
              
              <p><strong>Points Multiplier: {{pointsMultiplier}}x</strong></p>
              <p>You'll now earn {{pointsMultiplier}}x points on every purchase!</p>
              
              <div style="text-align: center;">
                <a href="{{appUrl}}/profile" class="button">View Your Profile</a>
              </div>
            </div>
            
            <div class="footer">
              <p>© MaxLoyalty 2026. All rights reserved.</p>
              <p>Manage your preferences: {{preferencesUrl}}</p>
            </div>
          </div>
        </body>
      </html>
    `;
    return this.renderTemplate(template, data);
  }

  /**
   * Points earned email template
   */
  getPointsEarnedTemplate(data: PointsEarnedNotificationDto): string {
    const template = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px; }
            .points-box { background: #D1FAE5; border-left: 4px solid #10B981; padding: 20px; margin: 20px 0; border-radius: 5px; }
            .points-number { font-size: 32px; font-weight: bold; color: #10B981; }
            .button { display: inline-block; padding: 12px 30px; background: #3B82F6; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
            .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💰 Points Added!</h1>
            </div>
            
            <div class="content" style="padding: 20px;">
              <p>Hi {{userName}},</p>
              <p>Thank you for your purchase of <strong>€{{amount}}</strong>!</p>
              
              <div class="points-box">
                <p style="margin: 0 0 10px 0;">Points Earned:</p>
                <p class="points-number">+{{points}}</p>
              </div>
              
              <div style="background: #EFF6FF; padding: 15px; border-radius: 5px; margin: 15px 0;">
                <p><strong>Current Balance:</strong> {{currentBalance}} points</p>
              </div>
              
              <p>Keep earning to unlock exclusive rewards!</p>
              
              <div style="text-align: center;">
                <a href="{{appUrl}}/rewards" class="button">View Rewards</a>
              </div>
            </div>
            
            <div class="footer">
              <p>© MaxLoyalty 2026</p>
            </div>
          </div>
        </body>
      </html>
    `;
    return this.renderTemplate(template, data);
  }

  /**
   * Reward available email template
   */
  getRewardAvailableTemplate(data: RewardNotificationDto): string {
    const template = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 8px; }
            .reward-box { background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 20px; margin: 20px 0; border-radius: 5px; }
            .points-required { font-size: 24px; font-weight: bold; color: #F59E0B; }
            .button { display: inline-block; padding: 12px 30px; background: #F59E0B; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
            .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎁 New Reward Unlocked!</h1>
            </div>
            
            <div class="content" style="padding: 20px;">
              <p>Hi {{userName}},</p>
              <p>Great news! You now have access to a new reward:</p>
              
              <div class="reward-box">
                <h2 style="margin-top: 0; color: #D97706;">{{rewardName}}</h2>
                <p class="points-required">{{pointsRequired}} points</p>
                <p>Your balance: <strong>{{currentPoints}} points</strong></p>
              </div>
              
              <p>You have enough points to redeem this reward right now!</p>
              
              <div style="text-align: center;">
                <a href="{{appUrl}}/rewards" class="button">Redeem Now</a>
              </div>
            </div>
            
            <div class="footer">
              <p>© MaxLoyalty 2026</p>
            </div>
          </div>
        </body>
      </html>
    `;
    return this.renderTemplate(template, data);
  }

  /**
   * Welcome email template
   */
  getWelcomeTemplate(data: any): string {
    const template = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px; }
            .benefits { list-style: none; padding: 0; }
            .benefits li { padding: 10px 0; margin-left: 20px; }
            .benefits li:before { content: "✓ "; color: #10B981; font-weight: bold; margin-right: 8px; }
            .button { display: inline-block; padding: 12px 30px; background: #3B82F6; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
            .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>👋 Welcome to MaxLoyalty!</h1>
              <p>Start earning rewards today</p>
            </div>
            
            <div class="content" style="padding: 20px;">
              <p>Hi {{userName}},</p>
              <p>Thank you for joining our loyalty program! You're now ready to start earning rewards.</p>
              
              <h3>How It Works:</h3>
              <ul class="benefits">
                <li>Earn points on every purchase</li>
                <li>Unlock tiers with exclusive benefits</li>
                <li>Redeem points for amazing rewards</li>
                <li>Enjoy special perks and exclusive offers</li>
              </ul>
              
              <p>Your loyalty card is now active and ready to use!</p>
              
              <div style="text-align: center;">
                <a href="{{appUrl}}/card" class="button">View Your Card</a>
              </div>
            </div>
            
            <div class="footer">
              <p>© MaxLoyalty 2026</p>
              <p><a href="{{preferencesUrl}}" style="color: #3B82F6;">Manage notification preferences</a></p>
            </div>
          </div>
        </body>
      </html>
    `;
    return this.renderTemplate(template, data);
  }

  /**
   * Render Handlebars template
   */
  private renderTemplate(template: string, data: any): string {
    // Add default URLs
    const context = {
      appUrl: process.env.FRONTEND_URL || 'https://maxloyalty.app',
      preferencesUrl: `${process.env.FRONTEND_URL || 'https://maxloyalty.app'}/notifications`,
      ...data,
    };

    const compiled = handlebars.compile(template);
    return compiled(context);
  }
}
