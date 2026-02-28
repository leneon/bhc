import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Chrome } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { login, register, loginWithGoogle } from '@/utils/auth';

export default function AuthPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState('login');
  const [loginData, setLoginData] = React.useState({ email: '', password: '' });
  const [registerData, setRegisterData] = React.useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const authBgUrl =
    'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1920&q=80';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!loginData.email || !loginData.password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    
    setLoading(true);
    try {
      const result = await login(loginData.email, loginData.password);
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Erreur de connexion');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!registerData.name || !registerData.email || !registerData.password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    
    setLoading(true);
    try {
      const result = await register(registerData.name, registerData.email, registerData.password);
      
      if (result.success) {
        setActiveTab('login');
        setError('');
        alert('Inscription réussie ! Veuillez vous connecter.');
      } else {
        setError(result.error || 'Erreur lors de l\'inscription');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const result = loginWithGoogle();
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Google login non disponible');
    }
  };

  return (
    <div
      className="min-h-screen relative flex items-center justify-center px-4 py-12"
      style={{
        backgroundImage: `url(${authBgUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#0f172a',
      }}
    >
      <div className="absolute inset-0 bg-slate-900/55 backdrop-blur-[2px]" />
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Work Sans' }}>
            Bienvenue sur Atiko
          </h1>
          <p className="text-gray-600">Connectez-vous pour continuer</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8" data-testid="auth-form">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" data-testid="login-tab">Connexion</TabsTrigger>
              <TabsTrigger value="register" data-testid="register-tab">Inscription</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label className="flex items-center text-gray-700 font-medium mb-2">
                    <Mail className="h-4 w-4 mr-2" />
                    Nom d'utilisateur ou Email
                  </Label>
                  <Input 
                    type="text" 
                    placeholder="votre@email.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                    data-testid="login-email-input"
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label className="flex items-center text-gray-700 font-medium mb-2">
                    <Lock className="h-4 w-4 mr-2" />
                    Mot de passe
                  </Label>
                  <Input 
                    type="password" 
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    data-testid="login-password-input"
                    disabled={loading}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-[#38BDF8] hover:bg-[#0EA5E9] h-11"
                  data-testid="login-submit-btn"
                  disabled={loading}
                >
                  {loading ? 'Connexion...' : 'Se connecter'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Label className="flex items-center text-gray-700 font-medium mb-2">
                    <User className="h-4 w-4 mr-2" />
                    Nom d'utilisateur
                  </Label>
                  <Input 
                    type="text" 
                    placeholder="jeandupont"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                    data-testid="register-name-input"
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label className="flex items-center text-gray-700 font-medium mb-2">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Label>
                  <Input 
                    type="email" 
                    placeholder="votre@email.com"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                    data-testid="register-email-input"
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label className="flex items-center text-gray-700 font-medium mb-2">
                    <Lock className="h-4 w-4 mr-2" />
                    Mot de passe (min. 6 caractères)
                  </Label>
                  <Input 
                    type="password" 
                    placeholder="••••••••"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                    data-testid="register-password-input"
                    disabled={loading}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-[#38BDF8] hover:bg-[#0EA5E9] h-11"
                  data-testid="register-submit-btn"
                  disabled={loading}
                >
                  {loading ? 'Inscription...' : 'S\'inscrire'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Ou continuer avec</span>
            </div>
          </div>

          <Button 
            onClick={handleGoogleLogin}
            variant="outline"
            className="w-full h-11 border-2 hover:bg-slate-50"
            data-testid="google-login-btn"
          >
            <Chrome className="h-5 w-5 mr-2" />
            Google
          </Button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          En vous connectant, vous acceptez nos conditions d'utilisation
        </p>
      </div>
    </div>
  );
}