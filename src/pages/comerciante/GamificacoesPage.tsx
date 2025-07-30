
import React, { useState } from 'react';
import { Plus, Edit, Trash2, GamepadIcon, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

// Mock data para demonstração
const mockGamifications = [
  {
    id: '1',
    title: 'Primeira Compra',
    description: 'Complete sua primeira compra no supermercado',
    type: 'qr_code',
    completion_data: 'SUPER001',
    xp_reward: 100,
    coin_reward: 50,
    is_active: true,
    is_unique: true,
    loteamento_id: 'lote_001',
    location_type: 'supermercado',
    status: 'approved',
    created_at: '2024-01-15'
  },
  {
    id: '2',
    title: 'Cliente Fiel',
    description: 'Visite o mesmo comércio 5 vezes',
    type: 'code',
    completion_data: 'FIEL123',
    xp_reward: 200,
    coin_reward: 100,
    is_active: true,
    is_unique: false,
    loteamento_id: 'lote_001',
    location_type: 'farmacia',
    status: 'pending',
    created_at: '2024-01-20'
  },
  {
    id: '3',
    title: 'Desconto Especial',
    description: 'Ganhe desconto em produtos selecionados',
    type: 'qr_code',
    completion_data: 'DESC456',
    xp_reward: 150,
    coin_reward: 75,
    is_active: false,
    is_unique: true,
    loteamento_id: 'lote_001',
    location_type: 'supermercado',
    status: 'rejected',
    created_at: '2024-01-18'
  }
];

export default function GamificacoesPage() {
  const [gamifications, setGamifications] = useState(mockGamifications);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'qr_code',
    completion_data: '',
    xp_reward: 0,
    coin_reward: 0,
    is_active: true,
    is_unique: false,
    loteamento_id: '',
    location_type: ''
  });

  const handleSubmit = () => {
    const newGamification = {
      id: Date.now().toString(),
      ...formData,
      status: 'pending',
      created_at: new Date().toISOString().split('T')[0]
    };
    setGamifications([...gamifications, newGamification]);
    setIsDialogOpen(false);
    setFormData({
      title: '',
      description: '',
      type: 'qr_code',
      completion_data: '',
      xp_reward: 0,
      coin_reward: 0,
      is_active: true,
      is_unique: false,
      loteamento_id: '',
      location_type: ''
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Aprovada</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pendente</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejeitada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const approvedGamifications = gamifications.filter(g => g.status === 'approved');
  const pendingGamifications = gamifications.filter(g => g.status === 'pending');
  const rejectedGamifications = gamifications.filter(g => g.status === 'rejected');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gamificações</h1>
          <p className="text-muted-foreground">
            Crie e gerencie missões para seus clientes
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Gamificação
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Criar Nova Gamificação</DialogTitle>
              <DialogDescription>
                Preencha os dados da nova missão. Ela será enviada para aprovação do administrador.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Nome da missão"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva como completar a missão"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="qr_code">QR Code</SelectItem>
                      <SelectItem value="code">Código</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="completion_data">Código de Completar</Label>
                  <Input
                    id="completion_data"
                    value={formData.completion_data}
                    onChange={(e) => setFormData({ ...formData, completion_data: e.target.value })}
                    placeholder="CODIGO123"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="xp_reward">Recompensa XP</Label>
                  <Input
                    id="xp_reward"
                    type="number"
                    value={formData.xp_reward}
                    onChange={(e) => setFormData({ ...formData, xp_reward: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="coin_reward">Recompensa Moedas</Label>
                  <Input
                    id="coin_reward"
                    type="number"
                    value={formData.coin_reward}
                    onChange={(e) => setFormData({ ...formData, coin_reward: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="loteamento_id">Loteamento</Label>
                  <Input
                    id="loteamento_id"
                    value={formData.loteamento_id}
                    onChange={(e) => setFormData({ ...formData, loteamento_id: e.target.value })}
                    placeholder="lote_001"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location_type">Tipo de Local</Label>
                  <Select value={formData.location_type} onValueChange={(value) => setFormData({ ...formData, location_type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="supermercado">Supermercado</SelectItem>
                      <SelectItem value="farmacia">Farmácia</SelectItem>
                      <SelectItem value="padaria">Padaria</SelectItem>
                      <SelectItem value="restaurante">Restaurante</SelectItem>
                      <SelectItem value="loja">Loja</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_unique"
                    checked={formData.is_unique}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_unique: checked })}
                  />
                  <Label htmlFor="is_unique">Missão única</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Ativa</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleSubmit}>
                Criar Gamificação
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <GamepadIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gamifications.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedGamifications.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingGamifications.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejeitadas</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedGamifications.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="approved">Aprovadas</TabsTrigger>
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
          <TabsTrigger value="rejected">Rejeitadas</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Todas as Gamificações</CardTitle>
              <CardDescription>
                Lista completa de suas gamificações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Recompensas</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gamifications.map((gamification) => (
                    <TableRow key={gamification.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{gamification.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {gamification.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={gamification.type === 'qr_code' ? 'default' : 'secondary'}>
                          {gamification.type === 'qr_code' ? 'QR Code' : 'Código'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{gamification.xp_reward} XP</div>
                          <div>{gamification.coin_reward} Moedas</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(gamification.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" disabled={gamification.status === 'approved'}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" disabled={gamification.status === 'approved'}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved">
          <Card>
            <CardHeader>
              <CardTitle>Gamificações Aprovadas</CardTitle>
              <CardDescription>
                Missões aprovadas e ativas no aplicativo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Recompensas</TableHead>
                    <TableHead>Local</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvedGamifications.map((gamification) => (
                    <TableRow key={gamification.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{gamification.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {gamification.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={gamification.type === 'qr_code' ? 'default' : 'secondary'}>
                          {gamification.type === 'qr_code' ? 'QR Code' : 'Código'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{gamification.xp_reward} XP</div>
                          <div>{gamification.coin_reward} Moedas</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{gamification.location_type}</div>
                          <div className="text-muted-foreground">{gamification.loteamento_id}</div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Gamificações Pendentes</CardTitle>
              <CardDescription>
                Missões aguardando aprovação do administrador
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Recompensas</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingGamifications.map((gamification) => (
                    <TableRow key={gamification.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{gamification.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {gamification.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={gamification.type === 'qr_code' ? 'default' : 'secondary'}>
                          {gamification.type === 'qr_code' ? 'QR Code' : 'Código'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{gamification.xp_reward} XP</div>
                          <div>{gamification.coin_reward} Moedas</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {gamification.created_at}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected">
          <Card>
            <CardHeader>
              <CardTitle>Gamificações Rejeitadas</CardTitle>
              <CardDescription>
                Missões que foram rejeitadas pelo administrador
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Recompensas</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rejectedGamifications.map((gamification) => (
                    <TableRow key={gamification.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{gamification.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {gamification.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={gamification.type === 'qr_code' ? 'default' : 'secondary'}>
                          {gamification.type === 'qr_code' ? 'QR Code' : 'Código'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{gamification.xp_reward} XP</div>
                          <div>{gamification.coin_reward} Moedas</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {gamification.created_at}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
