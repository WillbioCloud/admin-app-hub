-- Fix remaining database function security issues by adding SET search_path = '' 
-- to remaining security definer functions

CREATE OR REPLACE FUNCTION public.increment_like(post_id_to_update integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  UPDATE public.news_feed
  SET likes = likes + 1
  WHERE id = post_id_to_update;
END;
$function$;

CREATE OR REPLACE FUNCTION public.complete_mission(p_mission_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SET search_path = ''
AS $function$
declare
  already_completed boolean;
begin
  select exists (
    select 1 from user_completed_missions
    where user_id = auth.uid() and mission_id = p_mission_id
  ) into already_completed;

  if already_completed then
    return jsonb_build_object('success', false, 'message', 'Missão já completada');
  end if;

  insert into user_completed_missions(user_id, mission_id)
  values (auth.uid(), p_mission_id);

  update profiles
  set
    xp = xp + (select xp_reward from missions where id = p_mission_id),
    coins = coins + (select coin_reward from missions where id = p_mission_id)
  where id = auth.uid();

  return jsonb_build_object('success', true);
exception
  when others then
    return jsonb_build_object('success', false, 'message', SQLERRM);
end;
$function$;

CREATE OR REPLACE FUNCTION public.increment_post_comments_count(p_post_id integer)
RETURNS void
LANGUAGE plpgsql
SET search_path = ''
AS $function$
BEGIN
  UPDATE news_feed
  SET comments = comments + 1
  WHERE id = p_post_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.increment_view(post_id_to_update integer)
RETURNS void
LANGUAGE plpgsql
SET search_path = ''
AS $function$
BEGIN
  UPDATE public.news_feed
  SET views = views + 1
  WHERE id = post_id_to_update;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_news_feed_with_likes(p_user_id uuid)
RETURNS TABLE(id bigint, title text, description text, image_url text, video_url text, media_type text, published_at timestamp with time zone, likes bigint, comments bigint, views bigint, author_name text, author_avatar_url text, is_liked_by_user boolean)
LANGUAGE sql
SET search_path = ''
AS $function$
  select
    nf.id,
    nf.title,
    nf.description,
    nf.image_url,
    nf.video_url,
    nf.media_type,
    nf.published_at,
    nf.likes,
    nf.comments,
    nf.views,
    nf.author_name,
    nf.author_avatar_url,
    (pl.user_id is not null) as is_liked_by_user
  from news_feed nf
  left join post_likes pl
    on pl.post_id = nf.id and pl.user_id = p_user_id
  order by nf.published_at desc
$function$;

CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;