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
                        categorie: {
                            validators: {
                                notEmpty: {
                                    message: "La catégorie est requis"
                                }
                            }
                        },
                        titre: {
                            validators: {
                                notEmpty: {
                                    message: "Le titre est requis"
                                }
                            }
                        },
                        contenue: {
                            validators: {
                                notEmpty: {
                                    message: "Le contenue est requis"
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
                            const articleDto = {
                                id: formElement.querySelector("#article_id").value,
                                categorieId: formElement.querySelector("#categorie").value,
                                titre: formElement.querySelector("#titre").value,
                                //contenue: formElement.querySelector("#contenue").value,
                                contenue: angular.element(document.querySelector('[ng-controller="articlesController"]')).scope().articleDto.contenue,  // Quill instance doit être déjà initialisée

                            };
                            console.log(articleDto);
                            formData.append("articleDto", new Blob([JSON.stringify(articleDto)], { type: "application/json" }));

                            // Ajouter le fichier couverture
                            const couvertureFile = formElement.querySelector("#couverture").files[0];
                            formData.append("couverture", couvertureFile);

                            const requestMethod = articleDto.id ? 'PUT' : 'POST';
                            const url = articleDto.id ? `api/articles/` + articleDto.id : "api/articles";
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
                                angular.element(document.querySelector('[ng-controller="articlesController"]')).scope().loadarticles();

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


var App = angular.module('myApp', ['ngSanitize']);
// Directive pour intégrer Quill Editor
App.directive('quillEditor', function() {
    return {
        restrict: 'A',
        scope: {
            ngModel: '='  // Lier ngModel à l'extérieur
        },
        link: function(scope, element) {
            // Initialisation de Quill
            const quill = new Quill(element[0], {
                modules: {
                    toolbar: [
                        [{ header: [1, 2, false] }],
                        ["bold", "italic", "underline"],
                        ["image", "code-block"]
                    ]
                },
                placeholder: "Type your text here...",  // Placeholder par défaut
                theme: "snow"  // Thème de l'éditeur
            });

            // Synchroniser le contenu de Quill avec ngModel
            quill.on('text-change', function() {
                scope.$applyAsync(function() {
                    scope.ngModel = quill.root.innerHTML;  // Mettre à jour le modèle Angular
                });
            });

            // Assurer la mise à jour de l'éditeur si ngModel change
            scope.$watch('ngModel', function(newValue) {
                // Eviter de réinitialiser l'éditeur s'il est déjà synchronisé
                if (quill.root.innerHTML !== newValue) {
                    quill.root.innerHTML = newValue || '';  // Mettre à jour avec la nouvelle valeur ou vide
                }
            });
        }
    };
});

App.controller('articlesController', ['$scope', '$http', '$sce', function($scope, $http, $sce) {
    // URLs pour les opérations CRUD sur les rôles
    const appUrl = 'api/articles';
    const categoriesUrl = 'api/categories';
    const urlLoadarticles = appUrl;
    const disableUrl = appUrl + "/disable";

    // Initialisation des variables
    $scope.listeArticles = [];
    $scope.listeCategories = [];
    $scope.articleDto = {
        id: null,
        titre: null,
        couverture: null,
        contenue: null,
        status: null
    };
    $scope.articleMasterDTO = angular.copy($scope.articleDto); // Copie pour éviter la référence

    // Fonction pour charger la liste des rôles
    $scope.loadarticles = function () {
        $http.get(urlLoadarticles)
            .then(function (res) {
                $scope.listeArticles = res.data;
               
            })
            .catch(function (error) {
                console.error("ERREUR DE RECUPERATION DES articleS : ", error);
            });
    };
    // Chargement des rôles au chargement de la page
    $scope.loadarticles();

    // Fonction pour charger la liste des rôles
    $scope.loadCategories = function () {
        $http.get(categoriesUrl)
            .then(function (res) {
                $scope.listeCategories = res.data;
                console.log("LISTE DES categories : ",  res.data);
            })
            .catch(function (error) {
                console.error("ERREUR DE RECUPERATION DES categories : ", error);
            });
    };
    $scope.loadCategories ();

    $scope.deleteArticle = function (id) {
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
                        $scope.loadarticles(); // Recharge la liste des catégories
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
    $scope.findArticleById = function (id) {
        $http.get(appUrl + '/' + id)
            .then(function (res) {
                console.log("article TROUVÉ : ", res.data);
                $scope.articleDto = res.data;
                $scope.modalShow();
            })
            .catch(function (error) {
                console.error("ERREUR DE RECHERCHE DU article : ", error);
                $scope.errorSwal("Erreur lors de la recherche du rôle.");
            });
    };

    $scope.disableArticle = function (id) {
        $http.put(disableUrl + '/' + id)
            .then(function (res) {
                console.log("article TROUVÉ : ", res.data);
                $scope.loadarticles();
            })
            .catch(function (error) {
                console.error("ERREUR DE RECHERCHE DU article : ", error);
                $scope.errorSwal("Erreur lors de la recherche du rôle.");
            });
    };
    // Fonction pour réinitialiser le formulaire de rôle
    $scope.resetarticleForm = function() {
        $scope.articleMasterDTO = angular.copy($scope.articleDto); // Réinitialisation
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
