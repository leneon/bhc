import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 sm:py-10 md:py-12" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* About */}
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-bold mb-3 sm:mb-4" style={{ fontFamily: 'Work Sans' }}>Atiko</h3>
            <p className="text-gray-400 text-sm">
              Votre partenaire de confiance pour tous vos déplacements au Sénégal et à l'international.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-left">
            <h4 className="font-bold mb-3 sm:mb-4">Liens rapides</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/cars" className="text-gray-400 hover:text-[#38BDF8] transition-colors">
                  Location de voitures
                </Link>
              </li>
              <li>
                <Link to="/bus" className="text-gray-400 hover:text-[#38BDF8] transition-colors">
                  Réservation de bus
                </Link>
              </li>
              <li>
                <Link to="/flights" className="text-gray-400 hover:text-[#38BDF8] transition-colors">
                  Billets d'avion
                </Link>
              </li>
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
                <Link to="/dashboard" className="text-gray-400 hover:text-[#38BDF8] transition-colors">
                  Mon espace
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="text-center sm:text-left">
            <h4 className="font-bold mb-3 sm:mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-400">Aide & FAQ</li>
              <li className="text-gray-400">Conditions générales</li>
              <li className="text-gray-400">Politique de confidentialité</li>
              <li className="text-gray-400">Politique d'annulation</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center sm:text-left">
            <h4 className="font-bold mb-3 sm:mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center justify-center sm:justify-start text-gray-400">
                <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="break-all">contact@atiko.sn</span>
              </li>
              <li className="flex items-center justify-center sm:justify-start text-gray-400">
                <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>+221 33 123 45 67</span>
              </li>
              <li className="flex items-center justify-center sm:justify-start text-gray-400">
                <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>Dakar, Sénégal</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 sm:pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-xs sm:text-sm text-center md:text-left">
              © 2025 Atiko. Tous droits réservés.
            </p>
            <div className="flex items-center space-x-4 sm:space-x-6">
              <a href="#" className="text-gray-400 hover:text-[#38BDF8] transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#38BDF8] transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#38BDF8] transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <div className="h-5 w-px bg-gray-700"></div>
              <a 
                href="/login" 
                className="text-gray-400 hover:text-[#38BDF8] transition-colors flex items-center gap-2 group"
                title="Back-office"
                data-testid="backoffice-link"
              >
                <User className="h-5 w-5" />
                <span className="text-xs hidden sm:inline group-hover:text-[#38BDF8] transition-colors">Admin</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}