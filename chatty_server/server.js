// server.js

const express = require('express');
const SocketServer = require('ws').Server;
const uuidv1 = require('uuid/v1');

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.

let currentColorChoice = 0;
const pickColor = function(colorChoice){
  let colors = ['red', 'blue', 'green', 'yellow'];
  return colors[colorChoice];
}

const incrementColorChoice = function(){
  if(currentColorChoice >= 3){
    return currentColorChoice = 0;
  }else{
    return currentColorChoice += 1;
  }
}

wss.on('connection', (ws) => {

  wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === ws.OPEN) {
        client.send(data);
      }
    });
  };

  console.log('Client connected');
  const color = pickColor(currentColorChoice)
  incrementColorChoice();

  let connections = {
    type: "connectedUsers",
    size: wss.clients.size
  }

  const openConnection = {
    type: "incomingConnection",
    connected: true,
    id: uuidv1()
  }

  wss.broadcast(JSON.stringify(openConnection));
  wss.broadcast(JSON.stringify(connections));

  ws.on('message', function incoming(data) {
    const newData = JSON.parse(data);
    newData.id = uuidv1();
    switch (newData.type){
      case 'postMessage':
        newData.type = 'incomingMessage';
        newData.color = color;
        break;
      case 'postNotification':
        newData.type = 'incomingNotification';
        break;
      default:
        console.log("Unexpected data type: ", newData);
      }
  // Broadcast to everyone else.
    wss.broadcast(JSON.stringify(newData));
  });


  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    console.log('Client disconnected');

    connections.size = wss.clients.size;

    const closedConnection = {
      type: "incomingConnection",
      connected: false
    }

    wss.broadcast(JSON.stringify(connections));
    wss.broadcast(JSON.stringify(closedConnection));

  });
  ws.on('error', (error) => {
    console.log(error);
  })
});
