/* Ce fichier gère le serveur Express, la communication temps réel via 
Socket.io et la gestion des utilisateurs connectés */

// Liste des dépendances 
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const PORT = process.env.PORT || 3001;
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

// Liste des utilisateurs connectés
let users = {};

io.on("connection", (socket) => {
    console.log(` Connecté : ${socket.id}`);

    // L’utilisateur envoie son nom dès sa connexion
    socket.on("set username", (username) => {
        socket.username = username;
        users[socket.id] = username;

        io.emit("system message", `${username} a rejoint le chat.`);
        io.emit("user list", users);
    });

    // Message public
    socket.on("chat message", (data) => {
        io.emit("chat message", data);
    });

    // Message privé
    socket.on("private message", ({ to, user, message }) => {   // to représente ici socket.id
        socket.to(to).emit("chat message", {  // Récupération de l'id d'un utilisateur pour envoyer un message privé à ce dernier
            user: `${user} (privé)`,
            message
        });
    });

    // Typing
    socket.on("typing", (username) => {
        socket.broadcast.emit("typing", username);
    });

    // Déconnexion
    socket.on("disconnect", () => {
        if (users[socket.id]) {
            io.emit("system message", `${users[socket.id]} a quitté le chat.`);
            delete users[socket.id];
            io.emit("user list", users);
        }
        console.log(` Déconnecté : ${socket.id}`);
    });
});

server.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});