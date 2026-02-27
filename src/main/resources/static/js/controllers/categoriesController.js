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
                                    description: formElement.querySelector("#categorie_description").value,
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
                                .then(async (response) => {
                                    // Cloner la réponse pour pouvoir la lire plusieurs fois si nécessaire
                                    const responseClone = response.clone();
                                    
                                    if (!response.ok) {
                                        // Gérer les erreurs de réponse HTTP
                                        let errorMessage = "Une erreur est survenue.";
                                        try {
                                            const errorData = await response.json();
                                            errorMessage = errorData.message || errorMessage;
                                        } catch (e) {
                                            // Si ce n'est pas du JSON, essayer de lire le texte
                                            try {
                                                const errorText = await responseClone.text();
                                                errorMessage = errorText || errorMessage;
                                            } catch (textError) {
                                                // Ignorer si même le texte ne peut pas être lu
                                            }
                                        }
                                        throw new Error(errorMessage);
                                    }
                                    
                                    // Recharger la liste des catégories
                                    angular.element(document.querySelector('[ng-controller="categoriesController"]')).scope().loadcategories();
                                    
                                    // Essayer de parser la réponse en JSON seulement si elle a du contenu
                                    let data = null;
                                    const contentType = response.headers.get("content-type");
                                    if (contentType && contentType.includes("application/json")) {
                                        try {
                                            const text = await response.text();
                                            if (text && text.trim()) {
                                                data = JSON.parse(text);
                                            }
                                        } catch (e) {
                                            // Si le parsing échoue, ce n'est pas grave, on continue
                                            console.log("Réponse non-JSON ou vide, ignorée:", e);
                                        }
                                    }
                                    
                                    return data;
                                })
                                .then((data) => {
                                    setTimeout(() => {
                                        submitButton.removeAttribute("data-kt-indicator");
                                        submitButton.disabled = false;

                                        // Affichez une alerte de succès
                                        const message = userData.id ? "Catégorie modifiée avec succès" : "Catégorie créée avec succès";
                                        Swal.fire({
                                            text: message,
                                            icon: "success",
                                            buttonsStyling: false,
                                            confirmButtonText: "D'accord, compris !",
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

                                    // Vérifier si c'est vraiment une erreur ou juste un problème de parsing
                                    const errorMessage = error.message || "Une erreur est survenue, veuillez réessayer.";
                                    
                                    // Si l'utilisateur a été créé malgré l'erreur de parsing, recharger et afficher succès
                                    if (errorMessage.indexOf('supprimé') === -1 && errorMessage.indexOf('succès') === -1) {
                                        // Affichez une alerte en cas d'erreur réelle
                                        Swal.fire({
                                            text: errorMessage,
                                            icon: "error",
                                            buttonsStyling: false,
                                            confirmButtonText: "D'accord, compris !",
                                            customClass: {
                                                confirmButton: "btn btn-primary"
                                            }
                                        });
                                    } else {
                                        // Si c'est un faux positif, recharger et afficher succès
                                        angular.element(document.querySelector('[ng-controller="categoriesController"]')).scope().loadcategories();
                                        const message = userData.id ? "Catégorie modifiée avec succès" : "Catégorie créée avec succès";
                                        Swal.fire({
                                            text: message,
                                            icon: "success",
                                            buttonsStyling: false,
                                            confirmButtonText: "D'accord, compris !",
                                            customClass: {
                                                confirmButton: "btn btn-primary"
                                            }
                                        }).then(function (result) {
                                            if (result.isConfirmed) {
                                                formElement.reset();
                                                modalInstance.hide();
                                            }
                                        });
                                    }
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
    // URLs pour les opérations CRUD sur les catégories
    const appUrl = 'api/categories';
    const disableUrl = appUrl + "/disable";

    // Initialisation des variables
    $scope.listecategories = [];
    $scope.loading = true;
    $scope.categorieDto = {
        id: null,
        nom: null,
        description: null,
        statut: null
    };
    $scope.categorieMasterDTO = angular.copy($scope.categorieDto);

    // Fonction pour charger la liste des catégories
    $scope.loadcategories = function () {
        $scope.loading = true;
        $http.get(appUrl)
            .then(function (res) {
                $scope.listecategories = res.data;
                console.log("LISTE DES CATEGORIES : ", $scope.listecategories);
                $scope.loading = false;
            })
            .catch(function (error) {
                console.error("ERREUR DE RECUPERATION DES CATEGORIES : ", error);
                $scope.loading = false;
            });
    };

    // Chargement des catégories au chargement de la page
    $scope.loadcategories();
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
    

    // Fonction pour trouver une catégorie par son ID
    $scope.findcategorieById = function (id) {
        $http.get(appUrl + '/' + id)
            .then(function (res) {
                console.log("CATEGORIE TROUVÉE : ", res.data);
                $scope.categorieDto = res.data;
                $scope.modalShow();
            })
            .catch(function (error) {
                console.error("ERREUR DE RECHERCHE DE LA CATEGORIE : ", error);
                $scope.errorSwal("Erreur lors de la recherche de la catégorie.");
            });
    };

    // Fonction pour désactiver une catégorie
    $scope.disableCategorie = function (id) {
        $http.put(disableUrl + '/' + id)
            .then(function (res) {
                console.log("CATEGORIE DESACTIVEE : ", res.data);
                $scope.loadcategories();
            })
            .catch(function (error) {
                console.error("ERREUR DE DESACTIVATION DE LA CATEGORIE : ", error);
                $scope.errorSwal("Erreur lors de la désactivation de la catégorie.");
            });
    };

    // Fonction pour réinitialiser le formulaire
    $scope.resetcategorieForm = function() {
        $scope.categorieMasterDTO = angular.copy($scope.categorieDto);
    };

    // Fonction de succès pour les alertes
    $scope.successSwal = function(message) {
        Swal.fire({
            title: "Succès",
            text: message,
            icon: "success",
            confirmButtonText: "OK!",
            buttonsStyling: false,
            customClass: {
                confirmButton: "btn btn-primary"
            }
        });
    };

    // Fonction d'erreur pour les alertes
    $scope.errorSwal = function(message) {
        Swal.fire({
            title: "Erreur",
            text: message,
            icon: "error",
            confirmButtonText: "OK!",
            buttonsStyling: false,
            customClass: {
                confirmButton: "btn btn-primary"
            }
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
