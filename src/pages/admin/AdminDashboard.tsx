
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, Bell, Store } from 'lucide-react';
import { useReports } from '@/hooks/useReports';

const AdminDashboard = () => {
  const { 
    totalUsers,
    totalComercios,
    comerciosAtivos,
    totalMissoes,
    totalTickets
  } = useReports();

  const stats = [
    {
      title: 'Total de Usuários',
      value: totalUsers.toLocaleString(),
      description: 'Web + Mobile Apps',
      icon: Users,
    },
    {
      title: 'Comércios Cadastrados',
      value: totalComercios.toLocaleString(),
      description: `${comerciosAtivos} ativos`,
      icon: Store,
    },
    {
      title: 'Missões Ativas',
      value: totalMissoes.toLocaleString(),
      description: 'Gamificação em andamento',
      icon: FileText,
    },
    {
      title: 'Tickets de Suporte',
      value: totalTickets.toLocaleString(),
      description: 'Solicitações pendentes',
      icon: Bell,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Administrativo</h2>
        <p className="text-muted-foreground">
          Visão geral do sistema e estatísticas principais
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>
              Últimas ações no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <div className="text-sm">
                  <p className="font-medium">Sistema atualizado</p>
                  <p className="text-muted-foreground">há 2 horas</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <div className="text-sm">
                  <p className="font-medium">Novos usuários cadastrados</p>
                  <p className="text-muted-foreground">há 4 horas</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                <div className="text-sm">
                  <p className="font-medium">Comércios aprovados</p>
                  <p className="text-muted-foreground">ontem</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sistema</CardTitle>
            <CardDescription>
              Status e informações do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm">Status do Sistema</span>
                <span className="text-sm font-medium text-green-600">Online</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Total de Usuários</span>
                <span className="text-sm text-muted-foreground">{totalUsers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Comércios Ativos</span>
                <span className="text-sm text-muted-foreground">{comerciosAtivos}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Versão</span>
                <span className="text-sm text-muted-foreground">v1.2.3</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
