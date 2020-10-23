class Room {
  constructor(id, title, namespace, privateRoom = false) {
    this.id = id;
    this.title = title;
    this.namespace = namespace;
    this.privateRoom = privateRoom;
    this.history = [];
  }

  addMessage(message) {
    this.history.push(message);
  }

  clearHistory() {
    this.history = [];
  }
}

module.exports = Room;
