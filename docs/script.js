// Create map (centered on Peru)
const map = L.map('map').setView([-10, -76], 6);

// OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Marker cluster
const cluster = L.markerClusterGroup();
map.addLayer(cluster);

// Store all data
let allData = [];

// Load JSON data
fetch("./LOCFULL.json")
  .then(response => response.json())
  .then(data => {
    allData = data;
    drawMarkers(''); // draw all markers initially
  })
  .catch(err => console.error('Error loading JSON:', err));

// Draw markers with optional name filter
function drawMarkers(searchText) {
  cluster.clearLayers();

  let firstMatch = null; 

  allData.forEach(p => {
    if (p.LAT && p.LON && p.NOMBRE) {
      // If search is empty, show all; otherwise only exact matches
      if (!searchText || p.NOMBRE.toLowerCase() === searchText.toLowerCase()) {
        const marker = L.marker([p.LAT, p.LON]);
        marker.bindPopup(`
          <b>${p.NOMBRE}</b><br>
          Lat: ${p.LAT}<br>
          Lon: ${p.LON}
        `);
        cluster.addLayer(marker);

        if (!firstMatch && searchText) {
          firstMatch = [p.LAT, p.LON];
        }
      }
    }
  });

  map.addLayer(cluster);

  // Zoom to first match if search, otherwise default view
  if (firstMatch) {
    map.setView(firstMatch, 12);
  } else if (!searchText) {
    map.setView([-10, -76], 6);
  }
}

// Function to run the search
function runSearch() {
  const searchValue = document.getElementById('nameFilter').value.trim();
  drawMarkers(searchValue);
}

// Button search listener
document.getElementById('searchBtn').addEventListener('click', runSearch);

// Enter key triggers search
document.getElementById('nameFilter').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    runSearch();
  }
});
