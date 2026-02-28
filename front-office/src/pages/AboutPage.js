import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Users, Award, TrendingUp, Heart, Shield, Clock, Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#38BDF8] via-[#7DD3FC] to-[#BAE6FD] py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6" style={{ fontFamily: 'Work Sans' }} data-testid="about-title">
              À propos d'Atiko
            </h1>
            <p className="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed">
              Votre partenaire de confiance pour une mobilité accessible, rapide et sécurisée au Sénégal et à l'international.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div data-testid="mission-content">
              <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full mb-6">
                <Target className="h-5 w-5" />
                <span className="font-semibold">Notre Mission</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6" style={{ fontFamily: 'Work Sans' }}>
                Révolutionner le transport au Sénégal
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                Atiko a été fondée avec une vision claire : rendre le voyage accessible à tous. 
                Que vous ayez besoin d'une voiture pour un weekend, d'un bus pour rejoindre votre famille, 
                ou d'un vol pour explorer le monde, nous sommes là pour vous.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Notre plateforme connecte des milliers de voyageurs avec les meilleures options de transport, 
                tout en garantissant transparence, sécurité et facilité d'utilisation.
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1552581234-26160f608093?w=800" 
                alt="Mission" 
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-[#6EE7B7] rounded-xl p-6 shadow-xl">
                <div className="text-3xl font-bold text-gray-800">5000+</div>
                <div className="text-gray-700">Clients satisfaits</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-orange-50 to-pink-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Work Sans' }}>
              Nos Valeurs
            </h2>
            <p className="text-gray-600 text-lg">Ce qui nous guide au quotidien</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow" data-testid="value-trust">
              <div className="w-16 h-16 bg-gradient-to-br from-[#38BDF8] to-[#0EA5E9] rounded-xl flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Confiance</h3>
              <p className="text-gray-600 leading-relaxed">
                Nous mettons la sécurité de nos clients au centre de tout ce que nous faisons. 
                Paiements sécurisés, partenaires vérifiés, service client disponible 24/7.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow" data-testid="value-simplicity">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FDBA74] to-[#FB923C] rounded-xl flex items-center justify-center mb-6">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Simplicité</h3>
              <p className="text-gray-600 leading-relaxed">
                Réserver un transport ne devrait jamais être compliqué. Notre plateforme intuitive 
                vous permet de réserver en quelques clics, où que vous soyez.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow" data-testid="value-excellence">
              <div className="w-16 h-16 bg-gradient-to-br from-[#6EE7B7] to-[#34D399] rounded-xl flex items-center justify-center mb-6">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Excellence</h3>
              <p className="text-gray-600 leading-relaxed">
                Nous sélectionnons rigoureusement nos partenaires pour vous offrir la meilleure 
                expérience possible. Qualité et satisfaction sont nos priorités.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center" data-testid="stat-clients">
              <div className="text-5xl font-bold text-[#38BDF8] mb-2">5000+</div>
              <div className="text-gray-600 font-medium">Clients actifs</div>
            </div>
            <div className="text-center" data-testid="stat-vehicles">
              <div className="text-5xl font-bold text-[#FDBA74] mb-2">500+</div>
              <div className="text-gray-600 font-medium">Véhicules disponibles</div>
            </div>
            <div className="text-center" data-testid="stat-routes">
              <div className="text-5xl font-bold text-[#6EE7B7] mb-2">50+</div>
              <div className="text-gray-600 font-medium">Lignes de bus</div>
            </div>
            <div className="text-center" data-testid="stat-destinations">
              <div className="text-5xl font-bold text-[#F472B6] mb-2">100+</div>
              <div className="text-gray-600 font-medium">Destinations</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Work Sans' }}>
              Notre Équipe
            </h2>
            <p className="text-gray-600 text-lg">Des passionnés au service de votre mobilité</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Amadou Diallo', role: 'CEO & Fondateur', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
              { name: 'Aïssatou Seck', role: 'Directrice Technique', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400' },
              { name: 'Ousmane Fall', role: 'Responsable Client', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400' }
            ].map((member, idx) => (
              <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow" data-testid={`team-member-${idx}`}>
                <img src={member.image} alt={member.name} className="w-full h-64 object-cover" />
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
                  <p className="text-[#38BDF8] font-medium">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'Work Sans' }}>
            Rejoignez l'aventure Atiko
          </h2>
          <p className="text-white/95 text-xl mb-8">
            Des milliers de voyageurs nous font confiance chaque jour. Pourquoi pas vous ?
          </p>
          <Button 
            onClick={() => navigate('/auth')}
            className="bg-white text-[#38BDF8] hover:bg-gray-100 h-14 px-8 text-lg font-semibold"
            data-testid="cta-signup-btn"
          >
            Commencer maintenant
          </Button>
        </div>
      </section>
    </div>
  );
}