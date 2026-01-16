"use strict";
var KTvoinuresAddvoiture = function () {
    const modalElement = document.getElementById("kt_modal_add_voiture"),
        formElement = modalElement.querySelector("#kt_modal_add_voiture_form"),
        modalInstance = new bootstrap.Modal(modalElement);

    return {
        init: function () {
            (() => {
                // Validation
                const validator = FormValidation.formValidation(formElement, {
                    fields: {
                        voiture_nom: { validators: { notEmpty: { message: "Le nom de la voiture est requis" } } },
                        voiture_immatriculation: { validators: { notEmpty: { message: "L'immatriculation est requise" } } },
                        voiture_prix: { validators: { notEmpty: { message: "Le prix est requis" } } },
                        voiture_modeleId: { validators: { notEmpty: { message: "Le modèle est requis" } } },
                        voiture_siege: { validators: { notEmpty: { message: "Le siège est requis" } } },
                        voiture_coffre: { validators: { notEmpty: { message: "Le coffre est requis" } } },
                        voiture_nombrePlaces: { validators: { notEmpty: { message: "Le nombre de place est requis" } } },
                        // voiture_image: { validators: { notEmpty: { message: "L'image principale est requise" } } }
                    },
                    plugins: {
                        trigger: new FormValidation.plugins.Trigger(),
                        bootstrap: new FormValidation.plugins.Bootstrap5({
                            rowSelector: ".fv-row"
                        })
                    }
                });

                // Submit button
                const submitButton = modalElement.querySelector('[data-kt-voitures-modal-action="submit"]');
                submitButton.addEventListener("click", (event) => {
                    event.preventDefault();

                    validator.validate().then(function (status) {
                        if (status !== "Valid") {
                            Swal.fire({
                                text: "Des erreurs sont présentes, veuillez vérifier.",
                                icon: "error",
                                confirmButtonText: "Ok",
                                buttonsStyling: false,
                                customClass: { confirmButton: "btn btn-primary" }
                            });
                            return;
                        }

                        submitButton.setAttribute("data-kt-indicator", "on");
                        submitButton.disabled = true;

                        // Construction du FormData
                        const formData = new FormData();
                        const id = formElement.querySelector("#voiture_id").value;

                        // Construction de l'objet JSON pour le DTO
                        const voitureDto = {
                            nom: formElement.querySelector("#voiture_nom").value,
                            immatriculation: formElement.querySelector("#voiture_immatriculation").value,
                            automatique: formElement.querySelector("#voiture_automatique").checked,
                            siege: formElement.querySelector("#voiture_siege").value,
                            portiere: formElement.querySelector("#voiture_portiere").value,
                            coffre: formElement.querySelector("#voiture_coffre").value,
                            climatisation: formElement.querySelector("#voiture_climatisation").checked,
                            disponibilite: formElement.querySelector("#voiture_disponibilite").value,
                            prix: formElement.querySelector("#voiture_prix").value,
                            acompte: formElement.querySelector("#voiture_acompte").value,
                            modeleId: formElement.querySelector("#voiture_modeleId").value,
                            numeroCarteGrise: formElement.querySelector("#voiture_numeroCarteGrise").value,
                            numeroSerieVin: formElement.querySelector("#voiture_numeroSerieVin").value,
                            datePremiereMiseEnCirculation: formElement.querySelector("#voiture_datePremiereMiseEnCirculation").value,
                            genreNational: formElement.querySelector("#voiture_genreNational").value,
                            couleur: formElement.querySelector("#voiture_couleur").value,
                            poidsVide: formElement.querySelector("#voiture_poidsVide").value,
                            poidsTotalAutorise: formElement.querySelector("#voiture_poidsTotalAutorise").value,
                            nombrePlaces: formElement.querySelector("#voiture_nombrePlaces").value,
                            proprietaire: formElement.querySelector("#voiture_proprietaire").value,
                            adresseProprietaire: formElement.querySelector("#voiture_adresseProprietaire").value,
                            dateDelivranceCarteGrise: formElement.querySelector("#voiture_dateDelivranceCarteGrise").value,
                            centreImmatriculation: formElement.querySelector("#voiture_centreImmatriculation").value,
                            statut: true
                        };

                        // Ajout du DTO dans FormData
                        formData.append("voiture", new Blob([JSON.stringify(voitureDto)], { type: "application/json" }));

                        // Ajout des fichiers
                        const mainImage = formElement.querySelector("#voiture_image").files[0];
                        if (mainImage) formData.append('image', mainImage);

                        const additionalImages = formElement.querySelector("#voiture_images").files;
                        for (let i = 0; i < additionalImages.length; i++) {
                            formData.append('images', additionalImages[i]);
                        }

                        // URL et méthode
                        const requestMethod = id ? "PUT" : "POST";
                        const url = id ? `api/voitures/${id}` : "api/voitures";
                        console.log("Envoi vers l'URL :", url);
                        console.log("Données envoyées :", voitureDto);
                        
                        fetch(url, {
                            method: requestMethod,
                            body: formData  // important
                        })
                        .then(response => {
                            if (!response.ok)
                                return response.json().then(err => { throw new Error(err.message || "Erreur serveur"); });
                            return response.json();
                        })
                        .then(data => {
                            submitButton.removeAttribute("data-kt-indicator");
                            submitButton.disabled = false;

                            Swal.fire({
                                text: "Voiture enregistrée avec succès",
                                icon: "success",
                                confirmButtonText: "Ok",
                                buttonsStyling: false,
                                customClass: { confirmButton: "btn btn-primary" }
                            }).then(() => modalInstance.hide());

                            angular.element(document.querySelector('[ng-controller="voituresController"]')).scope().loadvoitures();
                        })
                        .catch(error => {
                            submitButton.removeAttribute("data-kt-indicator");
                            submitButton.disabled = false;

                            Swal.fire({
                                text: error.message,
                                icon: "error",
                                confirmButtonText: "Ok",
                                buttonsStyling: false,
                                customClass: { confirmButton: "btn btn-primary" }
                            });
                        });
                    });
                });

                // Cancel
                modalElement.querySelector('[data-kt-voitures-modal-action="cancel"]').addEventListener("click", (e) => {
                    e.preventDefault();
                    KTvoinuresAddvoiture.showCancelConfirmation();
                });

                // Close
                modalElement.querySelector('[data-kt-voitures-modal-action="close"]').addEventListener("click", (e) => {
                    e.preventDefault();
                    KTvoinuresAddvoiture.showCancelConfirmation();
                });

            })();
        },

        showCancelConfirmation: function () {
            Swal.fire({
                text: "Êtes-vous sûr de vouloir annuler ?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Oui",
                cancelButtonText: "Non",
                buttonsStyling: false,
                customClass: {
                    confirmButton: "btn btn-primary",
                    cancelButton: "btn btn-active-light"
                }
            }).then((result) => {
                if (result.value) {
                    formElement.reset();
                    modalInstance.hide();
                }
            });
        }
    };
}();

KTUtil.onDOMContentLoaded(function () {
    KTvoinuresAddvoiture.init();
});



var App = angular.module('myApp', []);

App.controller('voituresController', ['$scope', '$http', function($scope, $http) {
    // URLs pour les opérations CRUD sur les voitures
    const appUrl = 'api/voitures';
    const urlLoadvoitures = appUrl;
    const urlLoadmodeles = 'api/modeles';
    const urlCreatevoiture = appUrl;
    const urlUpdatevoiture = appUrl ;
    const urlDeletevoiture = appUrl;
    const disableUrl = appUrl + "/disable";

    // Initialisation des variables
    $scope.listevoitures = [];
    $scope.listemodeles = [];
    $scope.voitureDto = {
        id: null,
        nom: null,
        immatriculation: null,
        automatique: true,
        siege: null,
        portiere: null,
        coffre: null,
        climatisation: true,
        disponibilite: "disponible",
        prix: null,
        acompte: null,
        modeleId: null,
        modele: null,
        image: null,
        numeroCarteGrise: null,
        numeroSerieVin: null,
        datePremiereMiseEnCirculation: null,
        genreNational: null,
        couleur: null,
        poidsVide: null,
        poidsTotalAutorise: null,
        nombrePlaces: null,
        proprietaire: null,
        adresseProprietaire: null,
        dateDelivranceCarteGrise: null,
        centreImmatriculation: null,
        statut: true
    };
    $scope.voitureMasterDTO = angular.copy($scope.voitureDto);

    // Fonction pour charger la liste des voitures 
    $scope.loadvoitures = function () {
        $http.get(urlLoadvoitures)
            .then(function (res) {
                $scope.listevoitures = res.data;
                
                console.log("LISTE DES VOITURES : ", $scope.listevoitures);
            })
            .catch(function (error) {
                console.error("ERREUR DE RECUPERATION DES VOITURES : ", error);
            });
    };

    // Chargement des voitures au chargement de la page
    $scope.loadvoitures();
     $scope.loadmodeles = function () {
        $http.get(urlLoadmodeles)
            .then(function (res) {
                $scope.listemodeles = res.data;
                console.log("LISTE DES MODELES : ", $scope.listemodeles);
            })
            .catch(function (error) {
                console.error("ERREUR DE RECUPERATION DES MODELES : ", error);
            });
    };

    // Chargement des voitures au chargement de la page
    $scope.loadmodeles();

    // Fonction pour créer une voiture
    $scope.createvoiture = function () {
        const voitureJson = angular.toJson($scope.voitureMasterDTO);

        $http.post(urlCreatevoiture, voitureJson)
            .then(function (res) {
                console.log("VOITURE CREE : ", res.data);
                $scope.loadvoitures();
                $scope.resetvoitureForm();
                $scope.modalHide();
                $scope.successSwal("Voiture ajoutée avec succès.");
            })
            .catch(function (error) {
                console.error("ERREUR DE CREATION DE LA VOITURE : ", error);
                $scope.errorSwal("Erreur lors de la création de la voiture.");
            });
    };

    // Fonction pour mettre à jour une voiture
    $scope.updatevoiture = function () {
        $http.put(urlUpdatevoiture + '/' + $scope.voitureMasterDTO.id, $scope.voitureMasterDTO)
            .then(function (res) {
                console.log("VOITURE MISE A JOUR : ", res.data);
                $scope.loadvoitures();
                $scope.resetvoitureForm();
                $scope.successSwal("Voiture modifiée avec succès.");
            })
            .catch(function (error) {
                console.error("ERREUR DE MISE A JOUR DE LA VOITURE : ", error);
                $scope.errorSwal("Erreur lors de la mise à jour de la voiture.");
            });
    };

    // Fonction pour supprimer une voiture
    $scope.deletevoiture = function (id) {
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
                // Appel à l'API pour supprimer la voiture
                $http.delete(appUrl + '/' + id)
                    .then(function (res) {
                        Swal.fire({
                            text: "La voiture a été supprimée avec succès!",
                            icon: "success",
                            confirmButtonText: "D'accord, compris!",
                            customClass: {
                                confirmButton: "btn btn-primary"
                            }
                        });
                        $scope.loadvoitures();
                    })
                    .catch(function (error) {
                        Swal.fire({
                            text: "Erreur lors de la suppression de la voiture : " + (error.message || "Une erreur est survenue."),
                            icon: "error",
                            confirmButtonText: "D'accord, compris!",
                            customClass: {
                                confirmButton: "btn btn-primary"
                            }
                        }); 
                    });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    text: "La voiture n'a pas été supprimée!",
                    icon: "info",
                    confirmButtonText: "D'accord, compris!",
                    customClass: {
                        confirmButton: "btn btn-primary"
                    }
                });
            }
        });
    };

   // Fonction pour trouver une voiture par son ID
$scope.findvoitureById = function (id) {
    $http.get(appUrl + '/' + id)
        .then(function (res) {
            console.log("VOITURE TROUVÉE :", res.data);

            $scope.voitureDto = res.data;

            // Sécurisation des dates (évite les erreurs si null)
            $scope.voitureDto.datePremiereMiseEnCirculation =
                res.data.datePremiereMiseEnCirculation
                    ? new Date(res.data.datePremiereMiseEnCirculation)
                    : null;

            $scope.voitureDto.dateDelivranceCarteGrise =
                res.data.dateDelivranceCarteGrise
                    ? new Date(res.data.dateDelivranceCarteGrise)
                    : null;

            $scope.modalShow();
        })
        .catch(function (error) {
            console.error("ERREUR DE RECHERCHE DE LA VOITURE :", error);
            $scope.errorSwal("Erreur lors de la recherche de la voiture.");
        });
};


    // Fonction pour désactiver une voiture
    $scope.disablevoiture = function (id) {
        $http.put(disableUrl + '/' + id)
            .then(function (res) {
                console.log("VOITURE DESACTIVEE : ", res.data);
                $scope.loadvoitures();
            })
            .catch(function (error) {
                console.error("ERREUR DE DESACTIVATION DE LA VOITURE : ", error);
                $scope.errorSwal("Erreur lors de la désactivation de la voiture.");
            });
    };

    // Fonction pour réinitialiser le formulaire
    $scope.resetvoitureForm = function() {
        $scope.voitureMasterDTO = angular.copy($scope.voitureDto);
    };

    // Validation des données avant enregistrement
    $scope.valider = function () {
        if (!$scope.voitureMasterDTO.nom) {
            console.log("Veuillez remplir le nom de la voiture.");
            $scope.errorSwal("Veuillez remplir le nom de la voiture!");
            return;
        }

        if (!$scope.voitureMasterDTO.immatriculation) {
            console.log("Veuillez remplir l'immatriculation.");
            $scope.errorSwal("Veuillez remplir l'immatriculation!");
            return;
        }

        if (!$scope.voitureMasterDTO.prix) {
            console.log("Veuillez remplir le prix.");
            $scope.errorSwal("Veuillez remplir le prix!");
            return;
        }

        if ($scope.voitureMasterDTO.id) {
            $scope.updatevoiture();
        } else {
            $scope.createvoiture();
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
        $('#kt_modal_add_voiture').modal('show');
    };
    $scope.modalHide = function() {
        $('#kt_modal_add_voiture').modal('hide');
    };
}]);