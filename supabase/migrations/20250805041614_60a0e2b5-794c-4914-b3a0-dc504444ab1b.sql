-- Ajustar dados para ficar como na imagem
-- Deixar apenas alguns usuários aprovados e outros não
UPDATE public.profiles 
SET is_approved = false
WHERE user_type = 'cliente';

-- Manter admin@app.com como comerciante aprovado (como ele pediu)
UPDATE public.profiles 
SET is_approved = true
WHERE id = '5191287c-eb5c-4378-ae4f-a1c18d7b3baf';

-- Manter admins aprovados
UPDATE public.profiles 
SET is_approved = true
WHERE user_type = 'admin';