import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, Eye, Monitor, Smartphone, Globe, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SecurityDialogProps {
  trigger: React.ReactNode;
  type: 'password' | 'sessions' | '2fa';
}

export const SecurityDialog: React.FC<SecurityDialogProps> = ({ trigger, type }) => {
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { toast } = useToast();

  // Dados mock das sessões ativas
  const activeSessions = [
    {
      id: '1',
      device: 'Chrome - Windows',
      location: 'São Paulo, Brasil',
      lastActive: '2 minutos atrás',
      current: true,
      ip: '192.168.1.1',
      icon: Monitor
    },
    {
      id: '2', 
      device: 'Safari - iPhone',
      location: 'São Paulo, Brasil',
      lastActive: '1 hora atrás',
      current: false,
      ip: '192.168.1.5',
      icon: Smartphone
    },
    {
      id: '3',
      device: 'Firefox - Mac',
      location: 'Rio de Janeiro, Brasil',
      lastActive: '2 dias atrás',
      current: false,
      ip: '10.0.0.1',
      icon: Monitor
    }
  ];

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword.length < 8) {
      toast({
        title: "Erro", 
        description: "A senha deve ter pelo menos 8 caracteres",
        variant: "destructive"
      });
      return;
    }

    // Simular mudança de senha
    toast({
      title: "Sucesso",
      description: "Senha alterada com sucesso!"
    });
    setOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleTerminateSession = (sessionId: string) => {
    toast({
      title: "Sessão encerrada",
      description: "A sessão foi encerrada com sucesso"
    });
  };

  const handle2FASetup = () => {
    toast({
      title: "2FA Configurado",
      description: "Autenticação de dois fatores foi configurada com sucesso!"
    });
    setOpen(false);
  };

  const renderPasswordContent = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="current">Senha Atual</Label>
        <Input
          id="current"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Digite sua senha atual"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="new">Nova Senha</Label>
        <Input
          id="new"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Digite a nova senha"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirm">Confirmar Nova Senha</Label>
        <Input
          id="confirm"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Digite novamente a nova senha"
        />
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Requisitos da senha:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Pelo menos 8 caracteres</li>
          <li>• Pelo menos uma letra maiúscula</li>
          <li>• Pelo menos um número</li>
          <li>• Pelo menos um caractere especial</li>
        </ul>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={() => setOpen(false)}>
          Cancelar
        </Button>
        <Button onClick={handlePasswordChange}>
          Alterar Senha
        </Button>
      </div>
    </div>
  );

  const renderSessionsContent = () => (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Estas são as sessões ativas em sua conta. Você pode encerrar sessões que não reconhece.
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Dispositivo</TableHead>
            <TableHead>Localização</TableHead>
            <TableHead>Última Atividade</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activeSessions.map((session) => {
            const IconComponent = session.icon;
            return (
              <TableRow key={session.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <IconComponent className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{session.device}</div>
                      <div className="text-sm text-muted-foreground">{session.ip}</div>
                    </div>
                    {session.current && (
                      <Badge variant="default" className="ml-2">Atual</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    {session.location}
                  </div>
                </TableCell>
                <TableCell>{session.lastActive}</TableCell>
                <TableCell>
                  {!session.current && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTerminateSession(session.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );

  const render2FAContent = () => (
    <div className="space-y-4">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
          <Shield className="h-8 w-8 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Configurar Autenticação de Dois Fatores</h3>
          <p className="text-sm text-muted-foreground">
            Adicione uma camada extra de segurança à sua conta
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Como funciona?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">1</div>
            <div className="text-sm">
              <strong>Instale um app autenticador</strong>
              <p className="text-muted-foreground">Google Authenticator, Authy ou similar</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">2</div>
            <div className="text-sm">
              <strong>Escaneie o código QR</strong>
              <p className="text-muted-foreground">Use o app para escanear o código gerado</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">3</div>
            <div className="text-sm">
              <strong>Digite o código de verificação</strong>
              <p className="text-muted-foreground">Confirme com o código de 6 dígitos</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={() => setOpen(false)}>
          Cancelar
        </Button>
        <Button onClick={handle2FASetup}>
          Configurar 2FA
        </Button>
      </div>
    </div>
  );

  const getTitle = () => {
    switch (type) {
      case 'password': return 'Alterar Senha';
      case 'sessions': return 'Sessões Ativas';
      case '2fa': return 'Autenticação de Dois Fatores';
      default: return 'Configurações de Segurança';
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'password': return 'Mantenha sua conta segura com uma senha forte';
      case 'sessions': return 'Gerencie os dispositivos conectados à sua conta';
      case '2fa': return 'Adicione uma camada extra de proteção';
      default: return '';
    }
  };

  const getContent = () => {
    switch (type) {
      case 'password': return renderPasswordContent();
      case 'sessions': return renderSessionsContent();
      case '2fa': return render2FAContent();
      default: return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>
            {getDescription()}
          </DialogDescription>
        </DialogHeader>
        {getContent()}
      </DialogContent>
    </Dialog>
  );
};