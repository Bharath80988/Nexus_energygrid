import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Navigation, Globe, Radio, Search, Loader2, CheckCircle2, AlertCircle, MapPin, Building2, ChevronRight, Layers } from 'lucide-react';
import axios from 'axios';
import WorldMapSelector from './WorldMapSelector';

const STATES_DIRECTORY = [
  {
    id: 'tamil-nadu',
    name: 'Tamil Nadu',
    code: 'TN',
    capital: 'Chennai',
    lat: 13.0827,
    lon: 80.2707,
    region: 'South India',
    cities: [
      { name: 'Chennai', tag: 'Capital Hub', lat: 13.0827, lon: 80.2707 },
      { name: 'Coimbatore', tag: 'Industrial Corridor', lat: 11.0168, lon: 76.9558 },
      { name: 'Madurai', tag: 'Southern Grid', lat: 9.9252, lon: 78.1198 },
      { name: 'Tirunelveli', tag: 'Wind Energy Belt', lat: 8.7139, lon: 77.7567 },
      { name: 'Tiruchirappalli', tag: 'Central Substation', lat: 10.7905, lon: 78.7047 },
      { name: 'Salem', tag: 'Metals & Mining Zone', lat: 11.6643, lon: 78.1460 }
    ]
  },
  {
    id: 'kerala',
    name: 'Kerala',
    code: 'KL',
    capital: 'Thiruvananthapuram',
    lat: 8.5241,
    lon: 76.9366,
    region: 'South India',
    cities: [
      { name: 'Thiruvananthapuram', tag: 'Capital Hub', lat: 8.5241, lon: 76.9366 },
      { name: 'Kochi', tag: 'Solar Port Hub', lat: 9.9312, lon: 76.2673 },
      { name: 'Kozhikode', tag: 'Malabar Grid', lat: 11.2588, lon: 75.7804 },
      { name: 'Idukki', tag: 'Hydro Powerhouse', lat: 9.8494, lon: 76.9804 },
      { name: 'Thrissur', tag: 'Central Loop', lat: 10.5276, lon: 76.2144 }
    ]
  },
  {
    id: 'karnataka',
    name: 'Karnataka',
    code: 'KA',
    capital: 'Bangalore',
    lat: 12.9716,
    lon: 77.5946,
    region: 'South India',
    cities: [
      { name: 'Bangalore', tag: 'Capital & Silicon Hub', lat: 12.9716, lon: 77.5946 },
      { name: 'Mysore', tag: 'Heritage Grid', lat: 12.2958, lon: 76.6394 },
      { name: 'Mangalore', tag: 'Coastal Terminal', lat: 12.9141, lon: 74.8560 },
      { name: 'Hubli-Dharwad', tag: 'North Hub', lat: 15.3647, lon: 75.1240 },
      { name: 'Tumkur', tag: 'Pavagada Solar Zone', lat: 13.3379, lon: 77.1173 }
    ]
  },
  {
    id: 'maharashtra',
    name: 'Maharashtra',
    code: 'MH',
    capital: 'Mumbai',
    lat: 19.0760,
    lon: 72.8777,
    region: 'West India',
    cities: [
      { name: 'Mumbai', tag: 'Financial Capital', lat: 19.0760, lon: 72.8777 },
      { name: 'Pune', tag: 'Tech & Auto Hub', lat: 18.5204, lon: 73.8567 },
      { name: 'Nagpur', tag: 'Central Power Intertie', lat: 21.1458, lon: 79.0882 },
      { name: 'Nashik', tag: 'Western Loop', lat: 19.9975, lon: 73.7898 },
      { name: 'Chhatrapati Sambhajinagar', tag: 'Marathwada Hub', lat: 19.8762, lon: 75.3433 }
    ]
  },
  {
    id: 'delhi',
    name: 'Delhi NCR',
    code: 'DL',
    capital: 'Delhi NCT',
    lat: 28.7041,
    lon: 77.1025,
    region: 'North India',
    cities: [
      { name: 'Delhi NCT', tag: 'National Capital', lat: 28.7041, lon: 77.1025 },
      { name: 'Gurugram', tag: 'Cyber & Corporate Corridor', lat: 28.4595, lon: 77.0266 },
      { name: 'Noida', tag: 'Tech & Manufacturing Sector', lat: 28.5355, lon: 77.3910 },
      { name: 'Faridabad', tag: 'Industrial Base', lat: 28.4089, lon: 77.3178 }
    ]
  },
  {
    id: 'gujarat',
    name: 'Gujarat',
    code: 'GJ',
    capital: 'Gandhinagar',
    lat: 23.0225,
    lon: 72.5714,
    region: 'West India',
    cities: [
      { name: 'Ahmedabad', tag: 'Commercial Core', lat: 23.0225, lon: 72.5714 },
      { name: 'Surat', tag: 'Diamond & Energy Coast', lat: 21.1702, lon: 72.8311 },
      { name: 'Vadodara', tag: 'Engineering Hub', lat: 22.3072, lon: 73.1812 },
      { name: 'Kutch', tag: 'Mega Solar/Wind Corridor', lat: 23.7337, lon: 69.8597 }
    ]
  },
  {
    id: 'andhra-telangana',
    name: 'Andhra & Telangana',
    code: 'AP/TS',
    capital: 'Hyderabad',
    lat: 17.3850,
    lon: 78.4867,
    region: 'South India',
    cities: [
      { name: 'Hyderabad', tag: 'HITEC & Genome Hub', lat: 17.3850, lon: 78.4867 },
      { name: 'Visakhapatnam', tag: 'Coastal Port & Steel', lat: 17.6868, lon: 83.2185 },
      { name: 'Vijayawada', tag: 'Krishna Basin Grid', lat: 16.5062, lon: 80.6480 },
      { name: 'Kurnool', tag: '1GW Solar Sanctuary', lat: 15.8281, lon: 78.0373 }
    ]
  },
  {
    id: 'international-ny',
    name: 'New York State',
    code: 'US-NY',
    capital: 'New York City',
    lat: 40.7128,
    lon: -74.0060,
    region: 'USA',
    cities: [
      { name: 'New York City', tag: 'Metropolitan Core', lat: 40.7128, lon: -74.0060 },
      { name: 'Buffalo', tag: 'Niagara Hydro Link', lat: 42.8864, lon: -78.8784 },
      { name: 'Albany', tag: 'State Capital', lat: 42.6526, lon: -73.7562 }
    ]
  },
  {
    id: 'international-uk',
    name: 'London & England',
    code: 'UK',
    capital: 'London',
    lat: 51.5074,
    lon: -0.1278,
    region: 'Europe',
    cities: [
      { name: 'London', tag: 'National Capital', lat: 51.5074, lon: -0.1278 },
      { name: 'Manchester', tag: 'Northern Powerhouse', lat: 53.4808, lon: -2.2426 },
      { name: 'Birmingham', tag: 'Midlands Ring', lat: 52.4862, lon: -1.8904 }
    ]
  },
  {
    id: 'international-uae',
    name: 'Dubai & Emirates',
    code: 'UAE',
    capital: 'Abu Dhabi',
    lat: 25.2048,
    lon: 55.2708,
    region: 'Middle East',
    cities: [
      { name: 'Dubai', tag: 'Global Smart Grid', lat: 25.2048, lon: 55.2708 },
      { name: 'Abu Dhabi', tag: 'Barakah Clean Energy', lat: 24.4539, lon: 54.3773 },
      { name: 'Sharjah', tag: 'Northern Emirates Loop', lat: 25.3463, lon: 55.4209 }
    ]
  }
];

const LocationModal = ({ isOpen, onClose, onSelectLocation, currentLocationName }) => {
  const [selectedStateId, setSelectedStateId] = useState('tamil-nadu');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [detectStatus, setDetectStatus] = useState(null);

  const activeState = STATES_DIRECTORY.find(s => s.id === selectedStateId) || STATES_DIRECTORY[0];

  // Open-Meteo worldwide geocoding search
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await axios.get(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery.trim())}&count=6&language=en&format=json`
        );
        if (res.data?.results) {
          const items = res.data.results.map(r => ({
            name: r.name,
            country: r.country || r.admin1 || '',
            lat: parseFloat(r.latitude.toFixed(4)),
            lon: parseFloat(r.longitude.toFixed(4)),
            region: r.admin1 || r.country || ''
          }));
          setSearchResults(items);
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.error("Geocoding search failed:", err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Robust Auto-Detect Handler (GPS -> IP fallback -> Reverse Geocoding)
  const handleAutoDetect = async () => {
    setDetecting(true);
    setDetectStatus({ type: 'loading', message: 'Triangulating satellite coordinates...' });

    const resolveWithIP = async () => {
      setDetectStatus({ type: 'loading', message: 'Resolving location via IP Network...' });
      try {
        let ipRes = await axios.get('https://ipwho.is/').catch(() => null);
        if (ipRes?.data?.success) {
          const { city, country, latitude, longitude } = ipRes.data;
          const locName = city ? `${city}, ${country}` : country || 'Local Area';
          setDetectStatus({ type: 'success', message: `Connected: ${locName}` });
          setTimeout(() => {
            onSelectLocation(locName, parseFloat(latitude.toFixed(4)), parseFloat(longitude.toFixed(4)));
            setDetecting(false);
            onClose();
          }, 700);
          return;
        }

        const ipApiRes = await axios.get('https://ipapi.co/json/').catch(() => null);
        if (ipApiRes?.data?.city) {
          const { city, country_name, latitude, longitude } = ipApiRes.data;
          const locName = `${city}, ${country_name}`;
          setDetectStatus({ type: 'success', message: `Connected: ${locName}` });
          setTimeout(() => {
            onSelectLocation(locName, parseFloat(latitude.toFixed(4)), parseFloat(longitude.toFixed(4)));
            setDetecting(false);
            onClose();
          }, 700);
          return;
        }

        throw new Error('IP Fallback failed');
      } catch (e) {
        setDetectStatus({
          type: 'error',
          message: 'Auto-detection failed. Please select your state or city below.'
        });
        setDetecting(false);
      }
    };

    if (!navigator.geolocation) {
      await resolveWithIP();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(4));
        const lon = parseFloat(pos.coords.longitude.toFixed(4));
        setDetectStatus({ type: 'loading', message: 'GPS Fixed. Resolving state & district name...' });

        try {
          const revRes = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`,
            { timeout: 4000 }
          ).catch(() => null);

          let detectedName = 'Local GPS Station';
          if (revRes?.data?.address) {
            const addr = revRes.data.address;
            const city = addr.city || addr.town || addr.state_district || addr.state || 'Local Node';
            const country = addr.country || '';
            detectedName = country ? `${city}, ${country}` : city;
          }

          setDetectStatus({ type: 'success', message: `Target Locked: ${detectedName}` });
          setTimeout(() => {
            onSelectLocation(detectedName, lat, lon);
            setDetecting(false);
            onClose();
          }, 700);
        } catch (revErr) {
          setDetectStatus({ type: 'success', message: `GPS Fixed (${lat}, ${lon})` });
          setTimeout(() => {
            onSelectLocation('Local GPS Node', lat, lon);
            setDetecting(false);
            onClose();
          }, 700);
        }
      },
      async () => {
        await resolveWithIP();
      },
      { enableHighAccuracy: false, timeout: 6000, maximumAge: 60000 }
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-start justify-center pt-6 md:pt-10 px-3 md:px-6 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div 
          onClick={e => e.stopPropagation()}
          initial={{ y: -30, scale: 0.95, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: -30, scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className="w-full max-w-5xl relative overflow-hidden rounded-2xl mb-8"
          style={{ 
            background: 'linear-gradient(145deg, rgba(20,5,5,0.98), rgba(10,10,10,0.99))',
            border: '1px solid rgba(230, 57, 70, 0.3)',
            boxShadow: '0 0 80px rgba(230, 57, 70, 0.15), 0 25px 50px rgba(0,0,0,0.9)'
          }}
        >
          {/* Top red glow accent */}
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#E63946] to-transparent" />

          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors bg-black/60 p-2 rounded-xl border border-gray-800 hover:border-[#E63946] z-20"
          >
            <X size={18} />
          </button>
          
          <div className="p-5 md:p-8 space-y-6">
            {/* Header + Auto Detect */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Globe size={16} className="text-[#E63946]" />
                  <span className="text-[10px] text-[#E63946] font-bold tracking-[0.3em] uppercase">National & State Telemetry Grid</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-exo font-bold text-white">
                  Select State or City Node
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Currently Synchronized: <span className="text-white font-bold">{currentLocationName}</span>
                </p>
              </div>
              
              <button 
                onClick={handleAutoDetect}
                disabled={detecting}
                className="px-5 py-2.5 flex items-center gap-2.5 bg-[#E63946] hover:bg-[#ff4757] disabled:opacity-60 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(230,57,70,0.4)]"
              >
                {detecting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Auto-Detecting...</span>
                  </>
                ) : (
                  <>
                    <Navigation size={16} />
                    <span>Auto-Detect Location</span>
                  </>
                )}
              </button>
            </div>

            {/* Status Alert for Auto-Detect */}
            {detectStatus && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-xl text-xs flex items-center gap-2.5 border ${
                  detectStatus.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : detectStatus.type === 'error'
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                    : 'bg-[#E63946]/10 border-[#E63946]/30 text-white'
                }`}
              >
                {detectStatus.type === 'loading' && <Loader2 size={14} className="animate-spin text-[#E63946]" />}
                {detectStatus.type === 'success' && <CheckCircle2 size={14} className="text-emerald-400" />}
                {detectStatus.type === 'error' && <AlertCircle size={14} className="text-rose-400" />}
                <span>{detectStatus.message}</span>
              </motion.div>
            )}

            {/* Search Bar */}
            <div className="relative">
              <div className="flex items-center gap-3 px-4 py-3 bg-black/60 border border-gray-800 rounded-xl focus-within:border-[#E63946] transition-colors">
                <Search size={16} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search any State or City (e.g. Tamil Nadu, Kerala, Karnataka, Chennai, Kochi, Bangalore, Mumbai)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-sm text-white placeholder-gray-500 w-full outline-none"
                />
                {isSearching && <Loader2 size={16} className="animate-spin text-[#E63946]" />}
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-gray-500 hover:text-white">
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Live search dropdown results */}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-950/98 border border-[#E63946]/40 rounded-xl p-2 z-30 shadow-2xl space-y-1">
                  {searchResults.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        const fullName = item.country ? `${item.name}, ${item.country}` : item.name;
                        onSelectLocation(fullName, item.lat, item.lon);
                        onClose();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#E63946]/15 flex items-center justify-between text-xs transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin size={13} className="text-[#E63946]" />
                        <span className="text-white font-bold group-hover:text-[#E63946]">{item.name}</span>
                        <span className="text-gray-400">{item.country}</span>
                      </div>
                      <span className="text-[10px] text-gray-500 font-mono">
                        {item.lat.toFixed(2)}°, {item.lon.toFixed(2)}°
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── STATE-LEVEL HIERARCHY & DRILL DOWN (PRIMARY FEATURE) ── */}
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400 uppercase tracking-widest font-bold text-[10px] flex items-center gap-1.5">
                  <Layers size={14} className="text-[#E63946]" /> 1. Select State Grid
                </span>
                <span className="text-gray-500 text-[10px]">Click a state to reveal all regional districts</span>
              </div>

              {/* State Pills Horizontal Carousel */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-800">
                {STATES_DIRECTORY.map((state) => {
                  const isActive = selectedStateId === state.id;
                  return (
                    <button
                      key={state.id}
                      onClick={() => setSelectedStateId(state.id)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                        isActive
                          ? 'bg-[#E63946] text-white border-[#E63946] shadow-[0_0_20px_rgba(230,57,70,0.5)]'
                          : 'bg-black/50 text-gray-300 border-gray-800/90 hover:border-[#E63946]/50 hover:text-white'
                      }`}
                    >
                      <span>{state.name}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded ${isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-gray-400'}`}>
                        {state.cities.length} Cities
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active State View: Whole State Node vs City Drill Down */}
              {activeState && (
                <div className="p-5 rounded-2xl border border-gray-800/80 bg-black/60 space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-gray-800/60">
                    <div>
                      <div className="text-xs text-[#E63946] font-bold uppercase tracking-widest">{activeState.region}</div>
                      <h3 className="text-lg font-exo font-bold text-white flex items-center gap-2">
                        {activeState.name} Energy Network
                      </h3>
                    </div>

                    {/* Primary Button: Select Entire State Grid */}
                    <button
                      onClick={() => {
                        onSelectLocation(`${activeState.name} Grid`, activeState.lat, activeState.lon);
                        onClose();
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-2"
                    >
                      <Layers size={14} />
                      <span>Select Entire {activeState.name} Grid</span>
                    </button>
                  </div>

                  {/* Sub-Cities under this State */}
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2.5">
                      Drill Down to Specific City / District Node in {activeState.name}:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {activeState.cities.map((city) => (
                        <button
                          key={city.name}
                          onClick={() => {
                            onSelectLocation(`${city.name}, ${activeState.name}`, city.lat, city.lon);
                            onClose();
                          }}
                          className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between group ${
                            currentLocationName.toLowerCase().includes(city.name.toLowerCase())
                              ? 'bg-[#E63946]/20 border-[#E63946] text-white shadow-[0_0_15px_rgba(230,57,70,0.3)]'
                              : 'bg-zinc-950/80 border-gray-800/90 hover:border-[#E63946]/60 text-gray-300 hover:text-white'
                          }`}
                        >
                          <div>
                            <div className="font-exo font-bold text-sm text-white group-hover:text-[#E63946] transition-colors flex items-center gap-1.5">
                              <MapPin size={12} className="text-[#E63946]" />
                              {city.name}
                            </div>
                            <span className="text-[10px] text-gray-500">{city.tag}</span>
                          </div>
                          <ChevronRight size={16} className="text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Interactive World Map Section */}
            <div>
              <div className="flex justify-between items-center mb-2 text-xs">
                <span className="text-gray-400 uppercase tracking-widest font-bold text-[10px]">Global Map Overlay</span>
                <span className="text-gray-500 text-[10px]">Click any pinpoint</span>
              </div>
              <WorldMapSelector 
                onSelectLocation={(name, lat, lon) => {
                  onSelectLocation(name, lat, lon);
                  onClose();
                }} 
              />
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-gray-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <Radio size={14} className="text-[#E63946]" />
                <span>Connected Target: <strong className="text-white">{currentLocationName}</strong></span>
              </div>
              <div className="text-[10px] text-gray-500 font-mono">
                Integrated State & Central Electricity Authority (CEA) Model
              </div>
            </div>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default React.memo(LocationModal);
