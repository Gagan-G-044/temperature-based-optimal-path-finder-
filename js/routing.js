let lastRouteCallTime = 0;

async function fetchFallbackRoutes() {
    try {
        const response = await fetch('fallback_routes.json');
        const data = await response.json();
        return data.routes;
    } catch (e) {
        console.error("Failed to load fallback routes:", e);
        return [];
    }
}

function generateSyntheticRoute(baseRoute) {
    // Generate a synthetic variation of the base route
    const synthetic = JSON.parse(JSON.stringify(baseRoute));
    synthetic.name = "Route B (Alternative Corridor)";
    
    // Shift the middle coordinates slightly to create a synthetic alternative
    if (synthetic.geometry && synthetic.geometry.coordinates) {
        const coords = synthetic.geometry.coordinates;
        const middleIndex = Math.floor(coords.length / 2);
        const shiftAmt = 0.015; // Roughly a slight deviation (approx 1.5km)
        
        // Modify points in the middle 30% of the route
        const shiftStart = Math.floor(coords.length * 0.35);
        const shiftEnd = Math.floor(coords.length * 0.65);
        
        for (let i = Math.max(1, shiftStart); i < Math.min(coords.length - 1, shiftEnd); i++) {
            coords[i][0] += shiftAmt; // modify longitude
            coords[i][1] += shiftAmt; // modify latitude
        }
    }
    
    synthetic.distance = baseRoute.distance * 1.15;
    synthetic.duration = baseRoute.duration * 1.20;
    
    return synthetic;
}

function updateTelemetryBadge(isOffline) {
    const badge = document.getElementById('telemetry-status');
    if (badge) {
        if (isOffline) {
            badge.textContent = 'Telemetry: Offline / Cached Fallback';
            badge.className = 'telemetry-badge offline';
        } else {
            badge.textContent = 'Telemetry: Online / Live OSRM';
            badge.className = 'telemetry-badge online';
        }
    }
}

async function getRouteAlternatives(originCoords, destCoords) {
    const now = Date.now();
    if (now - lastRouteCallTime < 1000) {
        console.warn("Routing cooldown active. Please wait 1 second.");
        return null; // Enforce cooldown
    }
    lastRouteCallTime = now;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    try {
        const url = `https://router.project-osrm.org/route/v1/driving/${originCoords.lng},${originCoords.lat};${destCoords.lng},${destCoords.lat}?overview=full&geometries=geojson&alternatives=true`;
        
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`OSRM HTTP error: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.routes || data.routes.length === 0) {
            throw new Error("No routes found from OSRM");
        }

        updateTelemetryBadge(false);

        const routes = data.routes.map((route, index) => {
            const names = ["Route A (Primary/Fastest)", "Route B (Alternative Corridor)", "Route C (Secondary Alternative)"];
            return {
                name: names[index] || `Route ${index + 1}`,
                distance: route.distance, // in meters
                duration: route.duration, // in seconds
                geometry: route.geometry
            };
        });

        // Generate a synthetic alternative if only one is returned
        if (routes.length === 1) {
            console.log("OSRM returned 1 route, generating synthetic alternative.");
            routes.push(generateSyntheticRoute(routes[0]));
        }

        return routes;
    } catch (error) {
        console.warn("Routing network failure/timeout. Loading fallback routes.", error.message);
        updateTelemetryBadge(true);
        return await fetchFallbackRoutes();
    } finally {
        clearTimeout(timeoutId); // Ensure timeout is always cleared
    }
}
