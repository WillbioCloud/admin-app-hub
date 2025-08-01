-- Corrigir as duas últimas funções com problemas de search_path
CREATE OR REPLACE FUNCTION public.complete_mission(p_mission_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    v_user_id UUID;
    v_mission_record RECORD;
    v_result JSONB;
BEGIN
    -- Validate input
    IF p_mission_id IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'error_code', 'INVALID_INPUT',
            'message', 'Mission ID cannot be null'
        );
    END IF;

    -- Get the current user's ID
    v_user_id := auth.uid();

    -- Validate user authentication
    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'error_code', 'UNAUTHORIZED',
            'message', 'User not authenticated'
        );
    END IF;

    -- Check if the mission exists and is active
    SELECT * INTO v_mission_record
    FROM public.missions
    WHERE id = p_mission_id AND is_active = true;

    -- Validate mission existence
    IF v_mission_record IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'error_code', 'MISSION_NOT_FOUND',
            'message', 'Mission not found or inactive'
        );
    END IF;

    -- Check if the mission is unique and already completed
    IF v_mission_record.is_unique THEN
        IF EXISTS (
            SELECT 1 
            FROM public.user_completed_missions 
            WHERE user_id = v_user_id AND mission_id = p_mission_id
        ) THEN
            RETURN jsonb_build_object(
                'success', false,
                'error_code', 'MISSION_ALREADY_COMPLETED',
                'message', 'This unique mission has already been completed'
            );
        END IF;
    END IF;

    -- Insert the completed mission
    BEGIN
        INSERT INTO public.user_completed_missions (user_id, mission_id)
        VALUES (v_user_id, p_mission_id);
    EXCEPTION WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error_code', 'INSERTION_FAILED',
            'message', 'Failed to record mission completion',
            'details', SQLERRM
        );
    END;

    -- Prepare success response with mission rewards
    v_result := jsonb_build_object(
        'success', true,
        'message', 'Mission completed successfully',
        'xp_reward', v_mission_record.xp_reward,
        'coin_reward', v_mission_record.coin_reward,
        'mission_details', jsonb_build_object(
            'id', v_mission_record.id,
            'title', v_mission_record.title,
            'type', v_mission_record.type
        )
    );

    RETURN v_result;
EXCEPTION WHEN OTHERS THEN
    -- Catch any unexpected errors
    RETURN jsonb_build_object(
        'success', false,
        'error_code', 'UNEXPECTED_ERROR',
        'message', 'An unexpected error occurred',
        'details', SQLERRM
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.purchase_reward(p_reward_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  reward_cost INT;
  user_coins INT;
  user_id UUID := auth.uid();
BEGIN
  -- 1. Buscar o custo da recompensa e as moedas do usuário em uma única consulta
  SELECT r.coin_cost, p.coins INTO reward_cost, user_coins
  FROM public.rewards r, public.profiles p
  WHERE r.id = p_reward_id AND p.id = user_id;

  -- 2. Verificar se a recompensa existe
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Recompensa não encontrada.';
  END IF;

  -- 3. Verificar se o usuário já possui esta recompensa
  IF EXISTS (SELECT 1 FROM public.user_rewards ur WHERE ur.user_id = user_id AND ur.reward_id = p_reward_id) THEN
      RAISE EXCEPTION 'Você já possui esta recompensa.';
  END IF;

  -- 4. Verificar se o usuário tem moedas suficientes
  IF user_coins IS NULL OR user_coins < reward_cost THEN
    RAISE EXCEPTION 'Moedas insuficientes para comprar esta recompensa.';
  END IF;

  -- 5. Se tudo estiver certo, executar a transação:
  -- Deduzir as moedas do perfil do usuário
  UPDATE public.profiles
  SET coins = coins - reward_cost
  WHERE id = user_id;

  -- Inserir o item na mochila (tabela user_rewards)
  INSERT INTO public.user_rewards (user_id, reward_id)
  VALUES (user_id, p_reward_id);

  -- 6. Retornar uma mensagem de sucesso
  RETURN json_build_object('success', true, 'message', 'Recompensa comprada com sucesso!');
EXCEPTION
  WHEN OTHERS THEN
    -- Em caso de qualquer erro, retorna uma mensagem de erro
    RETURN json_build_object('success', false, 'message', SQLERRM);
END;
$$;