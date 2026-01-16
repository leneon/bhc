"use strict";

var myApp = angular.module('myApp', []);

myApp.controller('reservationController', ['$scope', '$http', function($scope, $http) {
    // URLs pour les opérations
    const urlClients = '/api/users/clients';
    const urlVoitures = '/api/voitures';
    const urlCreateClient = '/api/users/clients';
    const urlCreateReservation = '/api/reservations';
    const urlCoupons = '/api/coupons';
    const urlValidateCoupon = '/api/coupons/validate';
    
    // Initialisation des variables
    $scope.clients = [];
    $scope.voitures = [];
    $scope.selectedVoiture = null;
    $scope.selectedCoupon = null;
    $scope.couponCode = null;
    $scope.reservationDto = {
        clientId: null,
        vehiculeId: null,
        dateReservation: new Date().toISOString().slice(0, 16),
        dateDebutPrevue: null,
        dateFinPrevue: null,
        lieuDepart: null,
        lieuRetour: null,
        etatReservation: 'en_attente',
        modePaiement: null,
        montantTotal: null,
        acompte: null,
        remise: 0,
        couponId: null,
        nombreJours: 0,
        notes: null
    };
    
    $scope.clientForm = {};
    
    // Charger les clients
    $scope.loadClients = function() {
        $http.get(urlClients)
            .then(function(res) {
                $scope.clients = res.data;
                console.log("CLIENTS CHARGÉS : ", $scope.clients);
            })
            .catch(function(error) {
                console.error("ERREUR CHARGEMENT CLIENTS : ", error);
                $scope.showErrorMessage("Erreur lors du chargement des clients.");
            });
    };
    
    // Charger les voitures
    $scope.loadVoitures = function() {
        $http.get(urlVoitures)
            .then(function(res) {
                // Filtrer les voitures actives et disponibles
                console.log("TOUTES LES VOITURES : ", res.data);
                // $scope.voitures = res.data.filter(function(v) {
                //     return v.statut === true && 
                //            (v.disponibilite.toUpperCase === 'DISPONIBLE');
                $scope.voitures = res.data;
                console.log("VOITURES CHARGÉES : ", $scope.voitures);
            })
            .catch(function(error) {
                console.error("ERREUR CHARGEMENT VOITURES : ", error);
                $scope.showErrorMessage("Erreur lors du chargement des voitures.");
            });
    };
    
    // Charger les données au démarrage
    $scope.loadClients();
    $scope.loadVoitures();
    
    // Surveiller la sélection de la voiture pour calculer l'acompte
    $scope.$watch('reservationDto.vehiculeId', function(newVal) {
        if (newVal) {
            $scope.selectedVoiture = $scope.voitures.find(v => v.id === newVal);
            if ($scope.selectedVoiture && $scope.selectedVoiture.acompte) {
                $scope.reservationDto.acompte = $scope.selectedVoiture.acompte;
            }
        } else {
            $scope.selectedVoiture = null;
            $scope.reservationDto.acompte = null;
        }
    });
    
    // Calculer le nombre de jours et le montant total
    $scope.$watchGroup(['reservationDto.dateDebutPrevue', 'reservationDto.dateFinPrevue', 'reservationDto.remise', 'selectedCoupon'], function() {
        if ($scope.reservationDto.dateDebutPrevue && $scope.reservationDto.dateFinPrevue) {
            const debut = new Date($scope.reservationDto.dateDebutPrevue);
            const fin = new Date($scope.reservationDto.dateFinPrevue);
            
            if (fin > debut) {
                const diffTime = fin - debut;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                $scope.reservationDto.nombreJours = diffDays;
                
                // Calculer le montant total
                if ($scope.selectedVoiture && $scope.selectedVoiture.prix) {
                    let montantBase = $scope.selectedVoiture.prix * diffDays;
                    
                    // Appliquer la remise
                    if ($scope.reservationDto.remise && $scope.reservationDto.remise > 0) {
                        montantBase = montantBase * (1 - $scope.reservationDto.remise / 100);
                    }
                    
                    // Appliquer le coupon
                    if ($scope.selectedCoupon) {
                        if ($scope.selectedCoupon.typeReduction === 'POURCENTAGE') {
                            montantBase = montantBase * (1 - $scope.selectedCoupon.montant / 100);
                        } else if ($scope.selectedCoupon.typeReduction === 'FIXE') {
                            montantBase = montantBase - $scope.selectedCoupon.montant;
                        }
                    }
                    
                    $scope.reservationDto.montantTotal = Math.max(0, montantBase);
                }
            } else {
                $scope.reservationDto.nombreJours = 0;
                $scope.reservationDto.montantTotal = null;
            }
        } else {
            $scope.reservationDto.nombreJours = 0;
        }
    });
    
    // Valider un code coupon
    $scope.validateCoupon = function() {
        if (!$scope.couponCode || !$scope.couponCode.trim()) {
            $scope.selectedCoupon = null;
            $scope.reservationDto.couponId = null;
            return;
        }
        
        const montantTotal = $scope.reservationDto.montantTotal || 0;
        const code = $scope.couponCode.trim().toUpperCase();
        
        $http({
            method: 'POST',
            url: urlValidateCoupon,
            params: {
                code: code,
                montantTotal: montantTotal
            }
        })
        .then(function(res) {
            $scope.selectedCoupon = res.data;
            $scope.reservationDto.couponId = res.data.id;
            $scope.showSuccessMessage("Coupon valide : " + res.data.description);
            // Recalculer le montant avec le coupon
            $scope.$apply();
        })
        .catch(function(error) {
            $scope.selectedCoupon = null;
            $scope.reservationDto.couponId = null;
            let errorMsg = "Code coupon invalide ou expiré";
            if (error.headers && error.headers('X-Error-Message')) {
                errorMsg = error.headers('X-Error-Message');
            } else if (error.data && error.data.message) {
                errorMsg = error.data.message;
            } else if (error.status === 400) {
                errorMsg = "Code coupon invalide";
            }
            $scope.showErrorMessage(errorMsg);
        });
    };
    
    // Créer un nouveau client
    $scope.createClient = function() {
        const clientData = {
            nom: $scope.clientForm.nomComplet,
            email: $scope.clientForm.email,
            telephone: $scope.clientForm.telephone,
            localisation: $scope.clientForm.localisation,
            fonction: $scope.clientForm.fonction,
            typePieceIdentite: $scope.clientForm.typePieceIdentite,
            numeroPieceIdentite: $scope.clientForm.numeroPieceIdentite,
            numeroPermisConduire: $scope.clientForm.numeroPermisConduire,
            paysDelivrancePermis: $scope.clientForm.paysDelivrancePermis,
            dateDelivrancePermis: $scope.clientForm.dateDelivrancePermis,
            dateExpirationPermis: $scope.clientForm.dateExpirationPermis,
            username: $scope.clientForm.email,
            role: ['ROLE_USER'],
            password: 'password123'
        };
        
        $http.post(urlCreateClient, clientData)
            .then(function(res) {
                console.log("CLIENT CRÉÉ : ", res.data);
                $scope.showSuccessMessage("Client créé avec succès");
                $scope.clientForm = {};
                // Fermer le modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('kt_modal_add_client'));
                if (modal) modal.hide();
                // Recharger la liste des clients
                $scope.loadClients();
                // Sélectionner le nouveau client
                if (res.data && res.data.id) {
                    $scope.reservationDto.clientId = res.data.id;
                }
            })
            .catch(function(error) {
                console.error("ERREUR CRÉATION CLIENT : ", error);
                $scope.showErrorMessage(error.data?.message || "Erreur lors de la création du client.");
            });
    };
    
    // Soumettre la réservation
    $scope.submitReservation = function() {
        // Validation
        if (!$scope.reservationDto.clientId) {
            $scope.showErrorMessage("Veuillez sélectionner un client.");
            return;
        }
        if (!$scope.reservationDto.vehiculeId) {
            $scope.showErrorMessage("Veuillez sélectionner une voiture.");
            return;
        }
        if (!$scope.reservationDto.dateDebutPrevue || !$scope.reservationDto.dateFinPrevue) {
            $scope.showErrorMessage("Veuillez renseigner les dates de début et de fin.");
            return;
        }
        if (!$scope.reservationDto.modePaiement) {
            $scope.showErrorMessage("Veuillez sélectionner un mode de paiement.");
            return;
        }
        
        // Préparer les données
        const reservationData = {
            clientId: $scope.reservationDto.clientId,
            vehiculeId: $scope.reservationDto.vehiculeId,
            dateReservation: $scope.reservationDto.dateReservation ? new Date($scope.reservationDto.dateReservation).toISOString() : new Date().toISOString(),
            dateDebutPrevue: new Date($scope.reservationDto.dateDebutPrevue).toISOString(),
            dateFinPrevue: new Date($scope.reservationDto.dateFinPrevue).toISOString(),
            lieuDepart: $scope.reservationDto.lieuDepart,
            lieuRetour: $scope.reservationDto.lieuRetour,
            etatReservation: $scope.reservationDto.etatReservation,
            modePaiement: $scope.reservationDto.modePaiement,
            montantTotal: $scope.reservationDto.montantTotal,
            acompte: $scope.reservationDto.acompte,
            remise: $scope.reservationDto.remise || 0,
            couponId: $scope.reservationDto.couponId,
            nombreJours: $scope.reservationDto.nombreJours || 0,
            notes: $scope.reservationDto.notes
        };
        
        $http.post(urlCreateReservation, reservationData)
            .then(function(res) {
                console.log("RÉSERVATION CRÉÉE : ", res.data);
                $scope.showSuccessMessage("Réservation créée avec succès");
                // Rediriger vers la liste des réservations
                setTimeout(function() {
                    window.location.href = '/atiko/locations/reservations';
                }, 1500);
            })
            .catch(function(error) {
                console.error("ERREUR CRÉATION RÉSERVATION : ", error);
                $scope.showErrorMessage(error.data?.message || "Erreur lors de la création de la réservation.");
            });
    };
    
    // Messages
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

// Gestion du modal de création de client
document.addEventListener("DOMContentLoaded", function () {
    const modalElement = document.getElementById("kt_modal_add_client");
    if (!modalElement) return;
    
    const formElement = modalElement.querySelector("#form_add_client");
    if (!formElement) return;
    
    const modalInstance = new bootstrap.Modal(modalElement);
    const clientUrl = "/api/users/clients";
    
    // Validation du formulaire
    const validator = FormValidation.formValidation(formElement, {
        fields: {
            nomComplet: {
                validators: {
                    notEmpty: { message: "Le nom complet est requis" },
                    stringLength: {
                        min: 3,
                        message: "Le nom complet doit contenir au moins 3 caractères"
                    }
                }
            },
            email: {
                validators: {
                    notEmpty: { message: "Une adresse e-mail valide est requise" },
                    emailAddress: { message: "L'entrée n'est pas une adresse e-mail valide" }
                }
            },
            telephone: {
                validators: {
                    notEmpty: { message: "Le téléphone est requis" },
                    regexp: {
                        regexp: /^\d{8,15}$/,
                        message: "Numéro de téléphone invalide"
                    }
                }
            }
        },
        plugins: {
            trigger: new FormValidation.plugins.Trigger(),
            bootstrap: new FormValidation.plugins.Bootstrap5({
                rowSelector: ".fv-row",
                eleInvalidClass: "",
                eleValidClass: ""
            })
        }
    });
    
    // Bouton de soumission
    const submitButton = modalElement.querySelector('[data-kt-client-modal-action="submit"]');
    if (submitButton) {
        submitButton.addEventListener("click", function(event) {
            event.preventDefault();
            
            validator.validate().then(function(status) {
                if (status === "Valid") {
                    // Appeler la fonction AngularJS pour créer le client
                    const scope = angular.element(document.querySelector('[ng-controller="reservationController"]')).scope();
                    if (scope) {
                        scope.$apply(function() {
                            scope.createClient();
                        });
                    }
                }
            });
        });
    }
    
    // Boutons d'annulation
    const cancelButtons = modalElement.querySelectorAll('[data-kt-client-modal-action="cancel"], [data-kt-client-modal-action="close"]');
    cancelButtons.forEach(function(btn) {
        btn.addEventListener("click", function(event) {
            event.preventDefault();
            formElement.reset();
            modalInstance.hide();
        });
    });
});
