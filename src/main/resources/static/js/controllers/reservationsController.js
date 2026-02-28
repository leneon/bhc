"use strict";

var myApp;
try {
    myApp = angular.module('myApp');
} catch (e) {
    myApp = angular.module('myApp', []);
}

myApp.controller('reservationsController', ['$scope', '$http', function($scope, $http) {
    // URLs pour les opérations CRUD sur les réservations
    const appUrl = '/api/reservations';
    const urlLoadReservations = appUrl;
    const urlCreateReservation = appUrl;
    const urlUpdateReservation = appUrl;
    const urlDeleteReservation = appUrl;
    const urlGetReservation = appUrl;

    // Initialisation des variables
    $scope.listereservations = [];
    $scope.loading = false;
    $scope.reservationDto = {
        reservationId: null,
        clientId: null,
        vehiculeId: null,
        dateReservation: null,
        dateDebutPrevue: null,
        dateFinPrevue: null,
        lieuDepart: null,
        lieuRetour: null,
        etatReservation: null,
        modePaiement: null,
        montantTotal: null,
        acompte: null,
        notes: null
    };

    // Fonction pour charger la liste des réservations
    $scope.loadReservations = function() {
        $scope.loading = true;
        $http.get(urlLoadReservations)
            .then(function(res) {
                $scope.listereservations = res.data;
                console.log("LISTE DES RÉSERVATIONS : ", $scope.listereservations);
                $scope.loading = false;
            })
            .catch(function(error) {
                console.error("ERREUR DE RÉCUPÉRATION DES RÉSERVATIONS : ", error);
                const errorMsg = error.data?.error || error.data?.message || "Erreur lors du chargement des réservations.";
                $scope.showErrorMessage(errorMsg);
                $scope.loading = false;
            });
    };

    // Chargement des réservations au chargement de la page
    $scope.loadReservations();

    // Fonction pour voir les détails d'une réservation
    $scope.viewReservation = function(reservationId) {
        $http.get(urlGetReservation + '/' + reservationId)
            .then(function(res) {
                const reservation = res.data;
                // Afficher les détails dans un modal ou rediriger
                Swal.fire({
                    title: 'Détails de la réservation',
                    html: `
                        <div class="text-start">
                            <p><strong>Client:</strong> ${reservation.clientNom || 'N/A'}</p>
                            <p><strong>Voiture:</strong> ${reservation.voitureNom || 'N/A'} (${reservation.voitureImmatriculation || 'N/A'})</p>
                            <p><strong>Date réservation:</strong> ${reservation.dateReservation ? new Date(reservation.dateReservation).toLocaleString('fr-FR') : 'N/A'}</p>
                            <p><strong>Début prévue:</strong> ${reservation.dateDebutPrevue ? new Date(reservation.dateDebutPrevue).toLocaleString('fr-FR') : 'N/A'}</p>
                            <p><strong>Fin prévue:</strong> ${reservation.dateFinPrevue ? new Date(reservation.dateFinPrevue).toLocaleString('fr-FR') : 'N/A'}</p>
                            <p><strong>État:</strong> ${reservation.etatReservation || 'N/A'}</p>
                            <p><strong>Mode paiement:</strong> ${reservation.modePaiement || 'N/A'}</p>
                            <p><strong>Montant total:</strong> ${reservation.montantTotal || '0'} FCFA</p>
                            <p><strong>Acompte:</strong> ${reservation.acompte || '0'} FCFA</p>
                            <p><strong>Notes:</strong> ${reservation.notes || 'Aucune'}</p>
                        </div>
                    `,
                    icon: 'info',
                    confirmButtonText: 'Fermer',
                    customClass: {
                        confirmButton: 'btn btn-primary'
                    }
                });
            })
            .catch(function(error) {
                console.error("ERREUR LORS DE LA RÉCUPÉRATION : ", error);
                const errorMsg = error.data?.error || error.data?.message || "Erreur lors de la récupération des détails de la réservation.";
                $scope.showErrorMessage(errorMsg);
            });
    };

    // Fonction pour modifier une réservation
    $scope.editReservation = function(reservation) {
        // Rediriger vers la page de modification
        window.location.href = '/atiko/locations/reservation?id=' + reservation.reservationId;
    };
    
    // Fonction pour changer l'état d'une réservation
    $scope.changeEtat = function(reservationId, newEtat) {
        $http.get(urlGetReservation + '/' + reservationId)
            .then(function(res) {
                const reservation = res.data;
                reservation.etatReservation = newEtat;
                
                $http.put(urlUpdateReservation + '/' + reservationId, reservation)
                    .then(function(response) {
                        $scope.showSuccessMessage("État de la réservation mis à jour avec succès");
                        $scope.loadReservations();
                    })
                    .catch(function(error) {
                        console.error("ERREUR LORS DE LA MISE À JOUR : ", error);
                        const errorMsg = error.data?.error || error.data?.message || "Erreur lors de la mise à jour de l'état.";
                        $scope.showErrorMessage(errorMsg);
                    });
            })
            .catch(function(error) {
                console.error("ERREUR LORS DE LA RÉCUPÉRATION : ", error);
                $scope.showErrorMessage("Erreur lors de la récupération de la réservation.");
            });
    };

    // Fonction pour supprimer une réservation
    $scope.deleteReservation = function(reservationId, clientNom) {
        Swal.fire({
            title: 'Confirmation de suppression',
            text: `Êtes-vous sûr de vouloir supprimer la réservation de "${clientNom}" ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Oui, supprimer',
            cancelButtonText: 'Annuler',
            buttonsStyling: false,
            customClass: {
                confirmButton: 'btn btn-danger',
                cancelButton: 'btn btn-light'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                $http.delete(urlDeleteReservation + '/' + reservationId)
                    .then(function(response) {
                        console.log("Suppression réussie:", response);
                        $scope.loadReservations();
                        $scope.showSuccessMessage("Réservation supprimée avec succès");
                    })
                    .catch(function(error) {
                        console.error("ERREUR LORS DE LA SUPPRESSION : ", error);
                        const errorMsg = error.data?.error || error.data?.message || "Erreur lors de la suppression de la réservation.";
                        $scope.showErrorMessage(errorMsg);
                    });
            }
        });
    };

    // Fonction pour rafraîchir les données
    $scope.refreshData = function() {
        $scope.loadReservations();
    };

    // Fonction pour afficher un message de succès
    $scope.showSuccessMessage = function(message) {
        Swal.fire({
            text: message,
            icon: "success",
            buttonsStyling: false,
            confirmButtonText: "D'accord",
            customClass: {
                confirmButton: "btn btn-primary"
            }
        });
    };

    // Fonction pour afficher un message d'erreur
    $scope.showErrorMessage = function(message) {
        Swal.fire({
            text: message,
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "D'accord",
            customClass: {
                confirmButton: "btn btn-primary"
            }
        });
    };
}]);
