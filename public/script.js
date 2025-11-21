/* Gère l'interface client du chat : envoi/réception des messages,
affichage, utilisateurs et interactions Socket.io */

const socket = io();
const form = document.getElementById("chat-form");
const input = document.getElementById("message-input");
const messagesDiv = document.getElementById("messages");
const typingDiv = document.getElementById("typing");
const myUsernameDiv = document.getElementById("my-username");

// Récupération du nom de l'utilisateur via un prompt
let username = prompt("Entrez votre nom d'utilisateur :") || "Anonyme";
myUsernameDiv.textContent = `Connecté en tant que : ${username}`;

// Envoyer username au serveur
socket.emit("set username", username);

// Liste utilisateurs
let users = {};
socket.on("user list", (list) => {
    users = list;
    const listEl = document.getElementById("user-list");
    listEl.innerHTML = "";

    // Parcourt tous les utilisateurs connectés (clé = socket.id, valeur = username),
    // crée un <li> pour chacun d’eux puis l’ajoute à la liste affichée dans l’interface.
    Object.entries(users).forEach(([id, name]) => {
        const li = document.createElement("li");
        li.textContent = `${name} — ${id}`;
        listEl.appendChild(li);
    });
});

// Fonction pour formater l'heure au format DD/MM/YY hh:mm
function formatTime() {
    const d = new Date();
    const day = String(d.getDate()).padStart(2,"0");
    const month = String(d.getMonth()+1).padStart(2,"0");
    const year = String(d.getFullYear());
    const hours = String(d.getHours()).padStart(2,"0");
    const min = String(d.getMinutes()).padStart(2,"0");
    return `${day}/${month}/${year} ${hours}:${min}`;
}

// Envoi message
form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!input.value.trim()) return;

    const msg = input.value;

    // Commande message privé
    if (msg.startsWith("/mp ")) {
        const parts = msg.split(" ");
        const toId = parts[1]; // ID du destinataire
        const message = parts.slice(2).join(" ");
        socket.emit("private message", { to: toId, user: username, message });

        // Récupérer le nom du destinataire depuis la liste des utilisateurs
        const toName = users[toId] || toId; // fallback sur l’ID si l’utilisateur n’existe plus

        // Afficher côté émetteur
        const p = document.createElement("p");
        p.className = "text-sm bg-yellow-200 p-2 rounded mb-1 self-end text-right";
        p.innerHTML = `<strong>[MP pour ${toName}]</strong> : ${message} <span class="text-xs text-gray-500 ml-2">${formatTime()}</span>`; // correction ici pour afficher le nom du destinataire
        messagesDiv.appendChild(p);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
        input.value = "";
        return;
    }

    socket.emit("chat message", { user: username, message: msg });
    input.value = "";
    typingDiv.textContent = "";
});

// Envoi d’un signal "typing"
input.addEventListener("input", () => {
    socket.emit("typing", username);
});

// Réception et affichage des messages du chat
socket.on("chat message", (data) => {
    const p = document.createElement("p");
    const isMe = data.user === username || data.user.startsWith(username+" (privé)");
    p.className = `text-sm p-2 mb-1 rounded ${isMe ? "bg-blue-200 self-end text-right" : "bg-gray-200 self-start text-left"}`;
    p.innerHTML = `<strong>[${isMe ? "MOI" : data.user}]</strong> : ${data.message} <span class="text-xs text-gray-500 ml-2">${formatTime()}</span>`;
    messagesDiv.appendChild(p);
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Envoi d’un message normal au serveur
});

// Messages système (connexion / déconnexion)
socket.on("system message", (msg) => {
    const p = document.createElement("p");
    p.className = "text-gray-500 italic text-center text-sm";
    p.textContent = msg;
    messagesDiv.appendChild(p);
});

// Notification lorsqu'un utilisateur écrit
socket.on("typing", (user) => {
    typingDiv.textContent = `${user} est en train d'écrire...`;
    setTimeout(() => typingDiv.textContent = "", 1500);
});