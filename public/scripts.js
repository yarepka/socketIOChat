let socket = io('http://localhost:9000'); // the / namespace/endpoint
let nsSocket = '';

// listen for nsList, which is the list of all the namespaces
socket.on('nsList', (nsData) => {
  console.log('The list of namespaces has arrived!', nsData);
  let namespacesDiv = document.querySelector('.namespaces');
  namespacesDiv.innerHTML = '';

  nsData.forEach((ns) => {
    namespacesDiv.innerHTML += `<div class='namespace' ns=${ns.endpoint}><img src="${ns.img}" /></div>`;
  });

  // Add a click Listener for each NS
  document.querySelectorAll('.namespace').forEach((element) => {
    element.addEventListener('click', (e) => {
      const nsEndpoint = element.getAttribute('ns');
      console.log(`${nsEndpoint} I would go to now`);
    });
  });
  joinNs('/wiki');
});
