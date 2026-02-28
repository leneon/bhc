import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, Smartphone, Lock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { saveBooking } from '@/utils/bookings';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state;
  const [paymentMethod, setPaymentMethod] = React.useState('CARTE');
  const [processing, setProcessing] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState('');

  if (!bookingData) {
    navigate('/');
    return null;
  }

  const handlePayment = async () => {
    setProcessing(true);
    setError('');
    
    try {
      const bookingToSave = {
        ...bookingData,
        paymentMethod,
      };
      
      const booking = await saveBooking(bookingToSave);
      
      setSuccess(true);
      toast.success('Réservation confirmée avec succès !');
      
      setTimeout(() => {
        navigate('/dashboard', { state: { bookingId: booking.id } });
      }, 2000);
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Erreur lors du paiement');
      toast.error(err.message || 'Erreur lors du paiement');
      setProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-md animate-fade-in" data-testid="success-message">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Paiement réussi !</h2>
          <p className="text-gray-600 mb-6">Votre réservation a été confirmée avec succès.</p>
          <div className="w-12 h-1 bg-[#38BDF8] mx-auto rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8" style={{ fontFamily: 'Work Sans' }} data-testid="checkout-title">
          Finaliser la réservation
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6" data-testid="payment-form">
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}
              
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Mode de paiement</h2>

              <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="CARTE" className="flex items-center gap-2" data-testid="stripe-tab">
                    <CreditCard className="h-4 w-4" />
                    Carte bancaire
                  </TabsTrigger>
                  <TabsTrigger value="MOBILE_MONEY" className="flex items-center gap-2" data-testid="mobile-money-tab">
                    <Smartphone className="h-4 w-4" />
                    Mobile Money
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="CARTE" className="space-y-4">
                  <div>
                    <Label className="text-gray-700 font-medium mb-2 block">Numéro de carte</Label>
                    <Input placeholder="1234 5678 9012 3456" data-testid="card-number-input" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-700 font-medium mb-2 block">Date d'expiration</Label>
                      <Input placeholder="MM/AA" data-testid="card-expiry-input" />
                    </div>
                    <div>
                      <Label className="text-gray-700 font-medium mb-2 block">CVV</Label>
                      <Input placeholder="123" type="password" data-testid="card-cvv-input" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-700 font-medium mb-2 block">Nom sur la carte</Label>
                    <Input placeholder="JOHN DOE" data-testid="card-name-input" />
                  </div>
                  <div className="flex items-center text-sm text-gray-600 bg-slate-50 p-3 rounded-lg">
                    <Lock className="h-4 w-4 mr-2 text-green-600" />
                    Paiement 100% sécurisé avec Stripe
                  </div>
                </TabsContent>

                <TabsContent value="MOBILE_MONEY" className="space-y-4">
                  <div>
                    <Label className="text-gray-700 font-medium mb-2 block">Service</Label>
                    <select className="w-full border border-gray-300 rounded-md px-3 py-2" data-testid="mobile-service-select">
                      <option>Orange Money</option>
                      <option>Wave</option>
                      <option>Free Money</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-gray-700 font-medium mb-2 block">Numéro de téléphone</Label>
                    <Input placeholder="+221 77 123 45 67" data-testid="mobile-number-input" />
                  </div>
                  <div className="flex items-center text-sm text-gray-600 bg-slate-50 p-3 rounded-lg">
                    <Lock className="h-4 w-4 mr-2 text-green-600" />
                    Paiement sécurisé. Vous recevrez un code de confirmation par SMS.
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 mt-6" data-testid="billing-info">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Informations de facturation</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700 font-medium mb-2 block">Prénom</Label>
                  <Input placeholder="Jean" data-testid="billing-firstname" />
                </div>
                <div>
                  <Label className="text-gray-700 font-medium mb-2 block">Nom</Label>
                  <Input placeholder="Dupont" data-testid="billing-lastname" />
                </div>
                <div className="md:col-span-2">
                  <Label className="text-gray-700 font-medium mb-2 block">Email</Label>
                  <Input type="email" placeholder="jean.dupont@email.com" data-testid="billing-email" />
                </div>
                <div className="md:col-span-2">
                  <Label className="text-gray-700 font-medium mb-2 block">Téléphone</Label>
                  <Input placeholder="+221 77 123 45 67" data-testid="billing-phone" />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4" data-testid="order-summary">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Récapitulatif</h2>

              <div className="space-y-4 mb-6">
                <div className="pb-4 border-b">
                  <div className="text-sm text-gray-600 mb-2">Type de réservation</div>
                  <div className="font-bold text-gray-800">{bookingData.type}</div>
                </div>

                {bookingData.type === 'Voiture' && (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Véhicule</span>
                      <span className="font-medium">{bookingData.details.carName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ville</span>
                      <span className="font-medium">{bookingData.details.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Du</span>
                      <span className="font-medium">{bookingData.details.startDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Au</span>
                      <span className="font-medium">{bookingData.details.endDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Durée</span>
                      <span className="font-medium">{bookingData.details.days} jours</span>
                    </div>
                  </div>
                )}

                {bookingData.type === 'Bus' && (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Compagnie</span>
                      <span className="font-medium">{bookingData.details.company}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trajet</span>
                      <span className="font-medium">{bookingData.details.from} → {bookingData.details.to}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Départ</span>
                      <span className="font-medium">{bookingData.details.departure}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Durée</span>
                      <span className="font-medium">{bookingData.details.duration}</span>
                    </div>
                  </div>
                )}

                {bookingData.type === 'Avion' && (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Compagnie</span>
                      <span className="font-medium">{bookingData.details.airline}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vol</span>
                      <span className="font-medium">{bookingData.details.from} → {bookingData.details.to}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Départ</span>
                      <span className="font-medium">{bookingData.details.departure}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Classe</span>
                      <span className="font-medium">{bookingData.details.class}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">Total</span>
                  <span className="text-3xl font-bold text-[#38BDF8]">
                    {bookingData.totalPrice.toLocaleString()} FCFA
                  </span>
                </div>
              </div>

              <Button 
                onClick={handlePayment}
                disabled={processing}
                className="w-full bg-[#38BDF8] hover:bg-[#0EA5E9] h-12 text-lg font-semibold"
                data-testid="confirm-payment-btn"
              >
                {processing ? 'Traitement en cours...' : 'Confirmer le paiement'}
              </Button>

              <p className="text-xs text-gray-500 text-center mt-4">
                En confirmant, vous acceptez nos conditions générales
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}