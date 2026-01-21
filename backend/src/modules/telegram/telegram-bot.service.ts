import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Telegraf, Markup, Context } from 'telegraf';
import { PrismaService } from '../../prisma/prisma.service';
import { CardCodeService } from '../card-code/card-code.service';
import * as crypto from 'crypto';

/**
 * TelegramBotService handles Telegram Bot integration
 * - User registration and authentication
 * - Guest card creation
 * - Points notifications
 * - QR code management
 */
@Injectable()
export class TelegramBotService implements OnModuleInit {
  private bot: Telegraf;
  private readonly logger = new Logger(TelegramBotService.name);
  private readonly BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  private readonly BOT_WEBHOOK_URL = process.env.TELEGRAM_WEBHOOK_URL;
  private readonly BOT_WEBHOOK_PATH = '/telegram/webhook';

  constructor(
    private readonly prisma: PrismaService,
    private readonly cardCodeService: CardCodeService,
  ) {
    if (!this.BOT_TOKEN) {
      this.logger.warn('TELEGRAM_BOT_TOKEN not configured');
      return;
    }

    this.bot = new Telegraf(this.BOT_TOKEN);
  }

  async onModuleInit() {
    if (!this.BOT_TOKEN) {
      this.logger.warn('Telegram bot not initialized: missing token');
      return;
    }

    this.setupHandlers();

    // Set webhook if URL provided
    if (this.BOT_WEBHOOK_URL) {
      try {
        await this.bot.telegram.setWebhook(this.BOT_WEBHOOK_URL + this.BOT_WEBHOOK_PATH);
        this.logger.log(`Telegram webhook set to ${this.BOT_WEBHOOK_URL}`);
      } catch (error) {
        this.logger.error(`Failed to set webhook: ${error}`);
      }
    }
  }

  /**
   * Setup all telegram command handlers
   */
  private setupHandlers() {
    // /start command
    this.bot.start(async (ctx) => {
      await this.handleStart(ctx);
    });

    // /register command
    this.bot.command('register', async (ctx) => {
      await this.handleRegister(ctx);
    });

    // /card command - show current guest card
    this.bot.command('card', async (ctx) => {
      await this.handleCard(ctx);
    });

    // /points command - show current points
    this.bot.command('points', async (ctx) => {
      await this.handlePoints(ctx);
    });

    // /restaurants command - list available restaurants
    this.bot.command('restaurants', async (ctx) => {
      await this.handleRestaurants(ctx);
    });

    // /help command
    this.bot.command('help', async (ctx) => {
      await this.handleHelp(ctx);
    });

    // Callback queries (buttons)
    this.bot.action(/select_restaurant_(.+)/, async (ctx) => {
      await this.handleSelectRestaurant(ctx);
    });

    this.bot.action('generate_card', async (ctx) => {
      await this.handleGenerateCard(ctx);
    });

    this.bot.action('show_qr', async (ctx) => {
      await this.handleShowQR(ctx);
    });
  }

  /**
   * /start command handler
   */
  private async handleStart(ctx: Context) {
    try {
      const telegramUser = ctx.from;

      // Check if user exists
      let user = await this.prisma.user.findUnique({
        where: { telegramId: telegramUser.id.toString() },
      });

      if (!user) {
        // Create new user
        user = await this.prisma.user.create({
          data: {
            email: `${telegramUser.id}@telegram.local`,
            passwordHash: '', // No password for telegram users
            firstName: telegramUser.first_name,
            lastName: telegramUser.last_name || '',
            telegramId: telegramUser.id.toString(),
            telegramUsername: telegramUser.username,
            telegramFirstName: telegramUser.first_name,
            telegramLastName: telegramUser.last_name,
            role: 'USER',
          },
        });
      } else {
        // Update telegram info
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: {
            lastLoginAt: new Date(),
          },
        });
      }

      const welcomeMessage = `👋 Welcome to MaxLoyalty!

I'm your loyalty card manager. Here's what you can do:

📱 /register - Register and create your first loyalty card
💳 /card - View your current loyalty card
⭐ /points - Check your points balance
🏪 /restaurants - Browse available restaurants
❓ /help - Show available commands

Let's get started!`;

      await ctx.reply(welcomeMessage, {
        reply_markup: Markup.inlineKeyboard([
          [Markup.button.callback('📱 Register Now', 'generate_card')],
          [Markup.button.callback('📖 How it works', 'help')],
        ]).reply_markup,
      });

      this.logger.log(`User ${user.id} started bot from Telegram`);
    } catch (error) {
      this.logger.error(`Error in /start handler: ${error}`);
      await ctx.reply('❌ An error occurred. Please try again.');
    }
  }

  /**
   * /register command handler
   */
  private async handleRegister(ctx: Context) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { telegramId: ctx.from.id.toString() },
      });

      if (!user) {
        await ctx.reply('❌ Please use /start first');
        return;
      }

      // Get user's guest cards
      const cards = await this.prisma.guestCard.findMany({
        where: { userId: user.id },
        include: { restaurant: true },
      });

      if (cards.length > 0) {
        await ctx.reply('✅ You already have guest cards from these restaurants:', {
          reply_markup: Markup.inlineKeyboard(
            cards.map((card) => [
              Markup.button.callback(card.restaurant.name, `select_restaurant_${card.restaurant.id}`),
            ]),
          ).reply_markup,
        });
      } else {
        await ctx.reply('📍 Select a restaurant to create a loyalty card:', {
          reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('Generate Card', 'generate_card')],
          ]).reply_markup,
        });
      }
    } catch (error) {
      this.logger.error(`Error in /register handler: ${error}`);
      await ctx.reply('❌ An error occurred. Please try again.');
    }
  }

  /**
   * /card command handler
   */
  private async handleCard(ctx: Context) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { telegramId: ctx.from.id.toString() },
        include: {
          guestCards: {
            include: {
              restaurant: true,
              tier: true,
            },
          },
        },
      });

      if (!user) {
        await ctx.reply('❌ Please use /start first');
        return;
      }

      if (user.guestCards.length === 0) {
        await ctx.reply('📭 You don\'t have any loyalty cards yet. Use /register to create one.');
        return;
      }

      const card = user.guestCards[0]; // Show first card
      const message = `💳 Your Loyalty Card

🏪 Restaurant: ${card.restaurant.name}
⭐ Tier: ${card.tier?.name || 'Standard'}
⭐ Points: ${card.currentPoints}

📊 Total Earned: ${card.totalPointsEarned}
📊 Total Redeemed: ${card.totalPointsRedeemed}`;

      await ctx.reply(message, {
        reply_markup: Markup.inlineKeyboard([
          [Markup.button.callback('Show QR Code', 'show_qr')],
          [Markup.button.callback('View History', 'card_history')],
        ]).reply_markup,
      });
    } catch (error) {
      this.logger.error(`Error in /card handler: ${error}`);
      await ctx.reply('❌ An error occurred. Please try again.');
    }
  }

  /**
   * /points command handler
   */
  private async handlePoints(ctx: Context) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { telegramId: ctx.from.id.toString() },
        include: {
          guestCards: {
            include: { pointLogs: { take: 5, orderBy: { createdAt: 'desc' } } },
          },
        },
      });

      if (!user || user.guestCards.length === 0) {
        await ctx.reply('📭 You don\'t have any loyalty cards.');
        return;
      }

      let message = '⭐ Your Points\n\n';
      for (const card of user.guestCards) {
        message += `🏪 ${card.restaurant?.name || 'Restaurant'}\n`;
        message += `   Current: ${card.currentPoints} points\n\n`;
      }

      await ctx.reply(message);
    } catch (error) {
      this.logger.error(`Error in /points handler: ${error}`);
      await ctx.reply('❌ An error occurred. Please try again.');
    }
  }

  /**
   * /restaurants command handler
   */
  private async handleRestaurants(ctx: Context) {
    try {
      const restaurants = await this.prisma.restaurant.findMany({
        where: { status: 'ACTIVE' },
        take: 10,
      });

      if (restaurants.length === 0) {
        await ctx.reply('📭 No restaurants available.');
        return;
      }

      const buttons = restaurants.map((r) => [
        Markup.button.callback(r.name, `select_restaurant_${r.id}`),
      ]);

      await ctx.reply('🏪 Available Restaurants:', {
        reply_markup: Markup.inlineKeyboard(buttons).reply_markup,
      });
    } catch (error) {
      this.logger.error(`Error in /restaurants handler: ${error}`);
      await ctx.reply('❌ An error occurred. Please try again.');
    }
  }

  /**
   * /help command handler
   */
  private async handleHelp(ctx: Context) {
    const helpMessage = `ℹ️ Available Commands:

📱 /start - Welcome message and quick start
📝 /register - Create a loyalty card
💳 /card - View your current card
⭐ /points - Check points balance
🏪 /restaurants - Browse restaurants
❓ /help - Show this message

💡 Features:
• Earn points on every purchase
• Get exclusive rewards
• Join VIP tiers
• Manage multiple loyalty cards

📞 Support: https://support.maxloyalty.com`;

    await ctx.reply(helpMessage);
  }

  /**
   * Callback: Select restaurant
   */
  private async handleSelectRestaurant(ctx: Context) {
    try {
      const restaurantId = (ctx.match as any)[1];
      const user = await this.prisma.user.findUnique({
        where: { telegramId: ctx.from.id.toString() },
      });

      // Check if card already exists
      const existingCard = await this.prisma.guestCard.findFirst({
        where: {
          restaurantId,
          userId: user.id,
        },
      });

      if (existingCard) {
        await ctx.answerCbQuery('✅ You already have a card for this restaurant');
        return;
      }

      // Create new card
      const restaurant = await this.prisma.restaurant.findUnique({
        where: { id: restaurantId },
      });

      const newCard = await this.prisma.guestCard.create({
        data: {
          restaurantId,
          userId: user.id,
          status: 'ACTIVE',
          cardType: 'STANDARD',
        },
      });

      // Generate QR code
      const qrCode = await this.cardCodeService.generateNewCode(newCard.id, restaurantId);

      await ctx.editMessageText(
        `✅ Card created for ${restaurant.name}!\n\nYour QR code: ${qrCode}`,
      );

      this.logger.log(`Card created via Telegram for user ${user.id}`);
    } catch (error) {
      this.logger.error(`Error selecting restaurant: ${error}`);
      await ctx.answerCbQuery('❌ Error creating card');
    }
  }

  /**
   * Callback: Generate card
   */
  private async handleGenerateCard(ctx: Context) {
    try {
      await ctx.answerCbQuery();
      await this.handleRestaurants(ctx);
    } catch (error) {
      this.logger.error(`Error generating card: ${error}`);
    }
  }

  /**
   * Callback: Show QR code
   */
  private async handleShowQR(ctx: Context) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { telegramId: ctx.from.id.toString() },
        include: { guestCards: true },
      });

      if (!user || user.guestCards.length === 0) {
        await ctx.answerCbQuery('No cards found');
        return;
      }

      const card = user.guestCards[0];
      const qrCode = await this.cardCodeService.getActiveCode(card.id);

      if (qrCode) {
        await ctx.reply(`📱 Your QR Code: ${qrCode}\n\nScan this at the restaurant to earn points!`);
      }

      await ctx.answerCbQuery();
    } catch (error) {
      this.logger.error(`Error showing QR: ${error}`);
      await ctx.answerCbQuery('❌ Error');
    }
  }

  /**
   * Send notification to telegram user
   */
  async sendNotification(userId: string, message: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { telegramId: true },
      });

      if (!user || !user.telegramId) {
        return;
      }

      await this.bot.telegram.sendMessage(parseInt(user.telegramId), message);
      this.logger.debug(`Notification sent to user ${userId}`);
    } catch (error) {
      this.logger.error(`Failed to send notification: ${error}`);
    }
  }

  /**
   * Get bot instance for webhook handling
   */
  getBotMiddleware() {
    return this.bot.middleware();
  }

  /**
   * Handle webhook update
   */
  async handleWebhookUpdate(update: any) {
    if (this.bot) {
      await this.bot.handleUpdate(update);
    }
  }
}
