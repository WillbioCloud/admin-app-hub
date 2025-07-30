
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Users, Store, Calendar, Download, Eye, Star } from 'lucide-react';
import { useReportsData } from '@/hooks/useReports';

// Dados mockados para avaliações (mantidos até termos sistema de avaliação)
const dadosAvaliacoes = [
  { nota: '5 estrelas', quantidade: 145, cor: '#10B981' },
  { nota: '4 estrelas', quantidade: 89, cor: '#3B82F6' },
  { nota: '3 estrelas', quantidade: 45, cor: '#F59E0B' },
  { nota: '2 estrelas', quantidade: 12, cor: '#EF4444' },
  { nota: '1 estrela', quantidade: 3, cor: '#6B7280' }
];

const RelatoriosPage = () => {
  const {
    totalUsers,
    totalComercios,
    comerciosAtivos,
    comerciosPorCategoria,
    totalMissoes,
    crescimentoMensal,
    layoutsPopulares,
    isLoading
  } = useReportsData();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // Calcular taxa de crescimento simulada
  const taxaCrescimento = totalUsers > 0 ? Math.floor((totalUsers / 10) * 100) / 10 : 0;
  const visualizacoes = totalComercios * 84; // Simulado baseado no número de comércios
  const notaMedia = 4.7; // Mantida como constante até implementar sistema de avaliações

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Relatórios e Analytics</h2>
          <p className="text-muted-foreground">
            Visualize métricas e estatísticas da plataforma
          </p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Exportar Relatório
        </Button>
      </div>

      {/* KPIs principais */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              +{taxaCrescimento}% desde o início
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comércios Ativos</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{comerciosAtivos}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              {totalComercios} total cadastrados
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{visualizacoes.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              Baseado nos comércios ativos
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missões Ativas</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMissoes}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              Gamificação ativa
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="crescimento" className="space-y-4">
        <TabsList>
          <TabsTrigger value="crescimento">Crescimento</TabsTrigger>
          <TabsTrigger value="categorias">Categorias</TabsTrigger>
          <TabsTrigger value="layouts">Layouts</TabsTrigger>
          <TabsTrigger value="satisfacao">Satisfação</TabsTrigger>
        </TabsList>

        <TabsContent value="crescimento">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Crescimento Simulado</CardTitle>
                <CardDescription>
                  Projeção baseada nos dados atuais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={crescimentoMensal}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="usuarios" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      name="Usuários"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="comercios" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      name="Comércios"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resumo Atual</CardTitle>
                <CardDescription>
                  Estatísticas em tempo real
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total de Usuários</span>
                  <span className="text-2xl font-bold">{totalUsers}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Comércios Cadastrados</span>
                  <span className="text-2xl font-bold">{totalComercios}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Comércios Ativos</span>
                  <span className="text-2xl font-bold">{comerciosAtivos}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Taxa de Ativação</span>
                  <span className="text-2xl font-bold">
                    {totalComercios > 0 ? Math.round((comerciosAtivos / totalComercios) * 100) : 0}%
                  </span>
                </div>
                
                <div className="pt-2">
                  <div className="text-xs text-muted-foreground mb-2">
                    Progresso da plataforma
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{width: `${Math.min((totalUsers / 100) * 100, 100)}%`}}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categorias">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Comércios por Categoria</CardTitle>
                <CardDescription>
                  Distribuição dos estabelecimentos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={comerciosPorCategoria}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="categoria" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" fill="#3B82F6" name="Total" />
                    <Bar dataKey="novos" fill="#10B981" name="Novos (est.)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Categorias</CardTitle>
                <CardDescription>
                  Categorias mais populares
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {comerciosPorCategoria
                    .sort((a, b) => b.total - a.total)
                    .slice(0, 5)
                    .map((categoria, index) => (
                    <div key={categoria.categoria} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{categoria.categoria}</div>
                          <div className="text-sm text-muted-foreground">
                            {categoria.novos} novos estimados
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{categoria.total}</div>
                        <div className="text-sm text-muted-foreground">comércios</div>
                      </div>
                    </div>
                  ))}
                  {comerciosPorCategoria.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      Nenhum comércio cadastrado ainda
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="layouts">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Preferência de Layouts</CardTitle>
                <CardDescription>
                  Distribuição dos layouts escolhidos
                </CardDescription>
              </CardHeader>
              <CardContent>
                {layoutsPopulares.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={layoutsPopulares}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ layout, valor }) => `${layout} (${valor}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="valor"
                      >
                        {layoutsPopulares.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.cor} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    Nenhum dado de layout disponível
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cores Mais Usadas</CardTitle>
                <CardDescription>
                  Paletas de cores populares (dados simulados)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { cor: '#3B82F6', nome: 'Azul Primário', uso: 35 },
                    { cor: '#10B981', nome: 'Verde Esmeralda', uso: 28 },
                    { cor: '#F59E0B', nome: 'Amarelo Âmbar', uso: 18 },
                    { cor: '#EF4444', nome: 'Vermelho', uso: 12 },
                    { cor: '#6366F1', nome: 'Índigo', uso: 7 }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-6 h-6 rounded-full border-2 border-gray-200"
                          style={{ backgroundColor: item.cor }}
                        />
                        <div>
                          <div className="font-medium">{item.nome}</div>
                          <div className="text-sm text-muted-foreground">{item.cor}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full"
                            style={{ 
                              width: `${item.uso}%`, 
                              backgroundColor: item.cor 
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium w-8">{item.uso}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="satisfacao">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Avaliações</CardTitle>
                <CardDescription>
                  Como os usuários avaliam os comércios (dados simulados)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dadosAvaliacoes} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="nota" type="category" width={80} />
                    <Tooltip />
                    <Bar dataKey="quantidade" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métricas de Satisfação</CardTitle>
                <CardDescription>
                  Indicadores de qualidade do serviço (dados simulados)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">{notaMedia}</div>
                  <div className="text-sm text-muted-foreground">Nota média geral</div>
                  <div className="flex justify-center mt-2">
                    {[1,2,3,4,5].map(star => (
                      <Star 
                        key={star} 
                        className="h-5 w-5 text-yellow-400 fill-current" 
                      />
                    ))}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Excelente (5★)</span>
                    <span className="font-medium">49%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '49%'}}></div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Muito Bom (4★)</span>
                    <span className="font-medium">30%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{width: '30%'}}></div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Bom (3★)</span>
                    <span className="font-medium">15%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{width: '15%'}}></div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="text-sm text-muted-foreground text-center">
                    Dados de satisfação simulados até implementação do sistema de avaliações
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RelatoriosPage;
