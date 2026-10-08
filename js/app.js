let currentPolylines = [];

document.addEventListener('DOMContentLoaded', () => {
    console.log("Thermal Routing Dashboard Initialized");

    // Initialize map
    const map = L.map('map').setView(CONFIG.MAP.CENTER, CONFIG.MAP.ZOOM);

    // Add OpenStreetMap tiles (CartoDB Voyager for clean modern look)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Routing: OSRM | &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    // Custom marker icons using public Leaflet color markers
    const greenIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    const blueIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    // Add Hub Marker
    const hub = CONFIG.LOCATIONS.HUB;
    L.marker([hub.lat, hub.lng], { icon: blueIcon })
        .addTo(map)
        .bindPopup(`<strong>${hub.name}</strong><br>Processing Hub`);

    // Add Farm Markers
    CONFIG.LOCATIONS.FARMS.forEach(farm => {
        L.marker([farm.lat, farm.lng], { icon: greenIcon })
            .addTo(map)
            .bindPopup(`<strong>${farm.name}</strong><br>Smallholder Farm`);
    });

    // Handle Route Calculation
    const calcBtn = document.getElementById('calculate-route-btn');
    calcBtn.addEventListener('click', async () => {
        const produceType = document.getElementById('produce-type').value;
        const weight = document.getElementById('cargo-weight').value;
        
        if (!weight) {
            console.warn("Please enter a cargo weight.");
            return;
        }

        console.log(`Calculating route for ${weight}kg of ${CONFIG.PRODUCE[produceType].name}...`);
        
        // Mock processing update
        const calcBtnText = calcBtn.querySelector('.btn-text');
        calcBtnText.textContent = "Calculating...";
        
        // Use Farm 1 as the default origin for routing
        const origin = CONFIG.LOCATIONS.FARMS[0];
        const dest = CONFIG.LOCATIONS.HUB;

        const routes = await getRouteAlternatives(origin, dest);
        
        // Clear existing polylines
        currentPolylines.forEach(layer => map.removeLayer(layer));
        currentPolylines = [];

        if (routes && routes.length > 0) {
            const colors = ["#3b82f6", "#10b981", "#f59e0b"]; // Blue, Emerald, Amber
            const bounds = L.latLngBounds();

            routes.slice(0, 3).forEach((route, index) => {
                const color = colors[index] || "#999999";
                
                // Flip GeoJSON coordinates [lon, lat] to Leaflet [lat, lon]
                const latLngs = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
                
                const polyline = L.polyline(latLngs, {
                    color: color,
                    weight: 6 - index, // Primary is thickest
                    opacity: 0.9,
                    dashArray: index > 0 ? "8, 8" : "" // Dashed line for alternatives
                }).addTo(map);

                polyline.bindPopup(`<b>${route.name}</b><br>Distance: ${(route.distance / 1000).toFixed(1)} km<br>Duration: ${(route.duration / 60).toFixed(0)} mins`);

                currentPolylines.push(polyline);
                bounds.extend(polyline.getBounds());
            });

            // Auto-fit to routes
            map.fitBounds(bounds, { padding: [40, 40] });

            // Update telemetry stats from the primary route
            const primary = routes[0];
            document.getElementById('stat-distance').textContent = `${(primary.distance / 1000).toFixed(1)} km`;
            
            // Simple decay mock based on time (hours) * decay rate
            const hours = primary.duration / 3600;
            const rate = CONFIG.PRODUCE[produceType].decayRatePerHr;
            const decayPercentage = (hours * rate * 100).toFixed(1);
            
            document.getElementById('stat-decay').textContent = `${decayPercentage} %`;
        }

        calcBtnText.textContent = "Calculate Optimal Route";
        console.log("Route calculation complete.");
    });
});
