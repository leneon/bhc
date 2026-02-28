"use strict";
var KTRolesAddRole = function () {
    const modalElement = document.getElementById("kt_modal_add_role"),
        formElement = modalElement.querySelector("#kt_modal_add_role_form"),
        modalInstance = new bootstrap.Modal(modalElement);

    return {
        init: function () {
            (() => {
                // Initialize FormValidation
                const validator = FormValidation.formValidation(formElement, {
                    fields: {
                        role_name: {
                            validators: {
                                notEmpty: {
                                    message: "Le nom du rôle est requis"
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
                const submitButton = modalElement.querySelector('[data-kt-roles-modal-action="submit"]');
                submitButton.addEventListener("click", (event) => {
                    event.preventDefault();

                    // Validate form
                    if (validator) {
                        validator.validate().then(function (status) {
                            if (status === 'Valid') {
                                submitButton.setAttribute("data-kt-indicator", "on");
                                submitButton.disabled = true;

                                setTimeout(() => {
                                    submitButton.removeAttribute("data-kt-indicator");
                                    submitButton.disabled = false;

                                    // Show success alert
                                    Swal.fire({
                                        text: "Le formulaire a été soumis avec succès !",
                                        icon: "success",
                                        buttonsStyling: false,
                                        confirmButtonText: "Ok, compris!",
                                        customClass: {
                                            confirmButton: "btn btn-primary"
                                        }
                                    }).then(function (result) {
                                        if (result.isConfirmed) {
                                            modalInstance.hide();
                                        }
                                    });
                                }, 2000);
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
                modalElement.querySelector('[data-kt-roles-modal-action="cancel"]').addEventListener("click", (event) => {
                    event.preventDefault();
                    this.showCancelConfirmation();
                });

                // Close button event listener
                modalElement.querySelector('[data-kt-roles-modal-action="close"]').addEventListener("click", (event) => {
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
    KTRolesAddRole.init();
});


var App = angular.module('myApp', []);

App.controller('rolesController', ['$scope', '$http', function($scope, $http) {
    // URLs pour les opérations CRUD sur les rôles
    const appUrl = 'api/roles';
    const urlLoadRoles = appUrl;
    const urlCreateRole = appUrl + "/create";
    const urlUpdateRole = appUrl + "/update";
    const urlDeleteRole = appUrl + "/delete";
    const urlFindRole = appUrl + "/find";

    // Initialisation des variables
    $scope.listeRoles = [];
    $scope.roleDTO = {
        id: null,
        name: null,
        description: null,
        status: null
    };
    $scope.roleMasterDTO = angular.copy($scope.roleDTO); // Copie pour éviter la référence

    // Fonction pour charger la liste des rôles
    $scope.loadRoles = function () {
        $http.get(urlLoadRoles)
            .then(function (res) {
                $scope.listeRoles = res.data;
                console.log("LISTE DES ROLES : ", $scope.listeRoles);
            })
            .catch(function (error) {
                console.error("ERREUR DE RECUPERATION DES ROLES : ", error);
            });
    };

    // Chargement des rôles au chargement de la page
    $scope.loadRoles();

    // Fonction pour créer un rôle
    $scope.createRole = function () {
        const roleJson = angular.toJson($scope.roleMasterDTO);

        $http.post(urlCreateRole, roleJson)
            .then(function (res) {
                console.log("ROLE CREE : ", res.data);
                $scope.loadRoles();
                $scope.resetRoleForm();
                $scope.modalHide();
                $scope.successSwal("Rôle ajouté avec succès.");
            })
            .catch(function (error) {
                console.error("ERREUR DE CREATION DU ROLE : ", error);
                $scope.errorSwal("Erreur lors de la création du rôle.");
            });
    };

    // Fonction pour mettre à jour un rôle
    $scope.updateRole = function () {
        $http.put(urlUpdateRole + '/' + $scope.roleMasterDTO.id, $scope.roleMasterDTO)
            .then(function (res) {
                console.log("ROLE MISE A JOUR : ", res.data);
                $scope.loadRoles();
                $scope.resetRoleForm();
                $scope.successSwal("Rôle modifié avec succès.");
            })
            .catch(function (error) {
                console.error("ERREUR DE MISE A JOUR DU ROLE : ", error);
                $scope.errorSwal("Erreur lors de la mise à jour du rôle.");
            });
    };

    // Fonction pour supprimer un rôle
    $scope.deleteRole = function (id) {
        swal({
            title: "Êtes-vous sûr?",
            text: "Une fois supprimé, vous ne pourrez pas récupérer ce rôle!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                $http.delete(urlDeleteRole + '/' + id)
                    .then(function (res) {
                        swal("Le rôle a été supprimé avec succès!", { icon: "success" });
                        $scope.loadRoles();
                    })
                    .catch(function (error) {
                        swal("Erreur lors de la suppression du rôle : " + error.message, { icon: "error" });
                    });
            } else {
                swal("Le rôle n'a pas été supprimé!");
            }
        });
    };

    // Fonction pour trouver un rôle par son ID
    $scope.findRoleById = function (id) {
        $http.get(urlFindRole + '/' + id)
            .then(function (res) {
                console.log("ROLE TROUVÉ : ", res.data);
                $scope.roleMasterDTO = res.data;
                $scope.modalShow();
            })
            .catch(function (error) {
                console.error("ERREUR DE RECHERCHE DU ROLE : ", error);
                $scope.errorSwal("Erreur lors de la recherche du rôle.");
            });
    };

    // Fonction pour réinitialiser le formulaire de rôle
    $scope.resetRoleForm = function() {
        $scope.roleMasterDTO = angular.copy($scope.roleDTO); // Réinitialisation
    };

    // Validation des données avant enregistrement
    $scope.valider = function () {
        if (!$scope.roleMasterDTO.name || !$scope.roleMasterDTO.description || 
            $scope.roleMasterDTO.status === null) {
            console.log("Veuillez remplir tous les champs obligatoires.");
            $scope.errorSwal("Veuillez remplir tous les champs obligatoires!");
            return;
        }

        if ($scope.roleMasterDTO.id) {
            $scope.updateRole();
        } else {
            $scope.createRole();
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
        $('#myModal').modal('show');
    };
    $scope.modalHide = function() {
        $('#myModal').modal('hide');
    };
}]);
