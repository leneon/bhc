"use strict";

var myApp;
try {
    myApp = angular.module('myApp');
} catch (e) {
    myApp = angular.module('myApp', []);
}

myApp.controller('locationsController', ['$scope', '$http', function($scope, $http) {
    // Une "location" = une réservation confirmée (validée)
    const urlLoadLocations = '/api/reservations?etat=confirmee';
    const urlGetReservation = '/api/reservations';
    const urlUpdateReservation = '/api/reservations';

    $scope.listeLocations = [];
    $scope.loading = false;

    $scope.loadLocations = function() {
        $scope.loading = true;
        $http.get(urlLoadLocations)
            .then(function(res) {
                $scope.listeLocations = res.data || [];
                $scope.loading = false;
            })
            .catch(function(error) {
                console.error("ERREUR CHARGEMENT LOCATIONS : ", error);
                const errorMsg = error.data?.error || error.data?.message || "Erreur lors du chargement des locations.";
                Swal.fire({
                    text: errorMsg,
                    icon: "error",
                    buttonsStyling: false,
                    confirmButtonText: "D'accord",
                    customClass: { confirmButton: "btn btn-primary" }
                });
                $scope.loading = false;
            });
    };

    $scope.loadLocations();

    $scope.viewLocation = function(reservationId) {
        $http.get(urlGetReservation + '/' + reservationId)
            .then(function(res) {
                const r = res.data;
                Swal.fire({
                    title: 'Détails location',
                    html: `
                        <div class="text-start">
                            <p><strong>Client:</strong> ${r.clientNom || 'N/A'}</p>
                            <p><strong>Voiture:</strong> ${r.voitureNom || 'N/A'} (${r.voitureImmatriculation || 'N/A'})</p>
                            <p><strong>Début:</strong> ${r.dateDebutPrevue ? new Date(r.dateDebutPrevue).toLocaleString('fr-FR') : 'N/A'}</p>
                            <p><strong>Fin:</strong> ${r.dateFinPrevue ? new Date(r.dateFinPrevue).toLocaleString('fr-FR') : 'N/A'}</p>
                            <p><strong>Montant:</strong> ${(r.montantTotal || 0)} FCFA</p>
                            <p><strong>Acompte:</strong> ${(r.acompte || 0)} FCFA</p>
                            <p><strong>Mode paiement:</strong> ${r.modePaiement || 'N/A'}</p>
                            <p><strong>Notes:</strong> ${r.notes || 'Aucune'}</p>
                        </div>
                    `,
                    icon: 'info',
                    confirmButtonText: 'Fermer',
                    customClass: { confirmButton: 'btn btn-primary' }
                });
            })
            .catch(function(error) {
                console.error("ERREUR DÉTAIL LOCATION : ", error);
                const errorMsg = error.data?.error || error.data?.message || "Erreur lors de la récupération des détails.";
                Swal.fire({
                    text: errorMsg,
                    icon: "error",
                    buttonsStyling: false,
                    confirmButtonText: "D'accord",
                    customClass: { confirmButton: "btn btn-primary" }
                });
            });
    };

    // Terminer une location => repasser la réservation en "expiree" (et libérer la voiture via le service)
    $scope.terminateLocation = function(reservationId) {
        Swal.fire({
            title: 'Terminer la location',
            text: "Voulez-vous marquer cette location comme expirée ?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Oui',
            cancelButtonText: 'Annuler',
            buttonsStyling: false,
            customClass: { confirmButton: 'btn btn-danger', cancelButton: 'btn btn-light' }
        }).then((result) => {
            if (!result.isConfirmed) return;
            $http.get(urlGetReservation + '/' + reservationId)
                .then(function(res) {
                    const r = res.data;
                    r.etatReservation = 'expiree';
                    return $http.put(urlUpdateReservation + '/' + reservationId, r);
                })
                .then(function() {
                    Swal.fire({
                        text: "Location terminée",
                        icon: "success",
                        buttonsStyling: false,
                        confirmButtonText: "D'accord",
                        customClass: { confirmButton: "btn btn-primary" }
                    });
                    $scope.loadLocations();
                })
                .catch(function(error) {
                    console.error("ERREUR TERMINER LOCATION : ", error);
                    const errorMsg = error.data?.error || error.data?.message || "Erreur lors de la mise à jour.";
                    Swal.fire({
                        text: errorMsg,
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "D'accord",
                        customClass: { confirmButton: "btn btn-primary" }
                    });
                });
        });
    };
}]);

