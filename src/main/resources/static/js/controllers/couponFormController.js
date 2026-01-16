"use strict";

var myApp = angular.module('myApp', []);

myApp.controller('couponFormController', ['$scope', '$http', function($scope, $http) {
    // URLs pour les opérations
    const urlCoupons = '/api/coupons';
    
    // Initialisation des variables
    $scope.loading = false;
    $scope.couponDto = {
        id: null,
        code: null,
        description: null,
        montant: null,
        typeReduction: null,
        dateDebut: null,
        dateFin: null,
        nombreUtilisationsMax: null,
        actif: true,
        montantMinimum: null
    };
    
    // Récupérer l'ID depuis l'URL au chargement
    (function() {
        const path = window.location.pathname;
        const editMatch = path.match(/\/edit\/(\d+)/);
        if (editMatch) {
            const couponId = parseInt(editMatch[1]);
            $scope.couponDto.id = couponId;
            $scope.loadCoupon(couponId);
        }
    })();
    
    // Fonction pour charger un coupon
    $scope.loadCoupon = function(id) {
        $scope.loading = true;
        $http.get(urlCoupons + '/' + id)
            .then(function(res) {
                const coupon = res.data;
                $scope.couponDto = {
                    id: coupon.id,
                    code: coupon.code,
                    description: coupon.description,
                    montant: coupon.montant,
                    typeReduction: coupon.typeReduction,
                    dateDebut: coupon.dateDebut ? new Date(coupon.dateDebut).toISOString().split('T')[0] : null,
                    dateFin: coupon.dateFin ? new Date(coupon.dateFin).toISOString().split('T')[0] : null,
                    nombreUtilisationsMax: coupon.nombreUtilisationsMax,
                    actif: coupon.actif !== undefined ? coupon.actif : true,
                    montantMinimum: coupon.montantMinimum
                };
                $scope.loading = false;
            })
            .catch(function(error) {
                console.error("ERREUR LORS DU CHARGEMENT DU COUPON : ", error);
                $scope.showErrorMessage("Erreur lors du chargement du coupon.");
                $scope.loading = false;
            });
    };
    
    // Fonction pour soumettre le formulaire
    $scope.submitCoupon = function() {
        // Validation
        if (!$scope.couponDto.code || !$scope.couponDto.code.trim()) {
            $scope.showErrorMessage("Le code du coupon est requis.");
            return;
        }
        if (!$scope.couponDto.description || !$scope.couponDto.description.trim()) {
            $scope.showErrorMessage("La description est requise.");
            return;
        }
        if (!$scope.couponDto.typeReduction) {
            $scope.showErrorMessage("Le type de réduction est requis.");
            return;
        }
        if (!$scope.couponDto.montant || $scope.couponDto.montant <= 0) {
            $scope.showErrorMessage("Le montant doit être supérieur à 0.");
            return;
        }
        if ($scope.couponDto.typeReduction === 'POURCENTAGE' && $scope.couponDto.montant > 100) {
            $scope.showErrorMessage("Le pourcentage ne peut pas dépasser 100%.");
            return;
        }
        if (!$scope.couponDto.dateDebut) {
            $scope.showErrorMessage("La date de début est requise.");
            return;
        }
        if (!$scope.couponDto.dateFin) {
            $scope.showErrorMessage("La date de fin est requise.");
            return;
        }
        if (new Date($scope.couponDto.dateFin) < new Date($scope.couponDto.dateDebut)) {
            $scope.showErrorMessage("La date de fin doit être postérieure à la date de début.");
            return;
        }
        
        // Préparer les données
        const couponData = {
            code: $scope.couponDto.code.trim().toUpperCase(),
            description: $scope.couponDto.description.trim(),
            montant: $scope.couponDto.montant,
            typeReduction: $scope.couponDto.typeReduction,
            dateDebut: $scope.couponDto.dateDebut,
            dateFin: $scope.couponDto.dateFin,
            nombreUtilisationsMax: $scope.couponDto.nombreUtilisationsMax || null,
            actif: $scope.couponDto.actif !== undefined ? $scope.couponDto.actif : true,
            montantMinimum: $scope.couponDto.montantMinimum || null
        };
        
        $scope.loading = true;
        
        if ($scope.couponDto.id) {
            // Mise à jour
            $http.put(urlCoupons + '/' + $scope.couponDto.id, couponData)
                .then(function(res) {
                    console.log("COUPON MODIFIÉ : ", res.data);
                    $scope.showSuccessMessage("Coupon modifié avec succès");
                    setTimeout(function() {
                        window.location.href = '/atiko/coupons';
                    }, 1500);
                })
                .catch(function(error) {
                    console.error("ERREUR MODIFICATION COUPON : ", error);
                    const errorMsg = error.headers && error.headers('X-Error-Message') || 
                                   error.data?.message || 
                                   "Erreur lors de la modification du coupon.";
                    $scope.showErrorMessage(errorMsg);
                    $scope.loading = false;
                });
        } else {
            // Création
            $http.post(urlCoupons, couponData)
                .then(function(res) {
                    console.log("COUPON CRÉÉ : ", res.data);
                    $scope.showSuccessMessage("Coupon créé avec succès");
                    setTimeout(function() {
                        window.location.href = '/atiko/coupons';
                    }, 1500);
                })
                .catch(function(error) {
                    console.error("ERREUR CRÉATION COUPON : ", error);
                    const errorMsg = error.headers && error.headers('X-Error-Message') || 
                                   error.data?.message || 
                                   "Erreur lors de la création du coupon.";
                    $scope.showErrorMessage(errorMsg);
                    $scope.loading = false;
                });
        }
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

