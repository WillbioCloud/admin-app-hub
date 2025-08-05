import React, { useState } from 'react';
import { Sparkles, Eye, EyeOff, Edit, Building2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoteamentoDialog } from '@/components/admin/LoteamentoDialog';
import { 
  useLoteamentos, 
  useToggleLoteamentoDestaque,
  type LoteamentoCompleto 
} from '@/hooks/useLoteamentos';

export default function LoteamentosPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLoteamento, setSelectedLoteamento] = useState<LoteamentoCompleto | null>(null);

  const { data: loteamentos = [], isLoading } = useLoteamentos();
  const toggleMutation = useToggleLoteamentoDestaque();

  const handleEdit = (loteamento: LoteamentoCompleto) => {
    setSelectedLoteamento(loteamento);
    setDialogOpen(true);
  };

  const handleToggleDestaque = async (loteamento: LoteamentoCompleto) => {
    await toggleMutation.mutateAsync({
      loteamento_id: loteamento.id,
      ativo: !loteamento.ativo_destaque,
    });
  };

  const activeLoteamentos = loteamentos.filter(l => l.ativo_destaque);
  const lotesTotal = loteamentos.reduce((sum, l) => sum + l.total_lots, 0);
  const lotesDisponiveis = loteamentos.reduce((sum, l) => sum + l.available_lots, 0);

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
          <h1 className="text-3xl font-bold tracking-tight">Gerenciar Loteamentos</h1>
          <p className="text-muted-foreground">
            Edite informações dos loteamentos, gerencie lotes disponíveis e configure destaques
          </p>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Loteamentos</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loteamentos.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Com Destaque</CardTitle>
            <Sparkles className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{activeLoteamentos.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Lotes</CardTitle>
            <MapPin className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{lotesTotal}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lotes Disponíveis</CardTitle>
            <Eye className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{lotesDisponiveis}</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Loteamentos */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Lista de Loteamentos</h2>
        
        {loteamentos.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
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
                    <div className="space-y-2">
                      <CardTitle className="flex items-center gap-2">
                        {loteamento.name}
                        {loteamento.ativo_destaque && (
                          <Badge variant="default" className="bg-amber-100 text-amber-800 border-amber-200">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Destaque
                          </Badge>
                        )}
                        {loteamento.is_selling && (
                          <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                            Em Venda
                          </Badge>
                        )}
                        {loteamento.has_transport && (
                          <Badge variant="outline">
                            Transporte
                          </Badge>
                        )}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {loteamento.city}
                        </span>
                        <span>ID: {loteamento.id}</span>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span><strong>{loteamento.total_lots}</strong> lotes totais</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span><strong>{loteamento.available_lots}</strong> disponíveis</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span><strong>{loteamento.total_lots - loteamento.available_lots}</strong> vendidos</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(loteamento)}
                        className="gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Editar
                      </Button>
                      <Button
                        variant={loteamento.ativo_destaque ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleToggleDestaque(loteamento)}
                        disabled={toggleMutation.isPending}
                        className="gap-2"
                      >
                        {loteamento.ativo_destaque ? (
                          <>
                            <Sparkles className="h-4 w-4" />
                            Destaque ON
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-4 w-4" />
                            Destaque OFF
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {loteamento.description && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {loteamento.description}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Dialog de Edição */}
      {selectedLoteamento && (
        <LoteamentoDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          loteamento={selectedLoteamento}
        />
      )}
    </div>
  );
}