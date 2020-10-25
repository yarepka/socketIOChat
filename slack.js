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
  console.log(socket.handshake);
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
    const username = nsSocket.handshake.query.username;
    // a socket has connected to one of our chatgroup namespaces.
    // send that ns rooms info back
    nsSocket.emit('nsRoomLoad', namespace.rooms);

    // listen for a room join / it uses ack function passed from the client
    nsSocket.on('joinRoom', (roomToJoin) => {
      // remember nsSocket joins its own room on connection, so
      // nsSocket.rooms always have 1 room
      const roomToLeave = Object.keys(nsSocket.rooms)[1];
      console.log('roomToLeave: ', roomToLeave);
      console.log('roomToJoin: ', roomToJoin);
      console.log('nsSocket.rooms: ', nsSocket.rooms);
      // leave the roome
      nsSocket.leave(roomToLeave);
      // send the number of users in this room to client
      updateUsersInRoom(namespace, roomToLeave);
      // joing room
      nsSocket.join(roomToJoin);
      // find room ojbect for roomToJoin and send it's history to client
      const nsRoom = namespace.rooms.find((room) => room.title === roomToJoin);
      nsSocket.emit('historyCatchUp', nsRoom.history);
      // send the number of users in this room to client
      updateUsersInRoom(namespace, roomToJoin);
    });

    nsSocket.on('newMessageToServer', (msg) => {
      const fullMsg = {
        text: msg.text,
        time: Date.now(),
        username: username,
        avatar: 'https://via.placeholder.com/30',
      };
      // send this message to ALL the sockets that are in the rome that THIS socket is in
      // how can we find out what rooms THIS socket is in?
      // the user will be in the 2nd room in the object list
      // this is because the socket ALWAYS joins its own room on connection
      // get the keys
      console.log('nsSocket.rooms: ', nsSocket.rooms);
      const roomTitle = Object.keys(nsSocket.rooms)[1];
      console.log(namespace.rooms);
      // find room ojbect for curret roomTitle
      console.log('roomTitle: ', roomTitle);
      const nsRoom = namespace.rooms.find((room) => room.title === roomTitle);
      // add message to the room history
      nsRoom.addMessage(fullMsg);

      io.of(namespace.endpoint).to(roomTitle).emit('messageToClients', fullMsg);
    });
  });
}

function updateUsersInRoom(namespace, roomToJoin) {
  // send the number of users in this room to client
  io.of(namespace.endpoint)
    .in(roomToJoin)
    .clients((error, clients) => {
      io.of(namespace.endpoint)
        .in(roomToJoin)
        .emit('updateMembers', clients.length);
    });
}
