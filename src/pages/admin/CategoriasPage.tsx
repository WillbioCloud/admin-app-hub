
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { Plus, Edit, Trash2, Tag, Search } from 'lucide-react';

interface Categoria {
  id: string;
  nome: string;
  descricao: string;
  cor: string;
  icone: string;
  comercios: number;
  ativa: boolean;
}

interface FormData {
  nome: string;
  descricao: string;
  cor: string;
  icone: string;
}

const categoriasPadrao: Categoria[] = [
  {
    id: '1',
    nome: 'Alimentação',
    descricao: 'Restaurantes, lanchonetes, padarias e estabelecimentos de comida',
    cor: '#FF6B6B',
    icone: '🍽️',
    comercios: 45,
    ativa: true
  },
  {
    id: '2',
    nome: 'Saúde',
    descricao: 'Farmácias, clínicas, consultórios médicos e dentários',
    cor: '#4ECDC4',
    icone: '🏥',
    comercios: 23,
    ativa: true
  },
  {
    id: '3',
    nome: 'Saúde e Fitness',
    descricao: 'Estabelecimentos que combinam saúde e atividade física',
    cor: '#45B7D1',
    icone: '💪',
    comercios: 12,
    ativa: true
  },
  {
    id: '4',
    nome: 'Fitness',
    descricao: 'Academias, estúdios de pilates, personal trainers',
    cor: '#F9CA24',
    icone: '🏋️',
    comercios: 18,
    ativa: true
  },
  {
    id: '5',
    nome: 'Serviços',
    descricao: 'Salões de beleza, oficinas, consultoria e outros serviços',
    cor: '#6C5CE7',
    icone: '🛠️',
    comercios: 34,
    ativa: true
  },
  {
    id: '6',
    nome: 'Varejo',
    descricao: 'Lojas de roupas, eletrônicos, casa e decoração',
    cor: '#A29BFE',
    icone: '🛍️',
    comercios: 28,
    ativa: true
  },
  {
    id: '7'
    nome: 'Supermercado'
    descricao: 'estabelecimento comercial de grande porte, geralmente com autosserviço, variedade de produtos alimentícios e não alimentícios, organizados em seções e corredores.'
    cor: 'verde'
    icone: '🛍️'
    comercios: 32
    ativa: true
  }
];

const CategoriasPage = () => {
  const [categorias, setCategorias] = useState<Categoria[]>(categoriasPadrao);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [criandoNova, setCriandoNova] = useState(false);
  const [busca, setBusca] = useState('');

  const form = useForm<FormData>({
    defaultValues: {
      nome: '',
      descricao: '',
      cor: '#3B82F6',
      icone: ''
    }
  });

  const categoriasFiltradas = categorias.filter(categoria =>
    categoria.nome.toLowerCase().includes(busca.toLowerCase()) ||
    categoria.descricao.toLowerCase().includes(busca.toLowerCase())
  );

  const iniciarEdicao = (categoria: Categoria) => {
    setEditandoId(categoria.id);
    form.reset({
      nome: categoria.nome,
      descricao: categoria.descricao,
      cor: categoria.cor,
      icone: categoria.icone
    });
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setCriandoNova(false);
    form.reset();
  };

  const salvarCategoria = (data: FormData) => {
    if (editandoId) {
      // Editar categoria existente
      setCategorias(categorias.map(cat => 
        cat.id === editandoId 
          ? { ...cat, ...data }
          : cat
      ));
      setEditandoId(null);
    } else {
      // Criar nova categoria
      const novaCategoria: Categoria = {
        id: Date.now().toString(),
        ...data,
        comercios: 0,
        ativa: true
      };
      setCategorias([...categorias, novaCategoria]);
      setCriandoNova(false);
    }
    form.reset();
  };

  const toggleStatus = (id: string) => {
    setCategorias(categorias.map(cat =>
      cat.id === id ? { ...cat, ativa: !cat.ativa } : cat
    ));
  };

  const removerCategoria = (id: string) => {
    if (confirm('Tem certeza que deseja remover esta categoria?')) {
      setCategorias(categorias.filter(cat => cat.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gerenciar Categorias</h2>
          <p className="text-muted-foreground">
            Configure as categorias disponíveis para os comerciantes
          </p>
        </div>
        <Button onClick={() => setCriandoNova(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Categoria
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Categorias</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categorias.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorias Ativas</CardTitle>
            <div className="h-2 w-2 bg-green-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categorias.filter(c => c.ativa).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Comércios</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">🏪</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categorias.reduce((acc, cat) => acc + cat.comercios, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Busca */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar categorias..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Formulário */}
      {(criandoNova || editandoId) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editandoId ? 'Editar Categoria' : 'Nova Categoria'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(salvarCategoria)} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome da Categoria</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Alimentação" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="icone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ícone (Emoji)</FormLabel>
                        <FormControl>
                          <Input placeholder="🍽️" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="descricao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descrição da categoria..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cor</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Input type="color" {...field} className="w-16" />
                          <Input placeholder="#3B82F6" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={cancelarEdicao}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editandoId ? 'Salvar' : 'Criar'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Lista de Categorias */}
      <Card>
        <CardHeader>
          <CardTitle>Categorias Configuradas</CardTitle>
          <CardDescription>
            {categoriasFiltradas.length} categoria(s) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Categoria</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Comércios</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categoriasFiltradas.map((categoria) => (
                <TableRow key={categoria.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: categoria.cor }}
                      />
                      <span className="text-lg">{categoria.icone}</span>
                      <div>
                        <div className="font-medium">{categoria.nome}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-md">
                    <p className="text-sm text-muted-foreground">
                      {categoria.descricao}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {categoria.comercios} comércios
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={categoria.ativa ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                    >
                      {categoria.ativa ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => iniciarEdicao(categoria)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleStatus(categoria.id)}
                        className={categoria.ativa ? 'text-red-600' : 'text-green-600'}
                      >
                        {categoria.ativa ? 'Desativar' : 'Ativar'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removerCategoria(categoria.id)}
                        className="text-red-600"
                        disabled={categoria.comercios > 0}
                      >
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
    </div>
  );
};

export default CategoriasPage;
