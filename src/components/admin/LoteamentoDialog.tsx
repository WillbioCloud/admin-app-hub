import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { 
  useUpdateLoteamento,
  type LoteamentoCompleto,
  type UpdateLoteamentoData 
} from '@/hooks/useLoteamentos';

const formSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  city: z.string().min(1, 'Cidade é obrigatória'),
  description: z.string().optional(),
  total_lots: z.number().min(1, 'Total de lotes deve ser maior que 0'),
  available_lots: z.number().min(0, 'Lotes disponíveis não pode ser negativo'),
  is_selling: z.boolean().default(false),
  has_transport: z.boolean().default(false),
  image_url: z.string().optional(),
  logo_url: z.string().optional(),
  main_video_url: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface LoteamentoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loteamento: LoteamentoCompleto;
}

export function LoteamentoDialog({
  open,
  onOpenChange,
  loteamento,
}: LoteamentoDialogProps) {
  const updateMutation = useUpdateLoteamento();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: loteamento.name,
      city: loteamento.city || '',
      description: loteamento.description || '',
      total_lots: loteamento.total_lots,
      available_lots: loteamento.available_lots,
      is_selling: loteamento.is_selling,
      has_transport: loteamento.has_transport,
      image_url: loteamento.image_url || '',
      logo_url: loteamento.logo_url || '',
      main_video_url: loteamento.main_video_url || '',
    },
  });

  React.useEffect(() => {
    if (loteamento) {
      form.reset({
        name: loteamento.name,
        city: loteamento.city || '',
        description: loteamento.description || '',
        total_lots: loteamento.total_lots,
        available_lots: loteamento.available_lots,
        is_selling: loteamento.is_selling,
        has_transport: loteamento.has_transport,
        image_url: loteamento.image_url || '',
        logo_url: loteamento.logo_url || '',
        main_video_url: loteamento.main_video_url || '',
      });
    }
  }, [loteamento, form]);

  const onSubmit = async (data: FormData) => {
    try {
      await updateMutation.mutateAsync({
        id: loteamento.id,
        data: data as UpdateLoteamentoData,
      });
      onOpenChange(false);
    } catch (error) {
      // Erro já tratado no hook
    }
  };

  const isLoading = updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Loteamento: {loteamento.name}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Loteamento</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do loteamento" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input placeholder="Cidade" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descrição do loteamento" 
                      {...field} 
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="total_lots"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total de Lotes</FormLabel>
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
                name="available_lots"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lotes Disponíveis</FormLabel>
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
                name="is_selling"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Em Venda</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Loteamento está sendo comercializado
                      </div>
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

              <FormField
                control={form.control}
                name="has_transport"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Transporte</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Possui transporte público
                      </div>
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

            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL da Imagem Principal</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logo_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL do Logo</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="main_video_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL do Vídeo Principal</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}