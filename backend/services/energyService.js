import axios from 'axios';

// Comprehensive Database of Real-World Regional Power Plants & Supply Grids
const REGIONAL_POWER_PLANTS = {
  chennai: {
    regionName: "Tamil Nadu Southern Grid",
    plants: [
      {
        id: "maps-kalpakkam",
        name: "Madras Atomic Power Station (MAPS)",
        location: "Kalpakkam, Tamil Nadu (~60 km South)",
        type: "nuclear",
        technology: "Pressurized Heavy Water Reactor (PHWR)",
        capacityMw: 440,
        currentOutputKw: 0, // dynamic
        status: "ACTIVE - ONLINE",
        icon: "Atom",
        description: "India's premier nuclear research & power hub providing steady baseload energy to Chennai metropolitan and industrial corridors.",
        coordinates: [80.1764, 12.5574]
      },
      {
        id: "kudankulam-nps",
        name: "Kudankulam Nuclear Power Plant",
        location: "Radhapuram, Tirunelveli, TN",
        type: "nuclear",
        technology: "VVER-1000 Water-Water Energetic Reactor",
        capacityMw: 2000,
        currentOutputKw: 0,
        status: "ACTIVE - BASELOAD 98%",
        icon: "Atom",
        description: "Highest-capacity nuclear plant in India, feeding high-voltage 400kV interties to Chennai and Tamil Nadu grid.",
        coordinates: [77.7128, 8.1697]
      },
      {
        id: "muppandal-wind",
        name: "Muppandal & Kayathar Wind Farm Array",
        location: "Kanyakumari / Thoothukudi, TN",
        type: "wind",
        technology: "Multi-Megawatt Onshore Wind Turbines",
        capacityMw: 1500,
        currentOutputKw: 0,
        status: "OPERATIONAL",
        icon: "Wind",
        description: "One of the largest operational onshore wind farms in the world, capturing high-velocity Palghat & Shencottah gap winds.",
        coordinates: [77.5387, 8.2589]
      },
      {
        id: "kamuthi-solar",
        name: "Kamuthi Solar Power Project",
        location: "Kamuthi, Ramanathapuram, TN",
        type: "solar",
        technology: "Utility-Scale Single-Axis Tracking Photovoltaic",
        capacityMw: 648,
        currentOutputKw: 0,
        status: "GENERATING",
        icon: "Sun",
        description: "Massive 2,500-acre solar complex supplying peak daytime solar energy into the Tamil Nadu TANTRANSCO power grid.",
        coordinates: [78.3888, 9.3512]
      },
      {
        id: "ennore-ocean",
        name: "Ennore Tidal & Wave Energy Station",
        location: "Ennore Coast, Bay of Bengal, Chennai",
        type: "ocean",
        technology: "Oscillating Water Column Wave & Coastal Tidal Turbine",
        capacityMw: 35,
        currentOutputKw: 0,
        status: "SYNCHRONIZED",
        icon: "Droplets",
        description: "Coastal hydro and tidal flow generation harnessing Bay of Bengal littoral currents along North Chennai harbour.",
        coordinates: [80.3235, 13.2081]
      }
    ]
  },
  mumbai: {
    regionName: "Maharashtra Western Grid",
    plants: [
      {
        id: "tarapur-taps",
        name: "Tarapur Atomic Power Station (TAPS)",
        location: "Palghar, Maharashtra (~95 km North)",
        type: "nuclear",
        technology: "BWR & PHWR Nuclear Reactors (Units 1-4)",
        capacityMw: 1400,
        currentOutputKw: 0,
        status: "ACTIVE - BASELOAD 97%",
        icon: "Atom",
        description: "India's first commercial nuclear power station, delivering continuous clean baseload electricity to Mumbai & MMR.",
        coordinates: [72.6567, 19.8292]
      },
      {
        id: "brahmanvel-wind",
        name: "Brahmanvel & Dhalgaon Wind Park",
        location: "Dhule & Sangli, Maharashtra",
        type: "wind",
        technology: "High-Elevation Plateau Wind Turbine Clusters",
        capacityMw: 528,
        currentOutputKw: 0,
        status: "OPERATIONAL",
        icon: "Wind",
        description: "Western Ghats ridgeline wind farms feeding high seasonal monsoon generation into the MSETCL transmission lines.",
        coordinates: [74.2817, 21.3972]
      },
      {
        id: "sakri-solar",
        name: "Mahagenco Sakri Solar Park",
        location: "Shivajinagar, Sakri, Maharashtra",
        type: "solar",
        technology: "Crystalline Silicon Grid-Tied PV Array",
        capacityMw: 125,
        currentOutputKw: 0,
        status: "GENERATING",
        icon: "Sun",
        description: "State-of-the-art utility solar field offsetting fossil generation during daytime commercial peaks in Greater Mumbai.",
        coordinates: [74.3167, 20.9833]
      },
      {
        id: "bhira-khopoli-hydro",
        name: "Tata Power Bhira & Khopoli Hydroelectric",
        location: "Western Ghats, Raigad, Maharashtra",
        type: "ocean",
        technology: "Pumped Storage & High-Head Hydro Turbines",
        capacityMw: 300,
        currentOutputKw: 0,
        status: "SYNCHRONIZED",
        icon: "Droplets",
        description: "Pioneering hydro station converting Western Ghats monsoon water catchments into instant dispatchable power.",
        coordinates: [73.3980, 18.4550]
      }
    ]
  },
  delhi: {
    regionName: "Northern Regional Power Grid (NRPC)",
    plants: [
      {
        id: "narora-naps",
        name: "Narora Atomic Power Station (NAPS)",
        location: "Bulandshahr, Uttar Pradesh (~140 km East)",
        type: "nuclear",
        technology: "Twin Pressurized Heavy Water Reactors",
        capacityMw: 440,
        currentOutputKw: 0,
        status: "ACTIVE - ONLINE",
        icon: "Atom",
        description: "Primary nuclear station supplying non-fluctuating base electricity into the Delhi Transco national capital territory ring.",
        coordinates: [78.4147, 28.1583]
      },
      {
        id: "bhadla-solar",
        name: "Bhadla Solar Park (Phase I-IV)",
        location: "Phalodi, Jodhpur, Rajasthan",
        type: "solar",
        technology: "Ultra-Mega Photovoltaic Solar Cluster",
        capacityMw: 2245,
        currentOutputKw: 0,
        status: "MAX SOLAR HARVEST",
        icon: "Sun",
        description: "One of the world's largest solar installations spanning 14,000 acres in Thar desert, channeled to NCR via 765kV Green Corridor.",
        coordinates: [71.9167, 27.5333]
      },
      {
        id: "jaisalmer-wind",
        name: "Jaisalmer Wind Park Complex",
        location: "Amar Sagar, Jaisalmer, Rajasthan",
        type: "wind",
        technology: "High-Capacity Desert Wind Turbines",
        capacityMw: 1064,
        currentOutputKw: 0,
        status: "OPERATIONAL",
        icon: "Wind",
        description: "India's second largest wind farm harnessing high desert thermals to feed the Northern National Grid.",
        coordinates: [70.9000, 26.9167]
      },
      {
        id: "tehri-hydro",
        name: "Tehri Hydroelectric Complex & Pumped Storage",
        location: "Bhagirathi River, Tehri Garhwal, Uttarakhand",
        type: "ocean",
        technology: "High-Head Variable Speed Pumped Hydro Storage",
        capacityMw: 1400,
        currentOutputKw: 0,
        status: "PEAK DISPATCH READY",
        icon: "Droplets",
        description: "Tallest dam in India providing critical rapid grid frequency stabilization and peak power buffering for Delhi.",
        coordinates: [78.4800, 30.3780]
      }
    ]
  },
  bangalore: {
    regionName: "Karnataka Southern Clean Corridor",
    plants: [
      {
        id: "pavagada-solar",
        name: "Pavagada Solar Park (Shakti Sthala)",
        location: "Tumkur District, Karnataka (~180 km North)",
        type: "solar",
        technology: "Mega Ultra High-Density Bifacial PV Arrays",
        capacityMw: 2050,
        currentOutputKw: 0,
        status: "PEAK HARVESTING",
        icon: "Sun",
        description: "World-class 13,000-acre clean energy sanctuary powering Bangalore's Silicon Valley tech campuses.",
        coordinates: [77.2792, 14.1011]
      },
      {
        id: "kaiga-atomic",
        name: "Kaiga Generating Station",
        location: "Kali River, Karwar, Karnataka",
        type: "nuclear",
        technology: "Pressurized Heavy Water Reactor (Units 1-4)",
        capacityMw: 880,
        currentOutputKw: 0,
        status: "ACTIVE - BASELOAD 99%",
        icon: "Atom",
        description: "Record-holding continuous operation nuclear station powering Karnataka southern industrial zones.",
        coordinates: [74.4389, 14.8653]
      },
      {
        id: "chitradurga-wind",
        name: "Chitradurga & Gadag Wind Ridge",
        location: "Deccan Plateau Ridges, Karnataka",
        type: "wind",
        technology: "Onshore High-Torque Wind Turbines",
        capacityMw: 450,
        currentOutputKw: 0,
        status: "OPERATIONAL",
        icon: "Wind",
        description: "Plateau wind generation capturing dry seasonal gusts across central Karnataka.",
        coordinates: [76.4000, 14.2333]
      },
      {
        id: "sharavathi-hydro",
        name: "Sharavathi Hydroelectric Project",
        location: "Jog Falls, Shimoga, Karnataka",
        type: "ocean",
        technology: "High-Head Impulse Pelton Turbines",
        capacityMw: 1035,
        currentOutputKw: 0,
        status: "SYNCHRONIZED",
        icon: "Droplets",
        description: "Karnataka's primary hydro generation workhorse providing rapid load-following response.",
        coordinates: [74.7917, 14.2333]
      }
    ]
  },
  "new york": {
    regionName: "New York Independent System Operator (NYISO)",
    plants: [
      {
        id: "nine-mile-nuclear",
        name: "Nine Mile Point Nuclear Station",
        location: "Lake Ontario, Scriba, NY",
        type: "nuclear",
        technology: "Boiling Water Nuclear Reactors (BWR-4 & BWR-5)",
        capacityMw: 1850,
        currentOutputKw: 0,
        status: "ACTIVE - ONLINE",
        icon: "Atom",
        description: "Primary carbon-free baseload powerhouse for New York State electrical grid.",
        coordinates: [-76.4089, 43.5214]
      },
      {
        id: "south-fork-wind",
        name: "South Fork & Maple Ridge Offshore/Onshore Wind",
        location: "Atlantic Coast, Long Island / Tug Hill, NY",
        type: "wind",
        technology: "Offshore Marine Wind Turbines",
        capacityMw: 450,
        currentOutputKw: 0,
        status: "OPERATIONAL",
        icon: "Wind",
        description: "New York's flagship utility offshore wind array capturing Atlantic marine gusts.",
        coordinates: [-71.8500, 41.0500]
      },
      {
        id: "long-island-solar",
        name: "Long Island Solar Farm (LISF)",
        location: "Brookhaven National Laboratory, NY",
        type: "solar",
        technology: "Utility Photovoltaic Solar Array",
        capacityMw: 150,
        currentOutputKw: 0,
        status: "GENERATING",
        icon: "Sun",
        description: "Largest utility solar facility in Eastern USA powering Long Island & NYC suburbs.",
        coordinates: [-72.8750, 40.8650]
      },
      {
        id: "niagara-hydro",
        name: "Robert Moses Niagara Hydroelectric Power Plant",
        location: "Niagara River, Lewiston, NY",
        type: "ocean",
        technology: "Francis Hydraulic Turbines & Pumped Storage",
        capacityMw: 2525,
        currentOutputKw: 0,
        status: "BASE GENERATION",
        icon: "Droplets",
        description: "Massive hydroelectric plant channeling Niagara River gorge flow to NYC grid.",
        coordinates: [-79.0431, 43.1408]
      }
    ]
  },
  london: {
    regionName: "UK National Grid (NESO)",
    plants: [
      {
        id: "sizewell-nuclear",
        name: "Sizewell B Nuclear Power Station",
        location: "Suffolk Coast, East Anglia (~140 km NE)",
        type: "nuclear",
        technology: "Pressurized Water Reactor (PWR)",
        capacityMw: 1198,
        currentOutputKw: 0,
        status: "ACTIVE - BASELOAD",
        icon: "Atom",
        description: "The UK's sole commercial PWR, generating continuous zero-carbon baseload electricity for Greater London.",
        coordinates: [1.6192, 52.2133]
      },
      {
        id: "london-array-wind",
        name: "London Array Offshore Wind Farm",
        location: "Outer Thames Estuary (~20 km off Kent coast)",
        type: "wind",
        technology: "175x Siemens 3.6MW Marine Wind Turbines",
        capacityMw: 630,
        currentOutputKw: 0,
        status: "HIGH VELOCITY",
        icon: "Wind",
        description: "World-renowned offshore wind park supplying clean energy directly into the London substation hub.",
        coordinates: [1.4833, 51.6333]
      },
      {
        id: "cleve-hill-solar",
        name: "Cleve Hill Solar & BESS Park",
        location: "Graveney, Kent, South East England",
        type: "solar",
        technology: "High-Efficiency Solar PV with Utility Battery Storage",
        capacityMw: 350,
        currentOutputKw: 0,
        status: "GENERATING",
        icon: "Sun",
        description: "UK's largest solar farm feeding renewable daytime power into London transmission ring.",
        coordinates: [0.9333, 51.3500]
      },
      {
        id: "thames-tidal",
        name: "Thames Tidal & Marine Hydro Array",
        location: "Thames Barrier & Marine Reach",
        type: "ocean",
        technology: "Bi-directional Marine Current Turbines",
        capacityMw: 25,
        currentOutputKw: 0,
        status: "SYNCHRONIZED",
        icon: "Droplets",
        description: "Estuary tidal current generators leveraging North Sea tidal oscillations.",
        coordinates: [0.0369, 51.4978]
      }
    ]
  },
  tokyo: {
    regionName: "TEPCO Power Grid Network",
    plants: [
      {
        id: "kashiwazaki-nuclear",
        name: "Kashiwazaki-Kariwa Nuclear Station",
        location: "Niigata Prefecture, Sea of Japan Coast",
        type: "nuclear",
        technology: "Advanced Boiling Water Reactors (ABWR)",
        capacityMw: 8212,
        currentOutputKw: 0,
        status: "ACTIVE - SYNCHRONIZED",
        icon: "Atom",
        description: "The largest nuclear generating station in the world by net capacity, connected to Tokyo via 500kV ultra lines.",
        coordinates: [138.5989, 37.4278]
      },
      {
        id: "choshi-wind",
        name: "Choshi Offshore Wind Farm",
        location: "Pacific Coast, Chiba Prefecture",
        type: "wind",
        technology: "Bottom-Fixed Marine Wind Turbines",
        capacityMw: 200,
        currentOutputKw: 0,
        status: "OPERATIONAL",
        icon: "Wind",
        description: "Pacific offshore wind installation capturing oceanic jet currents.",
        coordinates: [140.8500, 35.7333]
      },
      {
        id: "komekurayama-solar",
        name: "Komekurayama Mega Solar Power Plant",
        location: "Kofu Basin, Yamanashi Prefecture",
        type: "solar",
        technology: "Crystalline High-Yield Solar Arrays",
        capacityMw: 100,
        currentOutputKw: 0,
        status: "GENERATING",
        icon: "Sun",
        description: "High-insolation solar complex in central Japan delivering daytime green power to Tokyo.",
        coordinates: [138.5667, 35.6000]
      },
      {
        id: "kairyu-ocean",
        name: "Izu Kuroshio Ocean Current Turbine (Kairyu)",
        location: "Izu Archipelago, Pacific Ocean",
        type: "ocean",
        technology: "Deep Ocean Submerged Current Rotor Generator",
        capacityMw: 40,
        currentOutputKw: 0,
        status: "SYNCHRONIZED",
        icon: "Droplets",
        description: "Deep sea generation utilizing the perennial high-speed Kuroshio ocean current.",
        coordinates: [139.7500, 34.5000]
      }
    ]
  },
  paris: {
    regionName: "RTE France Réseau de Transport d'Électricité",
    plants: [
      {
        id: "nogent-nuclear",
        name: "Nogent Nuclear Power Plant",
        location: "Seine River, Aube, France (~110 km SE)",
        type: "nuclear",
        technology: "Twin 1300MW Pressurized Water Reactors (PWR)",
        capacityMw: 2600,
        currentOutputKw: 0,
        status: "ACTIVE - BASELOAD 99%",
        icon: "Atom",
        description: "Primary clean nuclear baseload facility supplying over a third of Île-de-France (Greater Paris) electricity.",
        coordinates: [3.5186, 48.5153]
      },
      {
        id: "saint-nazaire-wind",
        name: "Saint-Nazaire & Catalan Offshore/Onshore Wind",
        location: "Loire-Atlantique & Occitanie, France",
        type: "wind",
        technology: "Haliade 150-6MW Offshore Marine Turbines",
        capacityMw: 480,
        currentOutputKw: 0,
        status: "OPERATIONAL",
        icon: "Wind",
        description: "France's flagship commercial offshore wind farm capturing Atlantic marine gusts.",
        coordinates: [-2.4333, 47.1667]
      },
      {
        id: "cestas-solar",
        name: "Cestas Solar Park",
        location: "Gironde, South-West France",
        type: "solar",
        technology: "East-West High-Density Photovoltaic Array",
        capacityMw: 300,
        currentOutputKw: 0,
        status: "GENERATING",
        icon: "Sun",
        description: "Europe's premier solar installation generating over 350 GWh annually for the French national grid.",
        coordinates: [-0.6833, 44.7500]
      },
      {
        id: "rance-tidal",
        name: "La Rance Tidal Power Station",
        location: "Rance River Estuary, Brittany, France",
        type: "ocean",
        technology: "24x Bulb-Type Bi-directional Tidal Turbines",
        capacityMw: 240,
        currentOutputKw: 0,
        status: "SYNCHRONIZED - TIDE CYCLE",
        icon: "Droplets",
        description: "Pioneering world-first commercial tidal power barrage operating continuously since 1966.",
        coordinates: [-2.0233, 48.6186]
      }
    ]
  },
  dubai: {
    regionName: "DEWA Smart Power Grid / UAE Interconnection",
    plants: [
      {
        id: "mbr-solar-park",
        name: "Mohammed bin Rashid Al Maktoum Solar Park",
        location: "Seih Al-Dahal, Dubai (~50 km South)",
        type: "solar",
        technology: "PV & Concentrated Solar Power (CSP) Tower (262m)",
        capacityMw: 2427,
        currentOutputKw: 0,
        status: "HYPER-HARVESTING",
        icon: "Sun",
        description: "The largest single-site solar park in the world, targeting 5,000 MW capacity with molten salt thermal storage.",
        coordinates: [55.3667, 24.7500]
      },
      {
        id: "barakah-nuclear",
        name: "Barakah Nuclear Energy Plant",
        location: "Al Dhafra Region, Abu Dhabi (~250 km West)",
        type: "nuclear",
        technology: "4x APR-1400 Advanced Power Reactors",
        capacityMw: 5600,
        currentOutputKw: 0,
        status: "ACTIVE - FULL BASELOAD",
        icon: "Atom",
        description: "The Arab world's first commercial nuclear station, producing 25% of the UAE's entire electricity with zero emissions.",
        coordinates: [52.2611, 23.9686]
      },
      {
        id: "uae-wind-program",
        name: "Sir Bani Yas & UAE Wind Program",
        location: "Sir Bani Yas Island & Coastal Promontories",
        type: "wind",
        technology: "Desert & Island Utility Wind Turbines",
        capacityMw: 103,
        currentOutputKw: 0,
        status: "OPERATIONAL",
        icon: "Wind",
        description: "Advanced low-wind-speed turbine network powering coastal and island microgrids.",
        coordinates: [52.6000, 24.3000]
      },
      {
        id: "hatta-hydro",
        name: "Hatta Pumped Storage Hydroelectric Plant",
        location: "Hajar Mountains, Hatta, Dubai",
        type: "ocean",
        technology: "Mountain Reservoir Pumped Storage Hydro",
        capacityMw: 250,
        currentOutputKw: 0,
        status: "GRID BUFFER READY",
        icon: "Droplets",
        description: "First-of-its-kind mountain pumped storage facility in the GCC, utilizing solar power to pump water for night-time dispatch.",
        coordinates: [56.1333, 24.8167]
      }
    ]
  }
};

// Fallback dynamic generator for any GPS coordinate / city
const generateDynamicPowerPlants = (cityName, lat, lon) => {
  const normCity = cityName || "Regional Node";
  return {
    regionName: `${normCity} Clean Power Grid`,
    plants: [
      {
        id: `local-nuclear-${lat.toFixed(1)}`,
        name: `${normCity} Regional Atomic Plant / Clean Baseload Station`,
        location: `Grid Sector ${Math.abs(lat).toFixed(1)}°N, ${Math.abs(lon).toFixed(1)}°E`,
        type: "nuclear",
        technology: "Advanced Zero-Emission Pressurized Baseload Reactor",
        capacityMw: 1200,
        currentOutputKw: 0,
        status: "ACTIVE - BASELOAD 98%",
        icon: "Atom",
        description: `Delivers steady, uninterruptible baseload power to ${normCity} and surrounding regional substations.`,
        coordinates: [lon + 0.35, lat + 0.25]
      },
      {
        id: `local-solar-${lat.toFixed(1)}`,
        name: `${normCity} High-Yield Solar Photovoltaic Park`,
        location: `${normCity} Green Corridor (~35 km)`,
        type: "solar",
        technology: "Bifacial Monocrystalline Smart-Tracking PV",
        capacityMw: 500,
        currentOutputKw: 0,
        status: "GENERATING",
        icon: "Sun",
        description: `Utility solar farm harvesting direct irradiance across ${normCity} area with automated sun-tracking arrays.`,
        coordinates: [lon - 0.2, lat - 0.15]
      },
      {
        id: `local-wind-${lat.toFixed(1)}`,
        name: `${normCity} Kinetic Wind Turbine Field`,
        location: `${normCity} Highland Ridge (~50 km)`,
        type: "wind",
        technology: "High-Altitude Gearless Direct-Drive Turbines",
        capacityMw: 350,
        currentOutputKw: 0,
        status: "OPERATIONAL",
        icon: "Wind",
        description: `Captures atmospheric boundary-layer winds, feeding variable renewable energy into local transmission lines.`,
        coordinates: [lon + 0.15, lat - 0.3]
      },
      {
        id: `local-ocean-${lat.toFixed(1)}`,
        name: `${normCity} Hydro / Marine Energy Converter`,
        location: `${normCity} Waterway / Coastal Reach`,
        type: "ocean",
        technology: "Subsea Kinetic Tidal / Hydro Turbines & Storage",
        capacityMw: 120,
        currentOutputKw: 0,
        status: "SYNCHRONIZED",
        icon: "Droplets",
        description: `Harnesses aquatic hydrodynamic currents and pumped storage to balance peak energy demand in ${normCity}.`,
        coordinates: [lon + 0.1, lat + 0.1]
      }
    ]
  };
};

export const fetchCurrentWeather = async (lat, lon, cityName = '') => {
  try {
    const parsedLat = parseFloat(lat);
    const parsedLon = parseFloat(lon);
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${parsedLat}&longitude=${parsedLon}&current=temperature_2m,wind_speed_10m,shortwave_radiation,cloud_cover,surface_pressure,relative_humidity_2m&hourly=temperature_2m,shortwave_radiation,wind_speed_10m&forecast_days=1`;
    const response = await axios.get(url, { timeout: 8000 });
    const data = response.data.current;

    const temperature = data.temperature_2m;
    const windSpeed = data.wind_speed_10m; // km/h
    const irradiance = data.shortwave_radiation; 
    const cloudCover = data.cloud_cover || 0;
    const pressure = data.surface_pressure || 1013;
    const humidity = data.relative_humidity_2m || 50;

    // Advanced Physics Simulation Constants
    const SOLAR_CAPACITY = 50; // kW
    const WIND_CAPACITY = 100; // kW
    const OCEAN_CAPACITY = 80; // kW
    const NUCLEAR_CAPACITY = 200; // kW steady

    // 1. Solar
    const solarFactor = Math.max(0, 1 - (cloudCover / 100));
    const solarOutputKw = (irradiance * 0.15 * 100) / 1000 * solarFactor;

    // 2. Wind
    const airDensity = pressure / (287 * (temperature + 273.15)); // ideal gas law approx
    const windOutputKw = windSpeed > 10 ? Math.min(WIND_CAPACITY, (Math.pow(windSpeed / 3.6, 3) * 0.5 * airDensity * 30 * 0.4) / 1000) : 0;

    // 3. Ocean / Tidal
    const hour = new Date().getHours();
    const tideEffect = (Math.sin(hour * Math.PI / 6) + 1) / 2;
    const waveEffect = Math.min(0.5, windSpeed / 100);
    const oceanOutputKw = (OCEAN_CAPACITY * tideEffect * 0.7) + (OCEAN_CAPACITY * waveEffect);

    // 4. Nuclear 
    const nuclearVariation = 0.94 + Math.random() * 0.02; 
    const nuclearOutputKw = NUCLEAR_CAPACITY * nuclearVariation;

    const totalOutput = solarOutputKw + windOutputKw + oceanOutputKw + nuclearOutputKw;
    
    const efficiencyScore = Math.min((totalOutput / 400) * 100, 100).toFixed(1);
    const carbonSavingsKg = (totalOutput * 0.4).toFixed(2); 

    // Battery Storage (BESS) simulation: baseline demand is 280 kW
    const GRID_BASE_DEMAND = 280;
    const netGridDifference = totalOutput - GRID_BASE_DEMAND;
    const batteryCapacityKwh = 500;
    const batterySocPercent = Math.min(100, Math.max(15, 65 + (netGridDifference / 10)));
    const batteryFlowKw = netGridDifference.toFixed(1); // >0 charging, <0 discharging

    // Generate historic mockup for the chart
    const history = [];
    const hourlyLogs = response.data.hourly;
    const currentHourIndex = new Date().getHours();
    
    for (let i = Math.max(0, currentHourIndex - 11); i <= currentHourIndex; i++) {
        const hIrr = hourlyLogs.shortwave_radiation[i] || 0;
        const hWind = hourlyLogs.wind_speed_10m[i] || 0;
        
        const sOut = (hIrr * 0.15 * 100) / 1000;
        const wOut = hWind > 10 ? Math.min(WIND_CAPACITY, (Math.pow(hWind / 3.6, 3) * 0.5 * 1.225 * 30 * 0.4) / 1000) : 0;
        const oOut = (OCEAN_CAPACITY * ((Math.sin(i * Math.PI / 6) + 1) / 2) * 0.7) + (OCEAN_CAPACITY * Math.min(0.5, hWind/100));
        const nOut = NUCLEAR_CAPACITY * 0.95;

        history.push({
            time: hourlyLogs.time[i].split('T')[1],
            solar: sOut.toFixed(2),
            wind: wOut.toFixed(2),
            ocean: oOut.toFixed(2),
            nuclear: nOut.toFixed(2),
            total: (sOut + wOut + oOut + nOut).toFixed(2)
        });
    }

    // Determine an AI Insight
    let insight = "Grid load balances optimally.";
    if (solarOutputKw > 20 && windOutputKw > 40) insight = "Renewable surge! Nuclear base scaling down.";
    else if (cloudCover > 80 && windSpeed < 10) insight = "Low natural factors. Tidal and Nuclear sustaining grid.";
    else if (totalOutput > 380) insight = "Hyper-generation. Battery arrays charging at max capacity.";

    // Resolve Regional Power Plants & Supply Infrastructure
    const searchKey = (cityName || '').toLowerCase();
    let regionalInfrastructure = null;

    for (const key of Object.keys(REGIONAL_POWER_PLANTS)) {
      if (searchKey.includes(key) || key.includes(searchKey.split(',')[0].trim().toLowerCase())) {
        regionalInfrastructure = JSON.parse(JSON.stringify(REGIONAL_POWER_PLANTS[key]));
        break;
      }
    }

    if (!regionalInfrastructure) {
      // Find closest known city by coordinates (within 400km)
      let closestCity = null;
      let minDistance = Infinity;
      for (const [key, data] of Object.entries(REGIONAL_POWER_PLANTS)) {
        if (data.plants && data.plants[0] && data.plants[0].coordinates) {
          const [pLon, pLat] = data.plants[0].coordinates;
          const dLat = parsedLat - pLat;
          const dLon = parsedLon - pLon;
          const dist = Math.sqrt(dLat * dLat + dLon * dLon);
          if (dist < minDistance) {
            minDistance = dist;
            closestCity = key;
          }
        }
      }
      if (minDistance < 5 && closestCity) {
        regionalInfrastructure = JSON.parse(JSON.stringify(REGIONAL_POWER_PLANTS[closestCity]));
      } else {
        regionalInfrastructure = generateDynamicPowerPlants(cityName || "Local Node", parsedLat, parsedLon);
      }
    }

    // Populate current live outputs and share for each plant
    regionalInfrastructure.plants = regionalInfrastructure.plants.map(plant => {
      let liveOutput = 0;
      if (plant.type === 'solar') liveOutput = solarOutputKw;
      else if (plant.type === 'wind') liveOutput = windOutputKw;
      else if (plant.type === 'nuclear') liveOutput = nuclearOutputKw;
      else if (plant.type === 'ocean') liveOutput = oceanOutputKw;

      return {
        ...plant,
        currentOutputKw: liveOutput.toFixed(2),
        outputSharePercent: totalOutput > 0 ? ((liveOutput / totalOutput) * 100).toFixed(1) : "0"
      };
    });

    return {
      current: {
        temperature,
        windSpeed,
        irradiance,
        cloudCover,
        pressure,
        humidity,
        solarOutputKw: solarOutputKw.toFixed(2),
        windOutputKw: windOutputKw.toFixed(2),
        oceanOutputKw: oceanOutputKw.toFixed(2),
        nuclearOutputKw: nuclearOutputKw.toFixed(2),
        totalOutput: totalOutput.toFixed(2),
        efficiencyScore,
        carbonSavingsKg,
        battery: {
          socPercent: batterySocPercent.toFixed(1),
          flowKw: batteryFlowKw,
          status: batteryFlowKw >= 0 ? "CHARGING" : "DISCHARGING",
          capacityKwh: batteryCapacityKwh
        }
      },
      regionalInfrastructure,
      history,
      insight
    };

  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    throw new Error('Failed to fetch energy data from weather API');
  }
};

export const getPredictionFromService = async (features) => {
  const { irradiance, windSpeed, temperature } = features;
  
  const solar = Math.max(0, (irradiance * 0.15 * 100) / 1000);
  const wind = windSpeed > 10 ? Math.min(100, (Math.pow(windSpeed / 3.6, 3) * 0.5 * 1.2 * 30 * 0.4) / 1000) : 0;
  const ocean = 80 * 0.7; // baseline prediction average
  const nuclear = 200 * 0.95; 
  
  const base_calc = solar + wind + ocean + nuclear;
  
  const randomFactor = 0.95 + Math.random() * 0.1; 
  const predicted_energy = base_calc * randomFactor;
  
  const timeline = [];
  let current_val = predicted_energy;
  
  for (let i = 1; i <= 12; i++) {
    const variation = -0.05 + Math.random() * 0.1; // tighten variance due to steady baseloads
    current_val = Math.max(0, current_val + (current_val * variation));
    timeline.push({
      hour: `+${i}h`,
      predicted: parseFloat(current_val.toFixed(2))
    });
  }
  
  const sumFirst6 = timeline.slice(0, 6).reduce((sum, item) => sum + item.predicted, 0);
  const sumLast6 = timeline.slice(6, 12).reduce((sum, item) => sum + item.predicted, 0);
  const trendSum = sumFirst6 - sumLast6;
  
  let trendType = trendSum > 0 ? "decreasing" : "increasing";
  if (Math.abs(trendSum) < predicted_energy * 0.05) {
      trendType = "stable";
  }

  return {
      predictedEnergy: parseFloat(predicted_energy.toFixed(2)),
      forecast_timeline: timeline,
      trend: trendType
  };
};
