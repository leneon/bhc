"use strict";

var App = angular.module('myApp', []);

// Directive pour gérer les fichiers
App.directive('fileModel', function () {
    return {
        scope: {
            fileModel: '='
        },
        link: function (scope, element, attrs) {
            element.bind('change', function () {
                scope.$apply(function () {
                    if (attrs.multiple) {
                        scope.fileModel = element[0].files;
                    } else {
                        scope.fileModel = element[0].files[0];
                    }
                });
            });
        }
    };
});

App.controller('voitureController', ['$scope', '$http', function($scope, $http) {
    console.log('voitureController initialisé');
    const appUrl = '/api/voitures';
    $scope.listeVoitures = [];
    $scope.categories = [];
    $scope.selected = {};
    $scope.selectAll = false;
    $scope.voitureForm = {};
    $scope.searchVoiture = '';

    $scope.loadVoitures = function() {
        console.log('Chargement des voitures...');
        $http.get(appUrl).then(function(res) {
            $scope.listeVoitures = res.data;
            $scope.selected = {};
            $scope.selectAll = false;
            console.log('Voitures chargées:', $scope.listeVoitures.length);
        });
    };

    $scope.loadCategories = function() {
        $http.get('/api/categories').then(function(res) {
            $scope.categories = res.data;
        });
    };

    $scope.loadVoitures();
    $scope.loadCategories();

    $scope.toggleAll = function() {
        angular.forEach($scope.listeVoitures, function(voiture) {
            $scope.selected[voiture.id] = $scope.selectAll;
        });
    };

    $scope.updateSelectAll = function() {
        var allSelected = true;
        angular.forEach($scope.listeVoitures, function(voiture) {
            if (!$scope.selected[voiture.id]) allSelected = false;
        });
        $scope.selectAll = allSelected;
    };

    $scope.openModal = function(voiture) {
        console.log('openModal called with:', voiture);
        if (voiture) {
            $scope.voitureForm = angular.copy(voiture);
            $scope.voitureForm.categorie = $scope.categories.find(cat => String(cat.id) === String(voiture.categorie && voiture.categorie.id));
            console.log('voitureForm after edit:', $scope.voitureForm);
        } else {
            $scope.voitureForm = {
                id: null,
                nom: '',
                immatriculation: '',
                model: '',
                automatique: false,
                siege: '',
                portiere: '',
                coffre: '',
                climatisation: false,
                disponibilite: 'DISPONIBLE',
                statut: true,
                categorie: $scope.categories[0] || null,
                imageFile: null,
                imagesFiles: []
            };
        }
        $('#kt_modal_add_voiture').modal('show');
    };

    $scope.closeModal = function() {
        $('#kt_modal_add_voiture').modal('hide');
    };

    $scope.editVoiture = function(voiture) {
        console.log('editVoiture called with:', voiture);
        if ($scope.categories.length === 0) {
            $scope.loadCategories();
            setTimeout(function() {
                $scope.editVoiture(voiture);
            }, 100);
            return;
        }
        $scope.openModal(voiture);
    };

    $scope.deleteVoiture = function(id) {
        Swal.fire({
            title: "Êtes-vous sûr?",
            text: "Une fois supprimée, vous ne pourrez pas récupérer cette voiture!",
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
                $http.delete(appUrl + '/' + id).then(function() {
                    $scope.loadVoitures();
                    Swal.fire({
                        text: "Voiture supprimée avec succès!",
                        icon: "success",
                        confirmButtonText: "D'accord, compris!",
                        customClass: { confirmButton: "btn btn-primary" }
                    });
                });
            }
        });
    };

    $scope.toggleStatut = function(voiture) {
        voiture.statut = !voiture.statut;
        $http.put(appUrl + '/' + voiture.id, voiture).then(function() {
            $scope.loadVoitures();
        });
    };

    // Fonction pour soumettre le formulaire
    $scope.submitVoitureForm = function() {
        console.log('submitVoitureForm called');
    };

    // Pour que KTVoituresAddVoiture puisse recharger la liste après ajout/modif
    window.reloadVoituresAngular = function() {
        $scope.loadVoitures();
        $scope.$applyAsync();
    };
}]);

// Contrôleur pour la page détail d'une voiture
App.controller('voitureDetailsController', ['$scope', '$http', function($scope, $http) {
    $scope.voiture = {};
    $scope.images = [];
    $scope.reservations = [];
    $scope.locations = [];
    $scope.selectedImageIndex = 0;
    $scope.categories = [];
    // Synchronise la catégorie de la voiture avec la liste des catégories
    function syncCategorie() {
        if ($scope.categories.length && $scope.voiture.categorie) {
            var cat = $scope.categories.find(function (c) { return String(c.id) === String($scope.voiture.categorie.id); });
            if (cat) $scope.voiture.categorie = cat;
        }
    }

    // Récupérer l'id de la voiture depuis le DOM
    var voitureId = document.getElementById('voitureId') ? document.getElementById('voitureId').value : null;

    // Charger les détails de la voiture
    $scope.loadVoiture = function() {
        if (!voitureId) return;
        $http.get('/api/voitures/' + voitureId).then(function(res) {
            $scope.voiture = res.data;
            $scope.images = res.data.images || [];
            if ($scope.voiture.image) {
                $scope.images.unshift({ url: $scope.voiture.image });
            }
            syncCategorie();
        });
    };

    // Charger les infos de réservation/location
    $scope.loadReservations = function() {
        if (!voitureId) return;
        $http.get('/api/voitures/' + voitureId + '/reservations').then(function(res) {
            $scope.reservations = res.data;
        });
        $http.get('/api/voitures/' + voitureId + '/locations').then(function(res) {
            $scope.locations = res.data;
        });
    };

    $scope.nextImage = function() {
        if ($scope.images.length > 0) {
            $scope.selectedImageIndex = ($scope.selectedImageIndex + 1) % $scope.images.length;
        }
    };
    $scope.prevImage = function() {
        if ($scope.images.length > 0) {
            $scope.selectedImageIndex = ($scope.selectedImageIndex - 1 + $scope.images.length) % $scope.images.length;
        }
    };

    $scope.setImage = function(idx) {
        $scope.selectedImageIndex = idx;
    };

    // Pour la modification (partie settings)
    $scope.updateVoiture = function() {
        // On prend les valeurs du formulaire (voitureForm) pour la modification
        var voitureData = {
            id: $scope.voitureForm.id,
            nom: $scope.voitureForm.nom,
            immatriculation: $scope.voitureForm.immatriculation,
            model: $scope.voitureForm.model,
            automatique: $scope.voitureForm.automatique,
            siege: $scope.voitureForm.siege,
            portiere: $scope.voitureForm.portiere,
            coffre: $scope.voitureForm.coffre,
            climatisation: $scope.voitureForm.climatisation,
            disponibilite: $scope.voitureForm.disponibilite,
            statut: $scope.voitureForm.statut,
            categorie: $scope.voitureForm.categorie,
            prix: $scope.voitureForm.prix,
            acompte: $scope.voitureForm.acompte
        };
        var fd = new FormData();
        fd.append('voiture', new Blob([JSON.stringify(voitureData)], {type: 'application/json'}));
        var imageFile = document.getElementById('voiture_image')?.files[0];
        if (imageFile) fd.append('image', imageFile);
        var imagesFiles = document.getElementById('voiture_images')?.files;
        if (imagesFiles) {
            for (let i = 0; i < imagesFiles.length; i++) {
                fd.append('images', imagesFiles[i]);
            }
        }
        $http({
            method: 'PUT',
            url: '/api/voitures/' + voitureId + '/with-files',
            data: fd,
            headers: { 'Content-Type': undefined },
            transformRequest: angular.identity
        }).then(function(res) {
            Swal.fire({ text: 'Voiture modifiée avec succès!', icon: 'success' });
            $scope.loadVoiture();
        }, function(err) {
            Swal.fire({ text: 'Erreur lors de la modification', icon: 'error' });
        });
    };

    // Initialisation
    // Charge les catégories puis synchronise la catégorie de la voiture
    $http.get('/api/categories').then(function(res) {
        $scope.categories = res.data;
        syncCategorie();
    });
    $scope.loadVoiture();
    $scope.loadReservations();
}]);

// --- Vanilla JS pour le modal, la validation et l'enregistrement ---
var KTVoituresAddVoiture = function () {
    const modalElement = document.getElementById("kt_modal_add_voiture"),
        formElement = modalElement.querySelector("#kt_modal_add_voiture_form"),
        modalInstance = new bootstrap.Modal(modalElement);

    return {
        init: function () {
            (() => {
                const validator = FormValidation.formValidation(formElement, {
                    fields: {
                        voiture_nom: {
                            validators: {
                                notEmpty: {
                                    message: "Le nom de la voiture est requis"
                                }
                            }
                        },
                        voiture_immatriculation: {
                            validators: {
                                notEmpty: {
                                    message: "L'immatriculation est requise"
                                }
                            }
                        },
                        voiture_siege: {
                            validators: {
                                notEmpty: {
                                    message: "Le nombre de sièges est requis"
                                }
                            }
                        },
                        voiture_model: {
                            validators: {
                                notEmpty: {
                                    message: "Le model est requis"
                                }
                            }
                        },
                        voiture_portiere: {
                            validators: {
                                notEmpty: {
                                    message: "Le nombre de portières est requis"
                                }
                            }
                        },
                        voiture_categorie: {
                            validators: {
                                notEmpty: {
                                    message: "La champ catégorie est requis"
                                }
                            }
                        },
                        voiture_type_coffre: {
                            validators: {
                                notEmpty: {
                                    message: "Choisissez un type de coffre"
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

                const submitButton = modalElement.querySelector('[data-kt-voiture-modal-action="submit"]');
                submitButton.addEventListener("click", (event) => {
                    event.preventDefault();

                    if (validator) {
                        validator.validate().then(function (status) {
                            if (status === 'Valid') {
                                submitButton.setAttribute("data-kt-indicator", "on");
                                submitButton.disabled = true;

                                // Construction de l'objet voitureData pour le backend
                                const scope = angular.element(formElement).scope();
                                const voitureForm = scope.voitureForm;
                                const voitureData = {
                                    nom: voitureForm.nom,
                                    immatriculation: voitureForm.immatriculation,
                                    model: voitureForm.model,
                                    automatique: voitureForm.automatique === 'true' || voitureForm.automatique === true,
                                    siege: voitureForm.siege,
                                    portiere: voitureForm.portiere,
                                    coffre: voitureForm.coffre,
                                    climatisation: voitureForm.climatisation === 'true' || voitureForm.climatisation === true,
                                    disponibilite: voitureForm.disponibilite || 'DISPONIBLE',
                                    statut: voitureForm.statut !== undefined ? voitureForm.statut : true,
                                    categorie: { id: voitureForm.categorie ? voitureForm.categorie.id : null },
                                    prix: voitureForm.prix,
                                    acompte: voitureForm.acompte
                                };

                                const id = formElement.querySelector("#voiture_id").value;
                                if (id) voitureData.id = id;

                                // Construction du FormData
                                var fd = new FormData();
                                fd.append('voiture', new Blob([JSON.stringify(voitureData)], {type: 'application/json'}));
                                const imageFile = formElement.querySelector("#voiture_image").files[0];
                                if (imageFile) fd.append('image', imageFile);
                                const imagesFiles = formElement.querySelector("#voiture_images").files;
                                for (let i = 0; i < imagesFiles.length; i++) {
                                    fd.append('images', imagesFiles[i]);
                                }


                                const requestMethod = id ? 'PUT' : 'POST';
                                const url = id ? "/api/voitures/" + id + "/with-files" : "/api/voitures/with-files";

                                fetch(url, {
                                    method: requestMethod,
                                    body: fd
                                })
                                .then(response => {
                                    if (!response.ok) {
                                        return response.json().then(error => {
                                            throw new Error(error.message || "Une erreur est survenue.");
                                        });
                                    }
                                    if (window.reloadVoituresAngular) window.reloadVoituresAngular();
                                    return response.json();
                                })
                                .then(data => {
                                    setTimeout(() => {
                                        submitButton.removeAttribute("data-kt-indicator");
                                        submitButton.disabled = false;
                                        Swal.fire({
                                            text: "Voiture enregistrée avec succès",
                                            icon: "success",
                                            confirmButtonText: "Ok, compris!",
                                            customClass: { confirmButton: "btn btn-primary" }
                                        }).then(() => modalInstance.hide());
                                    }, 1000);
                                })
                                .catch((error) => {
                                    submitButton.removeAttribute("data-kt-indicator");
                                    submitButton.disabled = false;
                                    Swal.fire({
                                        text: error.message || "Une erreur est survenue, veuillez réessayer.",
                                        icon: "error",
                                        confirmButtonText: "Ok, compris!",
                                        customClass: { confirmButton: "btn btn-primary" }
                                    });
                                });
                            } else {
                                Swal.fire({
                                    text: "Veuillez corriger les erreurs dans le formulaire.",
                                    icon: "error",
                                    confirmButtonText: "Ok, compris!",
                                    customClass: { confirmButton: "btn btn-primary" }
                                });
                            }
                        });
                    }
                });

                modalElement.querySelector('[data-kt-voiture-modal-action="cancel"]').addEventListener("click", (event) => {
                    event.preventDefault();
                    this.showCancelConfirmation();
                });

                modalElement.querySelector('[data-kt-voiture-modal-action="close"]').addEventListener("click", (event) => {
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
    KTVoituresAddVoiture.init();
});