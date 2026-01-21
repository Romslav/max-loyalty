import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';
import Button from './ui/Button';

interface TelegramIntegrationProps {
  onConnect?: () => void;
}

const TelegramIntegration: React.FC<TelegramIntegrationProps> = ({ onConnect }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const botUsername = process.env.REACT_APP_TELEGRAM_BOT_USERNAME || 'max_loyalty_bot';
  const telegramBotUrl = `https://t.me/${botUsername}`;

  useEffect(() => {
    // Check if user is already connected via Telegram
    const checkTelegramConnection = async () => {
      try {
        const response = await fetch('/api/auth/telegram/status');
        if (response.ok) {
          const data = await response.json();
          setIsConnected(data.connected);
        }
      } catch (err) {
        console.error('Failed to check Telegram connection:', err);
      }
    };

    checkTelegramConnection();
  }, []);

  const handleConnectTelegram = () => {
    setLoading(true);
    // Open Telegram bot in new window
    window.open(telegramBotUrl, '_blank', 'width=800,height=600');
    onConnect?.();
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2s9 5 20 5a9.5 9.5 0 0 0-9-5.5c4.75 2.25 9-0.75 11-4s3-8.5 3-8.5z" />
          </svg>
          <h3 className="text-lg font-bold">Telegram Bot</h3>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4">
          {isConnected
            ? '✅ Your Telegram account is connected!'
            : 'Connect your Telegram account to manage your loyalty cards on the go.'}
        </p>
        <p className="text-sm text-gray-600 mb-4">
          Use commands like /card to view points, /restaurants to browse, and /help for more.
        </p>
        {!isConnected && (
          <Button
            onClick={handleConnectTelegram}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Opening Telegram...' : 'Connect with Telegram'}
          </Button>
        )}
        {isConnected && (
          <div className="text-center text-sm text-green-600">
            You can also access the bot at:{' '}
            <a
              href={telegramBotUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold hover:underline"
            >
              @{botUsername}
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TelegramIntegration;
