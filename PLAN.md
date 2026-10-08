# Thermal Routing for Perishability Decay

## Overview
AG02 "Thermal Routing for Perishability Decay" is a logistics dashboard designed to optimize routing for perishable goods across smallholder farms and central processing facilities. 

## Phases

### Phase 1: Initialization (Current)
- [x] Scaffold base project files (`index.html`, `styles.css`, `js/config.js`, `js/app.js`).
- [x] Initialize Leaflet map with a modern UI layout (Sidebar + Map area).
- [x] Configure coordinates for Davanagere (Hub) and farms in Harihar, Honnali, and Jagalur.
- [x] Render distinct markers (Blue for Hub, Green for Farms).
- [x] Implement control panel for produce selection and cargo weight input.
- [x] Set up basic event handling and console logging for routing actions.

### Phase 2: Routing Integration (Next Step)
- [x] Integrate OSRM (Open Source Routing Machine) routing service.
- [x] Implement local fallback handling for routing API failures.
- [x] Draw route polylines on the map based on the generated path.
- [x] Calculate real distances and estimated travel times.

### Phase 3: Thermal Decay Modeling
- [ ] Apply decay algorithms based on produce type, time, and external temperature.
- [ ] Visualize decay risk along the route.

### Phase 4: Final Polish
- [ ] Add loading states and error handling UI.
- [ ] Optimize performance.
