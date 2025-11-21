# Système de Chat en Temps Réel --- README

## Objectif du TP

Ce projet a été réalisé dans le cadre d'un TP visant à pratiquer le
développement back-end avec **Node.js**, **Express**, et la
communication bidirectionnelle **Socket.io**.\
Le but final : créer un **chat en temps réel** fonctionnel permettant à
plusieurs utilisateurs d'échanger instantanément.
Il y a également la possibilité que deux utilisateurs puissent s'envoyer 
des messages privés sur ce même chat

------------------------------------------------------------------------

## Structure du Projet et Processus de Développement

### 1. Initialisation du projet

-   Création du dossier `nom_du_projet`

-   Initialisation du projet :

    ``` bash
    npm init -y
    ```

-   Installation des dépendances :

    ``` bash
    npm install express socket.io nodemon
    ```

### 2 Mise en place d'Express

-   Un fichier `server.js` est créé pour configurer :
    -   Le serveur Express
    -   L'écoute dynamique sur un port disponible
    -   Le service des fichiers statiques via `express.static`
-   Un dossier `public/` contient tout le code côté client.

### 3 Création de l'interface HTML/CSS

-   Le fichier `public/index.html` constitue l'interface utilisateur :
    -   Un conteneur pour afficher les messages
    -   Un champ texte pour écrire un message
    -   Un bouton d'envoi
-   Un léger style avec tailwind via un cdn a été appliqué pour améliorer la lisibilité.

### 4 Code client : `public/script.js`

-   Gère toutes les interactions côté client :
    -   Connexion au serveur via Socket.io
    -   Envoi et réception des messages publics et privés
    -   Affichage des messages dans la zone de chat
    -   Mise à jour dynamique de la liste des utilisateurs connectés
    -   Notification lorsqu'un utilisateur est en train d'écrire
-   Contient également des fonctions utilitaires comme `formatTime()` pour afficher l'heure des messages.

### 5 Intégration de Socket.io

Socket.io permet d'établir une communication full-duplex (pour des 
transmissions et réceptions simultanées) entre clients et serveur.

#### Côté serveur :

-   Ajout de :

    ``` js
    io.on("connection", socket => {
        console.log("Un utilisateur s'est connecté");
    });
    ```

-   Réception d'un message :

    ``` js
    socket.on("chat message", data => {
        io.emit("chat message", data);
    });
    ```

#### Côté client :

-   Import de la lib client Socket.io :

    ``` html
    <script src="/socket.io/socket.io.js"></script>
    ```

-   Connexion :

    ``` js
    const socket = io();
    ```

-   Envoi de message :

    ``` js
    socket.emit("chat message", message);
    ```

-   Réception de message :

    ``` js
    socket.on("chat message", ...)
    ```

    Message privé :

    ``` js
    socket.to(to).emit("chat message", { 
            user: `${user} (privé)`,
            message
        });
    ```

------------------------------------------------------------------------

##  Fonctionnalités Implémentées

###  Envoi / réception de messages en temps réel

Le serveur joue un rôle de *hub* : chaque message reçu est retransmis
immédiatement à tous les clients connectés.

###  Gestion des noms d'utilisateur

Chaque utilisateur doit saisir un nom lors de son arrivée.\
Les messages affichés prennent la forme :

    [NomUser] : Message

###  Messages de connexion/déconnexion

Lorsque quelqu'un rejoint ou quitte le chat, un message d'état est
diffusé à tous.

###  Possibilité d'ajouter des messages privés (option avancée)

Un tableau côté serveur permet de maintenir la liste des utilisateurs
connectés avec leur `socket.id`.

###  Fonction "est en train d'écrire..."

Détection du champ de saisie → émission d'un événement → affichage côté
client.

------------------------------------------------------------------------

## Sources et documentation utilisées

Ce projet a été réalisé en utilisant plusieurs ressources indispensables
:

-   Mozilla Developer Network (MDN)
-   StackOverflow
-   IA (corrections, debug, style)
-   Documentation officielle Node.js
-   Documentation Express.js
-   Documentation Socket.io
-   W3Schools JavaScript Reference
-   GeeksForGeeks Node.js Tutorials