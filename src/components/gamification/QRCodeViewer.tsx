import React from 'react';
import QRCode from 'qrcode';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Copy, QrCode } from 'lucide-react';
import { toast } from 'sonner';

interface QRCodeViewerProps {
  data: string;
  title?: string;
  size?: number;
}

export function QRCodeViewer({ data, title = "QR Code", size = 256 }: QRCodeViewerProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        setIsLoading(true);
        const url = await QRCode.toDataURL(data, {
          width: size,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        setQrCodeUrl(url);
      } catch (error) {
        console.error('Erro ao gerar QR Code:', error);
        toast.error('Erro ao gerar QR Code');
      } finally {
        setIsLoading(false);
      }
    };

    if (data) {
      generateQRCode();
    }
  }, [data, size]);

  const handleDownload = () => {
    if (!qrCodeUrl) return;
    
    const link = document.createElement('a');
    link.download = `qr-code-${title.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.href = qrCodeUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('QR Code baixado!');
  };

  const handleCopyData = async () => {
    try {
      await navigator.clipboard.writeText(data);
      toast.success('Dados copiados para área de transferência!');
    } catch (error) {
      toast.error('Erro ao copiar dados');
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Gerando QR Code...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>
          Escaneie para acessar: {data.length > 30 ? `${data.substring(0, 30)}...` : data}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          {qrCodeUrl && (
            <img 
              src={qrCodeUrl} 
              alt={`QR Code para ${title}`}
              className="border rounded-lg"
              style={{ width: size, height: size }}
            />
          )}
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDownload}
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-2" />
            Baixar
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCopyData}
            className="flex-1"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copiar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}