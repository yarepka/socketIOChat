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

  let searchBox = document.getElementById('search-box');
  searchBox.addEventListener('input', (e) => {
    console.log(e.target.value);
    // grab all messages
    let messages = document.querySelectorAll('.message-text');
    console.log(messages);
    // loop over messages
    messages.forEach((msg) => {
      if (
        msg.innerText.toLowerCase().indexOf(e.target.value.toLowerCase()) === -1
      ) {
        // the msg does not contain the user search term
        msg.style.display = 'none';
      } else {
        msg.style.display = 'block';
      }
    });
  });
}
