"use strict";
var KTarticlesAddarticle = function () {
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
                        type: {
                            validators: {
                                notEmpty: {
                                    message: "Le type est requis"
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
                        couverture: {
                            validators: {
                                notEmpty: {
                                    message: "La couverture est requis"
                                }
                            }
                        },
                        tarif: {
                            validators: {
                                notEmpty: {
                                    message: "Le tarif est requis"
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
                const submitButton = modalElement.querySelector('[data-kt-articles-modal-action="submit"]');
                submitButton.addEventListener("click", (event) => {
                    event.preventDefault();

                    // Validate form
                if (validator) {
                    validator.validate().then(function (status) {
                        if (status === 'Valid') {
                            submitButton.setAttribute("data-kt-indicator", "on");
                            submitButton.disabled = true;

                            const formData = new FormData();
                            const espaceDto = {
                                id: formElement.querySelector("#espace_id").value,
                                nom: formElement.querySelector("#nom").value,
                                type: formElement.querySelector("#type").value,
                                tarif: formElement.querySelector("#tarif").value,
                                status: true,
                                description: formElement.querySelector("#description").value,
                            };
                            formData.append("espaceDto", new Blob([JSON.stringify(espaceDto)], { type: "application/json" }));

                            // Ajouter le fichier couverture
                            const couvertureFile = formElement.querySelector("#couverture").files[0];
                            formData.append("couverture", couvertureFile);
                            const imagesFiles = formElement.querySelector("#images").files;
                            alert(imagesFiles.length);
                            for (let i = 0; i < imagesFiles.length; i++) {
                                    formData.append("images", imagesFiles[i]); // Utilisez "images[]" pour indiquer qu'il s'agit d'un tableau de fichiers
                            }
                            alert(formData.getAll("images[]"));
                            const requestMethod = espaceDto.id ? 'PUT' : 'POST';
                            const url = espaceDto.id ? `api/espaces/` + espaceDto.id : "api/espaces";
                            alert(requestMethod+" : "+url);
                            //  Send the request
                            fetch(url, {
                                method: requestMethod,
                                body: formData // Pas besoin de headers['Content-Type']
                            })
                            .then(response => {
                                if (!response.ok) {
                                    return response.json().then(error => {
                                        throw new Error(error.message || "Une erreur est survenue.");
                                    });
                                }
                                angular.element(document.querySelector('[ng-controller="espacesController"]')).scope().loadEspaces();

                                return response.json(); // Déplacez cette ligne ici
                            })
                            .then(data => {
                                setTimeout(() => {
                                    submitButton.removeAttribute("data-kt-indicator");
                                    submitButton.disabled = false;

                                    // Success alert
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
    KTarticlesAddarticle.init();
});


var App = angular.module('myApp', []);

App.controller('espacesController', ['$scope', '$http', function($scope, $http) {
    // URLs pour les opérations CRUD sur les rôles
    const appUrl = 'api/espaces';
    const urlLoadarticles = appUrl;
    const disableUrl = appUrl + "/disable";

    // Initialisation des variables
    $scope.listeEspaces = [];
    $scope.espaceDto = {
        id: null,
        nom: null,
        type: null,
        tarif: null,
        descipion: null,
        couverture: null,
        images: []
    };
    $scope.espaceMasterDto = angular.copy($scope.espaceDto); // Copie pour éviter la référence

    // Fonction pour charger la liste des rôles
    $scope.loadEspaces = function () {
        $http.get(appUrl)
            .then(function (res) {
                $scope.listeEspaces = res.data;
                console.log("LISTE DES ESPACES : ", $scope.listeEspaces);
            })
            .catch(function (error) {
                console.error("ERREUR DE RECUPERATION DES ESPACES : ", error);
            });
    };
    // Chargement des rôles au chargement de la page
    $scope.loadEspaces();

  

    $scope.deleteEspace = function (id) {
        Swal.fire({
            title: "Êtes-vous sûr?",
            text: "Une fois supprimée, vous ne pourrez pas récupérer cet espace!",
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
                            text: "Cet Espace a été supprimée avec succès!",
                            icon: "success",
                            confirmButtonText: "D'accord, compris!",
                            customClass: {
                                confirmButton: "btn btn-primary"
                            }
                        });
                        $scope.loadEspaces(); // Recharge la liste des catégories
                    })
                    .catch(function (error) {
                        Swal.fire({
                            text: "Erreur lors de la suppression de l'espce : " + (error.message || "Une erreur est survenue."),
                            icon: "error",
                            confirmButtonText: "D'accord, compris!",
                            customClass: {
                                confirmButton: "btn btn-primary"
                            }
                        }); 
                    });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    text: "L'espace n'a pas été supprimée!",
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
    $scope.findEspaceById = function (id) {
        $http.get(appUrl + '/' + id)
            .then(function (res) {
                console.log("ESPACE TROUVÉ : ", res.data);
                $scope.espaceDto = res.data;
                $scope.modalShow();
            })
            .catch(function (error) {
                console.error("ERREUR DE RECHERCHE DE L'ESPACE : ", error);
                $scope.errorSwal("Erreur lors de la recherche du rôle.");
            });
    };

    $scope.disableEspace = function (id) {
        $http.put(disableUrl + '/' + id)
            .then(function (res) {
                console.log("ESPACE TROUVÉ : ", res.data);
                $scope.loadEspaces();
            })
            .catch(function (error) {
                console.error("ERREUR DE RECHERCHE DE L'ESPACE : ", error);
                $scope.errorSwal("Erreur lors de la recherche du rôle.");
            });
    };
    // Fonction pour réinitialiser le formulaire de rôle
    $scope.resetarticleForm = function() {
        $scope.articleMasterDTO = angular.copy($scope.espaceDto); // Réinitialisation
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
