import axios from 'axios';

// Comprehensive Database of Real-World States, Regions, and Power Plants Infrastructure
export const REGIONAL_STATES_DATA = {
  "tamil nadu": {
    stateName: "Tamil Nadu",
    regionName: "Tamil Nadu State Transmission Corporation (TANTRANSCO) Grid",
    baseDemandKw: 310,
    cities: [
      { name: "Chennai", lat: 13.0827, lon: 80.2707, demandMultiplier: 1.35, isCapital: true },
      { name: "Coimbatore", lat: 11.0168, lon: 76.9558, demandMultiplier: 1.15 },
      { name: "Madurai", lat: 9.9252, lon: 78.1198, demandMultiplier: 1.05 },
      { name: "Tirunelveli", lat: 8.7139, lon: 77.7567, demandMultiplier: 0.95 },
      { name: "Tiruchirappalli", lat: 10.7905, lon: 78.7047, demandMultiplier: 1.0 },
      { name: "Salem", lat: 11.6643, lon: 78.1460, demandMultiplier: 0.95 }
    ],
    plants: [
      {
        id: "maps-kalpakkam",
        name: "Madras Atomic Power Station (MAPS)",
        location: "Kalpakkam, Chengalpattu (~60 km South of Chennai)",
        type: "nuclear",
        technology: "Pressurized Heavy Water Reactor (PHWR)",
        capacityMw: 440,
        status: "ACTIVE - BASELOAD 98%",
        icon: "Atom",
        description: "India's premier nuclear power and fast breeder reactor research facility providing uninterrupted clean baseload power.",
        coordinates: [80.1764, 12.5574]
      },
      {
        id: "kudankulam-nps",
        name: "Kudankulam Nuclear Power Plant (KKNPP)",
        location: "Radhapuram, Tirunelveli, Tamil Nadu",
        type: "nuclear",
        technology: "Twin VVER-1000 Water-Water Energetic Reactors",
        capacityMw: 2000,
        status: "ACTIVE - 99.2% EFFICIENCY",
        icon: "Atom",
        description: "The highest-capacity nuclear generating station in India, feeding high-voltage 400kV lines to the state grid.",
        coordinates: [77.7128, 8.1697]
      },
      {
        id: "muppandal-wind",
        name: "Muppandal Wind Farm Array",
        location: "Kanyakumari / Aralvaimozhi Pass, Tamil Nadu",
        type: "wind",
        technology: "Multi-Megawatt Gearless Wind Turbines",
        capacityMw: 1500,
        status: "HIGH VELOCITY GENERATION",
        icon: "Wind",
        description: "One of the largest operational onshore wind farms in the world, capturing high-velocity mountain gap winds.",
        coordinates: [77.5387, 8.2589]
      },
      {
        id: "kayathar-wind",
        name: "Kayathar & Shencottah Wind Corridor",
        location: "Thoothukudi / Tenkasi Districts, Tamil Nadu",
        type: "wind",
        technology: "High-Elevation Plateau Wind Turbine Clusters",
        capacityMw: 450,
        status: "OPERATIONAL",
        icon: "Wind",
        description: "Key wind generation corridor capturing seasonal monsoon pressure gradients across southern Tamil Nadu.",
        coordinates: [77.7800, 8.9500]
      },
      {
        id: "kamuthi-solar",
        name: "Kamuthi Solar Power Project",
        location: "Kamuthi, Ramanathapuram, Tamil Nadu",
        type: "solar",
        technology: "Single-Axis Tracking Utility Photovoltaic Array (2,500 Acres)",
        capacityMw: 648,
        status: "MAX SOLAR HARVEST",
        icon: "Sun",
        description: "Massive utility solar installation delivering bulk zero-carbon daytime electricity into TANTRANSCO grid.",
        coordinates: [78.3888, 9.3512]
      },
      {
        id: "ennore-ocean",
        name: "Ennore Tidal & Coastal Wave Energy Station",
        location: "Bay of Bengal, Ennore Port, Chennai",
        type: "ocean",
        technology: "Oscillating Water Column Coastal Wave Converters",
        capacityMw: 35,
        status: "SYNCHRONIZED - TIDAL CYCLE",
        icon: "Droplets",
        description: "Coastal hydro and tidal energy project harnessing Bay of Bengal littoral tidal shifts.",
        coordinates: [80.3235, 13.2081]
      },
      {
        id: "kundah-hydro",
        name: "Kundah & Pykara Hydroelectric Complex",
        location: "Nilgiris Biosphere Reserve, Tamil Nadu",
        type: "ocean",
        technology: "High-Head Hydro Pelton Turbines & Pumped Storage",
        capacityMw: 585,
        status: "PEAK DISPATCH READY",
        icon: "Droplets",
        description: "Multi-stage hydroelectric generation utilizing Western Ghats rainfall catchments for grid balancing.",
        coordinates: [76.6833, 11.3167]
      }
    ]
  },

  "kerala": {
    stateName: "Kerala",
    regionName: "Kerala State Electricity Board (KSEB) Clean Grid",
    baseDemandKw: 240,
    cities: [
      { name: "Kochi", lat: 9.9312, lon: 76.2673, demandMultiplier: 1.3, isCapital: false },
      { name: "Thiruvananthapuram", lat: 8.5241, lon: 76.9366, demandMultiplier: 1.2, isCapital: true },
      { name: "Kozhikode", lat: 11.2588, lon: 75.7804, demandMultiplier: 1.1 },
      { name: "Idukki", lat: 9.8494, lon: 76.9804, demandMultiplier: 0.8 },
      { name: "Thrissur", lat: 10.5276, lon: 76.2144, demandMultiplier: 1.0 }
    ],
    plants: [
      {
        id: "idukki-hydro",
        name: "Idukki Arch Dam & Hydroelectric Power Station",
        location: "Periyar River, Moolamattom, Idukki",
        type: "ocean",
        technology: "Double-Curvature Parabolic Arch Dam with Pelton Turbines",
        capacityMw: 780,
        status: "ACTIVE - PEAK DISPATCH",
        icon: "Droplets",
        description: "Kerala's largest hydroelectric powerhouse generating clean electricity from the Western Ghats Periyar gorge.",
        coordinates: [76.9744, 9.8425]
      },
      {
        id: "cial-solar",
        name: "Cochin International Airport (CIAL) Solar Park",
        location: "Nedumbassery, Kochi, Kerala",
        type: "solar",
        technology: "Bifacial Smart Photovoltaic Power Plant",
        capacityMw: 40,
        status: "100% CLEAN GENERATION",
        icon: "Sun",
        description: "World's first fully solar-powered international airport with net grid feed-in capability.",
        coordinates: [76.4020, 10.1518]
      },
      {
        id: "banasura-solar",
        name: "Banasura Sagar Floating Solar Installation",
        location: "Banasura Sagar Reservoir, Wayanad, Kerala",
        type: "solar",
        technology: "Inland Floating PV with Water Evaporation Mitigation",
        capacityMw: 15,
        status: "GENERATING",
        icon: "Sun",
        description: "Pioneering floating solar panels on reservoir water surface maintaining cooler PV cell efficiency.",
        coordinates: [75.9575, 11.6692]
      },
      {
        id: "ramakkalmedu-wind",
        name: "Ramakkalmedu & Kanjikode Wind Parks",
        location: "Western Ghats Border, Idukki & Palakkad Gap",
        type: "wind",
        technology: "High-Altitude Gust Wind Turbines",
        capacityMw: 60,
        status: "OPERATIONAL",
        icon: "Wind",
        description: "Captures year-round crosswinds funneled through the mountain gaps between Kerala and Tamil Nadu.",
        coordinates: [77.1833, 9.8000]
      },
      {
        id: "vizhinjam-ocean",
        name: "Vizhinjam Wave Energy & Tidal Testbed",
        location: "Arabian Sea Coast, Vizhinjam, Thiruvananthapuram",
        type: "ocean",
        technology: "Oscillating Water Column Submerged Wave Turbine",
        capacityMw: 10,
        status: "SYNCHRONIZED",
        icon: "Droplets",
        description: "Harnesses high-energy Arabian Sea coastal swell and tidal movements.",
        coordinates: [76.9917, 8.3750]
      },
      {
        id: "kudankulam-kerala-link",
        name: "Kudankulam Inter-State Nuclear Feed Link",
        location: "Southern Regional Power Grid Interconnect",
        type: "nuclear",
        technology: "Clean Baseload Nuclear Allocation Line (400kV)",
        capacityMw: 266,
        status: "ACTIVE - BASELOAD 99%",
        icon: "Atom",
        description: "Statutory central generating station share allocated directly to the KSEB grid for non-fluctuating night-time load.",
        coordinates: [77.7128, 8.1697]
      }
    ]
  },

  "karnataka": {
    stateName: "Karnataka",
    regionName: "Karnataka Power Transmission Corp (KPTCL) Grid",
    baseDemandKw: 290,
    cities: [
      { name: "Bangalore", lat: 12.9716, lon: 77.5946, demandMultiplier: 1.4, isCapital: true },
      { name: "Mysore", lat: 12.2958, lon: 76.6394, demandMultiplier: 1.05 },
      { name: "Mangalore", lat: 12.9141, lon: 74.8560, demandMultiplier: 1.1 },
      { name: "Hubli-Dharwad", lat: 15.3647, lon: 75.1240, demandMultiplier: 1.0 },
      { name: "Belagavi", lat: 15.8497, lon: 74.4977, demandMultiplier: 0.95 },
      { name: "Tumkur", lat: 13.3379, lon: 77.1173, demandMultiplier: 0.9 }
    ],
    plants: [
      {
        id: "pavagada-solar",
        name: "Pavagada Solar Park (Shakti Sthala)",
        location: "Tumkur District, Karnataka (~180 km North of Bangalore)",
        type: "solar",
        technology: "13,000-Acre Ultra Mega Photovoltaic Array",
        capacityMw: 2050,
        status: "PEAK HARVESTING",
        icon: "Sun",
        description: "World-class 2-Gigawatt solar sanctuary powering Bangalore's technology corridors and industrial hubs.",
        coordinates: [77.2792, 14.1011]
      },
      {
        id: "kaiga-atomic",
        name: "Kaiga Generating Station (KGS)",
        location: "Kali River, Karwar, Uttara Kannada",
        type: "nuclear",
        technology: "4x 220MW Pressurized Heavy Water Reactors (PHWR)",
        capacityMw: 880,
        status: "ACTIVE - BASELOAD 99%",
        icon: "Atom",
        description: "World-record holder for continuous uninterrupted nuclear operation (962 days), delivering reliable zero-carbon base load.",
        coordinates: [74.4389, 14.8653]
      },
      {
        id: "chitradurga-wind",
        name: "Chitradurga, Gadag & Bellary Wind Corridor",
        location: "Central Deccan Plateau Ridges, Karnataka",
        type: "wind",
        technology: "High-Capacity Direct Drive Wind Turbines",
        capacityMw: 650,
        status: "OPERATIONAL",
        icon: "Wind",
        description: "Elevated plateau wind generation capturing dry seasonal gusts across central Karnataka.",
        coordinates: [76.4000, 14.2333]
      },
      {
        id: "sharavathi-hydro",
        name: "Sharavathi Hydroelectric Project",
        location: "Jog Falls, Shimoga District, Karnataka",
        type: "ocean",
        technology: "High-Head Impulse Pelton Turbines",
        capacityMw: 1035,
        status: "SYNCHRONIZED",
        icon: "Droplets",
        description: "Karnataka's hydro generation workhorse providing rapid load-following response during peak industrial hours.",
        coordinates: [74.7917, 14.2333]
      }
    ]
  },

  "maharashtra": {
    stateName: "Maharashtra",
    regionName: "Maharashtra State Electricity Transmission (MSETCL) Grid",
    baseDemandKw: 320,
    cities: [
      { name: "Mumbai", lat: 19.0760, lon: 72.8777, demandMultiplier: 1.45, isCapital: true },
      { name: "Pune", lat: 18.5204, lon: 73.8567, demandMultiplier: 1.25 },
      { name: "Nagpur", lat: 21.1458, lon: 79.0882, demandMultiplier: 1.05 },
      { name: "Nashik", lat: 19.9975, lon: 73.7898, demandMultiplier: 1.0 },
      { name: "Chhatrapati Sambhajinagar", lat: 19.8762, lon: 75.3433, demandMultiplier: 0.95 }
    ],
    plants: [
      {
        id: "tarapur-taps",
        name: "Tarapur Atomic Power Station (TAPS)",
        location: "Palghar District, Maharashtra (~95 km North of Mumbai)",
        type: "nuclear",
        technology: "BWR & PHWR Nuclear Reactors (Units 1-4)",
        capacityMw: 1400,
        status: "ACTIVE - BASELOAD 97%",
        icon: "Atom",
        description: "India's first commercial nuclear power station, delivering continuous clean baseload electricity to Mumbai & MMR.",
        coordinates: [72.6567, 19.8292]
      },
      {
        id: "koyna-hydro",
        name: "Koyna Hydroelectric Power Complex",
        location: "Koynanagar, Satara District, Maharashtra",
        type: "ocean",
        technology: "Underground Powerhouse & Lake-Tap Pelton Generators",
        capacityMw: 1960,
        status: "PEAK LOAD BALANCER",
        icon: "Droplets",
        description: "Largest completed hydroelectric plant in India, acting as Maharashtra's rapid black-start and peak demand anchor.",
        coordinates: [73.7500, 17.4000]
      },
      {
        id: "brahmanvel-wind",
        name: "Brahmanvel & Dhalgaon Wind Park",
        location: "Dhule & Sangli Districts, Maharashtra",
        type: "wind",
        technology: "High-Elevation Ridgeline Wind Turbines",
        capacityMw: 528,
        status: "OPERATIONAL",
        icon: "Wind",
        description: "Western Ghats ridgeline wind farms feeding high seasonal monsoon generation into the transmission ring.",
        coordinates: [74.2817, 21.3972]
      },
      {
        id: "sakri-solar",
        name: "Mahagenco Sakri Solar Park",
        location: "Shivajinagar, Sakri, Dhule, Maharashtra",
        type: "solar",
        technology: "Crystalline Silicon Grid-Tied PV Array",
        capacityMw: 125,
        status: "GENERATING",
        icon: "Sun",
        description: "Utility solar field offsetting fossil generation during daytime commercial peaks in Mumbai and Pune.",
        coordinates: [74.3167, 20.9833]
      }
    ]
  },

  "delhi": {
    stateName: "Delhi NCR",
    regionName: "Delhi Transco Limited (DTL) / Northern Regional Grid",
    baseDemandKw: 340,
    cities: [
      { name: "Delhi NCT", lat: 28.7041, lon: 77.1025, demandMultiplier: 1.4, isCapital: true },
      { name: "Gurugram", lat: 28.4595, lon: 77.0266, demandMultiplier: 1.25 },
      { name: "Noida", lat: 28.5355, lon: 77.3910, demandMultiplier: 1.2 },
      { name: "Faridabad", lat: 28.4089, lon: 77.3178, demandMultiplier: 1.05 }
    ],
    plants: [
      {
        id: "narora-naps",
        name: "Narora Atomic Power Station (NAPS)",
        location: "Bulandshahr, Uttar Pradesh (~140 km East of Delhi)",
        type: "nuclear",
        technology: "Twin Pressurized Heavy Water Reactors",
        capacityMw: 440,
        status: "ACTIVE - ONLINE",
        icon: "Atom",
        description: "Primary nuclear station supplying steady base electricity into the Delhi Transco national capital territory ring.",
        coordinates: [78.4147, 28.1583]
      },
      {
        id: "bhadla-solar",
        name: "Bhadla Solar Park (Phase I-IV)",
        location: "Phalodi, Jodhpur, Rajasthan (Transferred via 765kV Green Corridor)",
        type: "solar",
        technology: "Ultra-Mega Contiguous Solar Complex (14,000 Acres)",
        capacityMw: 2245,
        status: "MAX SOLAR HARVEST",
        icon: "Sun",
        description: "One of the world's largest solar installations in the Thar desert, transmitting bulk green power to Delhi NCR.",
        coordinates: [71.9167, 27.5333]
      },
      {
        id: "jaisalmer-wind",
        name: "Jaisalmer Wind Park Complex",
        location: "Amar Sagar, Jaisalmer, Rajasthan",
        type: "wind",
        technology: "High-Capacity Desert Wind Turbines",
        capacityMw: 1064,
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
        status: "PEAK DISPATCH READY",
        icon: "Droplets",
        description: "Tallest dam in India providing rapid grid frequency stabilization and peak power buffering for the Capital.",
        coordinates: [78.4800, 30.3780]
      }
    ]
  },

  "gujarat": {
    stateName: "Gujarat",
    regionName: "Gujarat Energy Transmission Corp (GETCO) Clean Grid",
    baseDemandKw: 300,
    cities: [
      { name: "Ahmedabad", lat: 23.0225, lon: 72.5714, demandMultiplier: 1.35, isCapital: false },
      { name: "Surat", lat: 21.1702, lon: 72.8311, demandMultiplier: 1.25 },
      { name: "Vadodara", lat: 22.3072, lon: 73.1812, demandMultiplier: 1.1 },
      { name: "Rajkot", lat: 22.3039, lon: 70.8022, demandMultiplier: 1.05 },
      { name: "Kutch", lat: 23.7337, lon: 69.8597, demandMultiplier: 0.9 }
    ],
    plants: [
      {
        id: "kakrapar-kaps",
        name: "Kakrapar Atomic Power Station (KAPS)",
        location: "Vyara, Surat District, Gujarat",
        type: "nuclear",
        technology: "Indigenous 700MW Pressurized Heavy Water Reactors (Units 1-4)",
        capacityMw: 1840,
        status: "ACTIVE - BASELOAD 99%",
        icon: "Atom",
        description: "India's flagship indigenous 700MWe nuclear reactor facility providing steady clean baseload power.",
        coordinates: [73.3500, 21.2333]
      },
      {
        id: "charanka-solar",
        name: "Charanka Solar Park (Patan)",
        location: "Charanka, Santalpur, Patan District, Gujarat",
        type: "solar",
        technology: "Multi-Developer Photovoltaic Megapark",
        capacityMw: 790,
        status: "MAX HARVEST",
        icon: "Sun",
        description: "India's pioneer solar park built on arid land in Patan, generating clean power across western Gujarat.",
        coordinates: [71.2000, 23.9000]
      },
      {
        id: "kutch-wind",
        name: "Kutch & Saurashtra Coastal Wind Farms",
        location: "Gulf of Kutch & Arabian Sea Coast, Gujarat",
        type: "wind",
        technology: "Coastal High-Yield Marine Wind Turbines",
        capacityMw: 1200,
        status: "HIGH VELOCITY",
        icon: "Wind",
        description: "Harnesses fierce Arabian Sea coastal winds along the Kutch coastline.",
        coordinates: [69.5000, 23.2000]
      },
      {
        id: "sardar-sarovar-hydro",
        name: "Sardar Sarovar Dam Hydro Power Complex",
        location: "Narmada River, Kevadia, Gujarat",
        type: "ocean",
        technology: "Riverbed & Canal Head Hydro Turbines",
        capacityMw: 1450,
        status: "SYNCHRONIZED",
        icon: "Droplets",
        description: "Major multi-purpose river hydro station supplying flexible hydro balancing power to the grid.",
        coordinates: [73.7483, 21.8278]
      }
    ]
  },

  "andhra pradesh": {
    stateName: "Andhra Pradesh & Telangana",
    regionName: "Southern Regional Power Committee (SRPC) Grid",
    baseDemandKw: 280,
    cities: [
      { name: "Hyderabad", lat: 17.3850, lon: 78.4867, demandMultiplier: 1.35, isCapital: true },
      { name: "Visakhapatnam", lat: 17.6868, lon: 83.2185, demandMultiplier: 1.2 },
      { name: "Vijayawada", lat: 16.5062, lon: 80.6480, demandMultiplier: 1.1 },
      { name: "Kurnool", lat: 15.8281, lon: 78.0373, demandMultiplier: 1.0 },
      { name: "Warangal", lat: 17.9689, lon: 79.5941, demandMultiplier: 0.95 }
    ],
    plants: [
      {
        id: "kurnool-solar",
        name: "Kurnool Ultra Mega Solar Park",
        location: "Gani & Sakunala, Kurnool, Andhra Pradesh",
        type: "solar",
        technology: "Single-Axis Tracking Utility PV (5,900 Acres)",
        capacityMw: 1000,
        status: "GENERATING",
        icon: "Sun",
        description: "1-Gigawatt solar park operating under high ray density in the Rayalaseema region.",
        coordinates: [78.2833, 15.6833]
      },
      {
        id: "ramagundam-solar",
        name: "Ramagundam Floating Solar Plant",
        location: "NTPC Reservoir, Peddapalli, Telangana",
        type: "solar",
        technology: "Reservoir Floating Photovoltaic Array",
        capacityMw: 100,
        status: "ONLINE",
        icon: "Sun",
        description: "One of India's largest floating solar projects on reservoir surface conserving water and optimizing cell output.",
        coordinates: [79.5333, 18.7667]
      },
      {
        id: "srisailam-hydro",
        name: "Srisailam Hydroelectric Power Station",
        location: "Krishna River Gorge, Andhra Pradesh / Telangana",
        type: "ocean",
        technology: "Deep Gorge High-Head Reversible Pumped Hydro Turbines",
        capacityMw: 1670,
        status: "PEAK DISPATCH",
        icon: "Droplets",
        description: "Major pumped-storage hydro installation providing instantaneous power injection during grid frequency dips.",
        coordinates: [78.8972, 16.0867]
      },
      {
        id: "kaiga-kakrapar-ap-link",
        name: "Central Grid Baseload Nuclear Allocation",
        location: "Southern Transmission Interties (400kV)",
        type: "nuclear",
        technology: "Nuclear Baseload Share from Kaiga & MAPS",
        capacityMw: 450,
        status: "ACTIVE - BASELOAD",
        icon: "Atom",
        description: "Uninterrupted clean baseload nuclear energy allocated to Hyderabad and Visakhapatnam grids.",
        coordinates: [74.4389, 14.8653]
      }
    ]
  },

  "international-us-ny": {
    stateName: "New York State, USA",
    regionName: "New York Independent System Operator (NYISO)",
    baseDemandKw: 330,
    cities: [
      { name: "New York City", lat: 40.7128, lon: -74.0060, demandMultiplier: 1.5, isCapital: false },
      { name: "Buffalo", lat: 42.8864, lon: -78.8784, demandMultiplier: 1.05 },
      { name: "Albany", lat: 42.6526, lon: -73.7562, demandMultiplier: 1.0, isCapital: true },
      { name: "Rochester", lat: 43.1566, lon: -77.6088, demandMultiplier: 1.0 }
    ],
    plants: [
      {
        id: "nine-mile-nuclear",
        name: "Nine Mile Point Nuclear Station",
        location: "Lake Ontario, Scriba, NY",
        type: "nuclear",
        technology: "Boiling Water Nuclear Reactors (BWR-4 & BWR-5)",
        capacityMw: 1850,
        status: "ACTIVE - ONLINE",
        icon: "Atom",
        description: "Primary carbon-free baseload powerhouse for New York State electrical grid.",
        coordinates: [-76.4089, 43.5214]
      },
      {
        id: "niagara-hydro",
        name: "Robert Moses Niagara Hydroelectric Power Plant",
        location: "Niagara River, Lewiston, NY",
        type: "ocean",
        technology: "Francis Hydraulic Turbines & Pumped Storage",
        capacityMw: 2525,
        status: "BASE GENERATION",
        icon: "Droplets",
        description: "Massive hydroelectric plant channeling Niagara River gorge flow to NYC grid.",
        coordinates: [-79.0431, 43.1408]
      },
      {
        id: "south-fork-wind",
        name: "South Fork Offshore Wind Array",
        location: "Atlantic Ocean (~56 km off Montauk Point, NY)",
        type: "wind",
        technology: "Offshore Marine Wind Turbines",
        capacityMw: 130,
        status: "OPERATIONAL",
        icon: "Wind",
        description: "New York's flagship commercial utility offshore wind farm capturing Atlantic ocean winds.",
        coordinates: [-71.8500, 41.0500]
      },
      {
        id: "long-island-solar",
        name: "Long Island Solar Farm (LISF)",
        location: "Brookhaven National Laboratory, NY",
        type: "solar",
        technology: "Utility Photovoltaic Solar Array",
        capacityMw: 150,
        status: "GENERATING",
        icon: "Sun",
        description: "Utility solar facility in Eastern USA powering Long Island and NYC suburbs.",
        coordinates: [-72.8750, 40.8650]
      }
    ]
  },

  "international-uk": {
    stateName: "Greater London & England, UK",
    regionName: "UK National Energy System Operator (NESO)",
    baseDemandKw: 310,
    cities: [
      { name: "London", lat: 51.5074, lon: -0.1278, demandMultiplier: 1.45, isCapital: true },
      { name: "Manchester", lat: 53.4808, lon: -2.2426, demandMultiplier: 1.15 },
      { name: "Birmingham", lat: 52.4862, lon: -1.8904, demandMultiplier: 1.2 }
    ],
    plants: [
      {
        id: "sizewell-nuclear",
        name: "Sizewell B Nuclear Power Station",
        location: "Suffolk Coast, East Anglia (~140 km NE of London)",
        type: "nuclear",
        technology: "Pressurized Water Reactor (PWR)",
        capacityMw: 1198,
        status: "ACTIVE - BASELOAD",
        icon: "Atom",
        description: "The UK's sole commercial PWR, generating continuous zero-carbon baseload electricity.",
        coordinates: [1.6192, 52.2133]
      },
      {
        id: "london-array-wind",
        name: "London Array Offshore Wind Farm",
        location: "Outer Thames Estuary (~20 km off Kent coast)",
        type: "wind",
        technology: "175x Siemens 3.6MW Marine Wind Turbines",
        capacityMw: 630,
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
        status: "SYNCHRONIZED",
        icon: "Droplets",
        description: "Estuary tidal current generators leveraging North Sea tidal oscillations.",
        coordinates: [0.0369, 51.4978]
      }
    ]
  },

  "international-uae": {
    stateName: "Dubai & Emirates, UAE",
    regionName: "DEWA Smart Power Grid / UAE National Interconnection",
    baseDemandKw: 350,
    cities: [
      { name: "Dubai", lat: 25.2048, lon: 55.2708, demandMultiplier: 1.45, isCapital: false },
      { name: "Abu Dhabi", lat: 24.4539, lon: 54.3773, demandMultiplier: 1.35, isCapital: true },
      { name: "Sharjah", lat: 25.3463, lon: 55.4209, demandMultiplier: 1.1 }
    ],
    plants: [
      {
        id: "mbr-solar-park",
        name: "Mohammed bin Rashid Al Maktoum Solar Park",
        location: "Seih Al-Dahal, Dubai (~50 km South)",
        type: "solar",
        technology: "PV & Concentrated Solar Power (CSP) Tower (262m)",
        capacityMw: 2427,
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
        status: "GRID BUFFER READY",
        icon: "Droplets",
        description: "First mountain pumped storage facility in the GCC, utilizing solar power to pump water for peak evening dispatch.",
        coordinates: [56.1333, 24.8167]
      }
    ]
  }
};

// Fallback dynamic generator for any arbitrary GPS coordinate / city
const generateDynamicPowerPlants = (cityName, lat, lon) => {
  const normCity = cityName || "Regional Node";
  return {
    stateName: `${normCity} State / Region`,
    regionName: `${normCity} Synchronized Clean Power Grid`,
    baseDemandKw: 280,
    cities: [{ name: normCity, lat, lon, demandMultiplier: 1.0 }],
    plants: [
      {
        id: `local-nuclear-${lat.toFixed(1)}`,
        name: `${normCity} Regional Atomic Plant / Clean Baseload Station`,
        location: `Grid Sector ${Math.abs(lat).toFixed(1)}°N, ${Math.abs(lon).toFixed(1)}°E`,
        type: "nuclear",
        technology: "Advanced Zero-Emission Pressurized Baseload Reactor",
        capacityMw: 1200,
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
    const airDensity = pressure / (287 * (temperature + 273.15));
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

    // Resolve State / Regional Hierarchy
    const searchKey = (cityName || '').toLowerCase().trim();
    let matchedStateData = null;
    let matchedCityData = null;

    // Match by State Name or City Name
    for (const [sKey, stateObj] of Object.entries(REGIONAL_STATES_DATA)) {
      if (searchKey.includes(sKey) || sKey.includes(searchKey) || searchKey.includes(stateObj.stateName.toLowerCase())) {
        matchedStateData = JSON.parse(JSON.stringify(stateObj));
        break;
      }
      // Check individual cities inside the state
      for (const c of stateObj.cities) {
        if (searchKey.includes(c.name.toLowerCase()) || c.name.toLowerCase().includes(searchKey.split(',')[0].trim().toLowerCase())) {
          matchedStateData = JSON.parse(JSON.stringify(stateObj));
          matchedCityData = c;
          break;
        }
      }
      if (matchedStateData) break;
    }

    if (!matchedStateData) {
      // Find closest known city/state by coordinates
      let closestState = null;
      let minDistance = Infinity;
      for (const [sKey, stateObj] of Object.entries(REGIONAL_STATES_DATA)) {
        for (const c of stateObj.cities) {
          const dLat = parsedLat - c.lat;
          const dLon = parsedLon - c.lon;
          const dist = Math.sqrt(dLat * dLat + dLon * dLon);
          if (dist < minDistance) {
            minDistance = dist;
            closestState = stateObj;
            matchedCityData = c;
          }
        }
      }
      if (minDistance < 6 && closestState) {
        matchedStateData = JSON.parse(JSON.stringify(closestState));
      } else {
        matchedStateData = generateDynamicPowerPlants(cityName || "Local Node", parsedLat, parsedLon);
      }
    }

    // Dynamic Demand Calculation (Power Needed vs Power Producing)
    const baseDemand = matchedStateData.baseDemandKw || 280;
    const cityMultiplier = matchedCityData?.demandMultiplier || 1.0;
    
    // Diurnal load curve: Peak hours 9-12 (morning commercial) and 18-22 (evening domestic lighting & AC)
    let timeDemandFactor = 1.0;
    if ((hour >= 9 && hour <= 12) || (hour >= 18 && hour <= 22)) {
      timeDemandFactor = 1.22;
    } else if (hour >= 1 && hour <= 5) {
      timeDemandFactor = 0.76;
    }

    // Temperature cooling/heating impact
    const tempImpact = temperature > 30 ? 1 + (temperature - 30) * 0.015 : (temperature < 15 ? 1 + (15 - temperature) * 0.01 : 1.0);

    const neededDemandKw = baseDemand * cityMultiplier * timeDemandFactor * tempImpact;
    const gridBalanceKw = totalOutput - neededDemandKw;
    const gridStatus = gridBalanceKw >= 0 ? "SURPLUS" : "DEFICIT";
    const coveragePercent = Math.min(250, (totalOutput / neededDemandKw) * 100).toFixed(1);

    // Battery Storage (BESS)
    const batteryCapacityKwh = 500;
    const batterySocPercent = Math.min(100, Math.max(15, 65 + (gridBalanceKw / 8)));
    const batteryFlowKw = gridBalanceKw.toFixed(1);

    const efficiencyScore = Math.min((totalOutput / 400) * 100, 100).toFixed(1);
    const carbonSavingsKg = (totalOutput * 0.4).toFixed(2); 

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

    // Live output assignments for power plants
    matchedStateData.plants = matchedStateData.plants.map(plant => {
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

    // AI Insight
    let insight = "Grid load balances optimally with positive frequency stability.";
    if (gridStatus === 'SURPLUS') {
      insight = `Optimal Generation: Net surplus of ${Math.abs(gridBalanceKw).toFixed(1)} kW exported to BESS storage and inter-state corridors.`;
    } else {
      insight = `Peak Demand Strain: Deficit of ${Math.abs(gridBalanceKw).toFixed(1)} kW buffered by rapid hydro dispatch and battery discharge.`;
    }

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
        // Demand vs Supply
        powerNeededKw: neededDemandKw.toFixed(1),
        powerProducingKw: totalOutput.toFixed(1),
        gridBalanceKw: gridBalanceKw.toFixed(1),
        gridStatus,
        coveragePercent,
        efficiencyScore,
        carbonSavingsKg,
        battery: {
          socPercent: batterySocPercent.toFixed(1),
          flowKw: batteryFlowKw,
          status: batteryFlowKw >= 0 ? "CHARGING" : "DISCHARGING",
          capacityKwh: batteryCapacityKwh
        }
      },
      regionalInfrastructure: matchedStateData,
      selectedCity: matchedCityData?.name || cityName || matchedStateData.stateName,
      stateName: matchedStateData.stateName,
      availableCities: matchedStateData.cities || [],
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
    const variation = -0.05 + Math.random() * 0.1;
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
