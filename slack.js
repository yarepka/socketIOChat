const express = require('express');
const app = express();
const socketio = require('socket.io');

// get array of namespaces
let namespaces = require('./data/namespaces');

// here we use express for
app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(9000);
const io = socketio(expressServer);

// default namespace
io.on('connection', (socket) => {
  // build an array to send back with the image and endpoint for each namespace
  let nsData = namespaces.map((ns) => {
    return {
      img: ns.img,
      endpoint: ns.endpoint,
    };
  });

  // send nsData to client through the socket
  socket.emit('nsList', nsData);
});

// loop through each namespace and listen for a connection
for (let namespace of namespaces) {
  io.of(namespace.endpoint).on('connection', (nsSocket) => {
    console.log(`${nsSocket.id} has join ${namespace.endpoint}`);
    // a socket has connected to one of our chatgroup namespaces.
    // send that ns rooms info back
    nsSocket.emit('nsRoomLoad', namespace.rooms);

    // listen for a room join / it uses ack function passed from the client
    nsSocket.on('joinRoom', (roomToJoin, numberOfUsersCallback) => {
      // joing room
      nsSocket.join(roomToJoin);

      // find room ojbect for roomToJoin and send it's history to client
      const nsRoom = namespace.rooms.find((room) => room.title === roomToJoin);
      console.log(nsRoom);
      nsSocket.emit('historyCatchUp', nsRoom.history);

      // send the number of users in this room to client
      io.of(namespace.endpoint)
        .in(roomToJoin)
        .clients((error, clients) => {
          io.of(namespace.endpoint)
            .in(roomToJoin)
            .emit('updateMembers', clients.length);
        });
    });

    nsSocket.on('newMessageToServer', (msg) => {
      const fullMsg = {
        text: msg.text,
        time: Date.now(),
        username: 'yarepka',
        avatar: 'https://via.placeholder.com/30',
      };
      console.log(msg);
      // send this message to ALL the sockets that are in the rome that THIS socket is in
      // how can we find out what rooms THIS socket is in?
      console.log(nsSocket.rooms);
      // the user will be in the 2nd room in the object list
      // this is because the socket ALWAYS joins its own room on connection
      // get the keys
      const roomTitle = Object.keys(nsSocket.rooms)[1];

      // find room ojbect for curret roomTitle
      const nsRoom = namespace.rooms.find((room) => room.title === roomTitle);
      // add message to the room history
      nsRoom.addMessage(fullMsg);

      io.of(namespace.endpoint).to(roomTitle).emit('messageToClients', fullMsg);
    });
  });
}
