"use strict";

var App = angular.module("myApp", []);

// Directive pour gérer les fichiers
App.directive("fileModel", function () {
  return {
    scope: {
      fileModel: "=",
    },
    link: function (scope, element, attrs) {
      element.bind("change", function () {
        scope.$apply(function () {
          if (attrs.multiple) {
            scope.fileModel = element[0].files;
          } else {
            scope.fileModel = element[0].files[0];
          }
        });
      });
    },
  };
});

// Contrôleur pour la page détail d'une voiture
App.controller("voitureDetailsController", [
  "$scope",
  "$http",
  function ($scope, $http) {
    $scope.voiture = {};
    $scope.images = [];
    $scope.reservations = [];
    $scope.locations = [];
    $scope.selectedImageIndex = 0;
    $scope.categories = [];
    $scope.urlLoadmodeles = "/api/modeles";

    // Synchronise la catégorie de la voiture avec la liste des catégories
    function syncCategorie() {
      if ($scope.categories.length && $scope.voiture.categorie) {
        var cat = $scope.categories.find(function (c) {
          return String(c.id) === String($scope.voiture.categorie.id);
        });
        if (cat) $scope.voiture.categorie = cat;
      }
    }

    // Récupérer l'id de la voiture depuis le DOM
    var voitureId = document.getElementById("voitureId")
      ? document.getElementById("voitureId").value
      : null;

    // Charger les détails de la voiture
    $scope.loadVoiture = function () {
      if (!voitureId) return;
      $http.get("/api/voitures/" + voitureId).then(function (res) {
        $scope.voiture = res.data;
        $scope.voiture.datePremiereMiseEnCirculation = new Date(
          res.data.datePremiereMiseEnCirculation
        );
        $scope.voiture.dateDelivranceCarteGrise = new Date(
          res.data.dateDelivranceCarteGrise
        );

        $scope.images = res.data.images || [];
        if ($scope.voiture.image) {
          $scope.images.unshift({ url: $scope.voiture.image });
        }
        syncCategorie();
      });
    };

    $scope.loadmodeles = function () {
      $http
        .get($scope.urlLoadmodeles)
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

    $scope.nextImage = function () {
      if ($scope.images.length > 0) {
        $scope.selectedImageIndex =
          ($scope.selectedImageIndex + 1) % $scope.images.length;
      }
    };
    $scope.prevImage = function () {
      if ($scope.images.length > 0) {
        $scope.selectedImageIndex =
          ($scope.selectedImageIndex - 1 + $scope.images.length) %
          $scope.images.length;
      }
    };

    $scope.setImage = function (idx) {
      $scope.selectedImageIndex = idx;
    };

    $scope.updateVoiture = function () {
      if (!voitureId) return;

      // Construction du DTO depuis $scope.voiture
      var voitureData = {
        id: $scope.voiture.id,
        nom: $scope.voiture.nom,
        immatriculation: $scope.voiture.immatriculation,
        modeleId: $scope.voiture.modeleId,
        automatique: $scope.voiture.automatique,
        siege: $scope.voiture.siege,
        portiere: $scope.voiture.portiere,
        coffre: $scope.voiture.coffre,
        climatisation: $scope.voiture.climatisation,
        disponibilite: $scope.voiture.disponibilite,
        statut: $scope.voiture.statut,
        prix: $scope.voiture.prix,
        acompte: $scope.voiture.acompte,
        numeroCarteGrise: $scope.voiture.numeroCarteGrise,
        numeroSerieVin: $scope.voiture.numeroSerieVin,
        datePremiereMiseEnCirculation:
          $scope.voiture.datePremiereMiseEnCirculation,
        dateDelivranceCarteGrise: $scope.voiture.dateDelivranceCarteGrise,
        genreNational: $scope.voiture.genreNational,
        couleur: $scope.voiture.couleur,
        poidsVide: $scope.voiture.poidsVide,
        poidsTotalAutorise: $scope.voiture.poidsTotalAutorise,
        nombrePlaces: $scope.voiture.nombrePlaces,
        proprietaire: $scope.voiture.proprietaire,
        adresseProprietaire: $scope.voiture.adresseProprietaire,
        centreImmatriculation: $scope.voiture.centreImmatriculation,
      };

      // Construction du FormData
      var fd = new FormData();
      fd.append(
        "voiture",
        new Blob([JSON.stringify(voitureData)], { type: "application/json" })
      );

      // Ajout de l'image principale
      var imageFile = document.getElementById("voiture_image")?.files[0];
      if (imageFile) fd.append("image", imageFile);

      // Ajout des images supplémentaires
      var imagesFiles = document.getElementById("voiture_images")?.files;
      if (imagesFiles) {
        for (let i = 0; i < imagesFiles.length; i++) {
          fd.append("images", imagesFiles[i]);
        }
      }

      // Envoi PUT vers le backend
      $http({
        method: "PUT",
        url: "/api/voitures/" + voitureId,
        data: fd,
        headers: { "Content-Type": undefined },
        transformRequest: angular.identity,
      }).then(
        function (res) {
          Swal.fire({ text: "Voiture modifiée avec succès!", icon: "success" });
          $scope.loadVoiture(); // recharge les données pour mettre à jour le formulaire
        },
        function (err) {
          Swal.fire({ text: "Erreur lors de la modification", icon: "error" });
        }
      );
    };

    // Initialisation
    // Charge les catégories puis synchronise la catégorie de la voiture
    $http.get("/api/categories").then(function (res) {
      $scope.categories = res.data;
      syncCategorie();
    });
    $scope.loadVoiture();

    // --- Gestion des assurances ---
    $scope.listeAssurances = [];
    $scope.assuranceEncours = null;
    $scope.assuranceDto = {
      id: null,
      compagnie: "",
      numeroPolice: "",
      type: "",
      montant: null,
      dateDebut: null,
      dateFin: null,
      document: "",
      voitureId: voitureId,
    };
    $scope.selectedFile = null;

    // --- Chargement de la liste ---
    $scope.loadAssurances = function () {
      $http
        .get("/api/assurances/voiture/" + voitureId)
        .then(function (res) {
          $scope.listeAssurances = res.data;
          $scope.assuranceEncours = res.data.sort(
            (a, b) => new Date(b.dateDebut) - new Date(a.dateDebut)
          )[0];
        })
        .catch(function () {
          Swal.fire({
            text: "Erreur de chargement des assurances",
            icon: "error",
          });
        });
    };
    $scope.loadAssurances();

    // // --- Ouvrir le modal en mode création ---
    $scope.openAddModal = function () {
      $scope.assuranceDto = {};
      $scope.selectedFile = null;
    };

    // --- Ouvrir en mode édition ---
    $scope.editAssurance = function (id) {
      $http
        .get("/api/assurances/" + id)
        .then(function (res) {
          $scope.assuranceDto = res.data;
          $scope.assuranceDto.dateDebut = new Date(res.data.dateDebut);
          $scope.assuranceDto.dateFin = new Date(res.data.dateFin);
          $scope.selectedFile = null;

          $scope.modalShow();
        })
        .catch(function () {
          Swal.fire({
            text: "Impossible de charger l'assurance",
            icon: "error",
          });
        });
    };

    // --- Ajouter ou modifier ---
    $scope.saveAssurance = function () {
      if ($scope.valider()) {
        let formData = new FormData();
        formData.append(
          "assurance",
          new Blob([JSON.stringify($scope.assuranceDto)], {
            type: "application/json",
          })
        );

        if ($scope.selectedFile) {
          formData.append("file", $scope.selectedFile);
        }

        let isEdit = !!$scope.assuranceDto.id;
        let url = isEdit
          ? "/api/assurances/" + $scope.assuranceDto.id
          : "/api/assurances";
        let method = isEdit ? "PUT" : "POST";

        $http({
          method: method,
          url: url,
          data: formData,
          headers: { "Content-Type": undefined },
          transformRequest: angular.identity,
        })
          .then(function () {
            Swal.fire({
              text: isEdit ? "Assurance modifiée" : "Assurance ajoutée",
              icon: "success",
            });

            $scope.loadAssurances();
            $scope.modalHide();
          })
          .catch(function () {
            Swal.fire({
              text: "Une erreur est survenue, veuillez réessayer",
              icon: "error",
            });
          });
      }
    };
    $scope.valider = function () {
      if (
        !$scope.assuranceDto.compagnie ||
        !$scope.assuranceDto.numeroPolice ||
        !$scope.assuranceDto.type ||
        !$scope.assuranceDto.montant ||
        !$scope.assuranceDto.dateDebut ||
        !$scope.assuranceDto.dateFin
      ) {
        Swal.fire({
          text: "Veuillez remplir tous les champs obligatoires",
          icon: "error",
        });
        return false;
      }
      return true;
    };
    // --- Supprimer ---
    $scope.deleteAssurance = function (id) {
      Swal.fire({
        text: "Voulez-vous supprimer cette assurance ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, supprimer",
        cancelButtonText: "Annuler",
        buttonsStyling: false,
        customClass: {
          confirmButton: "btn btn-danger",
          cancelButton: "btn btn-active-light",
        },
      }).then((result) => {
        if (result.value) {
          $http
            .delete("/api/assurances/" + id)
            .then(() => {
              Swal.fire({
                text: "Assurance supprimée",
                icon: "success",
                buttonsStyling: false,
                confirmButtonText: "Ok",
                customClass: { confirmButton: "btn btn-primary" },
              });

              $scope.loadAssurances();
            })
            .catch(() => {
              Swal.fire({
                text: "Erreur lors de la suppression",
                icon: "error",
              });
            });
        }
      });
    };

    // Afficher/masquer le modal
    $scope.modalShow = function () {
      $("#kt_modal_add_assurance").modal("show");
    };
    $scope.modalHide = function () {
      $("#kt_modal_add_assurance").modal("hide");
    };

    // ----------------------- VISITES TECHNIQUES -----------------------
    $scope.listeVisites = [];
    $scope.visiteEncours = null;

    $scope.visiteDto = {
      id: null,
      centre: "",
    //   montant: null,
      dateDebut: null,
      dateFin: null,
      document: "",
      voitureId: voitureId,
    };

    $scope.visiteFile = null;

    // ----- Load -----
    $scope.loadVisites = function () {
      $http
        .get("/api/visites/voiture/" + voitureId)
        .then(function (res) {
          $scope.listeVisites = res.data;

          $scope.visiteEncours =
            res.data
              ?.slice()
              ?.sort(
                (a, b) => new Date(b.dateDebut) - new Date(a.dateDebut)
              )[0] || null;
              console.log("VISITE EN COURS :", $scope.visiteEncours);
                console.log("LISTE VISITES :", $scope.listeVisites);

        })
        .catch(() =>
          Swal.fire({ text: "Erreur de chargement", icon: "error" })
        );
    };
    $scope.loadVisites();

    // ----- Set File -----
    $scope.setVisiteFile = function (input) {
      $scope.visiteFile = input.files[0];
      $scope.$apply();
    };

    // ----- Open Add Modal -----
    $scope.openAddVisiteModal = function () {
      $scope.visiteDto = {
        id: null,
        centre: "",
        montant: null,
        dateDebut: null,
        dateFin: null,
        document: "",
        voitureId: voitureId,
      };
    $scope.selectedFile = null;
    };

    // ----- Edit -----
    $scope.editVisite = function (id) {
      $http.get("/api/visites/" + id).then(function (res) {
        $scope.visiteDto = res.data;
        $scope.visiteDto.dateDebut = new Date(res.data.dateDebut);
        $scope.visiteDto.dateFin = new Date(res.data.dateFin);
        $scope.visiteFile = null;
        console.log("VISITE DTO :", $scope.visiteDto);
        $scope.modalShowVisite();
      });
    };

    // ----- Validate -----
    $scope.validerVisite = function () {
      let v = $scope.visiteDto;

      if (!v.centre || !v.dateDebut || !v.dateFin) {
        Swal.fire({ text: "Champs obligatoires manquants", icon: "error" });
        return false;
      }
      return true;
    };

    // ----- Save (Add/Update) -----
    $scope.saveVisite = function () {
      if (!$scope.validerVisite()) return;

      let formData = new FormData();
      formData.append(
        "visite",
        new Blob([JSON.stringify($scope.visiteDto)], {
          type: "application/json",
        })
      );

        if ($scope.selectedFile) {
          formData.append("file", $scope.selectedFile);
        }

      let isEdit = !!$scope.visiteDto.id;
      console.log("SAVING VISITE, isEdit =", isEdit, $scope.visiteFile);
      $http({
        method: isEdit ? "PUT" : "POST",
        url: isEdit ? "/api/visites/" + $scope.visiteDto.id : "/api/visites",
        data: formData,
        headers: { "Content-Type": undefined },
        transformRequest: angular.identity,
      })
        .then(function () {
          Swal.fire({
            text: isEdit ? "Visite modifiée" : "Visite ajoutée",
            icon: "success",
          });

          $scope.loadVisites();
          $scope.modalHideVisite();
        })
        .catch(() =>
          Swal.fire({ text: "Erreur lors de la sauvegarde", icon: "error" })
        );
    };

    // ----- Delete -----
    $scope.deleteVisite = function (id) {
      Swal.fire({
        text: "Supprimer cette visite ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui",
        cancelButtonText: "Annuler",
      }).then((r) => {
        if (!r.value) return;

        $http
          .delete("/api/visites/" + id)
          .then(() => {
            Swal.fire({ text: "Visite supprimée", icon: "success" });
            $scope.loadVisites();
          })
          .catch(() =>
            Swal.fire({ text: "Erreur lors de la suppression", icon: "error" })
          );
      });
    };

    // Afficher/masquer le modal
    $scope.modalShowVisite = function () {
      $("#kt_modal_add_visite").modal("show");
    };
    $scope.modalHideVisite = function () {
      $("#kt_modal_add_visite").modal("hide");
    };
  },
]);
