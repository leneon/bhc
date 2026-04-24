import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  CreditCard,
  Smartphone,
  Lock,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  User,
  Info,
  Shield,
  Car as CarIcon,
  Bus as BusIcon,
  Plane as PlaneIcon,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Breadcrumbs from '@/components/Breadcrumbs';
import { saveBooking } from '@/utils/bookings';
import { toast } from 'sonner';

const STEPS = [
  { id: 1, label: 'Informations' },
  { id: 2, label: 'Paiement' },
  { id: 3, label: 'Confirmation' },
];

const formatCardNumber = (value) =>
  value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ');

const formatExpiry = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

const typeIcon = (type) => {
  if (type === 'Voiture') return CarIcon;
  if (type === 'Bus') return BusIcon;
  if (type === 'Avion') return PlaneIcon;
  return CarIcon;
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state;

  const [step, setStep] = React.useState(1);
  const [paymentMethod, setPaymentMethod] = React.useState('CARTE');
  const [processing, setProcessing] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [successId, setSuccessId] = React.useState(null);
  const [error, setError] = React.useState('');

  const [billing, setBilling] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [card, setCard] = React.useState({ number: '', expiry: '', cvv: '', name: '' });
  const [mobile, setMobile] = React.useState({ service: 'Orange Money', phone: '' });

  if (!bookingData) {
    navigate('/');
    return null;
  }

  const TypeIcon = typeIcon(bookingData.type);

  const goNext = () => {
    if (step === 1) {
      if (!billing.firstName || !billing.lastName || !billing.email || !billing.phone) {
        setError('Veuillez compléter tous les champs de facturation');
        return;
      }
      if (!/\S+@\S+\.\S+/.test(billing.email)) {
        setError('Email invalide');
        return;
      }
      setError('');
      setStep(2);
    }
  };

  const goBack = () => {
    setError('');
    if (step > 1) setStep(step - 1);
    else navigate(-1);
  };

  const validatePayment = () => {
    if (paymentMethod === 'CARTE') {
      const digits = card.number.replace(/\s/g, '');
      if (digits.length < 13) return 'Numéro de carte invalide';
      if (!/^\d{2}\/\d{2}$/.test(card.expiry)) return 'Date d\'expiration invalide';
      if (!/^\d{3,4}$/.test(card.cvv)) return 'CVV invalide';
      if (!card.name) return 'Nom sur la carte requis';
    } else {
      if (!mobile.phone || mobile.phone.replace(/\D/g, '').length < 9)
        return 'Numéro de téléphone invalide';
    }
    return null;
  };

  const handlePayment = async () => {
    const err = validatePayment();
    if (err) {
      setError(err);
      return;
    }
    setError('');
    setProcessing(true);
    try {
      const bookingToSave = { ...bookingData, paymentMethod };
      const booking = await saveBooking(bookingToSave);
      setSuccessId(booking.id);
      setStep(3);
      setSuccess(true);
      toast.success('Réservation confirmée avec succès !');
    } catch (err) {
      const msg = err.message || 'Erreur lors du paiement';
      setError(msg);
      toast.error(msg);
    } finally {
      setProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 py-8 md:py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center animate-scale-in"
            data-testid="success-message"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle className="h-14 w-14 text-white" />
            </div>
            <h2
              className="text-3xl md:text-4xl font-bold text-gray-800 mb-3"
              style={{ fontFamily: 'Work Sans' }}
            >
              Paiement réussi !
            </h2>
            <p className="text-gray-600 mb-2">
              Votre réservation a bien été enregistrée.
            </p>
            {successId && (
              <p className="text-sm text-gray-500 mb-6">
                Référence :{' '}
                <span className="font-mono font-semibold text-gray-700">
                  #{successId}
                </span>
              </p>
            )}

            <div className="bg-gradient-to-br from-sky-50 to-slate-50 rounded-xl p-5 text-left mb-6 border border-sky-100">
              <div className="flex items-center gap-2 mb-2 text-sky-700 font-semibold">
                <TypeIcon className="h-5 w-5" />
                {bookingData.type}
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-gray-600 text-sm">Montant payé</span>
                <span className="text-2xl font-bold text-[#0EA5E9]">
                  {bookingData.totalPrice.toLocaleString()} FCFA
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => navigate('/dashboard', { state: { bookingId: successId } })}
                className="bg-[#38BDF8] hover:bg-[#0EA5E9] h-11 px-6"
              >
                Voir mes réservations
              </Button>
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="h-11 px-6"
              >
                Retour à l'accueil
              </Button>
            </div>

            <p className="text-xs text-gray-500 mt-6 flex items-center justify-center gap-1.5">
              <Info className="h-3.5 w-3.5" />
              Un email de confirmation vous a été envoyé
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-6 md:py-8">
      <div className="max-w-5xl mx-auto px-3 sm:px-4">
        <Breadcrumbs items={[{ label: 'Finaliser la réservation' }]} />

        <h1
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-5 md:mb-7"
          style={{ fontFamily: 'Work Sans' }}
          data-testid="checkout-title"
        >
          Finaliser la réservation
        </h1>

        {/* Stepper */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex items-center justify-between max-w-lg mx-auto">
            {STEPS.map((s, idx) => {
              const active = step === s.id;
              const done = step > s.id;
              return (
                <React.Fragment key={s.id}>
                  <div className="flex flex-col items-center gap-1 flex-shrink-0">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                        done
                          ? 'bg-green-500 text-white'
                          : active
                          ? 'bg-[#0EA5E9] text-white ring-4 ring-sky-100'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {done ? <CheckCircle className="h-5 w-5" /> : s.id}
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        active ? 'text-[#0EA5E9]' : done ? 'text-green-600' : 'text-gray-500'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 mb-5 transition-colors ${
                        done ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            {error && (
              <div
                className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-2 text-sm"
                role="alert"
              >
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {step === 1 && (
              <div
                className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 border border-gray-100"
                data-testid="billing-info"
              >
                <div className="flex items-center gap-2 mb-5">
                  <User className="h-5 w-5 text-[#0EA5E9]" />
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                    Informations personnelles
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-700 font-medium mb-2 block text-sm">Prénom *</Label>
                    <Input
                      placeholder="Jean"
                      value={billing.firstName}
                      onChange={(e) =>
                        setBilling({ ...billing, firstName: e.target.value })
                      }
                      className="h-11"
                      data-testid="billing-firstname"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700 font-medium mb-2 block text-sm">Nom *</Label>
                    <Input
                      placeholder="Dupont"
                      value={billing.lastName}
                      onChange={(e) =>
                        setBilling({ ...billing, lastName: e.target.value })
                      }
                      className="h-11"
                      data-testid="billing-lastname"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-gray-700 font-medium mb-2 block text-sm">Email *</Label>
                    <Input
                      type="email"
                      placeholder="jean.dupont@email.com"
                      value={billing.email}
                      onChange={(e) => setBilling({ ...billing, email: e.target.value })}
                      className="h-11"
                      data-testid="billing-email"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-gray-700 font-medium mb-2 block text-sm">
                      Téléphone *
                    </Label>
                    <Input
                      placeholder="+221 77 123 45 67"
                      value={billing.phone}
                      onChange={(e) => setBilling({ ...billing, phone: e.target.value })}
                      className="h-11"
                      data-testid="billing-phone"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6 pt-5 border-t">
                  <Button onClick={goBack} variant="ghost">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour
                  </Button>
                  <Button
                    onClick={goNext}
                    className="bg-[#38BDF8] hover:bg-[#0EA5E9]"
                    data-testid="next-step-btn"
                  >
                    Continuer
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div
                className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 border border-gray-100"
                data-testid="payment-form"
              >
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-5">
                  Mode de paiement
                </h2>

                <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
                  <TabsList className="grid w-full grid-cols-2 mb-6 p-1">
                    <TabsTrigger
                      value="CARTE"
                      className="flex items-center gap-2 py-2.5"
                      data-testid="stripe-tab"
                    >
                      <CreditCard className="h-4 w-4" />
                      Carte bancaire
                    </TabsTrigger>
                    <TabsTrigger
                      value="MOBILE_MONEY"
                      className="flex items-center gap-2 py-2.5"
                      data-testid="mobile-money-tab"
                    >
                      <Smartphone className="h-4 w-4" />
                      Mobile Money
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="CARTE" className="space-y-4">
                    <div>
                      <Label className="text-gray-700 font-medium mb-2 block text-sm">
                        Numéro de carte
                      </Label>
                      <Input
                        inputMode="numeric"
                        placeholder="1234 5678 9012 3456"
                        value={card.number}
                        onChange={(e) =>
                          setCard({ ...card, number: formatCardNumber(e.target.value) })
                        }
                        className="h-11 font-mono tracking-wider"
                        autoComplete="cc-number"
                        data-testid="card-number-input"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-700 font-medium mb-2 block text-sm">
                          Expiration
                        </Label>
                        <Input
                          inputMode="numeric"
                          placeholder="MM/AA"
                          value={card.expiry}
                          onChange={(e) =>
                            setCard({ ...card, expiry: formatExpiry(e.target.value) })
                          }
                          className="h-11 font-mono"
                          autoComplete="cc-exp"
                          data-testid="card-expiry-input"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-700 font-medium mb-2 block text-sm">
                          CVV
                        </Label>
                        <Input
                          inputMode="numeric"
                          placeholder="123"
                          type="password"
                          maxLength={4}
                          value={card.cvv}
                          onChange={(e) =>
                            setCard({
                              ...card,
                              cvv: e.target.value.replace(/\D/g, '').slice(0, 4),
                            })
                          }
                          className="h-11 font-mono"
                          autoComplete="cc-csc"
                          data-testid="card-cvv-input"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-700 font-medium mb-2 block text-sm">
                        Nom sur la carte
                      </Label>
                      <Input
                        placeholder="JEAN DUPONT"
                        value={card.name}
                        onChange={(e) => setCard({ ...card, name: e.target.value.toUpperCase() })}
                        className="h-11 uppercase"
                        autoComplete="cc-name"
                        data-testid="card-name-input"
                      />
                    </div>
                    <div className="flex items-center text-sm text-gray-600 bg-gradient-to-r from-green-50 to-sky-50 p-3 rounded-lg border border-green-100">
                      <Lock className="h-4 w-4 mr-2 text-green-600 shrink-0" />
                      Paiement 100% sécurisé avec Stripe
                    </div>
                  </TabsContent>

                  <TabsContent value="MOBILE_MONEY" className="space-y-4">
                    <div>
                      <Label className="text-gray-700 font-medium mb-2 block text-sm">Service</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {['Orange Money', 'Wave', 'Free Money'].map((svc) => (
                          <button
                            key={svc}
                            type="button"
                            onClick={() => setMobile({ ...mobile, service: svc })}
                            className={`h-11 rounded-md border text-sm font-medium transition-colors ${
                              mobile.service === svc
                                ? 'border-[#0EA5E9] bg-sky-50 text-[#0EA5E9]'
                                : 'border-gray-200 text-gray-700 hover:border-gray-300'
                            }`}
                            data-testid={`mobile-service-${svc.toLowerCase().replace(' ', '-')}`}
                          >
                            {svc}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-700 font-medium mb-2 block text-sm">
                        Numéro de téléphone
                      </Label>
                      <Input
                        placeholder="+221 77 123 45 67"
                        value={mobile.phone}
                        onChange={(e) => setMobile({ ...mobile, phone: e.target.value })}
                        className="h-11"
                        inputMode="tel"
                        data-testid="mobile-number-input"
                      />
                    </div>
                    <div className="flex items-start text-sm text-gray-600 bg-gradient-to-r from-green-50 to-sky-50 p-3 rounded-lg border border-green-100">
                      <Lock className="h-4 w-4 mr-2 text-green-600 shrink-0 mt-0.5" />
                      Vous recevrez un code de confirmation par SMS pour valider le paiement.
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex items-center justify-between mt-6 pt-5 border-t">
                  <Button onClick={goBack} variant="ghost">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour
                  </Button>
                  <Button
                    onClick={handlePayment}
                    disabled={processing}
                    className="bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9] hover:from-[#0EA5E9] hover:to-[#0284C7] h-11 px-6 shadow-md"
                    data-testid="confirm-payment-btn"
                  >
                    {processing ? 'Traitement en cours...' : 'Confirmer le paiement'}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <aside className="lg:col-span-1">
            <div
              className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 lg:sticky lg:top-20 border border-gray-100"
              data-testid="order-summary"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4">Récapitulatif</h2>

              <div className="flex items-center gap-3 pb-4 border-b">
                <div className="w-10 h-10 bg-sky-50 rounded-lg flex items-center justify-center">
                  <TypeIcon className="h-5 w-5 text-[#0EA5E9]" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Type de réservation</div>
                  <div className="font-bold text-gray-800">{bookingData.type}</div>
                </div>
              </div>

              <div className="py-4 space-y-2 text-sm border-b">
                {bookingData.type === 'Voiture' && (
                  <>
                    <SummaryRow label="Véhicule" value={bookingData.details.carName} />
                    <SummaryRow label="Ville" value={bookingData.details.city} />
                    <SummaryRow label="Du" value={bookingData.details.startDate} />
                    <SummaryRow label="Au" value={bookingData.details.endDate} />
                    <SummaryRow
                      label="Durée"
                      value={`${bookingData.details.days} jour${
                        bookingData.details.days > 1 ? 's' : ''
                      }`}
                    />
                  </>
                )}
                {bookingData.type === 'Bus' && (
                  <>
                    <SummaryRow label="Compagnie" value={bookingData.details.company} />
                    <SummaryRow
                      label="Trajet"
                      value={`${bookingData.details.from} → ${bookingData.details.to}`}
                    />
                    <SummaryRow label="Départ" value={bookingData.details.departure} />
                    <SummaryRow label="Durée" value={bookingData.details.duration} />
                  </>
                )}
                {bookingData.type === 'Avion' && (
                  <>
                    <SummaryRow label="Compagnie" value={bookingData.details.airline} />
                    <SummaryRow
                      label="Vol"
                      value={`${bookingData.details.from} → ${bookingData.details.to}`}
                    />
                    <SummaryRow label="Départ" value={bookingData.details.departure} />
                    <SummaryRow label="Classe" value={bookingData.details.class} />
                  </>
                )}
              </div>

              <div className="pt-4 flex justify-between items-baseline">
                <span className="text-base font-bold text-gray-800">Total</span>
                <span className="text-2xl md:text-3xl font-bold text-[#0EA5E9]">
                  {bookingData.totalPrice.toLocaleString()} FCFA
                </span>
              </div>

              <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-500">
                <Shield className="h-3.5 w-3.5 text-green-500" />
                Paiement sécurisé SSL
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium text-gray-800 text-right truncate">{value}</span>
    </div>
  );
}
