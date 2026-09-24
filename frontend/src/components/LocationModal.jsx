import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Navigation, Globe, Radio, Search, Loader2, CheckCircle2, AlertCircle, MapPin } from 'lucide-react';
import axios from 'axios';
import WorldMapSelector from './WorldMapSelector';

const POPULAR_HUBS = [
  { name: 'Chennai', country: 'India', lat: 13.0827, lon: 80.2707, region: 'South Asia' },
  { name: 'Mumbai', country: 'India', lat: 19.0760, lon: 72.8777, region: 'South Asia' },
  { name: 'Delhi', country: 'India', lat: 28.7041, lon: 77.1025, region: 'South Asia' },
  { name: 'Bangalore', country: 'India', lat: 12.9716, lon: 77.5946, region: 'South Asia' },
  { name: 'New York', country: 'USA', lat: 40.7128, lon: -74.0060, region: 'Americas' },
  { name: 'London', country: 'UK', lat: 51.5074, lon: -0.1278, region: 'Europe' },
  { name: 'Tokyo', country: 'Japan', lat: 35.6895, lon: 139.6917, region: 'East Asia' },
  { name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522, region: 'Europe' },
  { name: 'Dubai', country: 'UAE', lat: 25.2048, lon: 55.2708, region: 'Middle East' },
  { name: 'Berlin', country: 'Germany', lat: 52.5200, lon: 13.4050, region: 'Europe' },
  { name: 'Singapore', country: 'Singapore', lat: 1.3521, lon: 103.8198, region: 'Southeast Asia' },
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093, region: 'Oceania' },
  { name: 'São Paulo', country: 'Brazil', lat: -23.5505, lon: -46.6333, region: 'South America' },
  { name: 'Cape Town', country: 'South Africa', lat: -33.9249, lon: 18.4241, region: 'Africa' },
];

const LocationModal = ({ isOpen, onClose, onSelectLocation, currentLocationName }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [detectStatus, setDetectStatus] = useState(null); // { type: 'loading'|'success'|'error', message: '' }

  // Auto geocoding search for worldwide cities
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
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Robust Auto-Detect Handler (Browser GPS -> IP Geolocation Fallback -> Reverse Geocoding)
  const handleAutoDetect = async () => {
    setDetecting(true);
    setDetectStatus({ type: 'loading', message: 'Triangulating GPS coordinates...' });

    const resolveWithIP = async (errMsg) => {
      setDetectStatus({ type: 'loading', message: 'Fallback: Resolving location via IP Network...' });
      try {
        // Try ipwho.is first, then ipapi.co
        let ipRes = await axios.get('https://ipwho.is/').catch(() => null);
        if (ipRes?.data?.success) {
          const { city, country, latitude, longitude } = ipRes.data;
          const locName = city ? `${city}, ${country}` : country || 'Local Area';
          setDetectStatus({ type: 'success', message: `Identified: ${locName}` });
          setTimeout(() => {
            onSelectLocation(locName, parseFloat(latitude.toFixed(4)), parseFloat(longitude.toFixed(4)));
            setDetecting(false);
            onClose();
          }, 800);
          return;
        }

        // Secondary IP fallback
        const ipApiRes = await axios.get('https://ipapi.co/json/').catch(() => null);
        if (ipApiRes?.data?.city) {
          const { city, country_name, latitude, longitude } = ipApiRes.data;
          const locName = `${city}, ${country_name}`;
          setDetectStatus({ type: 'success', message: `Identified: ${locName}` });
          setTimeout(() => {
            onSelectLocation(locName, parseFloat(latitude.toFixed(4)), parseFloat(longitude.toFixed(4)));
            setDetecting(false);
            onClose();
          }, 800);
          return;
        }

        throw new Error('All IP providers failed');
      } catch (fallbackErr) {
        console.error("IP fallback failed:", fallbackErr);
        setDetectStatus({
          type: 'error',
          message: 'Location auto-detection unavailable. Please select your city below.'
        });
        setDetecting(false);
      }
    };

    if (!navigator.geolocation) {
      await resolveWithIP('Browser geolocation unsupported.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(4));
        const lon = parseFloat(pos.coords.longitude.toFixed(4));
        
        setDetectStatus({ type: 'loading', message: 'GPS lock acquired. Resolving region name...' });

        // Reverse-geocode coordinates to get human city name
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
          }, 800);
        } catch (revErr) {
          setDetectStatus({ type: 'success', message: `GPS Fixed (${lat}, ${lon})` });
          setTimeout(() => {
            onSelectLocation('Local GPS Node', lat, lon);
            setDetecting(false);
            onClose();
          }, 800);
        }
      },
      async (err) => {
        console.warn("GPS failed or denied:", err.message);
        await resolveWithIP('GPS permission denied or timeout.');
      },
      {
        enableHighAccuracy: false,
        timeout: 6000,
        maximumAge: 60000
      }
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-start justify-center pt-8 md:pt-12 px-3 md:px-6 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div 
          onClick={e => e.stopPropagation()}
          initial={{ y: -40, scale: 0.95, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: -40, scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className="w-full max-w-5xl relative overflow-hidden rounded-2xl mb-8"
          style={{ 
            background: 'linear-gradient(145deg, rgba(20,5,5,0.98), rgba(10,10,10,0.99))',
            border: '1px solid rgba(230, 57, 70, 0.3)',
            boxShadow: '0 0 80px rgba(230, 57, 70, 0.15), 0 25px 50px rgba(0,0,0,0.9)'
          }}
        >
          {/* Accent line top */}
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#E63946] to-transparent" />

          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors bg-black/60 p-2 rounded-xl border border-gray-800 hover:border-[#E63946] z-20"
          >
            <X size={18} />
          </button>
          
          <div className="p-6 md:p-8 space-y-6">
            {/* Header + Auto-detect CTA */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Globe size={16} className="text-[#E63946]" />
                  <span className="text-[10px] text-[#E63946] font-bold tracking-[0.3em] uppercase">Global Telemetry Uplink</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-exo font-bold text-white">
                  Select Grid Location Node
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Connected: <span className="text-white font-bold">{currentLocationName}</span>
                </p>
              </div>
              
              <button 
                onClick={handleAutoDetect}
                disabled={detecting}
                className="px-5 py-3 flex items-center gap-2.5 bg-[#E63946] hover:bg-[#ff4757] disabled:opacity-60 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(230,57,70,0.4)] hover:shadow-[0_0_30px_rgba(230,57,70,0.7)]"
              >
                {detecting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Auto-Detecting...</span>
                  </>
                ) : (
                  <>
                    <Navigation size={16} />
                    <span>Auto-Detect My Location</span>
                  </>
                )}
              </button>
            </div>

            {/* Status Alert for Auto-Detect */}
            {detectStatus && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
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
                  placeholder="Search any city worldwide (e.g. Chennai, Mumbai, London, San Francisco, Tokyo)..."
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
                <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-950/95 border border-[#E63946]/40 rounded-xl p-2 z-30 shadow-2xl space-y-1">
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

            {/* Interactive World Map */}
            <div>
              <div className="flex justify-between items-center mb-2 text-xs">
                <span className="text-gray-400 uppercase tracking-widest font-bold text-[10px]">Interactive World Node Map</span>
                <span className="text-gray-500 text-[10px]">Click any pin to establish link</span>
              </div>
              <WorldMapSelector 
                onSelectLocation={(name, lat, lon) => {
                  onSelectLocation(name, lat, lon);
                  onClose();
                }} 
              />
            </div>

            {/* Quick Hubs Grid */}
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">
                Quick Regional Hubs
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                {POPULAR_HUBS.map((hub) => (
                  <button
                    key={hub.name}
                    onClick={() => {
                      onSelectLocation(hub.name, hub.lat, hub.lon);
                      onClose();
                    }}
                    className={`px-3 py-2 rounded-xl text-left border transition-all text-xs flex flex-col ${
                      currentLocationName.toLowerCase().includes(hub.name.toLowerCase())
                        ? 'bg-[#E63946]/20 border-[#E63946] text-white shadow-[0_0_12px_rgba(230,57,70,0.3)]'
                        : 'bg-black/40 border-gray-800 hover:border-[#E63946]/50 text-gray-300 hover:text-white'
                    }`}
                  >
                    <span className="font-bold">{hub.name}</span>
                    <span className="text-[9px] text-gray-500 truncate">{hub.country}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Footer status */}
            <div className="pt-2 border-t border-gray-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <Radio size={14} className="text-[#E63946]" />
                <span>Active Link: <strong className="text-white">{currentLocationName}</strong></span>
              </div>
              <div className="text-[10px] text-gray-500">
                Weather models: Open-Meteo High-Resolution (1 km ECMWF/GFS)
              </div>
            </div>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default React.memo(LocationModal);
