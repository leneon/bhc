"use strict";
var KTservices = function () {
    const modalElement = document.getElementById("kt_modal_add_article"),
        formElement = modalElement.querySelector("#kt_modal_add_article_form"),
        modalInstance = new bootstrap.Modal(modalElement);
    return { 
        init: function () {
            (() => {
                // Initialize FormValidation
                const validator = FormValidation.formValidation(formElement, {
                    fields: {
                        nom: {
                            validators: {
                                notEmpty: {
                                    message: "Le nom est requis"
                                }
                            }
                        },
                        description: {
                            validators: {
                                notEmpty: {
                                    message: "La description est requis"
                                }
                            }
                        },
                        type: {
                            validators: {
                                notEmpty: {
                                    message: "Le namespace est requis"
                                }
                            }
                        },
                       
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
                const submitButton = modalElement.querySelector('[data-kt-articles-modal-action="submit"]');
                submitButton.addEventListener("click", (event) => {
                    event.preventDefault();

                    // Validate form
                if (validator) {
                    validator.validate().then(function (status) {
                        if (status === 'Valid') {
                            submitButton.setAttribute("data-kt-indicator", "on");
                            submitButton.disabled = true;

                            const articleDto = {
                                id: formElement.querySelector("#service_id").value,
                                nom: formElement.querySelector("#nom").value,
                                type: formElement.querySelector("#type").value,
                                description: formElement.querySelector("#description").value,
                              
                            };

                            const requestMethod = articleDto.id ? 'PUT' : 'POST';
                            const url = articleDto.id ? `api/services/` + articleDto.id : "api/services";
                            //  Send the request
                            fetch(url, {
                                method: requestMethod,
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(articleDto) // Pas besoin de headers['Content-Type']
                            })
                            .then(response => {
                                if (!response.ok) {
                                    return response.json().then(error => {
                                        throw new Error(error.message || "Une erreur est survenue.");
                                    });
                                }
                                angular.element(document.querySelector('[ng-controller="servicesController"]')).scope().loadServices();

                                return response.json(); // Déplacez cette ligne ici
                            })
                            .then(data => {
                                setTimeout(() => {
                                    submitButton.removeAttribute("data-kt-indicator");
                                    submitButton.disabled = false;

                                    // Success alert
                                    Swal.fire({
                                        text: "opération éffectué avec succès",
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

                                // Error alert
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
                modalElement.querySelector('[data-kt-articles-modal-action="cancel"]').addEventListener("click", (event) => {
                    event.preventDefault();
                    this.showCancelConfirmation();
                });

                // Close button event listener
                modalElement.querySelector('[data-kt-articles-modal-action="close"]').addEventListener("click", (event) => {
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
    KTservices.init();
});


var App = angular.module('myApp', []);

App.controller('servicesController', ['$scope', '$http', function($scope, $http) {
    // URLs pour les opérations CRUD sur les rôles
    const appUrl = 'api/services';

    // Initialisation des variables
    $scope.listeServices = [];
    $scope.serviceDto = {
        id: null,
        nom: null,
        description: null
    };
    $scope.serviceMasterDto = angular.copy($scope.serviceDto); // Copie pour éviter la référence

    // Fonction pour charger la liste des rôles
    $scope.loadServices = function () {
        $http.get(appUrl)
            .then(function (res) {
                $scope.listeServices = res.data;
                console.log("LISTE DES Services : ", $scope.listeServices);
            })
            .catch(function (error) {
                console.error("ERREUR DE RECUPERATION DES services : ", error);
            });
    };
    // Chargement des rôles au chargement de la page
    $scope.loadServices();



    $scope.deleteServices = function (id) {
        Swal.fire({
            title: "Êtes-vous sûr?",
            text: "Une fois supprimée, vous ne pourrez pas récupérer ce service!",
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
                            text: "Le service a été supprimée avec succès!",
                            icon: "success",
                            confirmButtonText: "D'accord, compris!",
                            customClass: {
                                confirmButton: "btn btn-primary"
                            }
                        });
                        $scope.listeServices(); // Recharge la liste des catégories
                    })
                    .catch(function (error) {
                        Swal.fire({
                            text: "Erreur lors de la suppression du services : " + (error.message || "Une erreur est survenue."),
                            icon: "error",
                            confirmButtonText: "D'accord, compris!",
                            customClass: {
                                confirmButton: "btn btn-primary"
                            }
                        }); 
                    });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    text: "Le service n'a pas été supprimée!",
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
    $scope.findServiceById = function (id) {
        $http.get(appUrl + '/' + id)
            .then(function (res) {
                console.log("SERVICE TROUVÉ : ", res.data);
                $scope.serviceDto = res.data;
                $scope.modalShow();
            })
            .catch(function (error) {
                console.error("ERREUR DE RECHERCHE DU article : ", error);
                $scope.errorSwal("Erreur lors de la recherche du rôle.");
            });
    };

    // Fonction pour réinitialiser le formulaire de rôle
    $scope.resetarticleForm = function() {
        $scope.listeServices = angular.copy($scope.articleDto); // Réinitialisation
    };

    // Validation des données avant enregistrement
    $scope.valider = function () {
        if (!$scope.articleMasterDTO.name || !$scope.articleMasterDTO.description || 
            $scope.articleMasterDTO.status === null) {
            console.log("Veuillez remplir tous les champs obligatoires.");
            $scope.errorSwal("Veuillez remplir tous les champs obligatoires!");
            return;
        }

        if ($scope.articleMasterDTO.id) {
            $scope.updatearticle();
        } else {
            $scope.createarticle();
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
        $('#kt_modal_add_article').modal('show');
    };
    $scope.modalHide = function() {
        $('#kt_modal_add_article').modal('hide');
    };
}]);
