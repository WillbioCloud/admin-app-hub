
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Users, Store, Calendar, Download, Eye, Star } from 'lucide-react';

// Dados mockados para os gráficos
const dadosComerciosPorCategoria = [
  { categoria: 'Alimentação', total: 45, novos: 8 },
  { categoria: 'Saúde', total: 23, novos: 3 },
  { categoria: 'Fitness', total: 18, novos: 5 },
  { categoria: 'Serviços', total: 34, novos: 6 },
  { categoria: 'Varejo', total: 28, novos: 4 }
];

const dadosUsuariosPorMes = [
  { mes: 'Jan', usuarios: 12, comercios: 8 },
  { mes: 'Fev', usuarios: 19, comercios: 12 },
  { mes: 'Mar', usuarios: 25, comercios: 16 },
  { mes: 'Abr', usuarios: 32, comercios: 22 },
  { mes: 'Mai', usuarios: 28, comercios: 18 },
  { mes: 'Jun', usuarios: 35, comercios: 25 }
];

const dadosLayoutsPopulares = [
  { layout: 'Moderno', valor: 65, cor: '#3B82F6' },
  { layout: 'Clássico', valor: 35, cor: '#10B981' }
];

const dadosAvaliacoes = [
  { nota: '5 estrelas', quantidade: 145, cor: '#10B981' },
  { nota: '4 estrelas', quantidade: 89, cor: '#3B82F6' },
  { nota: '3 estrelas', quantidade: 45, cor: '#F59E0B' },
  { nota: '2 estrelas', quantidade: 12, cor: '#EF4444' },
  { nota: '1 estrela', quantidade: 3, cor: '#6B7280' }
];

const RelatoriosPage = () => {
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
            <div className="text-2xl font-bold">148</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              +12% desde o mês passado
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comércios Ativos</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">148</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              +8% desde o mês passado
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.4k</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              +25% desde o mês passado
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nota Média</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.7</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              +0.2 desde o mês passado
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
                <CardTitle>Crescimento Mensal</CardTitle>
                <CardDescription>
                  Novos usuários e comércios por mês
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dadosUsuariosPorMes}>
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
                <CardTitle>Resumo do Período</CardTitle>
                <CardDescription>
                  Estatísticas dos últimos 6 meses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Taxa de Crescimento</span>
                  <Badge className="bg-green-100 text-green-800">
                    +18.2%
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Novos Usuários</span>
                  <span className="text-2xl font-bold">35</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Novos Comércios</span>
                  <span className="text-2xl font-bold">25</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Taxa de Conversão</span>
                  <span className="text-2xl font-bold">71%</span>
                </div>
                
                <div className="pt-2">
                  <div className="text-xs text-muted-foreground mb-2">
                    Meta mensal: 30 novos usuários
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{width: '117%'}}></div>
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
                  <BarChart data={dadosComerciosPorCategoria}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="categoria" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" fill="#3B82F6" name="Total" />
                    <Bar dataKey="novos" fill="#10B981" name="Novos (mês)" />
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
                  {dadosComerciosPorCategoria
                    .sort((a, b) => b.total - a.total)
                    .map((categoria, index) => (
                    <div key={categoria.categoria} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{categoria.categoria}</div>
                          <div className="text-sm text-muted-foreground">
                            {categoria.novos} novos este mês
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{categoria.total}</div>
                        <div className="text-sm text-muted-foreground">comércios</div>
                      </div>
                    </div>
                  ))}
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
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dadosLayoutsPopulares}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ layout, valor }) => `${layout} (${valor}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="valor"
                    >
                      {dadosLayoutsPopulares.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.cor} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cores Mais Usadas</CardTitle>
                <CardDescription>
                  Paletas de cores populares
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
                  Como os usuários avaliam os comércios
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
                  Indicadores de qualidade do serviço
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">4.7</div>
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
                    94% dos usuários recomendam os comércios cadastrados
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
