
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserPlus, Loader2 } from 'lucide-react';
import { useCreateAdmin } from '@/hooks/useCreateAdmin';
import { toast } from 'sonner';

export const NovoUsuarioDialog = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    userType: 'comerciante' as 'admin' | 'comerciante'
  });

  const { createAdmin, isLoading } = useCreateAdmin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password || !formData.fullName) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      const result = await createAdmin({
        email: formData.email,
        password: formData.password,
        full_name: formData.fullName,
        user_type: formData.userType
      });

      toast.success('Administrador criado com sucesso!');
      setOpen(false);
      setFormData({
        email: '',
        password: '',
        fullName: '',
        userType: 'comerciante'
      });
      
      // Recarrega a página para atualizar a lista de usuários
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar administrador');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Novo Administrador
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Criar Novo Administrador</DialogTitle>
            <DialogDescription>
              Crie uma nova conta de administrador no sistema
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Nome Completo *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                placeholder="Digite o nome completo"
                disabled={isLoading}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="admin@exemplo.com"
                disabled={isLoading}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="password">Senha *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Mínimo 6 caracteres"
                minLength={6}
                disabled={isLoading}
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Tipo de Usuário *</Label>
              <Select 
                value={formData.userType} 
                onValueChange={(value: 'admin' | 'comerciante') => 
                  setFormData(prev => ({ ...prev, userType: value }))
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="comerciante">Comerciante</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Criar Administrador
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
