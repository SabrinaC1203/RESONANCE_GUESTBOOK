const form = document.getElementById("guestbook-form");
const messagesList = document.getElementById("messages");

// Load existing messages
async function loadMessages() {
  const res = await fetch("/messages");
  const messages = await res.json();

  messagesList.innerHTML = "";

  messages.forEach(msg => {
    const li = document.createElement("li");

    li.innerHTML = `
      <strong>${msg.name}</strong>: ${msg.message}
      <button class="delete-btn">🗑</button>
    `;

    li.querySelector(".delete-btn").addEventListener("click", async () => {
      await fetch(`/messages/${msg.id}`, {
        method: "DELETE"
      });
      loadMessages();
    });

    messagesList.appendChild(li);
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const message = document.getElementById("message").value;

  await fetch("/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, message })
  });

  form.reset();
  loadMessages();
});

// Load messages when page opens
loadMessages();
