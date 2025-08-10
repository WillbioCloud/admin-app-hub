import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Building, Gamepad2, Gift, Loader2, Store } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Comercio {
  id: string;
  name: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface ComercianteStats {
  missoesAtivas: number;
  recompensasDisponiveis: number;
}

export function ComercianteDashboard() {
  const { user } = useAuth();
  const [comercio, setComercio] = useState<Comercio | null>(null);
  const [stats, setStats] = useState<ComercianteStats>({ missoesAtivas: 0, recompensasDisponiveis: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // 1. Buscar o comércio do usuário
        const { data: comercioData, error: comercioError } = await supabase
          .from('comercios')
          .select('id, name, status')
          .eq('user_id', user.id)
          .single();

        if (comercioError && comercioError.code !== 'PGRST116') {
          throw new Error(`Erro ao buscar comércio: ${comercioError.message}`);
        }

        setComercio(comercioData);

        // 2. Se o comércio existir, buscar as estatísticas
        if (comercioData) {
          const { count: missoesCount, error: missoesError } = await supabase
            .from('missions')
            .select('*', { count: 'exact', head: true })
            .eq('comercio_id', comercioData.id)
            .eq('is_active', true);
          
          if (missoesError) throw new Error(`Erro ao buscar missões: ${missoesError.message}`);

          const { count: recompensasCount, error: recompensasError } = await supabase
            .from('rewards')
            .select('*, missions!inner(comercio_id)', { count: 'exact', head: true })
            .eq('missions.comercio_id', comercioData.id);

          if (recompensasError) throw new Error(`Erro ao buscar recompensas: ${recompensasError.message}`);
          
          setStats({
            missoesAtivas: missoesCount ?? 0,
            recompensasDisponiveis: recompensasCount ?? 0,
          });
        }
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard do comerciante:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-80px)] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // Se não houver comércio, exibe a tela de onboarding
  if (!comercio) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6 text-center p-4">
        <Store size={80} className="text-muted-foreground" />
        <h1 className="text-3xl font-bold">Bem-vindo ao seu Painel!</h1>
        <p className="text-lg text-muted-foreground max-w-lg">
          O primeiro passo para criar missões e recompensas é registrar os dados do seu estabelecimento.
        </p>
        <Button asChild size="lg" className="mt-4">
          <Link to="/comerciante/personalizacao">
            <Building className="mr-2 h-5 w-5" />
            Configurar meu Comércio
          </Link>
        </Button>
      </div>
    );
  }

  // Se o comércio existir, exibe o dashboard normal com os cards de estatísticas
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status da Loja</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {comercio.status === 'approved' && 'Aprovado'}
              {comercio.status === 'pending' && 'Em Análise'}
              {comercio.status === 'rejected' && 'Rejeitado'}
            </div>
            <p className="text-xs text-muted-foreground">
              {
                comercio.status === 'approved' 
                ? 'Sua loja está visível para os usuários.' 
                : comercio.status === 'pending'
                ? 'Aguardando aprovação do administrador.'
                : 'Seu cadastro foi rejeitado. Verifique os dados.'
              }
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missões Ativas</CardTitle>
            <Gamepad2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.missoesAtivas}</div>
            <p className="text-xs text-muted-foreground">
              Total de missões ativas no seu comércio.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recompensas Disponíveis</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recompensasDisponiveis}</div>
            <p className="text-xs text-muted-foreground">
              Total de recompensas vinculadas às suas missões.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
export default ComercianteDashboard;