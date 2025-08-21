"use strict";
 
var myApp = angular.module('myApp', []);

// Directive pour gérer les fichiers
myApp.directive('fileModel', function () {
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

myApp.controller('voituresController', ['$scope', '$http', function($scope, $http) {
    console.log('voituresController initialisé');
    const appUrl = '/api/voitures';
    $scope.listeVoitures = [];
    $scope.categories = [];
    $scope.selected = {};
    $scope.selectAll = false;
    $scope.voitureForm = {};
    $scope.searchVoiture = '';

    // Vérifier que SweetAlert2 est disponible
    if (typeof Swal === 'undefined') {
        console.error('SweetAlert2 n\'est pas chargé!');
    } else {
        console.log('SweetAlert2 est disponible');
    }

    $scope.loadVoitures = function() {
        console.log('Chargement des voitures...');
        $scope.loading = true;
        
        $http.get(appUrl).then(function(res) {
            console.log('Réponse API voitures:', res);
            $scope.listeVoitures = res.data;
            $scope.selected = {};
            $scope.selectAll = false;
            $scope.loading = false;
            console.log('Voitures chargées:', $scope.listeVoitures.length);
        }).catch(function(error) {
            console.error('Erreur lors du chargement des voitures:', error);
            $scope.loading = false;
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    text: "Erreur lors du chargement des voitures: " + (error.data?.message || error.statusText),
                    icon: "error",
                    confirmButtonText: "OK"
                });
            } else {
                alert("Erreur lors du chargement des voitures: " + (error.data?.message || error.statusText));
            }
        });
    };

    $scope.loadCategories = function() {
        $http.get('/api/categories').then(function(res) {
            $scope.categories = res.data;
            console.log('Catégories chargées:', $scope.categories.length);
        }).catch(function(error) {
            console.error('Erreur lors du chargement des catégories:', error);
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    text: "Erreur lors du chargement des catégories",
                    icon: "error",
                    confirmButtonText: "OK"
                });
            } else {
                alert("Erreur lors du chargement des catégories");
            }
        });
    };

    // Initialisation
    $scope.loadVoitures();
    $scope.loadCategories();

    $scope.toggleAll = function() {
        console.log('toggleAll called');
        angular.forEach($scope.listeVoitures, function(voiture) {
            $scope.selected[voiture.id] = $scope.selectAll;
        });
    };

    $scope.updateSelectAll = function() {
        console.log('updateSelectAll called');
        var allSelected = true;
        angular.forEach($scope.listeVoitures, function(voiture) {
            if (!$scope.selected[voiture.id]) allSelected = false;
        });
        $scope.selectAll = allSelected;
    };

    $scope.openModal = function(voiture) {
        console.log('openModal called with:', voiture);
        
        // Vérifier si Bootstrap est disponible
        if (typeof bootstrap === 'undefined') {
            console.error('Bootstrap is not loaded!');
            alert('Bootstrap is not loaded!');
            return;
        }
        
        // Changer le titre du modal
        const modalTitle = document.getElementById('modal_title');
        if (modalTitle) {
            if (voiture) {
                modalTitle.textContent = 'Modifier la voiture';
            } else {
                modalTitle.textContent = 'Nouvelle voiture';
            }
        } else {
            console.error('Modal title element not found');
        }
        
        if (voiture) {
            $scope.voitureForm = angular.copy(voiture);
            if (voiture.categorie && $scope.categories.length > 0) {
                $scope.voitureForm.categorie = $scope.categories.find(cat => String(cat.id) === String(voiture.categorie.id));
            }
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
                categorie: $scope.categories.length > 0 ? $scope.categories[0] : null,
                imageFile: null,
                imagesFiles: []
            };
        }
        
        // Forcer la mise à jour de la vue
        if (!$scope.$$phase) {
            $scope.$apply();
        }
        
        // Attendre un peu que le DOM soit mis à jour
        setTimeout(function() {
            // Ouvrir le modal
            const modalElement = document.getElementById('kt_modal_add_voiture');
            if (modalElement) {
                console.log('Modal element found, opening...');
                try {
                    const modal = new bootstrap.Modal(modalElement);
                    modal.show();
                    console.log('Modal opened successfully');
                } catch (error) {
                    console.error('Error opening modal:', error);
                    // Essayer avec jQuery si disponible
                    if (typeof $ !== 'undefined') {
                        $(modalElement).modal('show');
                        console.log('Modal opened with jQuery');
                    } else {
                        alert('Erreur lors de l\'ouverture du modal');
                    }
                }
            } else {
                console.error('Modal element not found: kt_modal_add_voiture');
                // Essayer de trouver tous les modals
                const allModals = document.querySelectorAll('.modal');
                console.log('Available modals:', allModals.length);
                allModals.forEach(function(modal, index) {
                    console.log('Modal', index, ':', modal.id);
                });
                alert('Modal non trouvé. Vérifiez la console pour plus de détails.');
            }
        }, 100);
    };

    // Fonction pour valider le formulaire
    $scope.validateForm = function() {
        const form = $scope.voitureForm;
        
        if (!form.nom || form.nom.trim() === '') {
            Swal.fire({
                text: "Le nom de la voiture est requis",
                icon: "error",
                confirmButtonText: "OK"
            });
            return false;
        }
        
        if (!form.immatriculation || form.immatriculation.trim() === '') {
            Swal.fire({
                text: "L'immatriculation est requise",
                icon: "error",
                confirmButtonText: "OK"
            });
            return false;
        }
        
        if (!form.model || form.model.trim() === '') {
            Swal.fire({
                text: "Le modèle est requis",
                icon: "error",
                confirmButtonText: "OK"
            });
            return false;
        }
        
        if (!form.categorie) {
            Swal.fire({
                text: "La catégorie est requise",
                icon: "error",
                confirmButtonText: "OK"
            });
            return false;
        }
        
        if (!form.siege || form.siege < 1 || form.siege > 20) {
            Swal.fire({
                text: "Le nombre de sièges doit être entre 1 et 20",
                icon: "error",
                confirmButtonText: "OK"
            });
            return false;
        }
        
        if (!form.portiere || form.portiere < 2 || form.portiere > 8) {
            Swal.fire({
                text: "Le nombre de portières doit être entre 2 et 8",
                icon: "error",
                confirmButtonText: "OK"
            });
            return false;
        }
        
        if (!form.coffre) {
            Swal.fire({
                text: "Le type de coffre est requis",
                icon: "error",
                confirmButtonText: "OK"
            });
            return false;
        }
        
        if (!form.disponibilite) {
            Swal.fire({
                text: "La disponibilité est requise",
                icon: "error",
                confirmButtonText: "OK"
            });
            return false;
        }
        
        return true;
    };

    // Fonction pour créer une voiture
    $scope.createVoiture = function() {
        console.log('createVoiture called');
        if (!$scope.validateForm()) {
            return;
        }
        const voitureData = {
            nom: $scope.voitureForm.nom,
            immatriculation: $scope.voitureForm.immatriculation,
            model: $scope.voitureForm.model,
            automatique: $scope.voitureForm.automatique || false,
            siege: $scope.voitureForm.siege,
            portiere: $scope.voitureForm.portiere,
            coffre: $scope.voitureForm.coffre,
            climatisation: $scope.voitureForm.climatisation || false,
            disponibilite: $scope.voitureForm.disponibilite,
            statut: $scope.voitureForm.statut !== undefined ? $scope.voitureForm.statut : true,
            categorie: { id: $scope.voitureForm.categorie ? $scope.voitureForm.categorie.id : null },
            prix: $scope.voitureForm.prix,
            acompte: $scope.voitureForm.acompte
        };
        // Construction du FormData
        var fd = new FormData();
        fd.append('voiture', new Blob([JSON.stringify(voitureData)], {type: 'application/json'}));
        // Récupérer les fichiers depuis le DOM
        var imageFile = document.getElementById('voiture_image').files[0];
        if (imageFile) fd.append('image', imageFile);
        var imagesFiles = document.getElementById('voiture_images').files;
        for (let i = 0; i < imagesFiles.length; i++) {
            fd.append('images', imagesFiles[i]);
        }
        fetch('/api/voitures/with-files', {
            method: 'POST',
            body: fd
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => { throw new Error(error.message || "Une erreur est survenue."); });
            }
            $scope.loadVoitures();
            $scope.closeModal();
            Swal.fire({
                text: "Voiture créée avec succès!",
                icon: "success",
                confirmButtonText: "OK"
            });
        })
        .catch(function(error) {
            console.error('Error creating voiture:', error);
            Swal.fire({
                text: error.message || "Erreur lors de la création de la voiture",
                icon: "error",
                confirmButtonText: "OK"
            });
        });
    };

    // Fonction pour mettre à jour une voiture
    $scope.updateVoiture = function() {
        console.log('updateVoiture called');
        if (!$scope.validateForm()) {
            return;
        }
        const voitureData = {
            id: $scope.voitureForm.id,
            nom: $scope.voitureForm.nom,
            immatriculation: $scope.voitureForm.immatriculation,
            model: $scope.voitureForm.model,
            automatique: $scope.voitureForm.automatique || false,
            siege: $scope.voitureForm.siege,
            portiere: $scope.voitureForm.portiere,
            coffre: $scope.voitureForm.coffre,
            climatisation: $scope.voitureForm.climatisation || false,
            disponibilite: $scope.voitureForm.disponibilite,
            statut: $scope.voitureForm.statut !== undefined ? $scope.voitureForm.statut : true,
            categorie: { id: $scope.voitureForm.categorie ? $scope.voitureForm.categorie.id : null },
            prix: $scope.voitureForm.prix,
            acompte: $scope.voitureForm.acompte
        };
        // Construction du FormData
        var fd = new FormData();
        fd.append('voiture', new Blob([JSON.stringify(voitureData)], {type: 'application/json'}));
        // Récupérer les fichiers depuis le DOM
        var imageFile = document.getElementById('voiture_image').files[0];
        if (imageFile) fd.append('image', imageFile);
        var imagesFiles = document.getElementById('voiture_images').files;
        for (let i = 0; i < imagesFiles.length; i++) {
            fd.append('images', imagesFiles[i]);
        }
        fetch('/api/voitures/' + $scope.voitureForm.id + '/with-files', {
            method: 'PUT',
            body: fd
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => { throw new Error(error.message || "Une erreur est survenue."); });
            }
            $scope.loadVoitures();
            $scope.closeModal();
            Swal.fire({
                text: "Voiture mise à jour avec succès!",
                icon: "success",
                confirmButtonText: "OK"
            });
        })
        .catch(function(error) {
            console.error('Error updating voiture:', error);
            Swal.fire({
                text: error.message || "Erreur lors de la mise à jour de la voiture",
                icon: "error",
                confirmButtonText: "OK"
            });
        });
    };

    // Fonction pour soumettre le formulaire (création ou mise à jour)
    $scope.submitVoitureForm = function() {
        console.log('submitVoitureForm called');
        
        if ($scope.voitureForm.id) {
            // Mode édition
            $scope.updateVoiture();
        } else {
            // Mode création
            $scope.createVoiture();
        }
    };

    $scope.closeModal = function() {
        console.log('closeModal called');
        const modalElement = document.getElementById('kt_modal_add_voiture');
        if (modalElement) {
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) {
                modal.hide();
                console.log('Modal closed successfully');
            } else {
                console.error('Modal instance not found');
            }
        } else {
            console.error('Modal element not found for closing');
        }
    };

    // Fonction pour éditer une voiture
    $scope.editVoiture = function(voiture) {
        console.log('editVoiture called with:', voiture);
        $scope.openModal(voiture);
    };

    $scope.deleteVoiture = function(id) {
        console.log('deleteVoiture called with id:', id);
        
        const confirmDelete = function() {
            if (typeof Swal !== 'undefined') {
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
                        performDelete(id);
                    }
                });
            } else {
                if (confirm("Êtes-vous sûr de vouloir supprimer cette voiture?")) {
                    performDelete(id);
                }
            }
        };
        
        const performDelete = function(id) {
            $http.delete(appUrl + '/' + id).then(function() {
                $scope.loadVoitures();
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        text: "Voiture supprimée avec succès!",
                        icon: "success",
                        confirmButtonText: "D'accord, compris!",
                        customClass: { confirmButton: "btn btn-primary" }
                    });
                } else {
                    alert("Voiture supprimée avec succès!");
                }
            }).catch(function(error) {
                console.error("ERREUR LORS DE LA SUPPRESSION : ", error);
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        text: "Erreur lors de la suppression de la voiture.",
                        icon: "error",
                        confirmButtonText: "D'accord, compris!",
                        customClass: { confirmButton: "btn btn-primary" }
                    });
                } else {
                    alert("Erreur lors de la suppression de la voiture.");
                }
            });
        };
        
        confirmDelete();
    };

    $scope.toggleStatut = function(voiture) {
        console.log('toggleStatut called with:', voiture);
        const newStatus = !voiture.statut;
        const action = newStatus ? 'activer' : 'désactiver';
        
        const confirmToggle = function() {
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    title: 'Confirmation',
                    text: `Êtes-vous sûr de vouloir ${action} cette voiture ?`,
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
                        performToggle(voiture, newStatus, action);
                    }
                });
            } else {
                if (confirm(`Êtes-vous sûr de vouloir ${action} cette voiture ?`)) {
                    performToggle(voiture, newStatus, action);
                }
            }
        };
        
        const performToggle = function(voiture, newStatus, action) {
            const updateData = {
                id: voiture.id,
                nom: voiture.nom,
                immatriculation: voiture.immatriculation,
                model: voiture.model,
                automatique: voiture.automatique,
                siege: voiture.siege,
                portiere: voiture.portiere,
                coffre: voiture.coffre,
                climatisation: voiture.climatisation,
                disponibilite: voiture.disponibilite,
                statut: newStatus,
                categorie: voiture.categorie
            };
            
            $http.put(appUrl + '/' + voiture.id, updateData).then(function() {
                $scope.loadVoitures();
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        text: `Voiture ${action === 'activer' ? 'activée' : 'désactivée'} avec succès!`,
                        icon: "success",
                        confirmButtonText: "D'accord, compris!",
                        customClass: { confirmButton: "btn btn-primary" }
                    });
                } else {
                    alert(`Voiture ${action === 'activer' ? 'activée' : 'désactivée'} avec succès!`);
                }
            }).catch(function(error) {
                console.error("ERREUR LORS DE LA MODIFICATION DU STATUT : ", error);
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        text: "Erreur lors de la modification du statut de la voiture.",
                        icon: "error",
                        confirmButtonText: "D'accord, compris!",
                        customClass: { confirmButton: "btn btn-primary" }
                    });
                } else {
                    alert("Erreur lors de la modification du statut de la voiture.");
                }
            });
        };
        
        confirmToggle();
    };

    // Fonction pour formater la disponibilité
    $scope.formatDisponibilite = function(disponibilite) {
        switch(disponibilite) {
            case 'DISPONIBLE': return 'Disponible';
            case 'LOUE': return 'Loué';
            case 'REPARATION': return 'En réparation';
            default: return 'Non défini';
        }
    };

    // Fonction pour obtenir la classe CSS de la disponibilité
    $scope.getDisponibiliteClass = function(disponibilite) {
        switch(disponibilite) {
            case 'DISPONIBLE': return 'badge-success';
            case 'LOUE': return 'badge-warning';
            case 'REPARATION': return 'badge-danger';
            default: return 'badge-secondary';
        }
    };

    // Fonction pour formater le type de coffre
    $scope.formatCoffre = function(coffre) {
        switch(coffre) {
            case 'PETIT': return 'Petit';
            case 'MOYEN': return 'Moyen';
            case 'GRAND': return 'Grand';
            default: return 'Non spécifié';
        }
    };

    // Fonction pour rafraîchir les données
    $scope.refreshData = function() {
        $scope.loadVoitures();
        $scope.loadCategories();
    };

    // Fonction pour exporter les données (placeholder)
    $scope.exportVoitures = function() {
        Swal.fire({
            title: 'Export',
            text: 'Fonctionnalité d\'export à implémenter',
            icon: 'info',
            confirmButtonText: 'OK'
        });
    };

    // Fonction pour importer les données (placeholder)
    $scope.importVoitures = function() {
        Swal.fire({
            title: 'Import',
            text: 'Fonctionnalité d\'import à implémenter',
            icon: 'info',
            confirmButtonText: 'OK'
        });
    };

    // Pour que KTVoituresAddVoiture puisse recharger la liste après ajout/modif
    window.reloadVoituresAngular = function() {
        $scope.loadVoitures();
        $scope.$applyAsync();
    };
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
                                    categorie: { id: voitureForm.categorie ? voitureForm.categorie.id : null }
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
                                const url = id ? "/api/voitures/" + id : "/api/voitures";

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
                                        alert("Annulation de l'action en cours. Le formulaire sera réinitialisé.");

                    event.preventDefault();
                    // Afficher la confirmation d'annulation
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