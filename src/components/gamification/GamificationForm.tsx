
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CodeGenerator } from './CodeGenerator';

const gamificationSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  type: z.enum(['qr_code', 'code']),
  completion_data: z.string().min(1, 'Código de completar é obrigatório'),
  xp_reward: z.number().min(0, 'Recompensa XP deve ser positiva'),
  coin_reward: z.number().min(0, 'Recompensa Moedas deve ser positiva'),
  is_active: z.boolean(),
  is_unique: z.boolean(),
  loteamento_id: z.string().min(1, 'Loteamento é obrigatório'),
  location_type: z.string().min(1, 'Tipo de local é obrigatório'),
});

type GamificationFormData = z.infer<typeof gamificationSchema>;

interface GamificationFormProps {
  defaultValues?: Partial<GamificationFormData>;
  onSubmit: (data: GamificationFormData) => void;
  onCancel: () => void;
  isEditing?: boolean;
  userRole?: 'admin' | 'comerciante';
}

export function GamificationForm({
  defaultValues,
  onSubmit,
  onCancel,
  isEditing = false,
  userRole = 'comerciante'
}: GamificationFormProps) {
  const form = useForm<GamificationFormData>({
    resolver: zodResolver(gamificationSchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'qr_code',
      completion_data: '',
      xp_reward: 0,
      coin_reward: 0,
      is_active: true,
      is_unique: false,
      loteamento_id: '',
      location_type: '',
      ...defaultValues,
    },
  });

  const watchedType = form.watch('type');

  const handleSubmit = (data: GamificationFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Nome da missão" {...field} />
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
                  placeholder="Descreva como completar a missão"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="qr_code">QR Code</SelectItem>
                  <SelectItem value="code">Código</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="completion_data"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código de Completar</FormLabel>
              <FormControl>
                <CodeGenerator
                  type={watchedType}
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="xp_reward"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recompensa XP</FormLabel>
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
            name="coin_reward"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recompensa Moedas</FormLabel>
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

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="loteamento_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loteamento</FormLabel>
                <FormControl>
                  <Input placeholder="lote_001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Local</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="supermercado">Supermercado</SelectItem>
                    <SelectItem value="farmacia">Farmácia</SelectItem>
                    <SelectItem value="padaria">Padaria</SelectItem>
                    <SelectItem value="restaurante">Restaurante</SelectItem>
                    <SelectItem value="loja">Loja</SelectItem>
                    <SelectItem value="posto">Posto de Combustível</SelectItem>
                    <SelectItem value="banco">Banco</SelectItem>
                    <SelectItem value="loteamento">Loteamento</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center justify-between">
          <FormField
            control={form.control}
            name="is_unique"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Missão única</FormLabel>
                  <FormDescription>
                    Pode ser completada apenas uma vez por usuário
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Ativa</FormLabel>
                  <FormDescription>
                    Missão disponível no aplicativo
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {isEditing ? 'Atualizar' : 'Criar'} Gamificação
          </Button>
        </div>
      </form>
    </Form>
  );
}
