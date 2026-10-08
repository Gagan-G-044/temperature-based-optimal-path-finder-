const CONFIG = {
    MAP: {
        CENTER: [14.4644, 75.9218], // Davanagere, Karnataka
        ZOOM: 10
    },
    LOCATIONS: {
        HUB: {
            id: 'hub_davanagere',
            name: 'Davanagere GMU (Central Hub)',
            lat: 14.4644,
            lng: 75.9218,
            type: 'hub'
        },
        FARMS: [
            {
                id: 'farm_1',
                name: 'Farm 1 - Harihar',
                lat: 14.5126,
                lng: 75.8055,
                type: 'farm'
            },
            {
                id: 'farm_2',
                name: 'Farm 2 - Honnali',
                lat: 14.2407,
                lng: 75.6323,
                type: 'farm'
            },
            {
                id: 'farm_3',
                name: 'Farm 3 - Jagalur',
                lat: 14.5292,
                lng: 76.3421,
                type: 'farm'
            }
        ]
    },
    PRODUCE: {
        tomato: { name: 'Tomato', decayRatePerHr: 0.05 },
        leafy_greens: { name: 'Leafy Greens', decayRatePerHr: 0.08 },
        mango: { name: 'Mango', decayRatePerHr: 0.03 },
        potato_onion: { name: 'Potato / Onion', decayRatePerHr: 0.01 }
    }
};
