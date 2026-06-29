// ---------------- KNOWLEDGE BASE ----------------
const knowledgeBase = {
  wifi: {
    keywords: ["wifi", "internet", "network"],
    reply: `📡 Wi-Fi Troubleshooting:
1. Restart router
2. Toggle Wi-Fi
3. Forget network
4. Check Airplane mode
5. Update drivers`
  },

  slow: {
    keywords: ["slow", "lag", "freeze"],
    reply: `🐢 Slow PC Fix:
1. Restart PC
2. Close apps
3. Check storage
4. Scan for malware`
  },

  bluescreen: {
    keywords: ["blue screen", "bsod"],
    reply: `💻 Blue Screen Fix:
1. Note error code
2. Remove new hardware
3. Update drivers
4. Test RAM`
  },

  printer: {
    keywords: ["printer", "print"],
    reply: `🖨 Printer Fix:
1. Check power
2. Reconnect cable/Wi-Fi
3. Clear queue
4. Reinstall driver`
  }
};

// ---------------- STORAGE ----------------
let tickets = JSON.parse(localStorage.getItem("tickets")) || [];
let chatHistory = JSON.parse(localStorage.getItem("chat")) || [];

// ---------------- PRIORITY ----------------
function getPriority(text) {
  text = text.toLowerCase();

  if (text.includes("down") || text.includes("not working") || text.includes("won't")) {
    return "High";
  }
  if (text.includes("slow") || text.includes("lag")) {
    return "Medium";
  }
  return "Low";
}

// ---------------- CREATE TICKET ----------------
function createTicket(issue) {
  const ticket = {
    id: Date.now(),
    issue,
    status: "Open",
    priority: getPriority(issue),
    time: new Date().toLocaleString()
  };

  tickets.push(ticket);
  localStorage.setItem("tickets", JSON.stringify(tickets));

  return ticket.id;
}

// ---------------- DIAGNOSE ----------------
function diagnose() {
  const input = document.getElementById("question");
  const chat = document.getElementById("chat");

  const question = input.value.toLowerCase();

  let answer = "❓ Issue not recognized. Creating ticket...";

  for (let key in knowledgeBase) {
    if (knowledgeBase[key].keywords.some(k => question.includes(k))) {
      answer = knowledgeBase[key].reply;
      break;
    }
  }

  const ticketId = createTicket(input.value);

  const userMsg = `You: ${input.value}`;
  const aiMsg = `AI: ${answer} (Ticket #${ticketId})`;

  chat.innerHTML += `<p>${userMsg}</p><p>${aiMsg}</p><hr>`;

  chatHistory.push(userMsg, aiMsg);
  localStorage.setItem("chat", JSON.stringify(chatHistory));

  input.value = "";
  chat.scrollTop = chat.scrollHeight;
}

// ---------------- SHOW TICKETS ----------------
function showTickets() {
  const list = document.getElementById("ticketList");

  if (tickets.length === 0) {
    list.innerHTML = "<p>No tickets yet.</p>";
    return;
  }

  list.innerHTML = tickets.map(t => `
    <div>
      <b>#${t.id}</b><br>
      Issue: ${t.issue}<br>
      Priority: ${t.priority}<br>
      Status: ${t.status}<br>
      Time: ${t.time}<br>
      <button onclick="closeTicket(${t.id})">Close</button>
    </div>
  `).join("");
}

// ---------------- SEARCH TICKETS ----------------
function searchTickets() {
  const query = document.getElementById("searchBox").value.toLowerCase();
  const list = document.getElementById("ticketList");

  const filtered = tickets.filter(t =>
    t.issue.toLowerCase().includes(query)
  );

  list.innerHTML = filtered.map(t => `
    <div>
      <b>#${t.id}</b><br>
      Issue: ${t.issue}<br>
      Priority: ${t.priority}<br>
      Status: ${t.status}<br>
      Time: ${t.time}<br>
      <button onclick="closeTicket(${t.id})">Close</button>
    </div>
  `).join("");
}

// ---------------- CLOSE TICKET ----------------
function closeTicket(id) {
  tickets = tickets.map(t => {
    if (t.id === id) {
      t.status = "Closed";
    }
    return t;
  });

  localStorage.setItem("tickets", JSON.stringify(tickets));
  showTickets();
}

// ---------------- DASHBOARD ----------------
function showStats() {
  const stats = document.getElementById("stats");

  const open = tickets.filter(t => t.status === "Open").length;
  const closed = tickets.filter(t => t.status === "Closed").length;

  stats.innerHTML = `
    <p>Total: ${tickets.length}</p>
    <p>Open: ${open}</p>
    <p>Closed: ${closed}</p>
  `;
}
