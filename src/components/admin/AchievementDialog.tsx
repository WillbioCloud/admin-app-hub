import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Upload, X } from 'lucide-react';
import { useCreateAchievement, useUpdateAchievement, Achievement } from '@/hooks/useAchievements';

const achievementSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  description: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres'),
  rarity: z.string().min(1, 'Selecione uma raridade'),
});

type AchievementFormData = z.infer<typeof achievementSchema>;

interface AchievementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  achievement?: Achievement | null;
  onSubmit?: (achievementId: string) => void;
  onSuccess?: () => void;
}

export function AchievementDialog({ open, onOpenChange, achievement, onSubmit, onSuccess }: AchievementDialogProps) {
  const [loading, setLoading] = useState(false);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(achievement?.icon_url || null);

  const createAchievement = useCreateAchievement();
  const updateAchievement = useUpdateAchievement();

  const form = useForm<AchievementFormData>({
    resolver: zodResolver(achievementSchema),
    defaultValues: {
      name: achievement?.name || '',
      description: achievement?.description || '',
      rarity: achievement?.rarity || '',
    },
  });

  const uploadIcon = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `achievement-${Date.now()}.${fileExt}`;
    const filePath = `achievements/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('app-media')
      .upload(filePath, file, { upsert: true });
    
    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('app-media').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleIconChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('A imagem deve ter no máximo 5MB');
        return;
      }
      setIconFile(file);
      setIconPreview(URL.createObjectURL(file));
    }
  };

  const removeIcon = () => {
    setIconFile(null);
    setIconPreview(null);
  };

  const handleSubmit = async (data: AchievementFormData) => {
    setLoading(true);
    try {
      let iconUrl = iconPreview;

      if (iconFile) {
        iconUrl = await uploadIcon(iconFile);
      }

      const achievementData = {
        name: data.name,
        description: data.description,
        rarity: data.rarity,
        icon_url: iconUrl,
      };

      let achievementId: string;
      if (achievement) {
        const result = await updateAchievement.mutateAsync({
          id: achievement.id,
          ...achievementData,
        });
        achievementId = result.id;
      } else {
        const result = await createAchievement.mutateAsync(achievementData);
        achievementId = result.id;
      }

      if (onSubmit) {
        onSubmit(achievementId);
      }
      if (onSuccess) {
        onSuccess();
      }
      onOpenChange(false);
      
      // Reset form
      form.reset();
      setIconFile(null);
      setIconPreview(null);
      
    } catch (error: any) {
      console.error('Erro ao salvar conquista:', error);
      toast.error(`Erro ao salvar conquista: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {achievement ? 'Editar Conquista' : 'Nova Conquista'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            
            {/* Informações Básicas */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informações da Conquista</h3>
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Conquista</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Primeiro Passo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva o que o usuário deve fazer para obter esta conquista..." 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rarity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Raridade</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a raridade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Comum">Comum</SelectItem>
                        <SelectItem value="Raro">Raro</SelectItem>
                        <SelectItem value="Épico">Épico</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Ícone */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Ícone da Conquista</h3>
              
              <div className="space-y-2">
                <Label>Ícone</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {iconPreview ? (
                    <div className="relative inline-block">
                      <img src={iconPreview} alt="Ícone preview" className="w-24 h-24 object-cover rounded-full mx-auto" />
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className="absolute top-0 right-0 w-6 h-6 p-0 rounded-full"
                        onClick={removeIcon}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500">Clique para fazer upload do ícone</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleIconChange}
                        className="hidden"
                        id="icon-upload"
                      />
                      <Label htmlFor="icon-upload" className="cursor-pointer">
                        <Button type="button" size="sm" className="mt-2">Selecionar Ícone</Button>
                      </Label>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : (achievement ? 'Atualizar' : 'Criar')} Conquista
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}