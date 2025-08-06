import React, { useState } from 'react';
import { Plus, Edit, Trash2, Newspaper, Heart, MessageCircle, Video, Image, User, MapPin } from 'lucide-react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
    image_url: '',
    video_url: '',
    media_type: 'IMAGE' as 'IMAGE' | 'VIDEO',
    author_name: 'FBZ Empreendimentos',
    author_avatar_url: '',
    location: 'Cidade Inteligente'
  });

  const { data: news = [], isLoading, error } = useNewsFeed();
  const createNews = useCreateNews();
  const updateNews = useUpdateNews();
  const deleteNews = useDeleteNews();
  const createNotification = useCreateNotification();

  const handleCreate = () => {
    setEditingNews(null);
    setFormData({ 
      title: '', 
      description: '', 
      image_url: '',
      video_url: '',
      media_type: 'IMAGE',
      author_name: 'FBZ Empreendimentos',
      author_avatar_url: '',
      location: 'Cidade Inteligente'
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (newsItem: NewsItem) => {
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title,
      description: newsItem.description || '',
      image_url: newsItem.image_url || '',
      video_url: newsItem.video_url || '',
      media_type: newsItem.media_type || 'IMAGE',
      author_name: newsItem.author_name || 'FBZ Empreendimentos',
      author_avatar_url: newsItem.author_avatar_url || '',
      location: newsItem.location || 'Cidade Inteligente'
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
      setFormData({ 
        title: '', 
        description: '', 
        image_url: '',
        video_url: '',
        media_type: 'IMAGE',
        author_name: 'FBZ Empreendimentos',
        author_avatar_url: '',
        location: 'Cidade Inteligente'
      });
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
  const totalViews = news.reduce((sum, item) => sum + (item.views || 0), 0);
  const videoCount = news.filter(item => item.media_type === 'VIDEO').length;
  const recentNews = news.filter(item => {
    const date = new Date(item.published_at);
    const now = new Date();
    const diffDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  }).length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Notícias</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Gerencie o feed de notícias do aplicativo móvel
          </p>
        </div>
        <Button onClick={handleCreate} className="shadow-lg hover:shadow-xl transition-shadow">
          <Plus className="h-4 w-4 mr-2" />
          Nova Notícia
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Posts</CardTitle>
              <div className="text-3xl font-bold text-foreground mt-2">{news.length}</div>
            </div>
            <div className="p-3 bg-background/50 rounded-lg">
              <Newspaper className="h-6 w-6 text-foreground" />
            </div>
          </CardHeader>
        </Card>
        <Card className="relative overflow-hidden bg-gradient-to-br from-green-500/20 to-green-600/20 border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium text-muted-foreground">Últimos 7 dias</CardTitle>
              <div className="text-3xl font-bold text-green-600 mt-2">{recentNews}</div>
            </div>
            <div className="p-3 bg-background/50 rounded-lg">
              <Newspaper className="h-6 w-6 text-green-600" />
            </div>
          </CardHeader>
        </Card>
        <Card className="relative overflow-hidden bg-gradient-to-br from-red-500/20 to-red-600/20 border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Curtidas</CardTitle>
              <div className="text-3xl font-bold text-red-600 mt-2">{totalLikes}</div>
            </div>
            <div className="p-3 bg-background/50 rounded-lg">
              <Heart className="h-6 w-6 text-red-600" />
            </div>
          </CardHeader>
        </Card>
        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium text-muted-foreground">Comentários</CardTitle>
              <div className="text-3xl font-bold text-purple-600 mt-2">{totalComments}</div>
            </div>
            <div className="p-3 bg-background/50 rounded-lg">
              <MessageCircle className="h-6 w-6 text-purple-600" />
            </div>
          </CardHeader>
        </Card>
        <Card className="relative overflow-hidden bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium text-muted-foreground">Visualizações</CardTitle>
              <div className="text-3xl font-bold text-orange-600 mt-2">{totalViews.toLocaleString()}</div>
            </div>
            <div className="p-3 bg-background/50 rounded-lg">
              <Video className="h-6 w-6 text-orange-600" />
            </div>
          </CardHeader>
        </Card>
      </div>

      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-xl">Lista de Notícias</CardTitle>
          <CardDescription>
            Todas as notícias publicadas no feed do aplicativo
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Conteúdo</TableHead>
                <TableHead>Tipo/Autor</TableHead>
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
                      <div className="relative">
                        {newsItem.media_type === 'VIDEO' ? (
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Video className="h-6 w-6 text-gray-500" />
                          </div>
                        ) : newsItem.image_url ? (
                          <img 
                            src={newsItem.image_url} 
                            alt={newsItem.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Image className="h-6 w-6 text-gray-500" />
                          </div>
                        )}
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                          {newsItem.media_type === 'VIDEO' ? (
                            <Video className="h-3 w-3 text-white" />
                          ) : (
                            <Image className="h-3 w-3 text-white" />
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-sm">{newsItem.title}</div>
                        <div className="text-xs text-muted-foreground max-w-md truncate mt-1">
                          {newsItem.description}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-3 w-3 text-gray-500" />
                        <span className="text-muted-foreground">{newsItem.author_name || 'FBZ'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-3 w-3 text-gray-500" />
                        <span className="text-muted-foreground">{newsItem.location || 'Cidade Inteligente'}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3 text-red-500" />
                        <span className="text-red-600 font-medium">{newsItem.likes || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3 text-blue-500" />
                        <span className="text-blue-600 font-medium">{newsItem.comments || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Video className="h-3 w-3 text-orange-500" />
                        <span className="text-orange-600 font-medium">{newsItem.views || 0}</span>
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
                              Tem certeza que deseja excluir o post "{newsItem.title}"?
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
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingNews ? 'Editar Post' : 'Novo Post'}
            </DialogTitle>
            <DialogDescription>
              {editingNews ? 'Edite os dados do post' : 'Crie um novo post para o feed do app móvel'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Título do post"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="media_type">Tipo de Mídia</Label>
                <Select 
                  value={formData.media_type} 
                  onValueChange={(value: 'IMAGE' | 'VIDEO') => 
                    setFormData(prev => ({ ...prev, media_type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IMAGE">
                      <div className="flex items-center gap-2">
                        <Image className="h-4 w-4" />
                        Imagem
                      </div>
                    </SelectItem>
                    <SelectItem value="VIDEO">
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4" />
                        Vídeo
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição do Post</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva o conteúdo do post..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="author_name">Nome do Autor</Label>
                <Input
                  id="author_name"
                  value={formData.author_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, author_name: e.target.value }))}
                  placeholder="FBZ Empreendimentos"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Localização</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Cidade Inteligente"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="author_avatar_url">Avatar do Autor (URL)</Label>
              <Input
                id="author_avatar_url"
                value={formData.author_avatar_url}
                onChange={(e) => setFormData(prev => ({ ...prev, author_avatar_url: e.target.value }))}
                placeholder="https://exemplo.com/avatar.jpg"
                type="url"
              />
            </div>
            
            {formData.media_type === 'IMAGE' ? (
              <div className="space-y-2">
                <Label htmlFor="image_url">URL da Imagem *</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  placeholder="https://exemplo.com/imagem.jpg"
                  type="url"
                  required={formData.media_type === 'IMAGE'}
                />
                <p className="text-xs text-muted-foreground">
                  Imagem será exibida no feed. Recomendado: 1080x1080px ou proporção 16:9
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="video_url">URL do Vídeo *</Label>
                <Input
                  id="video_url"
                  value={formData.video_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                  placeholder="https://exemplo.com/video.mp4"
                  type="url"
                  required={formData.media_type === 'VIDEO'}
                />
                <p className="text-xs text-muted-foreground">
                  Vídeo será reproduzido automaticamente no feed. Formatos: MP4, MOV
                </p>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={createNews.isPending || updateNews.isPending}
                className="bg-primary hover:bg-primary/90"
              >
                {editingNews ? 'Atualizar Post' : 'Publicar Post'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}