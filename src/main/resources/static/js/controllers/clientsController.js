"use strict";

document.addEventListener("DOMContentLoaded", function () {
  var KTUsersAddUser = (function () {
    const modalElement = document.getElementById("kt_modal_add_user"),
      formElement = modalElement.querySelector("#kt_modal_add_user_form"),
      modalInstance = new bootstrap.Modal(modalElement);
    // var createUserUrl = "auth/signup";
    var clientUrl = "api/users/clients";
    var method = "POST";
    return {
      init: function () {
        (() => {
          const validator = FormValidation.formValidation(formElement, {
            fields: {
              nomComplet: {
                validators: {
                  notEmpty: { message: "Le nom complet est requis" },
                  stringLength: {
                    min: 3,
                    message:
                      "Le nom complet doit contenir au moins 3 caractères",
                  },
                },
              },
              email: {
                validators: {
                  notEmpty: {
                    message: "Une adresse e-mail valide est requise",
                  },
                  emailAddress: {
                    message: "L'entrée n'est pas une adresse e-mail valide",
                  },
                },
              },
              localisation: {
                validators: {
                  notEmpty: { message: "La localisation est requise" },
                },
              },
              telephone: {
                validators: {
                  notEmpty: { message: "Le téléphone est requis" },
                  regexp: {
                    regexp: /^\d{8,15}$/,
                    message: "Numéro de téléphone invalide",
                  },
                },
              },
              typePieceIdentite: {
                validators: {
                  notEmpty: { message: "Type de pièce d'identité requis" },
                },
              },
              numeroPieceIdentite: {
                validators: {
                  notEmpty: { message: "Numéro de pièce d'identité requis" },
                },
              },
              numeroPermisConduire: {
                validators: {
                  notEmpty: { message: "Numéro de permis requis" },
                },
              },
              paysDelivrancePermis: {
                validators: {
                  notEmpty: { message: "Pays délivrance permis requis" },
                },
              },
              dateDelivrancePermis: {
                validators: {
                  notEmpty: { message: "Date délivrance permis requise" },
                },
              },
              dateExpirationPermis: {
                validators: {
                  notEmpty: { message: "Date expiration permis requise" },
                },
              },
            },
            plugins: {
              trigger: new FormValidation.plugins.Trigger(),
              bootstrap: new FormValidation.plugins.Bootstrap5({
                rowSelector: ".fv-row",
                eleInvalidClass: "",
                eleValidClass: "",
              }),
            },
          });

          const submitButton = modalElement.querySelector(
            '[data-kt-users-modal-action="submit"]'
          );
          submitButton.addEventListener("click", (event) => {
            event.preventDefault();

            // Assurez-vous que l'URL de création d'utilisateur est correcte

            if (validator) {
              validator.validate().then(function (status) {
                if (status === "Valid") {
                  submitButton.setAttribute("data-kt-indicator", "on");
                  submitButton.disabled = true;
                  // Préparez les données à envoyer
                  const userData = {
                    id:
                      formElement.querySelector("#id")?.value || "",
                    nomComplet:
                      formElement.querySelector("#nomComplet")?.value || "",
                    email: formElement.querySelector("#email")?.value || "",
                    telephone:
                      formElement.querySelector("#telephone")?.value || "",
                    localisation:
                      formElement.querySelector("#localisation")?.value || "",
                    typePieceIdentite:
                      formElement.querySelector("#typePieceIdentite")?.value ||
                      "",
                    numeroPieceIdentite:
                      formElement.querySelector("#numeroPieceIdentite")
                        ?.value || "",
                    numeroPermisConduire:
                      formElement.querySelector("#numeroPermisConduire")
                        ?.value || "",
                    paysDelivrancePermis:
                      formElement.querySelector("#paysDelivrancePermis")
                        ?.value || "",
                    dateDelivrancePermis:
                      formElement.querySelector("#dateDelivrancePermis")
                        ?.value || "",
                    dateExpirationPermis:
                      formElement.querySelector("#dateExpirationPermis")
                        ?.value || "",
                    username: formElement.querySelector("#email")?.value || "",
                    role: ["ROLE_USER"],
                    password: "password",
                  };

                  // Correction de la logique de mise à jour
                  let url = "api/users/clients";
                  let method = "POST";
                  if (userData.id != null && userData.id !== "") {
                    url = "api/users/clients/" + userData.id ;
                    method = "PUT"; // ou "PUT" si le backend le gère
                  }
                  fetch(url, {
                    method: method,
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(userData),
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
                      angular
                        .element(
                          document.querySelector(
                            '[ng-controller="usersController"]'
                          )
                        )
                        .scope()
                        .loadUsers();
                      
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

                        // Affichez une alerte de succès
                        const message = userData.id ? "Client modifié avec succès" : "Client créé avec succès";
                        Swal.fire({
                          text: message,
                          icon: "success",
                          buttonsStyling: false,
                          confirmButtonText: "D'accord, compris !",
                          customClass: {
                            confirmButton: "btn btn-primary",
                          },
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
                            confirmButton: "btn btn-primary",
                          },
                        });
                      } else {
                        // Si c'est un faux positif, recharger et afficher succès
                        angular
                          .element(
                            document.querySelector(
                              '[ng-controller="usersController"]'
                            )
                          )
                          .scope()
                          .loadUsers();
                        const message = userData.id ? "Client modifié avec succès" : "Client créé avec succès";
                        Swal.fire({
                          text: message,
                          icon: "success",
                          buttonsStyling: false,
                          confirmButtonText: "D'accord, compris !",
                          customClass: {
                            confirmButton: "btn btn-primary",
                          },
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
                      confirmButton: "btn btn-primary",
                    },
                  });
                }
              });
            }
          });

          modalElement
            .querySelector('[data-kt-users-modal-action="cancel"]')
            .addEventListener("click", (event) => {
              event.preventDefault();
              this.showCancelConfirmation();
            });

          modalElement
            .querySelector('[data-kt-users-modal-action="close"]')
            .addEventListener("click", (event) => {
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
            cancelButton: "btn btn-active-light",
          },
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
                confirmButton: "btn btn-primary",
              },
            });
          }
        });
      },
    };
  })();

  // Initialiser le module
  KTUsersAddUser.init();
});

// KTUtil.onDOMContentLoaded(function () {
//     KTUsersAddUser.init();
// });

var App = angular.module("myApp", []);
App.controller("usersController", [
  "$scope",
  "$http",
  function ($scope, $http) {
    // URLs pour les opérations CRUD sur les utilisateurs
    const appUrl = "api/users/clients";
    const urlLoadUsers = appUrl;
    const urlSignup = "auth/signup";
    const urlUpdateUser = "api/users/update"; // Pour activation/désactivation
    const urlUpdateClient = appUrl; // Pour mise à jour client: /clients/{id}
    const urlClient = "api/users/details";
    const urlDeleteUser = "api/users/delete"; // Suppression utilise /delete/{id} (pas /clients/delete)

    const urlFindUser = appUrl + "/find";

    // Initialisation des variables
    $scope.users = [];
    $scope.userDto = {
      id: null,
      username: null,
      email: null,
      role: null,
    };
    $scope.userMasterDto = {
      id: null,
      nomComplet: null,
      email: null,
      telephone: null,
      localisation: null,
      fonction: null,
      typePieceIdentite: null,
      numeroPieceIdentite: null,
      numeroPermisConduire: null,
      paysDelivrancePermis: null,
      dateDelivrancePermis: null,
      dateExpirationPermis: null,
      username: null,
      password: null,
      role: null,
    };
    $scope.listeUsers = null;
    //$scope.userMasterDto= angular.copy($scope.userDTO); // Copie pour éviter la référence

    // Fonction pour charger la liste des utilisateurs
    $scope.loadUsers = function () {
      $http
        .get(appUrl)
        .then(function (res) {
          $scope.listeUsers = res.data;
          console.log("LISTE DES UTILISATEURS : ", $scope.listeUsers);
        })
        .catch(function (error) {
          console.error("ERREUR DE RECUPERATION DES UTILISATEURS : ", error);
        });
    };

    // Chargement des utilisateurs au chargement de la page
    $scope.loadUsers();

    // Fonction pour créer un utilisateur
    $scope.createUser = function (data) {
      const userJson = angular.toJson(data);
      console.log(userJson);
      $http
        .post(urlSignup, userJson)
        .then(function (res) {
          console.log("UTILISATEUR CREE : ");
          $scope.loadUsers();
          $scope.userDto = angular.copy($scope.userMasterDto); // Copie pour éviter la référence
          $scope.showSuccessMessage("Utilisateur créé avec succès");
        })
        .catch(function (error) {
          console.error("ERREUR DE CREATION DE L'UTILISATEUR : ", error);
          $scope.showErrorMessage(
            "Erreur lors de la création de l'utilisateur."
          );
          return false;
        });
    };

    // Fonction pour voir les détails d'un utilisateur
    $scope.viewUser = function (userId) {
      window.location.href = "/atiko/utilisateurs/details/" + userId;
    };

    // Fonction pour modifier un utilisateur
    $scope.editUser = function (user) {
      $http
        .get(urlClient + "/" + user.id)
        .then(function (res) {
          $scope.userMasterDto = {
            id: user.id,
            nomComplet: user.nom,
            email: user.email,
            telephone: res.data.telephone,
            localisation: res.data.localisation,
            typePieceIdentite: res.data.typePieceIdentite,
            numeroPieceIdentite: res.data.numeroPieceIdentite,
            numeroPermisConduire: res.data.numeroPermisConduire,
            paysDelivrancePermis: res.data.paysDelivrancePermis,
            // ✅ Conversion en objet Date
            dateDelivrancePermis: res.data.dateDelivrancePermis
              ? new Date(res.data.dateDelivrancePermis)
              : null,
            dateExpirationPermis: res.data.dateExpirationPermis
              ? new Date(res.data.dateExpirationPermis)
              : null,
          };
          console.log("USER TO EDIT: ", $scope.userMasterDto );

          $("#kt_modal_add_user").modal("show");
        })
        .catch(function (error) {
          console.error("ERREUR DE RECUPERATION DE L'UTILISATEUR : ", error);
          return false;
        });
    };

    // Fonction pour activer/désactiver un utilisateur
    $scope.toggleUserStatus = function (userId, currentStatus) {
      console.log(
        "TOGGLE STATUS - User ID:",
        userId,
        "Current status:",
        currentStatus
      );
      const newStatus = !currentStatus;
      const action = newStatus ? "activer" : "désactiver";

      Swal.fire({
        title: "Confirmation",
        text: `Êtes-vous sûr de vouloir ${action} cet utilisateur ?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, confirmer",
        cancelButtonText: "Annuler",
        buttonsStyling: false,
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-light",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          // Trouver l'utilisateur dans la liste
          const user = $scope.listeUsers.find((u) => u.id === userId);
          console.log("Found user for status update:", user);
          if (user) {
            const updateData = {
              id: userId,
              username: user.username,
              email: user.email,
              role: user.role,
              status: newStatus,
            };
            console.log("Sending update data:", updateData);

            // Pour l'activation/désactivation, on doit utiliser l'endpoint /update avec un UserDto
            // Il faut trouver l'utilisateur correspondant au client
            $http
              .put(urlUpdateUser, updateData)
              .then(function (response) {
                console.log("Status update successful:", response);
                $scope.loadUsers();
                $scope.showSuccessMessage(
                  `Client ${
                    action === "activer" ? "activé" : "désactivé"
                  } avec succès`
                );
              })
              .catch(function (error) {
                console.error(
                  "ERREUR LORS DE LA MODIFICATION DU STATUT : ",
                  error
                );
                $scope.showErrorMessage(
                  "Erreur lors de la modification du statut de l'utilisateur."
                );
              });
          }
        }
      });
    };

    // Fonction pour supprimer un utilisateur
    $scope.deleteUser = function (userId, username) {
      console.log("DELETE USER - User ID:", userId, "Username:", username);
      Swal.fire({
        title: "Confirmation de suppression",
        text: `Êtes-vous sûr de vouloir supprimer l'utilisateur "${username}" ?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, supprimer",
        cancelButtonText: "Annuler",
        buttonsStyling: false,
        customClass: {
          confirmButton: "btn btn-danger",
          cancelButton: "btn btn-light",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          console.log(
            "Sending delete request to:",
            urlDeleteUser + "/" + userId
          );
          $http({
            method: 'DELETE',
            url: urlDeleteUser + "/" + userId,
            headers: {
              'Accept': 'text/plain, */*'
            },
            transformResponse: [function(data) {
              // Accepter les réponses texte sans transformation
              return data;
            }]
          })
            .then(function (response) {
              console.log("Delete successful:", response);
              $scope.loadUsers();
              $scope.showSuccessMessage("Client supprimé avec succès");
            })
            .catch(function (error) {
              console.error("ERREUR LORS DE LA SUPPRESSION : ", error);
              // Vérifier le statut HTTP - si c'est 200-299, c'est un succès
              // Même si AngularJS déclenche une erreur de parsing, si le status est 200, c'est OK
              if (error.status && error.status >= 200 && error.status < 300) {
                console.log("Suppression réussie malgré l'erreur de parsing");
                $scope.loadUsers();
                $scope.showSuccessMessage("Client supprimé avec succès");
              } else if (!error.status || error.status === 0) {
                // Si pas de status ou status 0, vérifier si c'est juste un problème de parsing
                // Si la réponse contient "supprimé", considérer comme succès
                if (error.data && (error.data.indexOf('supprimé') !== -1 || error.data.indexOf('succès') !== -1)) {
                  $scope.loadUsers();
                  $scope.showSuccessMessage("Client supprimé avec succès");
                } else {
                  // Sinon, c'est probablement une vraie erreur
                  const errorMsg = error.data?.message || error.data || error.statusText || "Erreur lors de la suppression du client.";
                  $scope.showErrorMessage(errorMsg);
                }
              } else {
                const errorMsg = error.data?.message || error.data || error.statusText || "Erreur lors de la suppression du client.";
                $scope.showErrorMessage(errorMsg);
              }
            });
        }
      });
    };

    // Fonction pour afficher un message de succès
    $scope.showSuccessMessage = function (message) {
      Swal.fire({
        text: message,
        icon: "success",
        buttonsStyling: false,
        confirmButtonText: "D'accord",
        customClass: {
          confirmButton: "btn btn-primary",
        },
      });
    };

    // Fonction pour afficher un message d'erreur
    $scope.showErrorMessage = function (message) {
      Swal.fire({
        text: message,
        icon: "error",
        buttonsStyling: false,
        confirmButtonText: "D'accord",
        customClass: {
          confirmButton: "btn btn-primary",
        },
      });
    };

    // Validation des données avant enregistrement
    $scope.valider = function () {
      if ($scope.userMasterDto.id) {
        $scope.updateUser();
      } else {
        $scope.createUser();
      }
    };

    // Fonction pour mettre à jour un utilisateur
    $scope.updateUser = function () {
      if (!$scope.userMasterDto.id) {
        $scope.showErrorMessage("Erreur: ID client manquant.");
        return;
      }
      
      // L'API utilise /clients/{id} pour la mise à jour
      const updateUrl = urlUpdateClient + "/" + $scope.userMasterDto.id;
      
      $http
        .put(updateUrl, $scope.userMasterDto)
        .then(function (response) {
          $scope.loadUsers();
          $("#kt_modal_add_user").modal("hide");
          $scope.showSuccessMessage("Client modifié avec succès");
          $scope.userMasterDto = {};
          // Réinitialiser le formulaire
          const formElement = document.getElementById('kt_modal_add_user_form');
          if (formElement) {
            formElement.reset();
          }
        })
        .catch(function (error) {
          console.error("ERREUR LORS DE LA MODIFICATION : ", error);
          const errorMsg = error.data?.message || error.data || "Erreur lors de la modification du client.";
          $scope.showErrorMessage(errorMsg);
        });
    };

    // Afficher/masquer le modal
    $scope.modalShow = function () {
      $("#myModal").modal("show");
    };
    $scope.modalHide = function () {
      $("#myModal").modal("hide");
    };
  },
]);

// var KTUsersList=function(){var e,t,n,r,o=document.getElementById("kt_table_users"),c=()=>{o.querySelectorAll('[data-kt-users-table-filter="delete_row"]').forEach((t=>{t.addEventListener("click",(function(t){t.preventDefault();const n=t.target.closest("tr"),r=n.querySelectorAll("td")[1].querySelectorAll("a")[1].innerText;Swal.fire({text:"Are you sure you want to delete "+r+"?",icon:"warning",showCancelButton:!0,buttonsStyling:!1,confirmButtonText:"Yes, delete!",cancelButtonText:"No, cancel",customClass:{confirmButton:"btn fw-bold btn-danger",cancelButton:"btn fw-bold btn-active-light-primary"}}).then((function(t){t.value?Swal.fire({text:"You have deleted "+r+"!.",icon:"success",buttonsStyling:!1,confirmButtonText:"D'accord, compris !",customClass:{confirmButton:"btn fw-bold btn-primary"}}).then((function(){e.row($(n)).remove().draw()})).then((function(){a()})):"cancel"===t.dismiss&&Swal.fire({text:customerName+" was not deleted.",icon:"error",buttonsStyling:!1,confirmButtonText:"D'accord, compris !",customClass:{confirmButton:"btn fw-bold btn-primary"}})}))}))}))},l=()=>{const c=o.querySelectorAll('[type="checkbox"]');t=document.querySelector('[data-kt-user-table-toolbar="base"]'),n=document.querySelector('[data-kt-user-table-toolbar="selected"]'),r=document.querySelector('[data-kt-user-table-select="selected_count"]');const s=document.querySelector('[data-kt-user-table-select="delete_selected"]');c.forEach((e=>{e.addEventListener("click",(function(){setTimeout((function(){a()}),50)}))})),s.addEventListener("click",(function(){Swal.fire({text:"Are you sure you want to delete selected customers?",icon:"warning",showCancelButton:!0,buttonsStyling:!1,confirmButtonText:"Yes, delete!",cancelButtonText:"No, cancel",customClass:{confirmButton:"btn fw-bold btn-danger",cancelButton:"btn fw-bold btn-active-light-primary"}}).then((function(t){t.value?Swal.fire({text:"You have deleted all selected customers!.",icon:"success",buttonsStyling:!1,confirmButtonText:"D'accord, compris !",customClass:{confirmButton:"btn fw-bold btn-primary"}}).then((function(){c.forEach((t=>{t.checked&&e.row($(t.closest("tbody tr"))).remove().draw()}));o.querySelectorAll('[type="checkbox"]')[0].checked=!1})).then((function(){a(),l()})):"cancel"===t.dismiss&&Swal.fire({text:"Selected customers was not deleted.",icon:"error",buttonsStyling:!1,confirmButtonText:"D'accord, compris !",customClass:{confirmButton:"btn fw-bold btn-primary"}})}))}))};const a=()=>{const e=o.querySelectorAll('tbody [type="checkbox"]');let c=!1,l=0;e.forEach((e=>{e.checked&&(c=!0,l++)})),c?(r.innerHTML=l,t.classList.add("d-none"),n.classList.remove("d-none")):(t.classList.remove("d-none"),n.classList.add("d-none"))};return{init:function(){o&&(o.querySelectorAll("tbody tr").forEach((e=>{const t=e.querySelectorAll("td"),n=t[3].innerText.toLowerCase();let r=0,o="minutes";n.includes("yesterday")?(r=1,o="days"):n.includes("mins")?(r=parseInt(n.replace(/\D/g,"")),o="minutes"):n.includes("hours")?(r=parseInt(n.replace(/\D/g,"")),o="hours"):n.includes("days")?(r=parseInt(n.replace(/\D/g,"")),o="days"):n.includes("weeks")&&(r=parseInt(n.replace(/\D/g,"")),o="weeks");const c=moment().subtract(r,o).format();t[3].setAttribute("data-order",c);const l=moment(t[5].innerHTML,"DD MMM YYYY, LT").format();t[5].setAttribute("data-order",l)})),(e=$(o).DataTable({info:!1,order:[],pageLength:10,lengthChange:!1,columnDefs:[{orderable:!1,targets:0},{orderable:!1,targets:6}]})).on("draw",(function(){l(),c(),a()})),l(),document.querySelector('[data-kt-user-table-filter="search"]').addEventListener("keyup",(function(t){e.search(t.target.value).draw()})),document.querySelector('[data-kt-user-table-filter="reset"]').addEventListener("click",(function(){document.querySelector('[data-kt-user-table-filter="form"]').querySelectorAll("select").forEach((e=>{$(e).val("").trigger("change")})),e.search("").draw()})),c(),(()=>{const t=document.querySelector('[data-kt-user-table-filter="form"]'),n=t.querySelector('[data-kt-user-table-filter="filter"]'),r=t.querySelectorAll("select");n.addEventListener("click",(function(){var t="";r.forEach(((e,n)=>{e.value&&""!==e.value&&(0!==n&&(t+=" "),t+=e.value)})),e.search(t).draw()}))})())}}}();KTUtil.onDOMContentLoaded((function(){KTUsersList.init()}));
