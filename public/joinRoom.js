function joinRoom(roomName) {
  // Send this roomName to the server to join it
  nsSocket.emit('joinRoom', roomName);

  nsSocket.on('historyCatchUp', (history) => {
    // console.log(history);
    const messagesUl = document.getElementById('messages');
    messagesUl.innerHTML = '';
    history.forEach((msg) => {
      const newMsg = buildHTML(msg);
      messagesUl.innerHTML += newMsg;
    });

    // scroll to the beggining of the chat
    messagesUl.scrollTo(0, messagesUl.scrollHeight);
  });

  // listen for members in the room amount event
  nsSocket.on('updateMembers', (numberOfMembers) => {
    document.querySelector(
      '.curr-room-num-users'
    ).innerHTML = `${numberOfMembers} <span class="glyphicon glyphicon-user"></span
    >`;
    document.querySelector('.curr-room-text').innerText = roomName;
  });
}
