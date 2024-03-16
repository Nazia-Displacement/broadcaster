// ############################################################################
// # Imports
// ############################################################################
const { app, BrowserWindow, ipcMain, Tray, Menu } = require("electron/main");
const path = require("node:path");
const midi = require("midi");

// Setup a custom menu with a small change to the
// file -> Exit functionality. This was needed in order to make the applicaiton
// truly close when this option was selected because of the addition of closing
// to system tray when using the X button.
require("./customMenu.js");

// ############################################################################
// # Global variables
// ############################################################################
let mainWindow; // Global variable referencing the applications visible window
let input; // Global variable housing the midi input data
let output; // Gloval Variable house the midi output data
let currentPort = -1; // Global variable denoting the currently open Midi port

// Regarding the currentPort global -1 means no port in this application.

// ############################################################################
// # Single Instance Lock - Make it such that only one instance
// # of the application will run at a time.
// ############################################################################
const singleInstanceLock = app.requestSingleInstanceLock();
if (!singleInstanceLock) {
  app.quit();
  return;
}

app.on("second-instance", () => {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    mainWindow.show();
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

// ############################################################################
// # Setup window properties
// ############################################################################

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    icon: path.join(__dirname, "./logo.png"),
    title: "Midi to Server",
  });

  mainWindow.loadFile("index.html");

  // Prevent the X button from killing the window. Instead Send it to the system tray.
  mainWindow.on("close", function (event) {
    if (process.platform !== "darwin") {
      event.preventDefault();
      mainWindow.hide();
    }
  });
}

// ############################################################################
// # Setup Midi Input
// ############################################################################

input = new midi.Input();
output = new midi.Output();
input.ignoreTypes(false, false, false); // ignore subsets of midi data we are not using

// This function runs every noteOn, noteOff, and controllerchanged, amongst others.
input.on("message", (deltaTime, message) => {
  // The message is an array of numbers corresponding to the MIDI bytes:
  //   [status, data1, data2]
  // https://www.cs.cf.ac.uk/Dave/Multimedia/node158.html has some helpful
  // information interpreting the messages.
  mainWindow.webContents.send("MidiMessage", { message, deltaTime });
});

// ############################################################################
// # IPC handling functions
// ############################################################################

// Gets all the midi devices and their ports the system can find
// Some odd behavoir to point out. This function doens't seems to
// remove ports once they have been found. I've attempted a few
// work arounds but to no avail. A restart of the app may be required
// in some cases.
function updateMidiPorts() {
  // Store port names in an array
  const ports = [];
  // Count the available input ports and loop through them.
  for (let i = 0; i < input.getPortCount(); i++) {
    // Get the name of each input port.
    ports.push(input.getPortName(i));
  }
  // return array of names to caller
  return ports;
}

// Send to the renderer the current port or a message detailing how to fix errors.
function getOpenedPort() {
  if (currentPort < 0) {
    mainWindow.webContents.send("PortOpened", `None`);
    return;
  }
  // Calling open port to ensure the port is still valid.
  openPort(currentPort);
}

function openPort(port) {
  input.closePort();
  output.closePort();

  try {
    input.openPort(Number(port));
    output.openPort(Number(port));
    currentPort = port;
  } catch (e) {
    // if the port is not valid give the user some indication and steps to fix.
    console.error(e);
    mainWindow.webContents.send(
      "PortOpened",
      "\nThe selected port failed" +
        "\nPlease use the get devices button and try opening the port again." +
        "\nIf errors continue please restart the app." +
        "\nNote: to fully close the app you must right click the icon in the system tray and choose quit."
    );
    currentPort = -1;
    return;
  }
  let ports = updateMidiPorts();
  mainWindow.webContents.send(
    "PortOpened",
    `${ports[currentPort]} - ${currentPort}`
  );
}

function closePort() {
  input.closePort();
  output.closePort();
  currentPort = -1;
  mainWindow.webContents.send("PortOpened", `None`);
}

function updatePanel(value) {
  console.log("Here with value! " + value);
  output.sendMessage([144, 60, value]);
}

// ############################################################################
// # Application ready setup
// ############################################################################
app.whenReady().then(() => {
  // IPC intercom Listeners - calls functions from IPC handling functions:
  ipcMain.handle("updateMidiPorts", updateMidiPorts);
  ipcMain.on("getOpenedPort", getOpenedPort);
  ipcMain.on("openPort", (ev, port) => openPort(port));
  ipcMain.on("closePort", closePort);
  ipcMain.on("updatePanel", (ev, value) => updatePanel(value));

  // Setup visuals and behaviors for tray icon.
  var appIcon = new Tray(path.join(__dirname, "./logo.png"));
  var contextMenu = Menu.buildFromTemplate([
    {
      label: "Show App",
      click: function () {
        mainWindow.show();
      },
    },
    {
      label: "Quit",
      click: function () {
        mainWindow.destroy();
        app.quit();
      },
    },
  ]);
  appIcon.on("double-click", () => {
    mainWindow.show();
  });
  appIcon.setContextMenu(contextMenu);

  // Create window
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  // Call Update ports on start to see if devices are already connected
  const ports = updateMidiPorts();
  // If there are devices connected then connect to the first one
  if (ports.length > 0) {
    input.openPort(0);
    currentPort = 0;
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    mainWindow = null; // This feels uneeded but just in case I'm keeping it.
    app.quit();
  }
});
