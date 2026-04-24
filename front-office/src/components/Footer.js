import React from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  User,
  Send,
  Car,
  Bus,
  Plane,
  Heart,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Logo from '@/components/Logo';
import { toast } from 'sonner';

export default function Footer() {
  const [email, setEmail] = React.useState('');
  const [subscribing, setSubscribing] = React.useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Veuillez saisir un email valide');
      return;
    }
    setSubscribing(true);
    setTimeout(() => {
      setSubscribing(false);
      toast.success("Merci ! Vous êtes abonné à la newsletter Atiko");
      setEmail('');
    }, 600);
  };

  return (
    <footer className="bg-gray-900 text-white pt-10 sm:pt-14 pb-6" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9] rounded-2xl p-6 sm:p-8 mb-10 shadow-xl">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Work Sans' }}>
                Restez informé
              </h3>
              <p className="text-white/90 text-sm sm:text-base">
                Recevez nos meilleures offres et des conseils de voyage en exclusivité.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <Input
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white border-0 h-11 text-gray-800 placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-white"
                data-testid="newsletter-email"
              />
              <Button
                type="submit"
                disabled={subscribing}
                className="h-11 bg-gray-900 hover:bg-gray-800 text-white px-6 whitespace-nowrap"
                data-testid="newsletter-submit"
              >
                <Send className="h-4 w-4 mr-2" />
                {subscribing ? 'Envoi...' : "S'abonner"}
              </Button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4">
              <Logo size={40} textClassName="text-white" />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Votre partenaire de confiance pour tous vos déplacements au Sénégal et à l'international.
            </p>
            <div className="flex items-center space-x-3">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-[#38BDF8] text-gray-400 hover:text-white transition-all flex items-center justify-center"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-[#38BDF8] text-gray-400 hover:text-white transition-all flex items-center justify-center"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-[#38BDF8] text-gray-400 hover:text-white transition-all flex items-center justify-center"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-white">Services</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/cars"
                  className="text-gray-400 hover:text-[#38BDF8] transition-colors flex items-center gap-2"
                >
                  <Car className="h-3.5 w-3.5" />
                  Location voitures
                </Link>
              </li>
              <li>
                <Link
                  to="/bus"
                  className="text-gray-400 hover:text-[#38BDF8] transition-colors flex items-center gap-2"
                >
                  <Bus className="h-3.5 w-3.5" />
                  Réservation bus
                </Link>
              </li>
              <li>
                <Link
                  to="/flights"
                  className="text-gray-400 hover:text-[#38BDF8] transition-colors flex items-center gap-2"
                >
                  <Plane className="h-3.5 w-3.5" />
                  Billets d'avion
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-[#38BDF8] transition-colors">
                  Mon espace
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-white">Entreprise</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-[#38BDF8] transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-[#38BDF8] transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-[#38BDF8] transition-colors">
                  Aide & FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-[#38BDF8] transition-colors">
                  Conditions générales
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-[#38BDF8] transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-white">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-gray-400">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#38BDF8]" />
                <a
                  href="mailto:contact@atiko.sn"
                  className="hover:text-[#38BDF8] transition-colors break-all"
                >
                  contact@atiko.sn
                </a>
              </li>
              <li className="flex items-start gap-2 text-gray-400">
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#38BDF8]" />
                <a href="tel:+221331234567" className="hover:text-[#38BDF8] transition-colors">
                  +221 33 123 45 67
                </a>
              </li>
              <li className="flex items-start gap-2 text-gray-400">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#38BDF8]" />
                <span>Dakar, Sénégal</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-gray-500">
            <p className="text-xs sm:text-sm text-center md:text-left flex items-center gap-1.5">
              © {new Date().getFullYear()} Atiko. Fait avec
              <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" />
              au Sénégal.
            </p>
            <a
              href="/login"
              className="text-gray-500 hover:text-[#38BDF8] transition-colors flex items-center gap-2 text-xs"
              title="Back-office"
              data-testid="backoffice-link"
            >
              <User className="h-4 w-4" />
              <span>Espace administrateur</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
