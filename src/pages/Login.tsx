
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Email ou senha inválidos');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login - Painel Administrativo</CardTitle>
          <CardDescription>
            Entre com suas credenciais para acessar o sistema
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seu@email.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Sua senha"
              />
            </div>

            <div className="text-sm text-muted-foreground">
              <p><strong>Contas de demonstração:</strong></p>
              <p>Admin: admin@app.com / 123456</p>
              <p>Comerciante: comerciante@loja.com / 123456</p>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
