import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import Button from './ui/Button';
import { Card, CardHeader, CardContent, CardFooter } from './ui/Card';
import axiosInstance from '../services/api';

interface QRCodeDisplayProps {
  cardId: string;
  restaurantName?: string;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ cardId, restaurantName }) => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rotationTime, setRotationTime] = useState<number>(300); // 5 minutes

  useEffect(() => {
    loadQRCode();
    // Refresh QR code every 5 minutes
    const interval = setInterval(() => {
      loadQRCode();
      setRotationTime(300);
    }, 300000);
    return () => clearInterval(interval);
  }, [cardId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setRotationTime((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const loadQRCode = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/cards/${cardId}/qr-code`);
      setQrCode(response.data.code);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load QR code');
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = () => {
    const element = document.getElementById(`qrcode-${cardId}`);
    if (element) {
      const link = document.createElement('a');
      link.href = (element as any).toDataURL('image/png');
      link.download = `loyalty-card-${cardId}.png`;
      link.click();
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <h2 className="text-xl font-bold">Your QR Code</h2>
        {restaurantName && (
          <p className="text-sm text-gray-600 mt-1">{restaurantName}</p>
        )}
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-600">Loading QR code...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-center">
            {error}
          </div>
        ) : qrCode ? (
          <div className="flex flex-col items-center gap-4">
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
              <QRCode
                id={`qrcode-${cardId}`}
                value={qrCode}
                size={256}
                level="H"
                includeMargin={true}
              />
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Code:</p>
              <p className="font-mono font-bold text-lg tracking-widest">{qrCode}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Rotates in</p>
              <p className="text-lg font-bold text-blue-600 font-mono">
                {formatTime(rotationTime)}
              </p>
            </div>
          </div>
        ) : null}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={loadQRCode}>
          Refresh
        </Button>
        <Button className="flex-1" onClick={downloadQRCode}>
          Download
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QRCodeDisplay;
