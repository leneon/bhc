import React from 'react';
import { useNavigate, useSearchParams, useLocation, Link } from 'react-router-dom';
import {
  Mail,
  Lock,
  User,
  Chrome,
  Eye,
  EyeOff,
  AlertCircle,
  Car,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { login, register, loginWithGoogle } from '@/utils/auth';
import { toast } from 'sonner';

const getPasswordStrength = (pwd) => {
  if (!pwd) return { score: 0, label: '', color: 'bg-gray-200' };
  let score = 0;
  if (pwd.length >= 6) score++;
  if (pwd.length >= 10) score++;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
  if (/\d/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const labels = ['Très faible', 'Faible', 'Moyen', 'Bon', 'Fort', 'Excellent'];
  const colors = [
    'bg-gray-200',
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-green-500',
    'bg-green-600',
  ];
  return { score, label: labels[score], color: colors[score] };
};

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const redirectTo = location.state?.from || '/dashboard';

  const [activeTab, setActiveTab] = React.useState(initialTab);
  const [loginData, setLoginData] = React.useState({ email: '', password: '' });
  const [registerData, setRegisterData] = React.useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = React.useState({
    login: false,
    register: false,
    confirm: false,
  });
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
        toast.success('Connexion réussie');
        navigate(redirectTo);
      } else {
        setError(result.error || 'Identifiants incorrects');
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
    const { name, email, password, confirmPassword } = registerData;

    if (!name || !email || !password || !confirmPassword) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email invalide');
      return;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);
    try {
      const result = await register(name, email, password);
      if (result.success) {
        toast.success('Inscription réussie ! Connectez-vous pour continuer.');
        setActiveTab('login');
        setError('');
        setLoginData({ email, password: '' });
        setRegisterData({ name: '', email: '', password: '', confirmPassword: '' });
      } else {
        setError(result.error || "Erreur lors de l'inscription");
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
      navigate(redirectTo);
    } else {
      toast.info(result.error || 'Google login non disponible pour le moment');
    }
  };

  const strength = getPasswordStrength(registerData.password);
  const passwordsMatch =
    registerData.confirmPassword &&
    registerData.password === registerData.confirmPassword;

  return (
    <div
      className="min-h-screen relative flex items-center justify-center px-4 py-10"
      style={{
        backgroundImage: `url(${authBgUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#0f172a',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-sky-900/60 to-slate-900/80 backdrop-blur-[3px]" />

      <div className="relative w-full max-w-md animate-fade-in">
        <Link
          to="/"
          className="flex items-center justify-center gap-2 mb-6 text-white hover:text-sky-200 transition-colors"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-[#38BDF8] to-[#0EA5E9] rounded-lg flex items-center justify-center shadow-lg">
            <Car className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold" style={{ fontFamily: 'Work Sans' }}>
            Atiko
          </span>
        </Link>

        <div className="text-center mb-6 text-white">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ fontFamily: 'Work Sans' }}>
            {activeTab === 'login' ? 'Ravi de vous revoir' : 'Rejoignez Atiko'}
          </h1>
          <p className="text-white/80 text-sm">
            {activeTab === 'login'
              ? 'Connectez-vous pour gérer vos réservations'
              : "Créez un compte pour réserver vos voyages en quelques clics"}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8" data-testid="auth-form">
          {error && (
            <div
              className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-2 text-sm animate-fade-in"
              role="alert"
            >
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setError(''); }}>
            <TabsList className="grid w-full grid-cols-2 mb-6 p-1">
              <TabsTrigger value="login" data-testid="login-tab">
                Connexion
              </TabsTrigger>
              <TabsTrigger value="register" data-testid="register-tab">
                Inscription
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label className="flex items-center text-gray-700 font-medium mb-2 text-sm">
                    <Mail className="h-4 w-4 mr-2 text-[#0EA5E9]" />
                    Email ou nom d'utilisateur
                  </Label>
                  <Input
                    type="text"
                    placeholder="votre@email.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    className="h-11"
                    autoComplete="username"
                    data-testid="login-email-input"
                    disabled={loading}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="flex items-center text-gray-700 font-medium text-sm">
                      <Lock className="h-4 w-4 mr-2 text-[#0EA5E9]" />
                      Mot de passe
                    </Label>
                    <button
                      type="button"
                      className="text-xs text-[#0EA5E9] hover:underline"
                      onClick={() =>
                        toast.info(
                          'Contactez le support via la page Contact pour réinitialiser votre mot de passe'
                        )
                      }
                    >
                      Oublié ?
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      type={showPassword.login ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                      className="h-11 pr-10"
                      autoComplete="current-password"
                      data-testid="login-password-input"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword({ ...showPassword, login: !showPassword.login })
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                      aria-label={showPassword.login ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    >
                      {showPassword.login ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9] hover:from-[#0EA5E9] hover:to-[#0284C7] h-11 font-semibold shadow-md"
                  data-testid="login-submit-btn"
                  disabled={loading}
                >
                  {loading ? 'Connexion en cours...' : 'Se connecter'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Label className="flex items-center text-gray-700 font-medium mb-2 text-sm">
                    <User className="h-4 w-4 mr-2 text-[#0EA5E9]" />
                    Nom d'utilisateur
                  </Label>
                  <Input
                    type="text"
                    placeholder="Ex: jeandupont"
                    value={registerData.name}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, name: e.target.value })
                    }
                    className="h-11"
                    autoComplete="username"
                    data-testid="register-name-input"
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label className="flex items-center text-gray-700 font-medium mb-2 text-sm">
                    <Mail className="h-4 w-4 mr-2 text-[#0EA5E9]" />
                    Email
                  </Label>
                  <Input
                    type="email"
                    placeholder="votre@email.com"
                    value={registerData.email}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, email: e.target.value })
                    }
                    className="h-11"
                    autoComplete="email"
                    data-testid="register-email-input"
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label className="flex items-center text-gray-700 font-medium mb-2 text-sm">
                    <Lock className="h-4 w-4 mr-2 text-[#0EA5E9]" />
                    Mot de passe
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword.register ? 'text' : 'password'}
                      placeholder="Minimum 6 caractères"
                      value={registerData.password}
                      onChange={(e) =>
                        setRegisterData({ ...registerData, password: e.target.value })
                      }
                      className="h-11 pr-10"
                      autoComplete="new-password"
                      data-testid="register-password-input"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword({ ...showPassword, register: !showPassword.register })
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                      aria-label="Afficher/masquer le mot de passe"
                    >
                      {showPassword.register ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {registerData.password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-colors ${
                              i <= strength.score ? strength.color : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">
                        Sécurité : <span className="font-medium">{strength.label}</span>
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  <Label className="flex items-center text-gray-700 font-medium mb-2 text-sm">
                    <Lock className="h-4 w-4 mr-2 text-[#0EA5E9]" />
                    Confirmer le mot de passe
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword.confirm ? 'text' : 'password'}
                      placeholder="Retapez votre mot de passe"
                      value={registerData.confirmPassword}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className={`h-11 pr-10 ${
                        registerData.confirmPassword && !passwordsMatch
                          ? 'border-red-300 focus-visible:ring-red-300'
                          : ''
                      }`}
                      autoComplete="new-password"
                      data-testid="register-confirm-input"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword({ ...showPassword, confirm: !showPassword.confirm })
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                      aria-label="Afficher/masquer la confirmation"
                    >
                      {showPassword.confirm ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {registerData.confirmPassword && (
                    <p
                      className={`text-xs mt-1 flex items-center gap-1 ${
                        passwordsMatch ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {passwordsMatch ? <Check className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                      {passwordsMatch
                        ? 'Les mots de passe correspondent'
                        : 'Les mots de passe ne correspondent pas'}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9] hover:from-[#0EA5E9] hover:to-[#0284C7] h-11 font-semibold shadow-md"
                  data-testid="register-submit-btn"
                  disabled={loading}
                >
                  {loading ? 'Inscription en cours...' : "Créer mon compte"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wider">
              <span className="px-3 bg-white text-gray-500">Ou continuer avec</span>
            </div>
          </div>

          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            className="w-full h-11 border-2 hover:bg-slate-50"
            data-testid="google-login-btn"
          >
            <Chrome className="h-5 w-5 mr-2 text-[#4285F4]" />
            Continuer avec Google
          </Button>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-white/70 text-xs mt-5">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Vos données sont chiffrées et protégées</span>
        </div>
      </div>
    </div>
  );
}
