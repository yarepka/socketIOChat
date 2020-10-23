class Namespace {
  constructor(id, title, img, endpoint) {
    this.id = id;
    this.title = title;
    this.img = img;
    this.endpoint = endpoint;
    this.rooms = [];
  }

  addRoom(room) {
    this.rooms.push(room);
  }
}

module.exports = Namespace;
