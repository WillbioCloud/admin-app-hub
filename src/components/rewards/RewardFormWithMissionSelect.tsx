import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X, Link2 } from 'lucide-react';
import { Reward } from '@/hooks/useRewards';
import { useAvailableMissions } from '@/hooks/useAvailableMissions';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const rewardSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  coin_cost: z.number().min(1, 'Custo deve ser maior que 0'),
  stock: z.number().min(0, 'Estoque não pode ser negativo').optional(),
  is_active: z.boolean(),
  mission_id_unlock: z.string().optional(),
});

type RewardFormData = z.infer<typeof rewardSchema>;

interface RewardFormWithMissionSelectProps {
  defaultValues?: Partial<Reward>;
  onSubmit: (data: RewardFormData & { image_url?: string }) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export function RewardFormWithMissionSelect({ 
  defaultValues, 
  onSubmit, 
  onCancel, 
  isEditing = false 
}: RewardFormWithMissionSelectProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(defaultValues?.image_url || null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [linkToMission, setLinkToMission] = useState(!!defaultValues?.mission_id_unlock);

  const { data: availableMissions = [] } = useAvailableMissions();

  const form = useForm<RewardFormData>({
    resolver: zodResolver(rewardSchema),
    defaultValues: {
      title: defaultValues?.title || '',
      description: defaultValues?.description || '',
      coin_cost: defaultValues?.coin_cost || 1,
      stock: defaultValues?.stock || undefined,
      is_active: defaultValues?.is_active ?? true,
      mission_id_unlock: defaultValues?.mission_id_unlock || undefined,
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Imagem muito grande. Máximo 5MB permitido.');
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
  };

  const uploadImageToSupabase = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `reward_${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `rewards/${fileName}`;

      const { data, error } = await supabase.storage
        .from('app-media')
        .upload(filePath, file);

      if (error) {
        console.error('Erro no upload:', error);
        toast.error('Erro ao fazer upload da imagem');
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('app-media')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Erro no upload:', error);
      toast.error('Erro ao fazer upload da imagem');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (data: RewardFormData) => {
    let imageUrl = defaultValues?.image_url || null;

    if (imageFile) {
      const uploadedUrl = await uploadImageToSupabase(imageFile);
      if (uploadedUrl) {
        imageUrl = uploadedUrl;
      } else {
        return;
      }
    }

    // Se não está vinculando a missão, remover o campo
    const finalData = {
      ...data,
      mission_id_unlock: linkToMission ? data.mission_id_unlock : undefined,
      image_url: imageUrl,
    };

    onSubmit(finalData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Opção de Vincular a Missão */}
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              Vincular a Missão
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Vincular esta recompensa a uma missão existente</p>
                <p className="text-sm text-muted-foreground">
                  Se ativado, esta recompensa só será desbloqueada após completar a missão selecionada
                </p>
              </div>
              <Switch
                checked={linkToMission}
                onCheckedChange={setLinkToMission}
              />
            </div>

            {linkToMission && (
              <FormField
                control={form.control}
                name="mission_id_unlock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Selecionar Missão</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Escolha uma missão" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableMissions.map((mission) => (
                          <SelectItem key={mission.id} value={mission.id}>
                            {mission.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
        </Card>

        {/* Resto do formulário só aparece se NÃO estiver vinculando a missão */}
        {!linkToMission && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título da Recompensa</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Desconto 20% na Pizza" {...field} />
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
                          placeholder="Descreva os detalhes da recompensa..."
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="coin_cost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Custo em Moedas</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estoque (opcional)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0"
                            placeholder="Ilimitado"
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Recompensa Ativa</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          A recompensa estará disponível na loja
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Imagem da Recompensa</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Recomendado: 600x300px ou 300x600px
                    </p>
                  </CardHeader>
                  <CardContent>
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={removeImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4">
                          <label
                            htmlFor="image-upload"
                            className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
                          >
                            Selecionar Imagem
                          </label>
                          <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                          PNG, JPG até 5MB
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={uploading}>
            {uploading ? 'Fazendo upload...' : (isEditing ? 'Atualizar Recompensa' : 'Criar Recompensa')}
          </Button>
        </div>
      </form>
    </Form>
  );
}