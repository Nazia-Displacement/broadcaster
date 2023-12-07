const { contextBridge, ipcRenderer } = require("electron/renderer");

contextBridge.exposeInMainWorld("electronAPI", {
  updateMidiPorts: () => ipcRenderer.invoke("updateMidiPorts"),
  getOpenedPort: () => ipcRenderer.send("getOpenedPort"),
  openPort: (port) => ipcRenderer.send("openPort", port),
  closePort: () => ipcRenderer.send("closePort"),
});

ipcRenderer.on("MidiMessage", (evt, message) => {
  const elm = document.getElementById("lastMessage");
  elm.innerText = `Message: ${
    message.message
  } - DT: ${message.deltaTime.toFixed(2)}`;
});

ipcRenderer.on("PortOpened", (evt, message) => {
  const elm = document.getElementById("openPortInfo");
  if (elm != null) {
    elm.innerText = message;
  }
});

ipcRenderer.on("PortClosed", (evt, message) => {
  console.log(message);
});

window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ["chrome", "node", "electron"]) {
    replaceText(`${type}-version`, process.versions[type]);
  }
});
