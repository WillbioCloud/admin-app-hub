
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Método não permitido' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 405,
    });
  }

  try {
    // Cria um cliente com privilégios de usuário para verificar permissões
    const userSupabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // Verifica se o usuário está autenticado
    const { data: { user } } = await userSupabaseClient.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Acesso negado: usuário não autenticado.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    // Verifica se o usuário é um administrador
    const { data: adminProfile } = await userSupabaseClient
      .from('admin_profiles')
      .select('id, user_type')
      .eq('id', user.id)
      .single();

    if (!adminProfile) {
      return new Response(JSON.stringify({ error: 'Acesso negado: apenas administradores podem acessar emails.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403,
      });
    }

    const { userIds } = await req.json();

    if (!userIds || !Array.isArray(userIds)) {
      return new Response(JSON.stringify({ error: 'Lista de IDs de usuário é obrigatória.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Criar cliente com privilégios de admin para buscar emails
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Buscando emails para usuários:', userIds);

    // Buscar emails dos usuários na tabela auth.users
    const emails = [];
    
    for (const userId of userIds) {
      try {
        const { data: userData, error } = await supabaseAdmin.auth.admin.getUserById(userId);
        
        if (!error && userData.user) {
          emails.push({
            id: userId,
            email: userData.user.email
          });
        }
      } catch (error) {
        console.error(`Erro ao buscar email do usuário ${userId}:`, error);
      }
    }

    console.log('Emails encontrados:', emails.length);

    return new Response(JSON.stringify(emails), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Erro inesperado:', error);
    return new Response(JSON.stringify({ error: `Erro interno: ${error.message}` }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
})
