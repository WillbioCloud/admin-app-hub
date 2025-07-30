
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { Upload, X, Plus } from 'lucide-react';

const CATEGORIAS = [
  'Alimentação',
  'Saúde',
  'Saúde e Fitness',
  'Fitness',
  'Serviços',
  'Varejo'
];

interface FormData {
  nome: string;
  categoria: string;
  descricao: string;
  whatsapp: string;
  instagram: string;
  endereco: string;
  horarios: string;
  servicos: string[];
}

const PerfilPage = () => {
  const [servicos, setServicos] = useState<string[]>(['Delivery', 'Balcão', 'Cartão']);
  const [novoServico, setNovoServico] = useState('');
  const [pendingApproval, setPendingApproval] = useState(false);

  const form = useForm<FormData>({
    defaultValues: {
      nome: 'Loja do João',
      categoria: 'Alimentação',
      descricao: 'O melhor da culinária regional com ingredientes frescos e sabor autêntico.',
      whatsapp: '(11) 99999-9999',
      instagram: '@lojadojoao',
      endereco: 'Rua das Flores, 123 - Centro',
      horarios: 'Segunda a Sexta: 8h às 18h\nSábado: 8h às 14h\nDomingo: Fechado',
      servicos: servicos
    }
  });

  const onSubmit = (data: FormData) => {
    console.log('Dados do perfil:', { ...data, servicos });
    setPendingApproval(true);
    alert('Alterações enviadas para aprovação do administrador!');
  };

  const adicionarServico = () => {
    if (novoServico.trim() && !servicos.includes(novoServico.trim())) {
      setServicos([...servicos, novoServico.trim()]);
      setNovoServico('');
    }
  };

  const removerServico = (servico: string) => {
    setServicos(servicos.filter(s => s !== servico));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Perfil do Comércio</h2>
        <p className="text-muted-foreground">
          Gerencie as informações do seu estabelecimento
        </p>
      </div>

      {pendingApproval && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
              <div>
                <h3 className="font-semibold text-orange-800">Aguardando Aprovação</h3>
                <p className="text-sm text-orange-700">Suas alterações foram enviadas para análise do administrador</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>
                  Dados principais do seu estabelecimento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Comércio</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o nome" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoria"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CATEGORIAS.map((categoria) => (
                            <SelectItem key={categoria} value={categoria}>
                              {categoria}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="descricao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva seu negócio"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Conte aos clientes sobre seu negócio
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contato</CardTitle>
                <CardDescription>
                  Informações para os clientes entrarem em contato
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="whatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp</FormLabel>
                      <FormControl>
                        <Input placeholder="(00) 00000-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram</FormLabel>
                      <FormControl>
                        <Input placeholder="@seuinsta" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endereco"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Input placeholder="Rua, número - Bairro" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="horarios"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Horários de Funcionamento</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Segunda a Sexta: 8h às 18h..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Mídias</CardTitle>
              <CardDescription>
                Adicione imagens e vídeos do seu estabelecimento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Logo</h4>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">Clique para fazer upload da logo</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Imagem de Capa</h4>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">Clique para fazer upload da capa</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Galeria</h4>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">Adicione até 10 fotos do seu comércio</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Serviços</CardTitle>
              <CardDescription>
                Liste os serviços oferecidos pelo seu estabelecimento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Digite um serviço"
                    value={novoServico}
                    onChange={(e) => setNovoServico(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && adicionarServico()}
                  />
                  <Button type="button" variant="outline" onClick={adicionarServico}>
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {servicos.map((servico, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                      <span>{servico}</span>
                      <button
                        type="button"
                        onClick={() => removerServico(servico)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
            <Button type="submit">
              Salvar Alterações
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PerfilPage;
