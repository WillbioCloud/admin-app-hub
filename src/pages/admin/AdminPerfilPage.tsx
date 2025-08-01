import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { User, Mail, Shield, Calendar, LogOut, Eye, Settings, Users as UsersIcon, Store } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ProfilePhotoUpload } from '@/components/admin/ProfilePhotoUpload';
import { SecurityDialog } from '@/components/admin/SecurityDialog';
import { useReports } from '@/hooks/useReports';

interface AdminFormData {
  nome: string;
  email: string;
  bio: string;
  telefone: string;
}

const AdminPerfilPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState('');
  
  // Buscar estatísticas reais
  const { 
    totalUsers, 
    totalComercios, 
    comerciosAtivos, 
    totalMissoes 
  } = useReports();

  const form = useForm<AdminFormData>({
    defaultValues: {
      nome: 'Administrador do App',
      email: 'admin@app.com',
      bio: 'Responsável pela administração geral do aplicativo e aprovação de comércios.',
      telefone: '(11) 98765-4321'
    }
  });

  const onSubmit = (data: AdminFormData) => {
    console.log('Dados do perfil admin:', data);
    setIsEditing(false);
    alert('Perfil atualizado com sucesso!');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Perfil do Administrador</h2>
          <p className="text-muted-foreground">
            Gerencie suas informações pessoais e configurações de conta
          </p>
        </div>
        <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          Sair da Conta
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium text-muted-foreground">Nível de Acesso</CardTitle>
              <div className="text-3xl font-bold text-foreground mt-2">Admin</div>
              <Badge variant="default" className="mt-2">Acesso Total</Badge>
            </div>
            <div className="p-3 bg-background/50 rounded-lg">
              <Shield className="h-6 w-6 text-foreground" />
            </div>
          </CardHeader>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-green-500/20 to-green-600/20 border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium text-muted-foreground">Status da Conta</CardTitle>
              <div className="text-3xl font-bold text-green-600 mt-2">Ativo</div>
              <Badge variant="default" className="mt-2">Verificado</Badge>
            </div>
            <div className="p-3 bg-background/50 rounded-lg">
              <User className="h-6 w-6 text-green-600" />
            </div>
          </CardHeader>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium text-muted-foreground">Último Login</CardTitle>
              <div className="text-3xl font-bold text-foreground mt-2">Hoje</div>
              <p className="text-sm text-muted-foreground mt-1">{new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            <div className="p-3 bg-background/50 rounded-lg">
              <Calendar className="h-6 w-6 text-foreground" />
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Upload de Foto de Perfil */}
      <ProfilePhotoUpload
        currentPhoto={profilePhoto}
        onPhotoChange={setProfilePhoto}
        userName={form.getValues('nome')}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Informações Pessoais
            <Button 
              variant={isEditing ? "outline" : "default"} 
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancelar' : 'Editar'}
            </Button>
          </CardTitle>
          <CardDescription>
            Suas informações básicas de perfil
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="email"
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="telefone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                          placeholder="(00) 00000-0000"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biografia</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                        placeholder="Conte um pouco sobre você..."
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isEditing && (
                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Salvar Alterações
                  </Button>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configurações de Segurança</CardTitle>
          <CardDescription>
            Gerencie as configurações de segurança da sua conta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Alterar Senha</h4>
              <p className="text-sm text-muted-foreground">Atualize sua senha regularmente para manter a segurança</p>
            </div>
            <SecurityDialog
              type="password"
              trigger={
                <Button variant="outline" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Alterar Senha
                </Button>
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Autenticação de Dois Fatores</h4>
              <p className="text-sm text-muted-foreground">Adicione uma camada extra de segurança à sua conta</p>
            </div>
            <SecurityDialog
              type="2fa"
              trigger={
                <Button variant="outline" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Configurar 2FA
                </Button>
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Sessões Ativas</h4>
              <p className="text-sm text-muted-foreground">Veja e gerencie dispositivos conectados</p>
            </div>
            <SecurityDialog
              type="sessions"
              trigger={
                <Button variant="outline" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Ver Sessões
                </Button>
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg bg-red-50 border-red-200">
            <div>
              <h4 className="font-medium text-red-900">Encerrar Sessão</h4>
              <p className="text-sm text-red-700">Sair da sua conta em todos os dispositivos</p>
            </div>
            <Button variant="destructive" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Estatísticas da Conta</CardTitle>
          <CardDescription>
            Resumo da sua atividade administrativa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="p-4 border rounded-lg text-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50">
              <Store className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{comerciosAtivos}</div>
              <p className="text-sm text-muted-foreground">Comércios Ativos</p>
            </div>
            <div className="p-4 border rounded-lg text-center bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50">
              <UsersIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{totalUsers}</div>
              <p className="text-sm text-muted-foreground">Total de Usuários</p>
            </div>
            <div className="p-4 border rounded-lg text-center bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50">
              <div className="text-2xl mb-2">🎯</div>
              <div className="text-2xl font-bold text-orange-600">{totalMissoes}</div>
              <p className="text-sm text-muted-foreground">Missões Ativas</p>
            </div>
            <div className="p-4 border rounded-lg text-center bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50">
              <div className="text-2xl mb-2">🏪</div>
              <div className="text-2xl font-bold text-purple-600">{totalComercios}</div>
              <p className="text-sm text-muted-foreground">Total Comércios</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPerfilPage;
