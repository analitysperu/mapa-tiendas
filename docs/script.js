// Create map (centered on Peru)
const map = L.map('map').setView([-10, -76], 6);

// OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Marker cluster
const cluster = L.markerClusterGroup();

// Store all data
let allData = [];

// Load JSON data
fetch('LOCFULL.json')
  .then(response => response.json())
  .then(data => {
    allData = data;
    drawMarkers('');
  })
  .catch(err => console.error('Error loading JSON:', err));

// Draw markers with optional name filter
function drawMarkers(searchText) {
  cluster.clearLayers();

  allData.forEach(p => {
    if (
      p.LAT &&
      p.LON &&
      p.Nombre &&
      p.Nombre.toLowerCase().includes(searchText.toLowerCase())
    ) {
      const marker = L.marker([p.LAT, p.LON]);

      marker.bindPopup(`
        <b>${p.Nombre}</b><br>
        Lat: ${p.LAT}<br>
        Lon: ${p.LON}
      `);

      cluster.addLayer(marker);
    }
  });

  map.addLayer(cluster);
}

// Name filter listener
document.getElementById('nameFilter').addEventListener('input', e => {
  drawMarkers(e.target.value);
});
