import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { ProfilePhotoUpload } from '@/components/admin/ProfilePhotoUpload';
import { Separator } from '@/components/ui/separator';

const ComerciantePerfilPage = () => {
  const { user, logout } = useAuth();

  const handlePhotoChange = (photoUrl: string) => {
    // Aqui você pode implementar a lógica para salvar a foto no perfil do usuário
    console.log('Nova foto:', photoUrl);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Perfil do Comerciante</h2>
          <p className="text-muted-foreground">
            Gerencie suas informações pessoais e configurações
          </p>
        </div>
        <ThemeToggle />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Informações do Perfil */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>
              Suas informações básicas de conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={(user as any)?.avatar_url} alt={user?.name} />
                <AvatarFallback className="text-lg">
                  {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{user?.name}</h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <p className="text-xs text-muted-foreground">Comerciante</p>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium">Email:</span>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Nome:</span>
                <p className="text-sm text-muted-foreground">{user?.name}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Tipo de Conta:</span>
                <p className="text-sm text-muted-foreground">Comerciante</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload de Foto */}
        <div className="space-y-6">
          <ProfilePhotoUpload
            currentPhoto={(user as any)?.avatar_url}
            onPhotoChange={handlePhotoChange}
            userName={user?.name || 'Usuário'}
          />
          
          {/* Configurações da Conta */}
          <Card>
            <CardHeader>
              <CardTitle>Configurações da Conta</CardTitle>
              <CardDescription>
                Gerencie suas preferências e segurança
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Tema</p>
                  <p className="text-sm text-muted-foreground">Escolha entre claro e escuro</p>
                </div>
                <ThemeToggle />
              </div>
              <Separator />
              <Button variant="outline" className="w-full">
                Alterar Senha
              </Button>
              <Button variant="destructive" onClick={logout} className="w-full">
                Sair da Conta
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ComerciantePerfilPage;