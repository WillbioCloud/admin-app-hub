import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const rewardSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  coin_cost: z.number().min(1, 'Custo em moedas deve ser positivo'),
  stock: z.number().min(1, 'Estoque deve ser positivo'),
  is_active: z.boolean(),
});

type RewardFormData = z.infer<typeof rewardSchema>;

interface RewardFormWithGamificationProps {
  onSubmit: (rewardData: RewardFormData) => Promise<void>;
  onCancel: () => void;
  defaultValues?: Partial<RewardFormData>;
  isEditing?: boolean;
}

export function RewardFormWithGamification({
  onSubmit,
  onCancel,
  defaultValues,
  isEditing = false,
}: RewardFormWithGamificationProps) {
  const [createReward, setCreateReward] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const form = useForm<RewardFormData>({
    resolver: zodResolver(rewardSchema),
    defaultValues: {
      title: '',
      description: '',
      coin_cost: 10,
      stock: 1,
      is_active: true,
      ...defaultValues,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Imagem deve ter no máximo 5MB');
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToSupabase = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `reward-${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('comercios')
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('comercios')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmitReward = async (data: RewardFormData) => {
    if (!createReward) {
      await onSubmit(data);
      return;
    }

    setUploading(true);
    try {
      let image_url = '';
      if (imageFile) {
        image_url = await uploadImageToSupabase(imageFile);
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Usuário não autenticado');
        return;
      }

      const { error } = await supabase
        .from('rewards')
        .insert({
          title: data.title,
          description: data.description,
          coin_cost: data.coin_cost,
          stock: data.stock,
          is_active: data.is_active,
          image_url,
          created_by: user.id,
        });

      if (error) throw error;

      toast.success('Recompensa criada com sucesso!');
      await onSubmit(data);
    } catch (error) {
      console.error('Erro ao criar recompensa:', error);
      toast.error('Erro ao criar recompensa');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Switch
          checked={createReward}
          onCheckedChange={setCreateReward}
        />
        <label className="text-sm font-medium">
          Criar recompensa junto com a missão
        </label>
      </div>

      {createReward && (
        <Card>
          <CardHeader>
            <CardTitle>Nova Recompensa</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmitReward)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título da Recompensa</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome da recompensa" {...field} />
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
                        <Textarea placeholder="Descrição da recompensa" {...field} />
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
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
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
                        <FormLabel>Estoque</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Imagem da Recompensa</label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel>Recompensa Ativa</FormLabel>
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
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      <Separator />

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button 
          onClick={form.handleSubmit(handleSubmitReward)}
          disabled={uploading}
        >
          {uploading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar')} Gamificação
        </Button>
      </div>
    </div>
  );
}