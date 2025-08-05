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
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  useCreateLoteamentoDestaque, 
  useUpdateLoteamentoDestaque,
  type LoteamentoDestaque,
  type CreateLoteamentoDestaqueData 
} from '@/hooks/useLoteamentoDestaques';

const formSchema = z.object({
  loteamento_id: z.string().min(1, 'ID do loteamento é obrigatório'),
  nome: z.string().min(1, 'Nome é obrigatório'),
  ativo: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

interface LoteamentoDestaqueDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loteamento?: LoteamentoDestaque | null;
}

export function LoteamentoDestaqueDialog({
  open,
  onOpenChange,
  loteamento,
}: LoteamentoDestaqueDialogProps) {
  const createMutation = useCreateLoteamentoDestaque();
  const updateMutation = useUpdateLoteamentoDestaque();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      loteamento_id: '',
      nome: '',
      ativo: false,
    },
  });

  React.useEffect(() => {
    if (loteamento) {
      form.reset({
        loteamento_id: loteamento.loteamento_id,
        nome: loteamento.nome,
        ativo: loteamento.ativo,
      });
    } else {
      form.reset({
        loteamento_id: '',
        nome: '',
        ativo: false,
      });
    }
  }, [loteamento, form]);

  const onSubmit = async (data: FormData) => {
    try {
      if (loteamento) {
        await updateMutation.mutateAsync({
          id: loteamento.id,
          data: {
            nome: data.nome,
            ativo: data.ativo,
          },
        });
      } else {
        await createMutation.mutateAsync(data as CreateLoteamentoDestaqueData);
      }
      onOpenChange(false);
    } catch (error) {
      // Erro já tratado nos hooks
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {loteamento ? 'Editar Loteamento' : 'Novo Loteamento'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="loteamento_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID do Loteamento</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="cidade-inteligente" 
                      {...field} 
                      disabled={!!loteamento} // Não permite editar o ID se estiver editando
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Cidade Inteligente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ativo"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Destaque Ativo</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Ativa a animação de destaque no app
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

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Salvando...' : loteamento ? 'Atualizar' : 'Criar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}