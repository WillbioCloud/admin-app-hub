import React, { useState, useRef, useCallback } from 'react';
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
import { Upload, X, Crop } from 'lucide-react';
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
  const [showCropper, setShowCropper] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setOriginalImage(imageUrl);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const cropImage = useCallback((imageUrl: string): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      const img = new Image();
      img.onload = () => {
        const size = Math.min(img.width, img.height);
        const x = (img.width - size) / 2;
        const y = (img.height - size) / 2;

        canvas.width = 200;
        canvas.height = 200;
        
        ctx.drawImage(img, x, y, size, size, 0, 0, 200, 200);
        
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, 'image/png', 1);
      };
      img.src = imageUrl;
    });
  }, []);

  const handleCropConfirm = async () => {
    if (!originalImage) return;
    
    try {
      const croppedBlob = await cropImage(originalImage);
      const file = new File([croppedBlob], 'achievement-icon.png', { type: 'image/png' });
      
      setIconFile(file);
      setIconPreview(URL.createObjectURL(croppedBlob));
      setShowCropper(false);
      setOriginalImage(null);
    } catch (error) {
      toast.error('Erro ao processar a imagem');
    }
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setOriginalImage(null);
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
                <Label>Ícone (formato quadrado 1:1)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {iconPreview ? (
                    <div className="relative inline-block">
                      <img src={iconPreview} alt="Ícone preview" className="w-24 h-24 object-cover rounded-lg mx-auto" />
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
                      <p className="text-xs text-gray-400">A imagem será cortada em formato 1:1</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleIconChange}
                        className="hidden"
                        id="icon-upload"
                      />
                      <Label htmlFor="icon-upload" className="cursor-pointer inline-block">
                        <span className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground mt-2">
                          Selecionar Ícone
                        </span>
                      </Label>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal de Crop */}
            {showCropper && originalImage && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Crop className="h-5 w-5" />
                    Ajustar Imagem
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="text-center">
                      <img 
                        src={originalImage} 
                        alt="Imagem original" 
                        className="w-48 h-48 object-cover mx-auto border rounded-lg"
                        style={{ objectPosition: 'center' }}
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        A imagem será cortada em formato quadrado (1:1)
                      </p>
                    </div>
                    
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={handleCropCancel}>
                        Cancelar
                      </Button>
                      <Button onClick={handleCropConfirm}>
                        Confirmar Corte
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <canvas ref={canvasRef} className="hidden" />

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