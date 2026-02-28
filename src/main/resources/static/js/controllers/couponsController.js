"use strict";

var myApp = angular.module('myApp', []);

myApp.controller('couponsController', ['$scope', '$http', function($scope, $http) {
    // URLs pour les opérations CRUD sur les coupons
    const appUrl = '/api/coupons';
    const urlLoadCoupons = appUrl;
    const urlUpdateCoupon = appUrl;
    const urlDeleteCoupon = appUrl;
    const urlToggleCoupon = appUrl;

    // Initialisation des variables
    $scope.listeCoupons = [];
    $scope.loading = false;

    // Fonction pour charger la liste des coupons
    $scope.loadCoupons = function() {
        $scope.loading = true;
        $http.get(urlLoadCoupons)
            .then(function(res) {
                $scope.listeCoupons = res.data;
                console.log("LISTE DES COUPONS : ", $scope.listeCoupons);
                $scope.loading = false;
            })
            .catch(function(error) {
                console.error("ERREUR DE RÉCUPÉRATION DES COUPONS : ", error);
                $scope.showErrorMessage("Erreur lors du chargement des coupons.");
                $scope.loading = false;
            });
    };

    // Chargement des coupons au chargement de la page
    $scope.loadCoupons();

    // Fonction pour modifier un coupon
    $scope.editCoupon = function(couponId) {
        window.location.href = '/atiko/coupons/edit/' + couponId;
    };

    // Fonction pour activer/désactiver un coupon
    $scope.toggleCouponStatus = function(couponId, currentStatus) {
        const newStatus = !currentStatus;
        const action = newStatus ? 'activer' : 'désactiver';
        
        Swal.fire({
            title: 'Confirmation',
            text: `Êtes-vous sûr de vouloir ${action} ce coupon ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Oui, confirmer',
            cancelButtonText: 'Annuler',
            buttonsStyling: false,
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-light'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const coupon = $scope.listeCoupons.find(c => c.id === couponId);
                if (coupon) {
                    const updateData = {
                        id: couponId,
                        code: coupon.code,
                        description: coupon.description,
                        montant: coupon.montant,
                        typeReduction: coupon.typeReduction,
                        dateDebut: coupon.dateDebut,
                        dateFin: coupon.dateFin,
                        nombreUtilisationsMax: coupon.nombreUtilisationsMax,
                        actif: newStatus,
                        montantMinimum: coupon.montantMinimum
                    };
                    
                    $http.put(urlUpdateCoupon + '/' + couponId, updateData)
                        .then(function(response) {
                            console.log("Statut modifié avec succès:", response);
                            $scope.loadCoupons();
                            $scope.showSuccessMessage(`Coupon ${action === 'activer' ? 'activé' : 'désactivé'} avec succès`);
                        })
                        .catch(function(error) {
                            console.error("ERREUR LORS DE LA MODIFICATION DU STATUT : ", error);
                            $scope.showErrorMessage("Erreur lors de la modification du statut du coupon.");
                        });
                }
            }
        });
    };

    // Fonction pour supprimer un coupon
    $scope.deleteCoupon = function(couponId, code) {
        Swal.fire({
            title: 'Confirmation de suppression',
            text: `Êtes-vous sûr de vouloir supprimer le coupon "${code}" ?`,
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
                $http.delete(urlDeleteCoupon + '/' + couponId)
                    .then(function(response) {
                        console.log("Suppression réussie:", response);
                        $scope.loadCoupons();
                        $scope.showSuccessMessage("Coupon supprimé avec succès");
                    })
                    .catch(function(error) {
                        console.error("ERREUR LORS DE LA SUPPRESSION : ", error);
                        $scope.showErrorMessage("Erreur lors de la suppression du coupon.");
                    });
            }
        });
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



