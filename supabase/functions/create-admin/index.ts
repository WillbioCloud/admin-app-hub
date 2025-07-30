
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
    // Cria um cliente com privilégios de usuário para verificar a role do autor da chamada
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
    const { data: adminProfile, error: adminError } = await userSupabaseClient
      .from('admin_profiles')
      .select('id, user_type')
      .eq('id', user.id)
      .single();

    if (adminError || !adminProfile) {
      return new Response(JSON.stringify({ error: 'Acesso negado: o usuário não é um administrador.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403,
      });
    }

    // Parse dos dados do novo admin
    const { email, password, full_name, user_type } = await req.json();

    if (!email || !password || !full_name) {
      return new Response(JSON.stringify({ error: 'Email, senha e nome completo são obrigatórios.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Valida o tipo de usuário
    const validUserTypes = ['admin', 'comerciante'];
    const userTypeToUse = user_type && validUserTypes.includes(user_type) ? user_type : 'comerciante';

    // Cria cliente com privilégios de admin para criar o usuário
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Criando usuário admin para:', email);

    // Cria o usuário na tabela auth.users
    const { data: newAdmin, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Já cria o usuário como confirmado
      user_metadata: { 
        full_name,
        app_context: 'admin_web',
        user_type: userTypeToUse
      }
    });

    if (createError) {
      console.error('Erro ao criar usuário:', createError);
      return new Response(JSON.stringify({ error: `Erro ao criar usuário: ${createError.message}` }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    console.log('Usuário criado, inserindo perfil admin...');

    // Insere o perfil do admin na tabela admin_profiles
    const { error: profileError } = await supabaseAdmin
      .from('admin_profiles')
      .insert({ 
        id: newAdmin.user.id, 
        full_name: full_name,
        user_type: userTypeToUse
      });

    if (profileError) {
      console.error('Erro ao criar perfil admin:', profileError);
      
      // Se falhou ao criar o perfil, remove o usuário criado
      await supabaseAdmin.auth.admin.deleteUser(newAdmin.user.id);
      
      return new Response(JSON.stringify({ error: `Erro ao criar perfil do administrador: ${profileError.message}` }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    console.log('Administrador criado com sucesso:', email);

    return new Response(JSON.stringify({ 
      message: 'Administrador criado com sucesso!',
      admin: {
        id: newAdmin.user.id,
        email: newAdmin.user.email,
        full_name: full_name,
        user_type: userTypeToUse
      }
    }), {
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
