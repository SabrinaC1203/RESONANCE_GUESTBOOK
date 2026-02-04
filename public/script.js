const form = document.getElementById("guestbook-form");
const messagesList = document.getElementById("messages");

// Charger les messages
async function loadMessages() {
  const res = await fetch("/messages");
  const messages = await res.json();

  messagesList.innerHTML = "";

  // Trier du plus récent au plus ancien
  messages.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));

  messages.forEach(msg => {
    const li = document.createElement("li");

    // Si pas de date côté serveur, créer la date maintenant
    const messageDate = msg.date ? new Date(msg.date) : new Date();
    const formattedDate = messageDate.toLocaleString();

    li.innerHTML = `
      <div class="header">
        <span class="name">${msg.name}</span>
        <span class="date">${formattedDate}</span>
      </div>
      <span class="message">${msg.message}</span>
    `;
    messagesList.appendChild(li);
  });
}

// Soumission du formulaire
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const message = document.getElementById("message").value;
  const date = new Date().toISOString(); // date automatique au moment de l'envoi

  await fetch("/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, message, date })
  });

  form.reset();
  loadMessages();
});

// Charger les messages à l'ouverture de la page
loadMessages();

