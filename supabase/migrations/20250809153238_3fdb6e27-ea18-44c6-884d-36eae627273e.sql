-- Security Hardening Migration

-- 1. Fix database functions by adding SET search_path = '' for security definer functions
-- This prevents search_path injection attacks

CREATE OR REPLACE FUNCTION public.get_notifications_with_read_status()
RETURNS TABLE(id uuid, title text, message text, type notification_type, metadata jsonb, user_id uuid, created_at timestamp with time zone, is_read_by_user boolean, read_at_by_user timestamp with time zone)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT 
    n.id,
    n.title,
    n.message,
    n.type,
    n.metadata,
    n.user_id,
    n.created_at,
    CASE 
      WHEN unr.read_at IS NOT NULL THEN true 
      ELSE false 
    END as is_read_by_user,
    unr.read_at as read_at_by_user
  FROM public.notifications n
  LEFT JOIN public.user_notification_reads unr 
    ON n.id = unr.notification_id 
    AND unr.user_id = auth.uid()
  WHERE n.user_id IS NULL OR n.user_id = auth.uid()
  ORDER BY n.created_at DESC;
$function$;

CREATE OR REPLACE FUNCTION public.mark_notification_as_read_for_user(p_notification_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.user_notification_reads (user_id, notification_id)
  VALUES (auth.uid(), p_notification_id)
  ON CONFLICT (user_id, notification_id) DO NOTHING;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid DEFAULT auth.uid())
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT user_type::text FROM public.profiles WHERE id = user_id;
$function$;

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT COALESCE(user_type::text, 'comerciante')
  FROM public.profiles
  WHERE id = auth.uid();
$function$;

CREATE OR REPLACE FUNCTION public.complete_mission_for_user(p_mission_id uuid, p_xp_reward integer, p_coin_reward integer)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
    v_user_id UUID;
    v_result jsonb;
BEGIN
    -- Get the current authenticated user's ID
    v_user_id := auth.uid();

    -- Check if mission is already completed
    IF EXISTS (
        SELECT 1 
        FROM public.user_completed_missions 
        WHERE user_id = v_user_id AND mission_id = p_mission_id
    ) THEN
        RETURN jsonb_build_object(
            'status', 'error',
            'message', 'Mission already completed'
        );
    END IF;

    -- Insert mission completion
    INSERT INTO public.user_completed_missions(user_id, mission_id)
    VALUES(v_user_id, p_mission_id);

    -- Update user profile with rewards
    UPDATE public.profiles
    SET
        xp = profiles.xp + p_xp_reward,
        coins = profiles.coins + p_coin_reward
    WHERE id = v_user_id;

    -- Return success status
    RETURN jsonb_build_object(
        'status', 'success',
        'xp_gained', p_xp_reward,
        'coins_gained', p_coin_reward
    );
END;
$function$;

CREATE OR REPLACE FUNCTION public.complete_mission_for_user(p_user_id uuid, p_mission_id uuid, p_xp_reward integer, p_coin_reward integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
    INSERT INTO public.user_completed_missions(user_id, mission_id)
    VALUES(p_user_id, p_mission_id);

    UPDATE public.profiles
    SET
        xp = profiles.xp + p_xp_reward,
        coins = profiles.coins + p_coin_reward
    WHERE id = p_user_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_admin_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  admin_count INTEGER;
BEGIN
  -- Se for contexto admin_web, cria perfil admin
  IF NEW.raw_user_meta_data->>'app_context' = 'admin_web' THEN
    
    -- Verificar se já existe algum admin
    SELECT COUNT(*) INTO admin_count 
    FROM public.admin_profiles 
    WHERE user_type = 'admin';
    
    INSERT INTO public.admin_profiles (
      id,
      full_name,
      user_type,
      phone,
      avatar_url
    ) VALUES (
      NEW.id,
      COALESCE(
        NEW.raw_user_meta_data->>'full_name', 
        NEW.raw_user_meta_data->>'name',
        NEW.email
      ),
      CASE 
        WHEN NEW.raw_user_meta_data->>'user_type' = 'admin' THEN 'admin'::admin_user_role
        WHEN NEW.raw_user_meta_data->>'user_type' = 'comerciante' THEN 'comerciante'::admin_user_role
        ELSE 'comerciante'::admin_user_role
      END,
      NEW.raw_user_meta_data->>'phone',
      COALESCE(
        NEW.raw_user_meta_data->>'avatar_url',
        NEW.raw_user_meta_data->>'picture'
      )
    );
    
    -- Se for o primeiro admin sendo criado, criar notificação especial
    IF admin_count = 0 AND NEW.raw_user_meta_data->>'user_type' = 'admin' THEN
      INSERT INTO public.notifications (
        title,
        message,
        type,
        metadata
      ) VALUES (
        'Primeiro Admin Criado! 🎉',
        'O primeiro administrador do sistema foi criado com sucesso. Agora você pode gerenciar usuários e configurações.',
        'app_update',
        jsonb_build_object(
          'first_admin', true,
          'admin_id', NEW.id
        )
      );
    END IF;
    
  ELSE
    -- Se não for contexto admin_web, cria perfil mobile
    INSERT INTO public.profiles (id, full_name, avatar_url, phone)
    VALUES (
      NEW.id, 
      NEW.raw_user_meta_data->>'full_name', 
      NEW.raw_user_meta_data->>'avatar_url', 
      NEW.raw_user_meta_data->>'phone'
    );
  END IF;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Erro ao criar perfil para usuário %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.cleanup_old_notifications()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  -- Remove notificações com mais de 30 dias
  DELETE FROM public.notifications
  WHERE created_at < NOW() - INTERVAL '30 days';
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.create_welcome_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  -- Verificar se é um perfil mobile (não admin) 
  -- Removendo a referência a 'cliente' que não existe no enum
  IF NEW.user_type IS NULL OR NEW.user_type = 'comerciante' THEN
    INSERT INTO public.notifications (
      user_id,
      title,
      message,
      type,
      metadata
    ) VALUES (
      NEW.id,
      'Bem-vindo(a) ao FBZ App! 🎉',
      'Seja bem-vindo(a) ao nosso aplicativo! Explore todas as funcionalidades disponíveis e descubra os benefícios exclusivos para você.',
      'app_update',
      jsonb_build_object(
        'welcome', true,
        'user_type', COALESCE(NEW.user_type, 'comerciante')
      )
    );
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.perform_health_info_cleanup()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  DELETE FROM public.health_info
  WHERE
    -- Condição 1: A dica foi criada há mais de 30 dias
    created_at < NOW() - INTERVAL '30 days'

    -- Condição 2: A dica NÃO é a nossa dica de nutrição automática (id 999)
    AND id != 999

    -- Condição 3: O ID da dica NÃO existe na tabela de favoritos de NENHUM usuário
    AND id NOT IN (SELECT health_info_id FROM public.user_favorites);
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_comment_increment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  UPDATE public.news_feed
  SET comments = comments + 1
  WHERE id = NEW.post_id;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_comment_decrement()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  UPDATE public.news_feed
  -- A CORREÇÃO ESTÁ AQUI: Usa a função GREATEST para garantir que o valor nunca seja menor que 0
  SET comments = GREATEST(0, comments - 1)
  WHERE id = OLD.post_id;
  RETURN OLD;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, phone)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'phone');
  RETURN new;
END;
$function$;

CREATE OR REPLACE FUNCTION public.check_and_apply_level_up(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
    v_user_profile RECORD;
    v_new_level INT;
    v_leveled_up BOOLEAN := false;
    level_thresholds INT[] := ARRAY[100, 250, 500, 1000, 2000]; 
BEGIN
    SELECT xp, level INTO v_user_profile FROM public.profiles WHERE id = p_user_id;

    IF v_user_profile IS NULL THEN
        RETURN jsonb_build_object('leveled_up', false, 'message', 'User not found');
    END IF;

    v_new_level := 1;
    FOR i IN 1..array_length(level_thresholds, 1) LOOP
        -- ====================================================================
        --  MUDANÇA PRINCIPAL AQUI: Conversão explícita para bigint (int8)
        -- ====================================================================
        IF v_user_profile.xp::bigint >= level_thresholds[i] THEN
            v_new_level := i + 1;
        ELSE
            EXIT; 
        END IF;
    END LOOP;

    IF v_new_level > v_user_profile.level THEN
        v_leveled_up := true;
        
        UPDATE public.profiles
        SET level = v_new_level
        WHERE id = p_user_id;
    END IF;

    RETURN jsonb_build_object(
        'leveled_up', v_leveled_up,
        'new_level', v_new_level,
        'current_xp', v_user_profile.xp
    );
END;
$function$;

CREATE OR REPLACE FUNCTION public.purchase_reward(p_reward_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  v_reward record;
  v_user_profile record;
  v_user_id UUID := auth.uid();
BEGIN
  -- Validar se o usuário está autenticado
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário não autenticado.';
  END IF;

  -- 1. Buscar os detalhes e o custo da recompensa
  SELECT * INTO v_reward FROM public.rewards WHERE id = p_reward_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Recompensa não encontrada.';
  END IF;

  -- 2. Buscar o perfil e as moedas do usuário
  SELECT * INTO v_user_profile FROM public.profiles WHERE id = v_user_id;
  IF v_user_profile.coins IS NULL OR v_user_profile.coins < v_reward.coin_cost THEN
    RAISE EXCEPTION 'Moedas insuficientes para comprar esta recompensa.';
  END IF;

  -- 3. Verificar se o usuário já possui esta recompensa (verificação explícita e sem ambiguidade)
  IF EXISTS (
    SELECT 1 FROM public.user_rewards AS ur -- Usando alias 'ur'
    WHERE ur.user_id = v_user_id AND ur.reward_id = p_reward_id
  ) THEN
    RAISE EXCEPTION 'Você já possui esta recompensa.';
  END IF;

  -- 4. Se tudo estiver certo, executar a transação
  UPDATE public.profiles
  SET coins = profiles.coins - v_reward.coin_cost
  WHERE id = v_user_id;

  INSERT INTO public.user_rewards (user_id, reward_id)
  VALUES (v_user_id, p_reward_id);

  -- 5. Retornar mensagem de sucesso
  RETURN json_build_object('success', true, 'message', 'Recompensa comprada com sucesso!');

EXCEPTION WHEN OTHERS THEN
  -- Em caso de qualquer erro, retorna a mensagem de erro específica do banco de dados
  RETURN json_build_object('success', false, 'message', SQLERRM);
END;
$function$;

CREATE OR REPLACE FUNCTION public.increment_post_view(p_post_id bigint)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  viewer_id UUID := auth.uid();
BEGIN
  -- Tenta inserir o registro de visualização.
  INSERT INTO public.post_views (post_id, user_id)
  VALUES (p_post_id, viewer_id)
  ON CONFLICT (post_id, user_id) DO NOTHING;

  -- Se a inserção foi bem-sucedida (nenhum conflito), atualiza a contagem.
  IF FOUND THEN
    UPDATE public.news_feed
    SET views = views + 1
    WHERE id = p_post_id;
  END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.increment_comment_like(comment_id_to_update bigint)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  UPDATE public.post_comments
  SET likes = likes + 1
  WHERE id = comment_id_to_update;
END;
$function$;

CREATE OR REPLACE FUNCTION public.toggle_like_comment(comment_id_to_update bigint)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  current_user_id UUID := auth.uid();
BEGIN
  -- Verifica se o usuário já curtiu
  IF EXISTS (SELECT 1 FROM public.comment_likes WHERE comment_id = comment_id_to_update AND user_id = current_user_id) THEN
    -- Se já curtiu, remove a curtida (descurtir)
    DELETE FROM public.comment_likes WHERE comment_id = comment_id_to_update AND user_id = current_user_id;
    UPDATE public.post_comments SET likes = likes - 1 WHERE id = comment_id_to_update;
  ELSE
    -- Se não curtiu, adiciona a curtida
    INSERT INTO public.comment_likes (comment_id, user_id) VALUES (comment_id_to_update, current_user_id);
    UPDATE public.post_comments SET likes = likes + 1 WHERE id = comment_id_to_update;
  END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_admin_user_role()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  -- Verifica se o usuário está na tabela admin_profiles
  IF EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE id = auth.uid()
  ) THEN
    -- Retorna o user_type da tabela admin_profiles
    RETURN (
      SELECT user_type::text 
      FROM public.admin_profiles 
      WHERE id = auth.uid()
    );
  END IF;
  
  -- Se não está na tabela admin_profiles, retorna 'cliente'
  RETURN 'cliente';
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_current_user_admin_role()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  user_role TEXT;
BEGIN
  -- Tenta buscar o user_type da tabela admin_profiles para o usuário logado
  SELECT user_type INTO user_role FROM public.admin_profiles WHERE id = auth.uid();
  -- Se não encontrar, ele não é um usuário do painel admin.
  IF user_role IS NULL THEN
    RETURN 'nao_autorizado';
  END IF;
  RETURN user_role;
END;
$function$;

CREATE OR REPLACE FUNCTION public.create_notification_for_user(target_user_id uuid, notification_title text, notification_message text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  -- Trava de Segurança interna: Somente admins podem prosseguir.
  IF get_current_user_admin_role() != 'admin' THEN
    RAISE EXCEPTION 'Apenas administradores podem executar esta ação.';
  END IF;

  -- Ação com privilégios de superusuário para criar a notificação.
  INSERT INTO public.notifications (user_id, title, message, type)
  VALUES (target_user_id, notification_title, notification_message, 'approval');
END;
$function$;

CREATE OR REPLACE FUNCTION public.toggle_like_post(post_id_to_update integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  current_user_id UUID := auth.uid();
BEGIN
  IF EXISTS (SELECT 1 FROM public.post_likes WHERE post_id = post_id_to_update AND user_id = current_user_id) THEN
    DELETE FROM public.post_likes WHERE post_id = post_id_to_update AND user_id = current_user_id;
    UPDATE public.news_feed SET likes = likes - 1 WHERE id = post_id_to_update;
  ELSE
    INSERT INTO public.post_likes (post_id, user_id) VALUES (post_id_to_update, current_user_id);
    UPDATE public.news_feed SET likes = likes + 1 WHERE id = post_id_to_update;
  END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_leaderboard()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  -- Limpar tabela existente
  DELETE FROM public.leaderboard;
  
  -- Inserir dados atualizados do ranking
  INSERT INTO public.leaderboard (user_id, full_name, avatar_url, points, level, coins, position)
  SELECT 
    p.id,
    p.full_name,
    p.avatar_url,
    p.points,
    p.level,
    p.coins,
    ROW_NUMBER() OVER (ORDER BY p.points DESC, p.level DESC) as position
  FROM public.profiles p
  WHERE p.user_type IN ('cliente', 'comerciante')
  AND p.points > 0
  ORDER BY p.points DESC, p.level DESC
  LIMIT 100;
END;
$function$;