import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, Bell, Store, Wifi, WifiOff, RefreshCw, UserCheck, BarChart3, MessageSquare, Clock } from 'lucide-react';
import { useReports } from '@/hooks/useReports';
import { useRealtimeReports } from '@/hooks/useRealtimeReports';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ActivityFeed } from '@/components/admin/ActivityFeed';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { 
    totalUsers,
    totalComercios,
    comerciosAtivos,
    totalMissoes,
    totalTickets
  } = useReports();

  const { isConnected } = useRealtimeReports();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simular atualização
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastUpdate(new Date());
    setIsRefreshing(false);
  };

  const getCurrentTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const stats = [
    {
      title: 'Total de Usuários',
      value: totalUsers.toLocaleString(),
      description: 'Registrados na plataforma',
      icon: Users,
      trend: '+12%',
      gradient: 'from-blue-500/20 to-blue-600/20',
    },
    {
      title: 'Comércios Ativos',
      value: comerciosAtivos.toLocaleString(),
      description: `${totalComercios} cadastrados`,
      icon: Store,
      trend: '+8%',
      gradient: 'from-green-500/20 to-green-600/20',
    },
    {
      title: 'Missões Ativas',
      value: totalMissoes.toLocaleString(),
      description: 'Gamificações ativas',
      icon: FileText,
      trend: '+15%',
      gradient: 'from-purple-500/20 to-purple-600/20',
    },
    {
      title: 'Tickets Pendentes',
      value: totalTickets.toLocaleString(),
      description: 'Suporte técnico',
      icon: Bell,
      trend: '-3%',
      gradient: 'from-orange-500/20 to-orange-600/20',
    },
  ];

  return (
    <div className="space-y-8 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground">
            {getCurrentTime()}, Admin!
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Aqui está um resumo do que está acontecendo na sua plataforma hoje
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Última atualização: {lastUpdate.toLocaleTimeString()}</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Atualizar Painel
          </Button>
          <Badge 
            variant={isConnected ? "default" : "destructive"} 
            className="flex items-center gap-2 px-4 py-2 text-sm"
          >
            {isConnected ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
            {isConnected ? 'Sistema Online' : 'Sistema Offline'}
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className={`relative overflow-hidden bg-gradient-to-br ${stat.gradient} border-0 shadow-lg hover:shadow-xl transition-all duration-300`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground">
                    {stat.value}
                  </span>
                  <span className={`text-sm font-medium ${
                    stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.trend}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-background/50 rounded-lg">
                <stat.icon className="h-6 w-6 text-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Activity Section - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          <ActivityFeed />
        </div>

        {/* Status Section - 1 column */}
        <div className="space-y-6">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-xl">Status do Sistema</CardTitle>
              <CardDescription>
                Informações em tempo real
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
                  <span className="text-sm font-medium">Sistema</span>
                  <span className="text-sm font-bold text-green-600 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Online
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-background">
                  <span className="text-sm">Total de Usuários</span>
                  <span className="text-sm font-medium">{totalUsers.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-background">
                  <span className="text-sm">Comércios Ativos</span>
                  <span className="text-sm font-medium">{comerciosAtivos.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-background">
                  <span className="text-sm">Tempo Real</span>
                  <span className={`text-sm font-medium flex items-center gap-2 ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    {isConnected ? 'Conectado' : 'Desconectado'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-background">
                  <span className="text-sm">Versão</span>
                  <span className="text-sm font-medium">v1.2.3</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-xl">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <button 
                  onClick={() => navigate('/admin/comercios')}
                  className="w-full p-3 text-left rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors flex items-center gap-3"
                >
                  <Store className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Aprovar comércios pendentes</p>
                    <p className="text-xs text-muted-foreground">3 aguardando aprovação</p>
                  </div>
                </button>
                <button 
                  onClick={() => navigate('/admin/relatorios')}
                  className="w-full p-3 text-left rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors flex items-center gap-3"
                >
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Revisar relatórios</p>
                    <p className="text-xs text-muted-foreground">Dados atualizados</p>
                  </div>
                </button>
                <button 
                  onClick={() => navigate('/admin/notificacoes')}
                  className="w-full p-3 text-left rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors flex items-center gap-3"
                >
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Gerenciar notificações</p>
                    <p className="text-xs text-muted-foreground">2 novas mensagens</p>
                  </div>
                </button>
                <button 
                  onClick={() => navigate('/admin/usuarios')}
                  className="w-full p-3 text-left rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors flex items-center gap-3"
                >
                  <UserCheck className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Gerenciar usuários</p>
                    <p className="text-xs text-muted-foreground">Ver todos os usuários</p>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
