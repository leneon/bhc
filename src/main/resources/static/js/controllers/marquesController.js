"use strict";
var KTmarquesAddmarque = function () {
    const modalElement = document.getElementById("kt_modal_add_marque"),
        formElement = modalElement.querySelector("#kt_modal_add_marque_form"),
        modalInstance = new bootstrap.Modal(modalElement);
    return {
        init: function () {
            (() => {
                // Initialize FormValidation
                const validator = FormValidation.formValidation(formElement, {
                    fields: {
                        marque_name: {
                            validators: { 
                                notEmpty: {
                                    message: "Le nom de la marque est requis"
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
                const submitButton = modalElement.querySelector('[data-kt-marques-modal-action="submit"]');
                submitButton.addEventListener("click", (event) => {
                    event.preventDefault();

                    // Validate form
                    if (validator) {
                        validator.validate().then(function (status) {
                            if (status === 'Valid') {
                                submitButton.setAttribute("data-kt-indicator", "on");
                                submitButton.disabled = true;

                                const userData = {
                                    id: formElement.querySelector("#marque_id").value,
                                    nom: formElement.querySelector("#marque_name").value,
                                    description: formElement.querySelector("#marque_description").value,
                                    statut: true
                                };

                                 // Distinction entre ajout et modification
                                 const requestMethod = userData.id ? 'PUT' : 'POST';
                                 const url = userData.id ? `api/marques/`+userData.id : "api/marques";

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
                                    angular.element(document.querySelector('[ng-controller="marquesController"]')).scope().loadmarques();
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
                modalElement.querySelector('[data-kt-marques-modal-action="cancel"]').addEventListener("click", (event) => {
                    event.preventDefault();
                    this.showCancelConfirmation();
                });

                // Close button event listener
                modalElement.querySelector('[data-kt-marques-modal-action="close"]').addEventListener("click", (event) => {
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
    KTmarquesAddmarque.init();
});
 

var App = angular.module('myApp', []);

App.controller('marquesController', ['$scope', '$http', function($scope, $http) {
    // URLs pour les opérations CRUD sur les rôles
    const appUrl = 'api/marques';
    const urlLoadmarques = appUrl;
    const urlCreatemarque = appUrl + "/create";
    const urlUpdatemarque = appUrl + "/update";
    const urlDeletemarque = appUrl + "/deete";
    const disableUrl = appUrl + "/disable";

    // Initialisation des variables
    $scope.listemarques = [];
    $scope.marqueDto = {
        id: null,
        nom: null,
        description: null,
        statut: null
    };
    $scope.marqueMasterDTO = angular.copy($scope.marqueDto); // Copie pour éviter la référence

    // Fonction pour charger la liste des rôles
    $scope.loadmarques = function () {
        $http.get(urlLoadmarques)
            .then(function (res) {
                $scope.listemarques = res.data;
                console.log("LISTE DES marqueS : ", $scope.listemarques);
            })
            .catch(function (error) {
                console.error("ERREUR DE RECUPERATION DES marqueS : ", error);
            });
    };

    // Chargement des rôles au chargement de la page
    $scope.loadmarques();

    // Fonction pour créer un rôle
    $scope.createmarque = function () {
        const marqueJson = angular.toJson($scope.marqueMasterDTO);

        $http.post(urlCreatemarque, marqueJson)
            .then(function (res) {
                console.log("marque CREE : ", res.data);
                $scope.loadmarques();
                $scope.resetmarqueForm();
                $scope.modalHide();
                $scope.successSwal("Rôle ajouté avec succès.");
            })
            .catch(function (error) {
                console.error("ERREUR DE CREATION DU marque : ", error);
                $scope.errorSwal("Erreur lors de la création du rôle.");
            });
    };

    // Fonction pour mettre à jour un rôle
    $scope.updatemarque = function () {
        $http.put(urlUpdatemarque + '/' + $scope.marqueMasterDTO.id, $scope.marqueMasterDTO)
            .then(function (res) {
                console.log("marque MISE A JOUR : ", res.data);
                $scope.loadmarques();
                $scope.resetmarqueForm();
                $scope.successSwal("Rôle modifié avec succès.");
            })
            .catch(function (error) {
                console.error("ERREUR DE MISE A JOUR DU marque : ", error);
                $scope.errorSwal("Erreur lors de la mise à jour du rôle.");
            });
    };
    $scope.deletemarque = function (id) {
        Swal.fire({
            title: "Êtes-vous sûr?",
            text: "Une fois supprimée, vous ne pourrez pas récupérer cette marque!",
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
                // Appel à l'API pour supprimer la marque
                $http.delete(appUrl + '/' + id)
                    .then(function (res) {
                        Swal.fire({
                            text: "La marque a été supprimée avec succès!",
                            icon: "success",
                            confirmButtonText: "D'accord, compris!",
                            customClass: {
                                confirmButton: "btn btn-primary"
                            }
                        });
                        $scope.loadmarques(); // Recharge la liste des marques
                    })
                    .catch(function (error) {
                        Swal.fire({
                            text: "Erreur lors de la suppression de la marque : " + (error.message || "Une erreur est survenue."),
                            icon: "error",
                            confirmButtonText: "D'accord, compris!",
                            customClass: {
                                confirmButton: "btn btn-primary"
                            }
                        }); 
                    });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    text: "La marque n'a pas été supprimée!",
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
    $scope.findmarqueById = function (id) {
        $http.get(appUrl + '/' + id)
            .then(function (res) {
                console.log("marque TROUVÉ : ", res.data);
                $scope.marqueDto = res.data;
                $scope.modalShow();
            })
            .catch(function (error) {
                console.error("ERREUR DE RECHERCHE DU marque : ", error);
                $scope.errorSwal("Erreur lors de la recherche du rôle.");
            });
    };

    $scope.disableCategorie = function (id) {
        $http.put(disableUrl + '/' + id)
            .then(function (res) {
                console.log("marque TROUVÉ : ", res.data);
                $scope.loadmarques();
            })
            .catch(function (error) {
                console.error("ERREUR DE RECHERCHE DU marque : ", error);
                $scope.errorSwal("Erreur lors de la recherche du rôle.");
            });
    };
    // Fonction pour réinitialiser le formulaire de rôle
    $scope.resetmarqueForm = function() {
        $scope.marqueMasterDTO = angular.copy($scope.marqueDto); // Réinitialisation
    };

    // Validation des données avant enregistrement
    $scope.valider = function () {
        if (!$scope.marqueMasterDTO.nom) {
            console.log("Veuillez remplir le nom de la marque.");
            $scope.errorSwal("Veuillez remplir le nom de la marque!");
            return;
        }

        if ($scope.marqueMasterDTO.id) {
            $scope.updatemarque();
        } else {
            $scope.createmarque();
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
        $('#kt_modal_add_marque').modal('show');
    };
    $scope.modalHide = function() {
        $('#kt_modal_add_marque').modal('hide');
    };
}]);
