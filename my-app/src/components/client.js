const net = require("net-browserify");

const socket = new net.Socket();

socket.connect(5000, "localhost", () => {
  console.log("Connected to server");
});

socket.on("data", (data) => {
  const strData = data.toString();
  console.log(`Received: ${strData}`);
});

socket.on("end", () => {
  console.log("Disconnected from server");
});

socket.on("error", (error) => {
  console.log(`Socket Error: ${error.message}`);
});

const sendData = (data) => {
  socket.write(data);
};

export { sendData };
