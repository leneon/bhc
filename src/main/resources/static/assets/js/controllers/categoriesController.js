"use strict";
var KTcategoriesAddcategorie = function () {
    const modalElement = document.getElementById("kt_modal_add_categorie"),
        formElement = modalElement.querySelector("#kt_modal_add_categorie_form"),
        modalInstance = new bootstrap.Modal(modalElement);
    return {
        init: function () {
            (() => {
                // Initialize FormValidation
                const validator = FormValidation.formValidation(formElement, {
                    fields: {
                        categorie_name: {
                            validators: {
                                notEmpty: {
                                    message: "Le nom de la catégorie est requis"
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
                const submitButton = modalElement.querySelector('[data-kt-categories-modal-action="submit"]');
                submitButton.addEventListener("click", (event) => {
                    event.preventDefault();

                    // Validate form
                    if (validator) {
                        validator.validate().then(function (status) {
                            if (status === 'Valid') {
                                submitButton.setAttribute("data-kt-indicator", "on");
                                submitButton.disabled = true;

                                const userData = {
                                    id: formElement.querySelector("#categorie_id").value,
                                    nom: formElement.querySelector("#categorie_name").value,
                                    statut: true
                                };

                                 // Distinction entre ajout et modification
                                 const requestMethod = userData.id ? 'PUT' : 'POST';
                                 const url = userData.id ? `api/categories/`+userData.id : "api/categories";

                                // Envoi de la requête HTTP via Fetch
                                fetch(url, {
                                    method: requestMethod,
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(userData)
                                })
                                .then(response => {
                                    if (!response.ok) {
                                        // Gérer les erreurs de réponse HTTP
                                        return response.json().then(error => {
                                            throw new Error(error.message || "Une erreur est survenue.");
                                        });
                                    }
                                    angular.element(document.querySelector('[ng-controller="categoriesController"]')).scope().loadcategories();
                                    return response.json();
                                })
                                .then(data => {
                                    setTimeout(() => {
                                        submitButton.removeAttribute("data-kt-indicator");
                                        submitButton.disabled = false;

                                        // Affichez une alerte de succès après la création
                                        Swal.fire({
                                            text: "Catégorie créé avec succès",
                                            icon: "success",
                                            buttonsStyling: false,
                                            confirmButtonText: "D'accord, compris !",
                                            customClass: {
                                                confirmButton: "btn btn-primary"
                                            }
                                        }).then(function (result) {
                                            if (result.isConfirmed) {
                                                modalInstance.hide();
                                            }
                                        });
                                    }, 1000);
                                })
                                .catch((error) => {
                                    submitButton.removeAttribute("data-kt-indicator");
                                    submitButton.disabled = false;

                                    // Affichez une alerte en cas d'erreur
                                    Swal.fire({
                                        text: error.message || "Une erreur est survenue, veuillez réessayer.",
                                        icon: "error",
                                        buttonsStyling: false,
                                        confirmButtonText: "D'accord, compris !",
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
                modalElement.querySelector('[data-kt-categories-modal-action="cancel"]').addEventListener("click", (event) => {
                    event.preventDefault();
                    this.showCancelConfirmation();
                });

                // Close button event listener
                modalElement.querySelector('[data-kt-categories-modal-action="close"]').addEventListener("click", (event) => {
                    event.preventDefault();
                    this.showCancelConfirmation();
                });
            })();
        },
        showCancelConfirmation: function () {
            Swal.fire({
                text: "Êtes-vous sûr de vouloir annuler ?",
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
    KTcategoriesAddcategorie.init();
});


var App = angular.module('myApp', []);

App.controller('categoriesController', ['$scope', '$http', function($scope, $http) {
    // URLs pour les opérations CRUD sur les rôles
    const appUrl = 'api/categories';
    const urlLoadcategories = appUrl;
    const urlCreatecategorie = appUrl + "/create";
    const urlUpdatecategorie = appUrl + "/update";
    const urlDeletecategorie = appUrl + "/deete";
    const disableUrl = appUrl + "/disable";

    // Initialisation des variables
    $scope.listecategories = [];
    $scope.categorieDto = {
        id: null,
        name: null,
        status: null
    };
    $scope.categorieMasterDTO = angular.copy($scope.categorieDto); // Copie pour éviter la référence

    // Fonction pour charger la liste des rôles
    $scope.loadcategories = function () {
        $http.get(urlLoadcategories)
            .then(function (res) {
                $scope.listecategories = res.data;
                console.log("LISTE DES categorieS : ", $scope.listecategories);
            })
            .catch(function (error) {
                console.error("ERREUR DE RECUPERATION DES categorieS : ", error);
            });
    };

    // Chargement des rôles au chargement de la page
    $scope.loadcategories();

    // Fonction pour créer un rôle
    $scope.createcategorie = function () {
        const categorieJson = angular.toJson($scope.categorieMasterDTO);

        $http.post(urlCreatecategorie, categorieJson)
            .then(function (res) {
                console.log("categorie CREE : ", res.data);
                $scope.loadcategories();
                $scope.resetcategorieForm();
                $scope.modalHide();
                $scope.successSwal("Rôle ajouté avec succès.");
            })
            .catch(function (error) {
                console.error("ERREUR DE CREATION DU categorie : ", error);
                $scope.errorSwal("Erreur lors de la création du rôle.");
            });
    };

    // Fonction pour mettre à jour un rôle
    $scope.updatecategorie = function () {
        $http.put(urlUpdatecategorie + '/' + $scope.categorieMasterDTO.id, $scope.categorieMasterDTO)
            .then(function (res) {
                console.log("categorie MISE A JOUR : ", res.data);
                $scope.loadcategories();
                $scope.resetcategorieForm();
                $scope.successSwal("Rôle modifié avec succès.");
            })
            .catch(function (error) {
                console.error("ERREUR DE MISE A JOUR DU categorie : ", error);
                $scope.errorSwal("Erreur lors de la mise à jour du rôle.");
            });
    };
    $scope.deletecategorie = function (id) {
        Swal.fire({
            title: "Êtes-vous sûr?",
            text: "Une fois supprimée, vous ne pourrez pas récupérer cette catégorie!",
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
                // Appel à l'API pour supprimer la catégorie
                $http.delete(appUrl + '/' + id)
                    .then(function (res) {
                        Swal.fire({
                            text: "La catégorie a été supprimée avec succès!",
                            icon: "success",
                            confirmButtonText: "D'accord, compris!",
                            customClass: {
                                confirmButton: "btn btn-primary"
                            }
                        });
                        $scope.loadcategories(); // Recharge la liste des catégories
                    })
                    .catch(function (error) {
                        Swal.fire({
                            text: "Erreur lors de la suppression de la catégorie : " + (error.message || "Une erreur est survenue."),
                            icon: "error",
                            confirmButtonText: "D'accord, compris!",
                            customClass: {
                                confirmButton: "btn btn-primary"
                            }
                        }); 
                    });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    text: "La catégorie n'a pas été supprimée!",
                    icon: "info",
                    confirmButtonText: "D'accord, compris!",
                    customClass: {
                        confirmButton: "btn btn-primary"
                    }
                });
            }
        });
    };
    

    // Fonction pour trouver un rôle par son ID
    $scope.findcategorieById = function (id) {
        $http.get(appUrl + '/' + id)
            .then(function (res) {
                console.log("categorie TROUVÉ : ", res.data);
                $scope.categorieDto = res.data;
                $scope.modalShow();
            })
            .catch(function (error) {
                console.error("ERREUR DE RECHERCHE DU categorie : ", error);
                $scope.errorSwal("Erreur lors de la recherche du rôle.");
            });
    };

    $scope.disableCategorie = function (id) {
        $http.put(disableUrl + '/' + id)
            .then(function (res) {
                console.log("categorie TROUVÉ : ", res.data);
                $scope.loadcategories();
            })
            .catch(function (error) {
                console.error("ERREUR DE RECHERCHE DU categorie : ", error);
                $scope.errorSwal("Erreur lors de la recherche du rôle.");
            });
    };
    // Fonction pour réinitialiser le formulaire de rôle
    $scope.resetcategorieForm = function() {
        $scope.categorieMasterDTO = angular.copy($scope.categorieDto); // Réinitialisation
    };

    // Validation des données avant enregistrement
    $scope.valider = function () {
        if (!$scope.categorieMasterDTO.name || !$scope.categorieMasterDTO.description || 
            $scope.categorieMasterDTO.status === null) {
            console.log("Veuillez remplir tous les champs obligatoires.");
            $scope.errorSwal("Veuillez remplir tous les champs obligatoires!");
            return;
        }

        if ($scope.categorieMasterDTO.id) {
            $scope.updatecategorie();
        } else {
            $scope.createcategorie();
        }
    };

    // Fonction de succès pour les alertes
    $scope.successSwal = function(message) {
        swal({
            title: "Succès",
            text: message,
            icon: "success",
            button: "OK!",
        });
    };

    // Fonction d'erreur pour les alertes
    $scope.errorSwal = function(message) {
        swal({
            title: "Erreur",
            text: message,
            icon: "error",
            button: "OK!",
        });
    };

    // Afficher/masquer le modal
    $scope.modalShow = function() {
        $('#kt_modal_add_categorie').modal('show');
    };
    $scope.modalHide = function() {
        $('#kt_modal_add_categorie').modal('hide');
    };
}]);
