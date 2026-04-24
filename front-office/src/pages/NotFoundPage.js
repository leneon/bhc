import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-sky-50 via-white to-orange-50">
      <div className="text-center max-w-md animate-fade-in">
        <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#38BDF8] to-[#0EA5E9] flex items-center justify-center shadow-xl">
          <Compass className="h-12 w-12 text-white" />
        </div>
        <h1 className="text-6xl font-extrabold text-gray-800 mb-3" style={{ fontFamily: 'Work Sans' }}>
          404
        </h1>
        <h2 className="text-2xl font-bold text-gray-700 mb-3">Page introuvable</h2>
        <p className="text-gray-500 mb-8">
          La page que vous cherchez n'existe pas ou a été déplacée. Pas de panique, on vous ramène à bon port.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => navigate('/')}
            className="bg-[#38BDF8] hover:bg-[#0EA5E9] h-11 px-6"
          >
            <Home className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Button>
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="h-11 px-6"
          >
            Page précédente
          </Button>
        </div>
      </div>
    </div>
  );
}
