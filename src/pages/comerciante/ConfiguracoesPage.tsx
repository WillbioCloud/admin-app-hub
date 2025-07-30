
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Bell, Shield, Eye, Mail, Phone, Globe } from 'lucide-react';

interface ConfiguracoesData {
  notificacoesPush: boolean;
  notificacoesEmail: boolean;
  notificacoesSms: boolean;
  perfilPublico: boolean;
  mostrarTelefone: boolean;
  mostrarEmail: boolean;
  mostrarEndereco: boolean;
}

const ConfiguracoesPage = () => {
  const [pendingChanges, setPendingChanges] = useState(false);

  const form = useForm<ConfiguracoesData>({
    defaultValues: {
      notificacoesPush: true,
      notificacoesEmail: true,
      notificacoesSms: false,
      perfilPublico: true,
      mostrarTelefone: true,
      mostrarEmail: false,
      mostrarEndereco: true,
    }
  });

  const onSubmit = (data: ConfiguracoesData) => {
    console.log('Configurações atualizadas:', data);
    setPendingChanges(false);
    alert('Configurações salvas com sucesso!');
  };

  const handleFieldChange = () => {
    setPendingChanges(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
        <p className="text-muted-foreground">
          Gerencie suas preferências e configurações de privacidade
        </p>
      </div>

      {pendingChanges && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-orange-800">Alterações Pendentes</h3>
                <p className="text-sm text-orange-700">Você tem alterações não salvas</p>
              </div>
              <Button onClick={form.handleSubmit(onSubmit)}>
                Salvar Configurações
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notificações</span>
              </CardTitle>
              <CardDescription>
                Configure como deseja receber notificações sobre seu comércio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="notificacoesPush"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Notificações Push</FormLabel>
                      <FormDescription>
                        Receba notificações em tempo real no navegador
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(value) => {
                          field.onChange(value);
                          handleFieldChange();
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notificacoesEmail"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span>Notificações por Email</span>
                      </FormLabel>
                      <FormDescription>
                        Receba resumos diários e atualizações importantes
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(value) => {
                          field.onChange(value);
                          handleFieldChange();
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notificacoesSms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span>Notificações por SMS</span>
                      </FormLabel>
                      <FormDescription>
                        Receba alertas urgentes via mensagem de texto
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(value) => {
                          field.onChange(value);
                          handleFieldChange();
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Privacidade</span>
              </CardTitle>
              <CardDescription>
                Controle a visibilidade das suas informações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="perfilPublico"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base flex items-center space-x-2">
                        <Globe className="h-4 w-4" />
                        <span>Perfil Público</span>
                      </FormLabel>
                      <FormDescription>
                        Seu comércio aparecerá nas buscas do aplicativo
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(value) => {
                          field.onChange(value);
                          handleFieldChange();
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Separator />

              <div>
                <h4 className="text-sm font-medium mb-4">Informações Visíveis no Perfil</h4>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="mostrarTelefone"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between">
                        <div className="space-y-0.5">
                          <FormLabel>Telefone</FormLabel>
                          <FormDescription>
                            Mostrar número de telefone para contato
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={(value) => {
                              field.onChange(value);
                              handleFieldChange();
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mostrarEmail"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between">
                        <div className="space-y-0.5">
                          <FormLabel>Email</FormLabel>
                          <FormDescription>
                            Mostrar endereço de email para contato
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={(value) => {
                              field.onChange(value);
                              handleFieldChange();
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mostrarEndereco"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between">
                        <div className="space-y-0.5">
                          <FormLabel>Endereço</FormLabel>
                          <FormDescription>
                            Mostrar endereço completo do estabelecimento
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={(value) => {
                              field.onChange(value);
                              handleFieldChange();
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conta</CardTitle>
              <CardDescription>
                Configurações da sua conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email da Conta</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value="comerciante@loja.com" 
                  disabled 
                  className="bg-muted"
                />
                <p className="text-sm text-muted-foreground">
                  Para alterar o email, entre em contato com o suporte
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Button variant="outline" type="button">
                  Alterar Senha
                </Button>
                <p className="text-sm text-muted-foreground">
                  Clique para redefinir sua senha
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => {
              form.reset();
              setPendingChanges(false);
            }}>
              Cancelar
            </Button>
            <Button type="submit">
              Salvar Configurações
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ConfiguracoesPage;
