"use strict";

document.addEventListener("DOMContentLoaded", function () {
    
    var KTUsersAddUser = function () {
        const modalElement = document.getElementById("kt_modal_add_user"),
            formElement = modalElement.querySelector("#kt_modal_add_user_form"),
            modalInstance = new bootstrap.Modal(modalElement);
        var createUserUrl = "auth/signup"
        return {
            init: function () {
                (() => {
                    const validator = FormValidation.formValidation(formElement, {
                        fields: {
                            user_name: {
                                validators: {
                                    notEmpty: {
                                        message: "Le nom d'utilisateur est requis"
                                    },
                                    stringLength: {
                                        min: 3,
                                        message: "Le nom d'utilisateur doit contenir au moins 3 caractères"
                                    }
                                }
                            },
                            user_email: {
                                validators: {
                                    notEmpty: {
                                        message: "Une adresse e-mail valide est requise"
                                    },
                                    emailAddress: {
                                        message: "L'entrée n'est pas une adresse e-mail valide"
                                    }
                                }
                            },
                            user_role: {
                                validators: {
                                    notEmpty: {
                                        message: "Le rôle est requis"
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
            
                    const submitButton = modalElement.querySelector('[data-kt-users-modal-action="submit"]');
                    submitButton.addEventListener("click", (event) => {
                        event.preventDefault();
            
                        // Assurez-vous que l'URL de création d'utilisateur est correcte

                    if (validator) {
                        validator.validate().then(function (status) {
                            if (status === 'Valid') {
                                submitButton.setAttribute("data-kt-indicator", "on");
                                submitButton.disabled = true;

                                // Préparez les données à envoyer
                                const userData = {
                                    username: formElement.querySelector("#user_name").value,
                                    email: formElement.querySelector("#user_email").value,
                                    role: [formElement.querySelector("#user_role").value],
                                    password: "Rootkit1010."
                                };

                                // Envoi de la requête HTTP via Fetch
                                fetch(createUserUrl, {
                                    method: 'POST',
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
                                    
                                    // Recharger la liste des utilisateurs
                                    angular.element(document.querySelector('[ng-controller="usersController"]')).scope().loadUsers();
                                    
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

                                        // Affichez une alerte de succès après la création
                                        Swal.fire({
                                            text: "Utilisateur créé avec succès",
                                            icon: "success",
                                            buttonsStyling: false,
                                            confirmButtonText: "D'accord, compris !",
                                            customClass: {
                                                confirmButton: "btn btn-primary"
                                            }
                                        }).then(function (result) {
                                            if (result.isConfirmed) {
                                                formElement.reset();
                                                const scope = angular.element(document.querySelector('[ng-controller="usersController"]')).scope();
                                                if (scope) {
                                                    scope.userMasterDto = {};
                                                }
                                                modalInstance.hide();
                                            }
                                        });
                                    }, 2000);
                                })
                                .catch((error) => {
                                    submitButton.removeAttribute("data-kt-indicator");
                                    submitButton.disabled = false;

                                    // Vérifier si c'est vraiment une erreur ou juste un problème de parsing
                                    // Si le message contient des indices de succès, ne pas afficher d'erreur
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
                                        angular.element(document.querySelector('[ng-controller="usersController"]')).scope().loadUsers();
                                        Swal.fire({
                                            text: "Utilisateur créé avec succès",
                                            icon: "success",
                                            buttonsStyling: false,
                                            confirmButtonText: "D'accord, compris !",
                                            customClass: {
                                                confirmButton: "btn btn-primary"
                                            }
                                        }).then(function (result) {
                                            if (result.isConfirmed) {
                                                formElement.reset();
                                                const scope = angular.element(document.querySelector('[ng-controller="usersController"]')).scope();
                                                if (scope) {
                                                    scope.userMasterDto = {};
                                                }
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
                                    confirmButtonText: "D'accord, compris !",
                                    customClass: {
                                        confirmButton: "btn btn-primary"
                                    }
                                });
                            }
                        });
                    }

                    });
            
                    modalElement.querySelector('[data-kt-users-modal-action="cancel"]').addEventListener("click", (event) => {
                        event.preventDefault();
                        this.showCancelConfirmation();
                    });
            
                    modalElement.querySelector('[data-kt-users-modal-action="close"]').addEventListener("click", (event) => {
                        event.preventDefault();
                        this.showCancelConfirmation();
                    });
                })();
            },
            
            showCancelConfirmation: function () {
                Swal.fire({
                    text: "Are you sure you would like to cancel?",
                    icon: "warning",
                    showCancelButton: true,
                    buttonsStyling: false,
                    confirmButtonText: "Yes, cancel it!",
                    cancelButtonText: "No, return",
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
                            text: "Your form has not been cancelled!",
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "D'accord, compris !",
                            customClass: {
                                confirmButton: "btn btn-primary"
                            }
                        });
                    }
                });
            }
        };
    }();

    // Initialiser le module
    KTUsersAddUser.init();
});

var App = angular.module('myApp', []);
App.controller('usersController', ['$scope', '$http', function($scope, $http) {
    // URLs pour les opérations CRUD sur les utilisateurs
    const appUrl = 'api/users';
    const urlLoadUsers = appUrl;
    const urlUpdateUser = appUrl + "/update";
    const urlDeleteUser = appUrl + "/delete";
    $scope.userMasterDto = {
        id: null,
        username: null,
        email: null, 
        role: null,
    };
    $scope.listeUsers = null;
    $scope.loading = true;

    // Fonction pour charger la liste des utilisateurs
    $scope.loadUsers = function () {
        $scope.loading = true;
        $http.get(appUrl)
            .then(function (res) {
                $scope.listeUsers = res.data;
                console.log("LISTE DES UTILISATEURS : ", $scope.listeUsers);
                $scope.loading = false;
            })
            .catch(function (error) {
                console.error("ERREUR DE RECUPERATION DES UTILISATEURS : ", error);
                $scope.loading = false;
            });
    };

    // Chargement des utilisateurs au chargement de la page
    $scope.loadUsers();

    // Fonction pour voir les détails d'un utilisateur
    $scope.viewUser = function(userId) {
        window.location.href = '/atiko/utilisateurs/details/' + userId;
    };

    // Fonction pour modifier un utilisateur
    $scope.editUser = function(user) {
        $scope.userMasterDto = angular.copy(user);
        $('#kt_modal_add_user').modal('show');
    };

    // Fonction pour activer/désactiver un utilisateur
    $scope.toggleUserStatus = function(userId, currentStatus) {
        console.log("TOGGLE STATUS - User ID:", userId, "Current status:", currentStatus);
        const newStatus = !currentStatus;
        const action = newStatus ? 'activer' : 'désactiver';
        
        Swal.fire({
            title: 'Confirmation',
            text: `Êtes-vous sûr de vouloir ${action} cet utilisateur ?`,
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
                // Trouver l'utilisateur dans la liste
                const user = $scope.listeUsers.find(u => u.id === userId);
                console.log("Found user for status update:", user);
                if (user) {
                    const updateData = {
                        id: userId,
                        username: user.username,
                        email: user.email,
                        role: user.role,
                        status: newStatus
                    };
                    console.log("Sending update data:", updateData);
                    
                    $http.put(urlUpdateUser, updateData)
                    .then(function(response) {
                        console.log("Status update successful:", response);
                        $scope.loadUsers();
                        $scope.showSuccessMessage(`Utilisateur ${action === 'activer' ? 'activé' : 'désactivé'} avec succès`);
                    })
                    .catch(function(error) {
                        console.error("ERREUR LORS DE LA MODIFICATION DU STATUT : ", error);
                        $scope.showErrorMessage("Erreur lors de la modification du statut de l'utilisateur.");
                    });
                }
            }
        });
    };

    // Fonction pour supprimer un utilisateur
    $scope.deleteUser = function(userId, username) {
        console.log("DELETE USER - User ID:", userId, "Username:", username);
        Swal.fire({
            title: 'Confirmation de suppression',
            text: `Êtes-vous sûr de vouloir supprimer l'utilisateur "${username}" ?`,
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
                console.log("Sending delete request to:", urlDeleteUser + '/' + userId);
                $http({
                    method: 'DELETE',
                    url: urlDeleteUser + '/' + userId,
                    headers: {
                        'Accept': 'text/plain, */*'
                    },
                    transformResponse: [function(data) {
                        // Accepter les réponses texte sans transformation
                        return data;
                    }]
                })
                .then(function(response) {
                    console.log("Delete successful:", response);
                    $scope.loadUsers();
                    $scope.showSuccessMessage("Utilisateur supprimé avec succès");
                })
                .catch(function(error) {
                    console.error("ERREUR LORS DE LA SUPPRESSION : ", error);
                    // Vérifier le statut HTTP - si c'est 200-299, c'est un succès
                    // Même si AngularJS déclenche une erreur de parsing, si le status est 200, c'est OK
                    if (error.status && error.status >= 200 && error.status < 300) {
                        console.log("Suppression réussie malgré l'erreur de parsing");
                        $scope.loadUsers();
                        $scope.showSuccessMessage("Utilisateur supprimé avec succès");
                    } else if (!error.status || error.status === 0) {
                        // Si pas de status ou status 0, vérifier si c'est juste un problème de parsing
                        // Si la réponse contient "supprimé", considérer comme succès
                        if (error.data && (error.data.indexOf('supprimé') !== -1 || error.data.indexOf('succès') !== -1)) {
                            $scope.loadUsers();
                            $scope.showSuccessMessage("Utilisateur supprimé avec succès");
                        } else {
                            // Sinon, c'est probablement une vraie erreur
                            const errorMsg = error.data?.message || error.data || error.statusText || "Erreur lors de la suppression de l'utilisateur.";
                            $scope.showErrorMessage(errorMsg);
                        }
                    } else {
                        const errorMsg = error.data?.message || error.data || error.statusText || "Erreur lors de la suppression de l'utilisateur.";
                        $scope.showErrorMessage(errorMsg);
                    }
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

    // Fonction pour mettre à jour un utilisateur
    $scope.updateUser = function() {
        $http.put(urlUpdateUser, $scope.userMasterDto)
            .then(function(response) {
                $scope.loadUsers();
                $('#kt_modal_add_user').modal('hide');
                $scope.showSuccessMessage("Utilisateur modifié avec succès");
                $scope.userMasterDto = {};
            })
            .catch(function(error) {
                console.error("ERREUR LORS DE LA MODIFICATION : ", error);
                $scope.showErrorMessage("Erreur lors de la modification de l'utilisateur.");
            });
    };

}]);
