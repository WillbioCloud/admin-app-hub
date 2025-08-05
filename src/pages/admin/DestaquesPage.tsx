import React from 'react';
import { Sparkles, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  useLoteamentoDestaques, 
  useToggleLoteamentoDestaque,
  type LoteamentoComDestaque 
} from '@/hooks/useLoteamentoDestaques';

export default function DestaquesPage() {
  const { data: loteamentos = [], isLoading } = useLoteamentoDestaques();
  const toggleMutation = useToggleLoteamentoDestaque();

  const handleToggleActive = async (loteamento: LoteamentoComDestaque) => {
    await toggleMutation.mutateAsync({
      loteamento_id: loteamento.id,
      ativo: !loteamento.ativo_destaque,
    });
  };

  const activeLoteamentos = loteamentos.filter(l => l.ativo_destaque);
  const inactiveLoteamentos = loteamentos.filter(l => !l.ativo_destaque);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Destaques dos Loteamentos</h1>
          <p className="text-muted-foreground">
            Gerencie quais loteamentos aparecerão com destaque animado no aplicativo
          </p>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Loteamentos</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loteamentos.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Com Destaque Ativo</CardTitle>
            <Eye className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeLoteamentos.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sem Destaque</CardTitle>
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inactiveLoteamentos.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Loteamentos */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Lista de Loteamentos</h2>
        
        {loteamentos.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum loteamento encontrado</h3>
              <p className="text-muted-foreground">
                Não foi possível carregar os loteamentos do banco de dados
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {loteamentos.map((loteamento) => (
              <Card key={loteamento.id} className="transition-all hover:shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        {loteamento.name}
                        {loteamento.ativo_destaque && (
                          <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Destaque Ativo
                          </Badge>
                        )}
                        {!loteamento.ativo_destaque && (
                          <Badge variant="secondary">
                            <EyeOff className="h-3 w-3 mr-1" />
                            Sem Destaque
                          </Badge>
                        )}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        ID: {loteamento.id} • {loteamento.city}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {loteamento.available_lots} de {loteamento.total_lots} lotes disponíveis
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={loteamento.ativo_destaque ? "destructive" : "default"}
                        size="sm"
                        onClick={() => handleToggleActive(loteamento)}
                        disabled={toggleMutation.isPending}
                        className="gap-2"
                      >
                        {loteamento.ativo_destaque ? (
                          <>
                            <EyeOff className="h-4 w-4" />
                            Desativar
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4" />
                            Ativar Destaque
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {loteamento.description || 'Sem descrição'}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}