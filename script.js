// Personalizar css no mapa
const myCustomColourUser = 'background-color: red;';
const markerHtml = `
    width: 2rem;
    height: 2rem;
    display: block;
    left: -1.5rem;
    top: -1.5rem;
    position: relative;
    border-radius: 3rem 3rem 0;
    transform: rotate(45deg);
    border: 3px solid red;`;

// Coordenadas do Ponto A - R. Tonico de Pina - St. Central, Anápolis - GO, 75023-055
let coordDiesel = [-16.3232, -48.9543];  
// Coordenadas do Ponto B - Destino
let coordUser = [];

// Armazenar uma referência ao marcador do ônibus
let busMarker;

// Iniciar o mapa com coordenadas do ponto A (Anápolis)
const map = L.map('map').setView(coordDiesel, 15);

const tileLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);

// Personalizar Ponto no mapa com imagem do diesel
const dieselIcon = L.icon({
    className: "diesel-pointers",
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/9249/9249336.png',
    iconSize: [45, 45]
});
busMarker = L.marker(coordDiesel, { icon: dieselIcon }).addTo(map);

function startService() {
    // Identifica a melhor rota para iniciar a viagem
    const control = L.Routing.control({
        waypoints: [
            L.latLng(coordDiesel[0], coordDiesel[1]),
            L.latLng(coordUser[0], coordUser[1])
        ],
        routeWhileDragging: true // Atualiza a rota enquanto arrasta os pontos no mapa
    }).on('routesfound', function (e) {
        const route = e.routes[0];
        const coordinates = route.coordinates;
        followRoute(coordinates);
    }).addTo(map);
}

function followRoute(coordinates) {
    let index = 0;
    const interval = setInterval(() => {
        if (index >= coordinates.length) {
            clearInterval(interval);
            return;
        }
        const coordinate = coordinates[index];
        busMarker.setLatLng([coordinate.lat, coordinate.lng]);
        map.panTo([coordinate.lat, coordinate.lng]);
        index++;
    }, 1000); // Change this interval according to your preference
}

// Adicione um evento de mudança para o seletor suspenso de rotas
document.getElementById('route-select').addEventListener('change', function() {
    var selectedRoute = this.value;
    // Limpe o mapa antes de atualizar as coordenadas da rota
    map.eachLayer(function(layer) {
        if (layer !== tileLayer && layer !== busMarker) {
            map.removeLayer(layer);
        }
    });
    // Atualize a rota com base na seleção do usuário
    switch (selectedRoute) {
        case 'rota1':
            // Rota Unievangelica
            coordDiesel = [-16.3232, -48.9543]; // "R. Tonico de Pina - St. Central, Anápolis - GO, 75023-055"
            coordUser = [-16.29424570841718, -48.94567732194342]; // "Av. Universitária, s/n - Cidade Universitária, Anápolis - GO"
            break;
        case 'rota2':
            // Rota Parque Ipiranga
            coordDiesel = [-16.3232, -48.9543]; // "R. Tonico de Pina - St. Central, Anápolis - GO, 75023-055"
            coordUser = [-16.33663814007476, -48.94059804741932]; // "R. 10, 296-462 - Lourdes, Anápolis - GO, 75095-690"
            break;
        case 'rota3':
            // Rota Brasil Park Shopping
            coordDiesel = [-16.3232, -48.9543]; // "R. Tonico de Pina - St. Central, Anápolis - GO, 75023-055"
            coordUser = [-16.32416342943865, -48.94802209124979]; // "Av. Brasil Norte, 505 - Centro, Anápolis - GO, 75113-570"
            break;
        default:
            // Se nenhuma rota for selecionada, não faça nada
            return;
    }
});

// Adicione um evento de clique para o botão "Confirmar Rota"
document.getElementById('confirm-route-btn').addEventListener('click', function() {
    // Verifique se as coordenadas do Diesel e do Usuário foram definidas
    if (coordDiesel && coordUser) {
        startService();
    } else {
        alert("Por favor, selecione uma rota antes de confirmar.");
    }
});

document.getElementById('view-schedule-btn').addEventListener('click', function() {
    window.location.href = 'pagina-de-horarios.html'; // Altere 'pagina-de-horarios.html' para o URL correto
});

//validador de seleção de rota

document.getElementById('view-schedule-btn').addEventListener('click', function() {
    const routeSelect = document.getElementById('route-select');
    if (routeSelect.value === '') {
        alert('Por favor, selecione uma rota.');
    } else {
        window.location.href = 'pagina-de-horarios.html'; // Altere 'pagina-de-horarios.html' para o URL correto
    }
});
// Função para armazenar a rota selecionada no armazenamento local
function salvarRotaSelecionada(rota) {
    localStorage.setItem('rotaSelecionada', rota);
}

// Função para carregar a rota selecionada do armazenamento local
function carregarRotaSelecionada() {
    return localStorage.getItem('rotaSelecionada');
}
