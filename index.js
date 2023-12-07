const portList = document.getElementById("portList");

const getDevicesBtn = document.getElementById("getDevicesBtn");
getDevicesBtn.onclick = () => {
  updatePortList();
};

const openPortBtn = document.getElementById("openPortBtn");
openPortBtn.onclick = () => {
  window.electronAPI.openPort(portList.value);
};

const closePortBtn = document.getElementById("closePortBtn");
closePortBtn.onclick = () => {
  window.electronAPI.closePort();
  document.getElementById("lastMessage").innerText = "";
};

const refreshPortBtn = document.getElementById("refreshPortBtn");
refreshPortBtn.onclick = () => {
  window.electronAPI.getOpenedPort();
};

async function updatePortList() {
  while (portList.firstChild != null) {
    portList.removeChild(portList.firstChild);
  }
  const ports = await window.electronAPI.updateMidiPorts();
  ports.forEach((p, i) => {
    const optionElm = document.createElement("option");
    optionElm.value = i;
    optionElm.innerText = `${p}`;
    portList.append(optionElm);
  });
}

updatePortList();
window.electronAPI.getOpenedPort();
