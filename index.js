// ############################################################################
// # Global UI Element References
// ############################################################################
//Midi
const getDevicesBtn = document.getElementById("getDevicesBtn");
const portList = document.getElementById("portList");
const openPortBtn = document.getElementById("openPortBtn");
const closePortBtn = document.getElementById("closePortBtn");
const refreshPortBtn = document.getElementById("refreshPortBtn");
const portOpen = document.getElementById("openPortInfo");
const lastMessage = document.getElementById("lastMessage");

//Socket
const socketLogin = document.getElementById("socketLogin");
const socketLoginSecret = document.getElementById("socketLoginSecret");
const socketConnectionStatus = document.getElementById("serverConStatus");

// ############################################################################
// # Socket IO Related globals
// ############################################################################
let socket;
let socketConnectionCheck;

// ############################################################################
// # UI Callbacks Setups
// ############################################################################
getDevicesBtn.onclick = () => {
  updatePortList();
};

openPortBtn.onclick = () => {
  window.electronAPI.openPort(portList.value);
};

closePortBtn.onclick = () => {
  window.electronAPI.closePort();
  document.getElementById("lastMessage").innerText = "";
};

refreshPortBtn.onclick = () => {
  window.electronAPI.getOpenedPort();
};

socketLogin.onclick = () => {
  clearInterval(socketConnectionCheck);
  connectSocket();
  socketConnectionCheck = setInterval(checkConnection, 1000);
};

// ############################################################################
// # UI Callback Implmentations
// ############################################################################
async function updatePortList() {
  while (portList.firstChild != null) {
    portList.removeChild(portList.firstChild);
  }
  const ports = await window.electronAPI.updateMidiPorts();
  const optionElm = document.createElement("option");
  ports.forEach((p, i) => {
    optionElm.value = i;
    optionElm.innerText = `${p}`;
    portList.append(optionElm);
  });
}

// ############################################################################
// # Socket IO Related functions
// ############################################################################
function connectSocket() {
  socketConnectionStatus.innerText = "Contecting...🟡";
  if (socket) socket.disconnect();

  console.log(socketLoginSecret.value);
  //socket = io("http://127.0.0.1:3001", {
  socket = io("https://displacementserver.isaachisey.com", {
    query: {
      token: "Nazia.MIDI.Project",
      secret: socketLoginSecret.value,
    },
  });
  
  socket.on("panel_update", (value) => {
    console.log(value);
    window.electronAPI.updatePanel(value);
  });

  socket.on("lights_update", (colors) => {
    window.electronAPI.updateColors(colors);
  });
}

function checkConnection() {
  if (!socket) {
    socketConnectionStatus.innerText = "Disconnected 🔴";
    return;
  }

  if (socket.connected) socketConnectionStatus.innerText = "Connected 🟢";
  else socketConnectionStatus.innerText = "Disconnected 🔴";
}

// ############################################################################
// # Messages to listen for from backend (app.js)
// ############################################################################
window.electronAPI.receive("MidiMessage", (message) => {
  lastMessage.innerText = `Message: ${
    message.message
  } - DT: ${message.deltaTime.toFixed(2)}`;

  if (socket) socket.emit("midi-message", message);
});

window.electronAPI.receive("PortOpened", (message) => {
  portOpen.innerText = message;
});

window.electronAPI.receive("PortClosed", (message) => {
  console.log(message);
});

// ############################################################################
// # Run on load
// ############################################################################
updatePortList();
window.electronAPI.getOpenedPort();
