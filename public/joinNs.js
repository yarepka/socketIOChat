// connect to Namespace
function joinNs(endpoint) {
  if (nsSocket) {
    // close socket
    nsSocket.close();

    // remove the eventListener before it's added again
    document
      .getElementById('user-input')
      .removeEventListener('submit', formSubmission);
  }
  nsSocket = io(`http://localhost:9000${endpoint}`);
  nsSocket.on('nsRoomLoad', (nsRooms) => {
    // get rooms list (html)
    let roomList = document.querySelector('.room-list');
    roomList.innerHTML = '';

    // add rooms (html)
    nsRooms.forEach((room) => {
      let glyph = room.privateRoom ? 'lock' : 'globe';
      roomList.innerHTML += `<li class='room'>
      <span class="glyphicon glyphicon-${glyph}"></span>${room.title}
    </li>`;
    });

    // get rooms (html)
    let roomNodes = document.querySelectorAll('.room');

    // add click listener to each room
    roomNodes.forEach((room) => {
      room.addEventListener('click', (e) => {
        // join the room
        joinRoom(room.innerText);
      });
    });

    // add room automatically... first time here
    const topRoom = document.querySelector('.room');
    const topRoomName = topRoom.innerText;
    // console.log('topRoomName: ', topRoomName);
    joinRoom(topRoomName);
  });

  nsSocket.on('messageToClients', (msg) => {
    console.log(msg);
    document.getElementById('messages').innerHTML += buildHTML(msg);
  });

  document
    .querySelector('.message-form')
    .addEventListener('submit', formSubmission);
}

function formSubmission(event) {
  event.preventDefault();
  const newMessage = document.getElementById('user-message').value;
  nsSocket.emit('newMessageToServer', { text: newMessage });
}

function buildHTML(msg) {
  const convertedDate = new Date(msg.time).toLocaleString();
  const newHTML = `
  <li>
    <div class="user-image">
      <img src=${msg.avatar} />
    </div>

    <div class="user-message">
      <div class="user-name-time">${msg.username} <span>${convertedDate}</span></div>
      <div class="message-text">${msg.text}</div>
    </div>
  </li>
`;

  return newHTML;
}
