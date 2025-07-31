import React, { useState } from 'react';
import { Plus, Edit, Trash2, Newspaper, Heart, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useNewsFeed, useCreateNews, useUpdateNews, useDeleteNews, NewsItem } from '@/hooks/useNewsFeed';
import { useCreateNotification } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function NoticiasPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: ''
  });

  const { data: news = [], isLoading, error } = useNewsFeed();
  const createNews = useCreateNews();
  const updateNews = useUpdateNews();
  const deleteNews = useDeleteNews();
  const createNotification = useCreateNotification();

  const handleCreate = () => {
    setEditingNews(null);
    setFormData({ title: '', description: '', image_url: '' });
    setIsDialogOpen(true);
  };

  const handleEdit = (newsItem: NewsItem) => {
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title,
      description: newsItem.description || '',
      image_url: newsItem.image_url || ''
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) return;

    try {
      if (editingNews) {
        await updateNews.mutateAsync({
          id: editingNews.id,
          data: formData
        });
      } else {
        const createdNews = await createNews.mutateAsync(formData);
        
        // Criar notificação para o app
        await createNotification.mutateAsync({
          title: `Nova notícia: ${formData.title}`,
          message: formData.description || 'Confira a nova notícia no feed!',
          type: 'novidade_feed',
          metadata: { news_id: createdNews.id },
          user_id: null // null = notificação global
        });
      }
      
      setIsDialogOpen(false);
      setFormData({ title: '', description: '', image_url: '' });
    } catch (error) {
      console.error('Erro ao salvar notícia:', error);
    }
  };

  const handleDelete = (id: number) => {
    deleteNews.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando notícias...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Erro ao carregar notícias</div>
      </div>
    );
  }

  const totalLikes = news.reduce((sum, item) => sum + (item.likes || 0), 0);
  const totalComments = news.reduce((sum, item) => sum + (item.comments || 0), 0);
  const recentNews = news.filter(item => {
    const date = new Date(item.published_at);
    const now = new Date();
    const diffDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  }).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notícias</h1>
          <p className="text-muted-foreground">
            Gerencie o feed de notícias do aplicativo móvel
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Notícia
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Notícias</CardTitle>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{news.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Últimos 7 dias</CardTitle>
            <Newspaper className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{recentNews}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Curtidas</CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalLikes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Comentários</CardTitle>
            <MessageCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalComments}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Notícias</CardTitle>
          <CardDescription>
            Todas as notícias publicadas no feed do aplicativo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Engajamento</TableHead>
                <TableHead>Publicado</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {news.map((newsItem) => (
                <TableRow key={newsItem.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {newsItem.image_url && (
                        <img 
                          src={newsItem.image_url} 
                          alt={newsItem.title}
                          className="w-10 h-10 rounded object-cover"
                        />
                      )}
                      <div className="font-medium">{newsItem.title}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground max-w-md truncate">
                      {newsItem.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3 text-red-500" />
                        {newsItem.likes || 0}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3 text-blue-500" />
                        {newsItem.comments || 0}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {formatDistanceToNow(new Date(newsItem.published_at), {
                        addSuffix: true,
                        locale: ptBR
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(newsItem)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir a notícia "{newsItem.title}"?
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(newsItem.id)}>
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingNews ? 'Editar Notícia' : 'Nova Notícia'}
            </DialogTitle>
            <DialogDescription>
              {editingNews ? 'Edite os dados da notícia' : 'Crie uma nova notícia para o feed do app'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Título da notícia"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descrição da notícia"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image_url">URL da Imagem</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                placeholder="https://exemplo.com/imagem.jpg"
                type="url"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={createNews.isPending || updateNews.isPending}
              >
                {editingNews ? 'Salvar' : 'Publicar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}