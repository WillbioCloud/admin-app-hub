
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Copy, QrCode, Hash, Check } from 'lucide-react';
import { toast } from 'sonner';

interface CodeGeneratorProps {
  type: 'qr_code' | 'code';
  value: string;
  onChange: (value: string) => void;
}

export function CodeGenerator({ type, value, onChange }: CodeGeneratorProps) {
  const [copied, setCopied] = useState(false);

  const generateCode = () => {
    let newCode: string;
    
    if (type === 'code') {
      // Gerar código alfanumérico de 8 caracteres
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      newCode = '';
      for (let i = 0; i < 8; i++) {
        newCode += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    } else {
      // Para QR Code, gerar um identificador único
      newCode = `QR_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    }
    
    onChange(newCode);
    toast.success(`${type === 'code' ? 'Código' : 'QR Code'} gerado com sucesso!`);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success('Código copiado para a área de transferência!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Erro ao copiar código');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {type === 'code' ? (
            <>
              <Hash className="h-4 w-4" />
              Código de Completar
            </>
          ) : (
            <>
              <QrCode className="h-4 w-4" />
              QR Code
            </>
          )}
        </CardTitle>
        <CardDescription className="text-xs">
          {type === 'code' 
            ? 'Código que o usuário deve inserir para completar a missão'
            : 'Identificador único para o QR Code da missão'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={type === 'code' ? 'Ex: ABC123XY' : 'Ex: QR_1234567890_ABC123'}
            className="font-mono text-sm"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={generateCode}
            className="whitespace-nowrap"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Gerar
          </Button>
        </div>
        
        {value && (
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="flex-1"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1" />
                  Copiar
                </>
              )}
            </Button>
            
            {type === 'qr_code' && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  // Aqui você pode implementar a visualização do QR Code
                  toast.info('Visualização do QR Code será implementada em breve');
                }}
              >
                <QrCode className="h-4 w-4 mr-1" />
                Visualizar
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
