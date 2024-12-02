var App = angular.module('myApp', []);

App.controller('unAuthController', ['$scope', '$http', '$sce', function($scope, $http, $sce) {
    // URLs pour les opérations CRUD sur les structures
    const url = '/unauth';
    const structuresUrl = url + '/structure';
    const articlesUrl = url + '/articles';
    const categoriesUrl = url + '/categories';
    const newslettersUrl = url + '/newsletter';
    const commentaireUrl = url + '/commentaire';
    const contactUrl = url + '/contact';
    const servicesUrl = url+'/services';
    const espasesUrl = url+'/espaces';


    $scope.serviceDto = {
        id: null,
        nom: null,
        descriptio: null
    };
    $scope.singleService = null;
    $scope.contactDto = {
        id: null,
        useremail: null,
        username: null,
        message: null,
        sevice: null,
        userphone: null,
    };
    $scope.listeServices = [];
    $scope.listeEspaces = null;
    $scope.urldata = [
        "/services-appui-techniques",
        "/services-location-espaces",
        "/services-domiciliation-d-entreprise",
        "/services-incubations",
        "/services-gestion-projets"
    ];
    $scope.dataIcons = [
        "line-icon-Medal-2",
        "line-icon-Home",
        "line-icon-Archery-2",
        "line-icon-Money-Bag"
    ];


    // Initialisation des variables
    $scope.newsletter = null;
    $scope.firstArtcile = null;
    $scope.firstArtciles = null;
    $scope.lastArtciles = [];
    $scope.singleArticle = {id:null,description:null, couverture:null,categorie:{}};
    $scope.commentaireDto = {id:null,contenue:null, useremail:null,username:null, articleId:null, createdAt:null};
    $scope.commentaireMasterDto = {id:null,contenue:null, useremail:null,username:null, articleId:null, createdAt:null};
    $scope.contactMasterDto = {message:null, useremail:null,username:null,subject:null};
    $scope.contactDto = {message:null, useremail:null,username:null,message:null, serviceId: null};
    $scope.newsletterDto = {useremail:null};
    $scope.listeCategories = [];
    $scope.listeArticlesFilter = [];
    $scope.listeArticles = [];
    $scope.structureDto = {
        id: null,
        nom: null,
        telephone: null,
        email: null,
        dateCreation: null,
        localisation: null,
        gps: null,
        logo: null,
        bio: null,
        description: null,
        img: null,
        img1: null,
        img2: null,
        facbook: null,
        twitter: null,
        youtube: null,
        instagram: null

    };     

    // Fonction pour charger la liste des structures
    $scope.loadStructure = function () {
        $http.get(structuresUrl)
            .then(function (res) {
                $scope.structureDto = res.data;
                $scope.structureDto.dateCreation = new Date($scope.structureDto.dateCreation);
                $scope.structureDto.description = $sce.trustAsHtml($scope.structureDto.description);
                $scope.structureDto.bio = $sce.trustAsHtml($scope.structureDto.bio);
            })
            .catch(function (error) {
                console.error("ERREUR DE RECUPERATION DES DONNEES : ", error);
            });
    };
    // Chargement des structures au chargement de la page
    $scope.loadStructure();

     // Fonction pour charger la liste des structures
     $scope.loadServices= function () {
        $http.get(servicesUrl)
            .then(function (res) {
                $scope.listeServices = res.data;
            })
            .catch(function (error) {
                console.error("ERREUR DE RECUPERATION DES DONNEES : ", error);
            });
    };

    // Chargement des structures au chargement de la page
    $scope.loadServices();

       // Fonction pour charger la liste des structures
   $scope.loadEspaces= function () {
       $http.get(espasesUrl)
           .then(function (res) {
               $scope.listeEspaces = res.data;
           })
           .catch(function (error) {
               console.error("ERREUR DE RECUPERATION DES DONNEES : ", error);
           });
   };

   // Chargement des structures au chargement de la page
   $scope.loadEspaces();
   

   
    $scope.loadarticles = function () {
        $http.get(articlesUrl)
            .then(function (res) {
                // Traitement de la liste des articles
                $scope.listeArticles = res.data.map(article => ({
                    ...article,
                    contenue: $sce.trustAsHtml(article.contenue),
                    createdAt: new Date(article.createdAt)
                }));
    
                // Sélection du premier article
                $scope.firstArticle = $scope.listeArticles[0] ;
                $scope.listeArticlesFilter = $scope.listeArticles.slice(0, 4);
                // Sélection des trois premiers articles
                $scope.firstArticles = $scope.listeArticles.slice(0, 3);
    
                // Sélection des quatre dernier s articles
                $scope.lastArticles = $scope.listeArticles.slice(-5);
                console.log($scope.firstArticle);
            })
            .catch(function (error) {
                console.error("ERREUR DE RECUPERATION DES DONNEES : ", error);
            });
    };
    // Chargement des structures au chargement de la page
    $scope.loadarticles();

    // Fonction pour charger la liste des structures
    $scope.loadCateories = function () {
        $http.get(categoriesUrl)
            .then(function (res) {
                $scope.listeCategories = res.data;
                console.log("LISTE DE CATEGORIES    :",$scope.listeCategories );
            })
            .catch(function (error) {
                console.error("ERREUR DE RECUPERATION DES CATEGORIES : ", error);
            });
    };
    // Chargement des structures au chargement de la page
    $scope.loadCateories();

    $scope.filterByCategory = function(categoryName) {
        if (categoryName) {
            // Filtrer et limiter à 4 articles
            $scope.listeArticlesFilter = $scope.listeArticles
                .filter(function(article) {
                    return article.categorie.nom === categoryName;
                })
                .slice(0, 4); // Limiter aux 4 premiers
        } else {
            // Si aucune catégorie n'est sélectionnée, afficher les 4 premiers articles
            $scope.listeArticlesFilter = $scope.listeArticles.slice(0, 4);
        }
    };
    
    // Fonction pour charger la liste des structures
    const serviceIdElement = document.getElementById("serviceId");
    const articleIdElement = document.getElementById("articleId");


    $scope.loadArticle = function (articleId) {
        $http.get(articlesUrl+"/"+articleId)
            .then(function (res) {
                $scope.singleArticle = res.data;
                $scope.singleArticle.contenue = $sce.trustAsHtml($scope.singleArticle.contenue);
                $scope.singleArticle.dateCreation = new Date($scope.singleArticle.dateCreation);
                console.log($scope.singleArticle);
            })
            .catch(function (error) {
                console.error("ERREUR DE RECUPERATION DES CATEGORIES : ", error);
            });
    };
   
    $scope.submitFeedback = function(liked) {
        const url = "/unauth/" + (liked? "like/" : "dislike/") + $scope.singleArticle.id;
        $http.put(url)
        .then(function (res) {
            $scope.feedbackMessage = liked 
            ? "Merci ! Heureux de savoir que vous avez aimé cet article."
            : "Merci pour votre retour ! Nous ferons de notre mieux pour nous améliorer.";
        })
        .catch(function (error) {
            console.error("ERREUR DE RECUPERATION DES CATEGORIES : ", error);
        });
        
    };

    $scope.newsletter = function() {
        if(!$scope.newsletterDto.useremail)
            return null;
        fetch(newslettersUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify($scope.newsletterDto)
        })
        .then(response => {
            if (response.status === 409) {
                throw new Error("Une erreur est survenue. Veuillez réessayer.");
            } else if (!response.ok) {
                throw new Error("Cet email est déjà inscrit à la newsletter.");
            }
            return response.json();
        })
        .then(data => {
            
            Swal.fire({
                title: 'Félicitations !',
                text: "Vous êtes maintenant abonné et au bon endroit pour rester informé des dernières nouveautés !",
                icon: 'success',
                confirmButtonText: 'Merci !'
            });
        })
        .catch(error => {
            Swal.fire({
                title: 'Erreur',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        });
        $scope.newsletterDto.useremail = null;   
        
    }; 
    
    $scope.comment = function() {
        $scope.commentaireDto.articleId = articleIdElement.value;
        
        if(!$scope.commentaireDto.username || !$scope.commentaireDto.username){
        return null;
        }

        fetch(commentaireUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: angular.toJson($scope.commentaireDto)
        })
        .then(response => {
            if (response.status === 409) {
                throw new Error("Une erreur est survenue. Veuillez réessayer.");
            }
            return response.json();
        })
        .then(data => {
            Swal.fire({
                title: 'Félicitations !',
                text: "Merci d'avoir commenté ce post!",
                icon: 'success',
                confirmButtonText: 'Merci !'
            });
        })
        .catch(error => {
            Swal.fire({
                title: 'Erreur',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        });
        
        $scope.commentaireDto = angular.copy($scope.commentaireMasterDto);

    };

    $scope.contact = function() {
        
        if(!$scope.contactDto.username || !$scope.contactDto.useremail || !$scope.contactDto.message || !$scope.contactDto.serviceId){
            return Swal.fire({
                title: 'Erreur !',
                text: "Veillez remplire tous les champs oligatoire!",
                icon: 'error',
                confirmButtonText: 'Merci !'
            });;
        }
        console.log(angular.toJson($scope.contactDto));
        fetch(contactUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: angular.toJson($scope.contactDto)
        })
        .then(response => {
            if (response.status === 409) {
                throw new Error("Une erreur est survenue. Veuillez réessayer.");
            }
            return response.json();
        })
        .then(data => {
            Swal.fire({
                title: 'Félicitations !',
                text: "Merci de nous avoir contacté, votre requette serais traité dans les bref delais!",
                icon: 'success',
                confirmButtonText: 'Merci !'
            });

        })
        .catch(error => {
            Swal.fire({
                title: 'Erreur',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        });
        
        $scope.contactDto = angular.copy($scope.contactMasterDto);

    };

    $scope.listeArticles = function(limit) {
        // Supposons que `articles` soit une liste d'articles déjà récupérée
        // Trier les articles par createdAt dans l'ordre décroissant
        const sortedArticles = $scope.listeArticles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // Retourner les 5 premiers articles
        return sortedArticles.slice(0, limit);
    };

    // Méthode pour obtenir l'article précédent
    $scope.prevPost = function(currentId) {
        const currentIndex = $scope.listeArticles.findIndex(article => article.id === currentId);  
        // Si l'article précédent existe, le retourner
        if (currentIndex > 0) {
            return $scope.listeArticles[currentIndex - 1];
        }          // Votre logique continue ici
        return null; // Retourne null si c'est le premier article
    };


    $scope.nextPost = function(currentId) {
            const currentIndex = $scope.listeArticles.findIndex(article => article.id === currentId);
            if (currentIndex < $scope.listeArticles.length - 1) {
                return $scope.listeArticles[currentIndex + 1];
            }                // Votre logique continue ici
        return null; // Retourne null si c'est le dernier article
    };


$scope.currentPage = 1;
$scope.pageSize = 5; // Nombre d'articles par page
$scope.totalPages = Math.ceil($scope.totalArticles / $scope.pageSize); // Total de pages

$scope.setPage = function (page) {
    if (page >= 1 && page <= $scope.totalPages) {
        $scope.currentPage = page;
        $scope.loadArticles(); // Appel de la fonction pour charger les articles de la page sélectionnée
    }
};

// Fonction de chargement des articles pour la page active
$scope.loadArticles = function() {
    // Requête pour récupérer les articles de la page `$scope.currentPage`
    // Exemple :
    // fetch(`api/articles?page=${$scope.currentPage}&size=${$scope.pageSize}`)
    //     .then(response => response.json())
    //     .then(data => {
    //         $scope.articles = data.articles;
    //         $scope.totalArticles = data.totalCount;
    //         $scope.totalPages = Math.ceil($scope.totalArticles / $scope.pageSize);
    //         $scope.$apply();
    //     });
};

// Initialisation au chargement
$scope.loadArticles();

$scope.appui = false;
$scope.loadService = function (serviceId) {
    $http.get(servicesUrl+"/"+serviceId)
        .then(function (res) {
            $scope.singleService = res.data;
            $scope.singleService.description = $sce.trustAsHtml($scope.singleService.description);
            $scope.singleService.createdAt = new Date($scope.singleService.createdAt );
            console.log("SERVICE ",res.data);
        })
        .catch(function (error) {
            console.error("ERREUR DE RECUPERATION DES CATEGORIES : ", error);
        });
};
 // Chargement des structures au chargement de la page
 if (serviceIdElement && serviceIdElement.value) {
    const serviceId = serviceIdElement.value;
    $scope.loadService (serviceId);
}
 // Chargement des structures au chargement de la page
 if (articleIdElement && articleIdElement.value) {
    const articleId = articleIdElement.value;
    $scope.loadArticle (articleId);
}

$scope.toggleFinancementFields = function () {
    const financementCheckbox = document.getElementById("financement");
    const financementDetails = document.getElementById("financementDetails");
    financementDetails.style.display = financementCheckbox.checked ? "block" : "none";
  }
  $scope.toggleAutreFields =  function () {
    const autresCheckBox = document.getElementById("autresCheckBox");
    const autres = document.getElementById("autres");
    autres.style.display = autresCheckBox.checked ? "block" : "none";
  }

  
}]);


