"use strict";

var KTmodeleszerAddmodele = function () {
    const modalElement = document.getElementById("kt_modal_add_modele"),
        formElement = modalElement.querySelector("#kt_modal_add_modele_form"),
        modalInstance = new bootstrap.Modal(modalElement);
    
    return {
        init: function () {
            (() => {
                // Initialize FormValidation
                const validator = FormValidation.formValidation(formElement, {
                    fields: {
                        modele_nom: { 
                            validators: {
                                notEmpty: {
                                    message: "Le nom du modèle est requis"
                                }
                            }
                        },
                        modele_categorie: {
                            validators: {
                                notEmpty: {
                                    message: "La catégorie est requise"
                                }
                            }
                        },
                        modele_marque: {
                            validators: {
                                notEmpty: {
                                    message: "La marque est requise"
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

                // Submit button event listener
                const submitButton = modalElement.querySelector('[data-kt-modeles-modal-action="submit"]');
                submitButton.addEventListener("click", (event) => {
                    event.preventDefault();

                    if (validator) {
                        validator.validate().then(function (status) {
                            if (status === 'Valid') {
                                submitButton.setAttribute("data-kt-indicator", "on");
                                submitButton.disabled = true;

                                const modeleData = {
                                    id: formElement.querySelector("#modele_id").value || null,
                                    nom: formElement.querySelector("#modele_nom").value,
                                    anneeSortie: formElement.querySelector("#modele_annee").value || null,
                                    typeMoteur: formElement.querySelector("#modele_moteur").value,
                                    puissance: formElement.querySelector("#modele_puissance").value || null,
                                    description: formElement.querySelector("#modele_description").value,
                                    categorieId: formElement.querySelector("#modele_categorie").value,
                                    marqueId: formElement.querySelector("#modele_marque").value,
                                    statut: true
                                };

                                const requestMethod = modeleData.id ? 'PUT' : 'POST';
                                const url = modeleData.id ? `api/modeles/${modeleData.id}` : "api/modeles";

                                fetch(url, {
                                    method: requestMethod,
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(modeleData)
                                })
                                .then(response => {
                                    if (!response.ok) {
                                        return response.json().then(error => {
                                            throw new Error(error.message || "Une erreur est survenue.");
                                        });
                                    }
                                    angular.element(document.querySelector('[ng-controller="modelesController"]')).scope().loadmodeles();
                                    return response.json();
                                })
                                .then(data => {
                                    setTimeout(() => {
                                        submitButton.removeAttribute("data-kt-indicator");
                                        submitButton.disabled = false;

                                        Swal.fire({
                                            text: "Modèle enregistré avec succès",
                                            icon: "success",
                                            buttonsStyling: false,
                                            confirmButtonText: "D'accord, compris!",
                                            customClass: {
                                                confirmButton: "btn btn-primary"
                                            }
                                        }).then(function (result) {
                                            if (result.isConfirmed) {
                                                formElement.reset();
                                                modalInstance.hide();
                                            }
                                        });
                                    }, 1000);
                                })
                                .catch((error) => {
                                    submitButton.removeAttribute("data-kt-indicator");
                                    submitButton.disabled = false;

                                    Swal.fire({
                                        text: error.message || "Une erreur est survenue, veuillez réessayer.",
                                        icon: "error",
                                        buttonsStyling: false,
                                        confirmButtonText: "D'accord, compris!",
                                        customClass: {
                                            confirmButton: "btn btn-primary"
                                        }
                                    });
                                });
                            } else {
                                Swal.fire({
                                    text: "Désolé, il semble qu'il y ait des erreurs détectées, veuillez réessayer.",
                                    icon: "error",
                                    buttonsStyling: false,
                                    confirmButtonText: "Ok, compris!",
                                    customClass: {
                                        confirmButton: "btn btn-primary"
                                    }
                                });
                            }
                        });
                    }
                });

                // Cancel button event listener
                modalElement.querySelector('[data-kt-modeles-modal-action="cancel"]').addEventListener("click", (event) => {
                    event.preventDefault();
                    this.showCancelConfirmation();
                });

                // Close button event listener
                modalElement.querySelector('[data-kt-modeles-modal-action="close"]').addEventListener("click", (event) => {
                    event.preventDefault();
                    this.showCancelConfirmation();
                });
            })();
        },
        showCancelConfirmation: function () {
            Swal.fire({
                text: "Êtes-vous sûr de vouloir annuler?",
                icon: "warning",
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: "Oui, annuler!",
                cancelButtonText: "Non, retourner",
                customClass: {
                    confirmButton: "btn btn-primary",
                    cancelButton: "btn btn-active-light"
                }
            }).then(function (result) {
                if (result.value) {
                    formElement.reset();
                    modalInstance.hide();
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    Swal.fire({
                        text: "Votre formulaire n'a pas été annulé!",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, compris!",
                        customClass: {
                            confirmButton: "btn btn-primary"
                        }
                    });
                }
            });
        }
    };
}();

KTUtil.onDOMContentLoaded(function () {
    KTmodeleszerAddmodele.init();
});

var App = angular.module('myApp', []);

App.controller('modelesController', ['$scope', '$http', function($scope, $http) {
    const appUrl = 'api/modeles';
    const categoriesUrl = 'api/categories';
    const marquesUrl = 'api/marques';
    const disableUrl = appUrl + "/disable";

    // Initialisation
    $scope.listemodeles = [];
    $scope.listecategories = [];
    $scope.listeMarques = [];
    $scope.modeleDto = {
        id: null,
        nom: null,
        anneeSortie: null,
        typeMoteur: null,
        puissance: null,
        description: null,
        statut: null,
        categorieId: null,
        marqueId: null
    };

    // Charger les modèles
    $scope.loadmodeles = function () {
        $http.get(appUrl)
            .then(function (res) {
                $scope.listemodeles = res.data;
                console.log("LISTE DES MODELES : ", $scope.listemodeles);
            })
            .catch(function (error) {
                console.error("ERREUR DE RECUPERATION DES MODELES : ", error);
                $scope.errorSwal("Erreur lors du chargement des modèles.");
            });
    };

    // Charger les catégories
    $scope.loadcategories = function () {
        $http.get(categoriesUrl)
            .then(function (res) {
                $scope.listecategories = res.data;
                console.log("LISTE DES CATEGORIES : ", $scope.listecategories);
            })
            .catch(function (error) {
                console.error("ERREUR DE RECUPERATION DES CATEGORIES : ", error);
            });
    };

    // Charger les marques
    $scope.loadmarques = function () {
        $http.get(marquesUrl)
            .then(function (res) {
                $scope.listeMarques = res.data;
                console.log("LISTE DES MARQUES : ", $scope.listeMarques);
            })
            .catch(function (error) {
                console.error("ERREUR DE RECUPERATION DES MARQUES : ", error);
            });
    };

    // Charger tous les éléments au démarrage
    $scope.loadmodeles();
    $scope.loadcategories();
    $scope.loadmarques();

    // Trouver modèle par ID
    $scope.findmodeleById = function (id) {
        $http.get(appUrl + '/' + id)
            .then(function (res) {
                console.log("MODELE TROUVÉ : ", res.data);
                $scope.modeleDto = res.data;
                $scope.modalShow();
            })
            .catch(function (error) {
                console.error("ERREUR DE RECHERCHE DU MODELE : ", error);
                $scope.errorSwal("Erreur lors de la recherche du modèle.");
            });
    };

    // Supprimer modèle
    $scope.deletemodele = function (id) { 
        Swal.fire({
            title: "Êtes-vous sûr?",
            text: "Une fois supprimé, vous ne pourrez pas récupérer ce modèle!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Oui, supprimer!",
            cancelButtonText: "Non, annuler",
            customClass: {
                confirmButton: "btn btn-danger",
                cancelButton: "btn btn-active-light"
            }
        }).then((result) => {
            if (result.isConfirmed) {
                $http.delete(appUrl + '/' + id)
                    .then(function (res) {
                        Swal.fire({
                            text: "Le modèle a été supprimé avec succès!",
                            icon: "success",
                            confirmButtonText: "D'accord, compris!",
                            customClass: {
                                confirmButton: "btn btn-primary"
                            }
                        });
                        $scope.loadmodeles();
                    })
                    .catch(function (error) {
                        Swal.fire({
                            text: "Erreur lors de la suppression : " + (error.message || "Une erreur est survenue."),
                            icon: "error",
                            confirmButtonText: "D'accord, compris!",
                            customClass: {
                                confirmButton: "btn btn-primary"
                            }
                        });
                    });
            }
        });
    };

    // Désactiver modèle
    $scope.disableModele = function (id) {
        $http.put(disableUrl + '/' + id)
            .then(function (res) {
                console.log("MODELE MODIFIE : ", res.data);
                $scope.loadmodeles();
            })
            .catch(function (error) {
                console.error("ERREUR DE MODIFICATION DU MODELE : ", error);
                $scope.errorSwal("Erreur lors de la modification du modèle.");
            });
    };

    // Afficher/Masquer modal
    $scope.modalShow = function() {
        $('#kt_modal_add_modele').modal('show');
    };

    $scope.modalHide = function() {
        $('#kt_modal_add_modele').modal('hide');
    };

    // Alertes
    $scope.successSwal = function(message) {
        Swal.fire({
            title: "Succès",
            text: message,
            icon: "success",
            confirmButtonText: "OK!"
        });
    };

    $scope.errorSwal = function(message) {
        Swal.fire({
            title: "Erreur",
            text: message,
            icon: "error",
            confirmButtonText: "OK!"
        });
    };
}]);