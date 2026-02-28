import React from 'react';
import { Mail, Phone, MapPin, Send, Clock, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { contactService } from '@/services/contactService';

export default function ContactPage() {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const contactData = {
        nom: formData.name,
        email: formData.email,
        telephone: formData.phone,
        sujet: formData.subject,
        message: formData.message,
      };
      
      const result = await contactService.sendContactMessage(contactData);
      
      if (result.success) {
        toast.success('Message envoyé avec succès! Nous vous répondrons sous 24h.');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        toast.error(result.error || 'Erreur lors de l\'envoi du message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#6EE7B7] via-[#34D399] to-[#10B981] py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6" style={{ fontFamily: 'Work Sans' }} data-testid="contact-title">
              Contactez-nous
            </h1>
            <p className="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto">
              Une question ? Un problème ? Notre équipe est là pour vous aider 24/7
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow" data-testid="contact-phone">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FDBA74] to-[#FB923C] rounded-full flex items-center justify-center mx-auto mb-6">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Téléphone</h3>
              <p className="text-gray-600 mb-2">Appelez-nous directement</p>
              <a href="tel:+221331234567" className="text-[#38BDF8] font-semibold text-lg hover:underline">
                +221 33 123 45 67
              </a>
              <p className="text-sm text-gray-500 mt-2">Lun-Dim: 7h-22h</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow" data-testid="contact-email">
              <div className="w-16 h-16 bg-gradient-to-br from-[#38BDF8] to-[#0EA5E9] rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Email</h3>
              <p className="text-gray-600 mb-2">Écrivez-nous</p>
              <a href="mailto:contact@atiko.sn" className="text-[#38BDF8] font-semibold text-lg hover:underline">
                contact@atiko.sn
              </a>
              <p className="text-sm text-gray-500 mt-2">Réponse sous 24h</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-shadow" data-testid="contact-location">
              <div className="w-16 h-16 bg-gradient-to-br from-[#6EE7B7] to-[#34D399] rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Bureau</h3>
              <p className="text-gray-600 mb-2">Visitez-nous</p>
              <p className="text-gray-700 font-medium">
                Avenue Léopold Sédar Senghor<br />
                Dakar, Sénégal
              </p>
              <p className="text-sm text-gray-500 mt-2">Lun-Ven: 8h-18h</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6" style={{ fontFamily: 'Work Sans' }}>
                Envoyez-nous un message
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Remplissez le formulaire ci-dessous et notre équipe vous répondra dans les plus brefs délais.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#38BDF8]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-[#38BDF8]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">Temps de réponse rapide</h4>
                    <p className="text-gray-600 text-sm">Nous répondons généralement en moins de 2 heures pendant les heures ouvrables</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#FDBA74]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="h-5 w-5 text-[#FDBA74]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">Support multilingue</h4>
                    <p className="text-gray-600 text-sm">Notre équipe parle français, wolof et anglais</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#6EE7B7]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-[#6EE7B7]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">Assistance 24/7</h4>
                    <p className="text-gray-600 text-sm">Service client disponible tous les jours de la semaine</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8" data-testid="contact-form">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label className="text-gray-700 font-medium mb-2 block">Nom complet *</Label>
                  <Input 
                    required
                    placeholder="Jean Dupont"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    data-testid="contact-name-input"
                  />
                </div>

                <div>
                  <Label className="text-gray-700 font-medium mb-2 block">Email *</Label>
                  <Input 
                    type="email"
                    required
                    placeholder="jean.dupont@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    data-testid="contact-email-input"
                  />
                </div>

                <div>
                  <Label className="text-gray-700 font-medium mb-2 block">Téléphone</Label>
                  <Input 
                    type="tel"
                    placeholder="+221 77 123 45 67"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    data-testid="contact-phone-input"
                  />
                </div>

                <div>
                  <Label className="text-gray-700 font-medium mb-2 block">Sujet *</Label>
                  <Input 
                    required
                    placeholder="Comment pouvons-nous vous aider ?"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    data-testid="contact-subject-input"
                  />
                </div>

                <div>
                  <Label className="text-gray-700 font-medium mb-2 block">Message *</Label>
                  <Textarea 
                    required
                    placeholder="Décrivez votre demande en détail..."
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="resize-none"
                    data-testid="contact-message-input"
                  />
                </div>

                <Button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9] hover:from-[#0EA5E9] hover:to-[#0284C7] h-12 text-lg font-semibold"
                  data-testid="contact-submit-btn"
                >
                  <Send className="h-5 w-5 mr-2" />
                  {loading ? 'Envoi en cours...' : 'Envoyer le message'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Work Sans' }}>
              Questions Fréquentes
            </h2>
            <p className="text-gray-600 text-lg">Trouvez rapidement des réponses</p>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "Comment puis-je modifier ou annuler ma réservation ?",
                a: "Vous pouvez gérer vos réservations depuis votre espace client. L'annulation est gratuite jusqu'à 24h avant le départ."
              },
              {
                q: "Quels moyens de paiement acceptez-vous ?",
                a: "Nous acceptons les cartes bancaires (Visa, Mastercard), Mobile Money (Orange Money, Wave, Free Money) et PayPal."
              },
              {
                q: "Dois-je imprimer mon billet ?",
                a: "Non, vous pouvez présenter votre billet électronique directement depuis votre smartphone."
              },
              {
                q: "Y a-t-il des frais cachés ?",
                a: "Non, tous les prix affichés sont finaux. Aucun frais supplémentaire ne sera ajouté lors du paiement."
              }
            ].map((faq, idx) => (
              <div key={idx} className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-6" data-testid={`faq-${idx}`}>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}