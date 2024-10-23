const { contextBridge, ipcRenderer } = require("electron/renderer");

// ############################################################################
// # Functions to texpose in index.js (renderer)
// # Call backend (app.js) functions
// ############################################################################
contextBridge.exposeInMainWorld("electronAPI", {
  updateMidiPorts: () => ipcRenderer.invoke("updateMidiPorts"),
  getOpenedPort: () => ipcRenderer.send("getOpenedPort"),
  openPort: (port) => ipcRenderer.send("openPort", port),
  closePort: () => ipcRenderer.send("closePort"),
  updatePanel: (value) => ipcRenderer.send("updatePanel", value),
  updateColors: (value) => ipcRenderer.send("updateColors", value),
  receive: (channel, func) => {
    let validChannels = ["MidiMessage", "PortOpened", "PortClosed"];
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
});

// ############################################################################
// # Run on web page load
// ############################################################################
window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ["chrome", "node", "electron"]) {
    replaceText(`${type}-version`, process.versions[type]);
  }
});
