const channel = new BroadcastChannel("quiz_channel");
let isHost = false;
let team = "";

function initHost() {
  isHost = true;
  channel.onmessage = (e) => {
    if (e.data.type === "buzz") {
      addBuzz(e.data.team);
    }
  };
}

function initTeam() {
  team = prompt("Enter your team name:");
  document.getElementById("teamName").innerText = team;

  channel.onmessage = (e) => {
    if (e.data.type === "lock") {
      document.getElementById("buzzBtn").disabled = true;
      document.getElementById("status").innerText = "Buzz locked!";
    }
    if (e.data.type === "reset") {
      document.getElementById("buzzBtn").disabled = false;
      document.getElementById("status").innerText = "";
    }
  };
}

function buzz() {
  channel.postMessage({
    type: "buzz",
    team: team,
    time: Date.now()
  });

  document.getElementById("buzzBtn").disabled = true;
}

let buzzedTeams = [];

function addBuzz(team) {
  if (buzzedTeams.length === 0) {
    channel.postMessage({ type: "lock" });
  }

  if (!buzzedTeams.includes(team)) {
    buzzedTeams.push(team);
    renderBuzzes();
  }
}

function renderBuzzes() {
  const list = document.getElementById("buzzList");
  list.innerHTML = "";
  buzzedTeams.forEach((team, index) => {
    const li = document.createElement("li");
    li.innerText = `${index + 1}. ${team}`;
    list.appendChild(li);
  });
}

function startBuzzerRound() {
  buzzedTeams = [];
  renderBuzzes();
  channel.postMessage({ type: "reset" });
}

function resetBuzzers() {
  buzzedTeams = [];
  renderBuzzes();
  channel.postMessage({ type: "reset" });
}
