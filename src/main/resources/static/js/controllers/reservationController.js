"use strict";

var myApp;
try {
    myApp = angular.module('myApp');
} catch (e) {
    myApp = angular.module('myApp', []);
}

myApp.controller('reservationController', ['$scope', '$http', function($scope, $http) {
    // URLs pour les opérations
    const urlClients = '/api/users/clients';
    const urlVoitures = '/api/voitures';
    const urlCreateClient = '/api/users/clients';
    const urlCreateReservation = '/api/reservations';
    const urlUpdateReservation = '/api/reservations';
    const urlGetReservation = '/api/reservations';
    const urlCoupons = '/api/coupons';
    const urlValidateCoupon = '/api/coupons/validate';
    
    // Initialisation des variables
    $scope.clients = [];
    $scope.voitures = [];
    $scope.selectedVoiture = null;
    $scope.selectedCoupon = null;
    $scope.couponCode = null;
    $scope.isEditMode = false;
    $scope.reservationId = null;
    $scope.reservationDto = {
        reservationId: null,
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
    
    // Récupérer l'ID de la réservation depuis l'URL si en mode édition
    function getReservationIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }
    
    // Charger une réservation existante pour édition
    $scope.loadReservation = function(reservationId) {
        $http.get(urlGetReservation + '/' + reservationId)
            .then(function(res) {
                const reservation = res.data;
                $scope.isEditMode = true;
                $scope.reservationId = reservation.reservationId;
                
                // Remplir le formulaire avec les données de la réservation
                $scope.reservationDto = {
                    reservationId: reservation.reservationId,
                    clientId: reservation.clientId,
                    vehiculeId: reservation.vehiculeId,
                    dateReservation: reservation.dateReservation ? new Date(reservation.dateReservation).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
                    dateDebutPrevue: reservation.dateDebutPrevue ? new Date(reservation.dateDebutPrevue).toISOString().slice(0, 16) : null,
                    dateFinPrevue: reservation.dateFinPrevue ? new Date(reservation.dateFinPrevue).toISOString().slice(0, 16) : null,
                    lieuDepart: reservation.lieuDepart || null,
                    lieuRetour: reservation.lieuRetour || null,
                    etatReservation: reservation.etatReservation || 'en_attente',
                    modePaiement: reservation.modePaiement || null,
                    montantTotal: reservation.montantTotal || null,
                    acompte: reservation.acompte || null,
                    remise: reservation.remise || 0,
                    couponId: reservation.couponId || null,
                    nombreJours: reservation.nombreJours || 0,
                    notes: reservation.notes || null
                };
                
                // Charger le coupon si présent
                if (reservation.couponCode) {
                    $scope.couponCode = reservation.couponCode;
                    $scope.selectedCoupon = {
                        id: reservation.couponId,
                        code: reservation.couponCode,
                        montant: reservation.couponMontant,
                        typeReduction: reservation.couponTypeReduction
                    };
                }
                
                // Mettre à jour le titre de la page
                const titleElement = document.querySelector('.card-title');
                if (titleElement) {
                    titleElement.textContent = 'Modifier la réservation';
                }
            })
            .catch(function(error) {
                console.error("ERREUR LORS DU CHARGEMENT DE LA RÉSERVATION : ", error);
                const errorMsg = error.data?.error || error.data?.message || "Erreur lors du chargement de la réservation.";
                $scope.showErrorMessage(errorMsg);
            });
    };
    
    // Charger les clients
    $scope.loadClients = function() {
        $http.get(urlClients)
            .then(function(res) {
                $scope.clients = res.data;
                console.log("CLIENTS CHARGÉS : ", $scope.clients);
            })
            .catch(function(error) {
                console.error("ERREUR CHARGEMENT CLIENTS : ", error);
                const errorMsg = error.data?.error || error.data?.message || "Erreur lors du chargement des clients.";
                $scope.showErrorMessage(errorMsg);
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
                const errorMsg = error.data?.error || error.data?.message || "Erreur lors du chargement des voitures.";
                $scope.showErrorMessage(errorMsg);
            });
    };
    
    // Charger les données au démarrage
    $scope.loadClients();
    $scope.loadVoitures();

    // ==========================
    //  Sync selects ↔ AngularJS
    // ==========================
    const CLIENT_SELECT_ID = 'reservation_client';
    const VEHICULE_SELECT_ID = 'reservation_voiture';

    function parseId(val) {
        if (val === undefined || val === null) return null;
        let s = String(val).trim();
        if (!s) return null;
        // AngularJS (ng-options) peut générer des valeurs comme "number:1"
        const colonIdx = s.lastIndexOf(':');
        if (colonIdx > -1) {
            const prefix = s.slice(0, colonIdx);
            if (prefix === 'number' || prefix === 'string' || prefix === 'object') {
                s = s.slice(colonIdx + 1);
            }
        }
        const n = parseInt(s, 10);
        return Number.isFinite(n) ? n : null;
    }

    function safeApply(fn) {
        try {
            $scope.$apply(fn);
        } catch (e) {
            fn();
        }
    }

    function syncClientFromDom() {
        const el = document.getElementById(CLIENT_SELECT_ID);
        $scope.reservationDto.clientId = parseId(el ? el.value : null);
    }

    function syncVehiculeFromDom() {
        const el = document.getElementById(VEHICULE_SELECT_ID);
        $scope.reservationDto.vehiculeId = parseId(el ? el.value : null);

        if ($scope.reservationDto.vehiculeId) {
            $scope.selectedVoiture = $scope.voitures.find(v => String(v.id) === String($scope.reservationDto.vehiculeId)) || null;
            if ($scope.selectedVoiture && $scope.selectedVoiture.acompte != null && ($scope.reservationDto.acompte == null || $scope.reservationDto.acompte === '')) {
                $scope.reservationDto.acompte = $scope.selectedVoiture.acompte;
            }
        } else {
            $scope.selectedVoiture = null;
        }
    }

    function attachSelectListeners() {
        const clientEl = document.getElementById(CLIENT_SELECT_ID);
        if (clientEl && clientEl.dataset.ngSyncAttached !== '1') {
            clientEl.addEventListener('change', function() {
                safeApply(syncClientFromDom);
            });
            clientEl.dataset.ngSyncAttached = '1';
        }

        const vehiculeEl = document.getElementById(VEHICULE_SELECT_ID);
        if (vehiculeEl && vehiculeEl.dataset.ngSyncAttached !== '1') {
            vehiculeEl.addEventListener('change', function() {
                safeApply(syncVehiculeFromDom);
            });
            vehiculeEl.dataset.ngSyncAttached = '1';
        }
    }

    function initSelect2IfAvailable() {
        const jq = window.jQuery || window.$;
        if (!jq || !jq.fn || !jq.fn.select2) return;
        const clientSel = jq('#' + CLIENT_SELECT_ID);
        const vehiculeSel = jq('#' + VEHICULE_SELECT_ID);

        if (clientSel.length && !clientSel.data('select2')) clientSel.select2();
        if (vehiculeSel.length && !vehiculeSel.data('select2')) vehiculeSel.select2();
    }

    // Appelé par ng-change (et aussi par l’event listener natif)
    $scope.onClientChange = function() { safeApply(syncClientFromDom); };
    $scope.onVehiculeChange = function() { safeApply(syncVehiculeFromDom); };

    // Attacher les listeners (DOM + Select2 si présent)
    setTimeout(function() {
        attachSelectListeners();
        initSelect2IfAvailable();
        safeApply(function() {
            syncClientFromDom();
            syncVehiculeFromDom();
        });
    }, 0);

    // Charger la réservation si en mode édition
    const reservationId = getReservationIdFromUrl();
    if (reservationId) {
        $scope.loadReservation(reservationId);
    }
    
    // Surveiller la sélection de la voiture pour calculer l'acompte
    $scope.$watch('reservationDto.vehiculeId', function(newVal) {
        if (newVal) {
            $scope.selectedVoiture = $scope.voitures.find(v => v.id === newVal);
            if ($scope.selectedVoiture && $scope.selectedVoiture.acompte && !$scope.reservationDto.acompte) {
                $scope.reservationDto.acompte = $scope.selectedVoiture.acompte;
            }
        } else {
            $scope.selectedVoiture = null;
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
                const errorMsg = error.data?.error || error.data?.message || "Erreur lors de la création du client.";
                $scope.showErrorMessage(errorMsg);
            });
    };
    
    // Soumettre la réservation
    $scope.submitReservation = function() {
        // Toujours re-synchroniser depuis les <select> natifs juste avant validation
        // (Select2 déclenche aussi 'change' sur le select d'origine, donc on reste compatible)
        attachSelectListeners();
        initSelect2IfAvailable();
        safeApply(function() {
            syncClientFromDom();
            syncVehiculeFromDom();
        });

        console.log("CLIENT ID RÉCUPÉRÉ : ", $scope.reservationDto.clientId);
        console.log("VÉHICULE ID RÉCUPÉRÉ : ", $scope.reservationDto.vehiculeId);
        
        // Validation
        if (!$scope.reservationDto.clientId || $scope.reservationDto.clientId === 0 || isNaN($scope.reservationDto.clientId)) {
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
        
        // Validation des dates
        const dateDebut = new Date($scope.reservationDto.dateDebutPrevue);
        const dateFin = new Date($scope.reservationDto.dateFinPrevue);
        if (dateFin <= dateDebut) {
            $scope.showErrorMessage("La date de fin doit être postérieure à la date de début.");
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
            acompte: $scope.reservationDto.acompte || ($scope.selectedVoiture && $scope.selectedVoiture.acompte ? $scope.selectedVoiture.acompte : null),
            remise: $scope.reservationDto.remise || 0,
            couponId: $scope.reservationDto.couponId,
            nombreJours: $scope.reservationDto.nombreJours || 0,
            notes: $scope.reservationDto.notes
        };
        
        console.log("DONNÉES DE RÉSERVATION À ENVOYER : ", reservationData);
        
        const url = $scope.isEditMode ? urlUpdateReservation + '/' + $scope.reservationId : urlCreateReservation;
        const method = $scope.isEditMode ? 'PUT' : 'POST';
        
        $http({
            method: method,
            url: url,
            data: reservationData
        })
        .then(function(res) {
            console.log($scope.isEditMode ? "RÉSERVATION MODIFIÉE : " : "RÉSERVATION CRÉÉE : ", res.data);
            $scope.showSuccessMessage($scope.isEditMode ? "Réservation modifiée avec succès" : "Réservation créée avec succès");
            // Redirection: si la réservation est validée (confirmée) => elle apparaît dans "Locations"
            setTimeout(function() {
                const etat = (res.data && res.data.etatReservation) ? String(res.data.etatReservation).toLowerCase() : null;
                window.location.href = (etat === 'confirmee') ? '/atiko/locations' : '/atiko/locations/reservations';
            }, 1500);
        })
        .catch(function(error) {
            console.error("ERREUR : ", error);
            const errorMsg = error.data?.error || error.data?.message || 
                ($scope.isEditMode ? "Erreur lors de la modification de la réservation." : "Erreur lors de la création de la réservation.");
            $scope.showErrorMessage(errorMsg);
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
