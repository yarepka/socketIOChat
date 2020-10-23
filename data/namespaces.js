// Bring in the room class
const Namespace = require('../classes/Namespace');
const Room = require('../classes/Room');

// Set up the namespaces
let namespaces = [];
let wikiNs = new Namespace(
  0,
  'Wiki',
  'https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/103px-Wikipedia-logo-v2.svg.png',
  '/wiki'
);
let mozNs = new Namespace(
  1,
  'Mozilla',
  'https://www.mozilla.org/media/img/logos/firefox/logo-quantum.9c5e96634f92.png',
  '/mozilla'
);
let linuxNs = new Namespace(
  2,
  'Linux',
  'https://upload.wikimedia.org/wikipedia/commons/a/af/Tux.png',
  '/linux'
);

// Make the main room and add it to rooms. it will ALWAYS be 0
wikiNs.addRoom(new Room(0, 'New Articles', wikiNs.title));
wikiNs.addRoom(new Room(1, 'Editors', wikiNs.title));
wikiNs.addRoom(new Room(2, 'Other', wikiNs.title));

mozNs.addRoom(new Room(0, 'Firefox', mozNs.title));
mozNs.addRoom(new Room(1, 'SeaMonkey', mozNs.title));
mozNs.addRoom(new Room(2, 'SpiderMonkey', mozNs.title));
mozNs.addRoom(new Room(3, 'Rust', mozNs.title));

linuxNs.addRoom(new Room(0, 'Debian', linuxNs.title));
linuxNs.addRoom(new Room(1, 'Red Hat', linuxNs.title));
linuxNs.addRoom(new Room(2, 'MacOs', linuxNs.title));
linuxNs.addRoom(new Room(3, 'Kernal Development', linuxNs.title));

namespaces.push(wikiNs, mozNs, linuxNs);

module.exports = namespaces;
