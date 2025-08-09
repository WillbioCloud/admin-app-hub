-- Deletar usuário admin@app.com existente para permitir novo cadastro
DELETE FROM auth.users WHERE email = 'admin@app.com';