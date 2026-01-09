const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());
app.use(express.static("public"));

const FILE = "messages.json";

// Fonction pour lire les messages sans planter si le fichier est vide
function readMessages() {
  try {
    const data = fs.readFileSync(FILE, "utf8");
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Erreur lecture messages:", err);
    return [];
  }
}

// Crée le fichier si nécessaire
if (!fs.existsSync(FILE)) {
  fs.writeFileSync(FILE, "[]");
}

// GET : récupérer tous les messages
app.get("/messages", (req, res) => {
  const messages = readMessages();
  res.json(messages);
});

// POST : ajouter un message
app.post("/messages", (req, res) => {
  const messages = readMessages();

  const newMessage = {
    id: Date.now(), // ID simple unique
    name: req.body.name,
    message: req.body.message,
    date: new Date()
  };

  messages.push(newMessage);
  fs.writeFileSync(FILE, JSON.stringify(messages, null, 2));
  res.status(201).json(newMessage);
});

// DELETE : supprimer un message par ID
app.delete("/messages/:id", (req, res) => {
  const messages = readMessages();
  const idToDelete = Number(req.params.id);

  const filteredMessages = messages.filter(msg => msg.id !== idToDelete);

  fs.writeFileSync(FILE, JSON.stringify(filteredMessages, null, 2));
  res.status(204).end();
});

// PORT dynamique pour Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Guestbook running on port ${PORT}`);
});

