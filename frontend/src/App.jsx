import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Settings, Zap, Wind, Sun, AlertTriangle, Activity, Droplets, Atom, MapPin, Thermometer, Gauge, TrendingUp, Leaf } from 'lucide-react';
import NetworkBackground from './components/NetworkBackground';
import SettingsModal from './components/SettingsModal';
import EnergyInfoModal from './components/EnergyInfoModal';
import LocationModal from './components/LocationModal';
import LiveMeter from './components/LiveMeter';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' } })
};

function App() {
  const [location, setLocation] = useState({ name: 'Mumbai', lat: 19.0760, lon: 72.8777 });
  const [energyData, setEnergyData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('combined');

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  const [refreshRate, setRefreshRate] = useState(5000);
  const [units, setUnits] = useState('metric');

  // Auto-open location modal on first load
  const [hasAskedLocation, setHasAskedLocation] = useState(false);
  useEffect(() => {
    if (!hasAskedLocation && !loading) {
      setIsLocationModalOpen(true);
      setHasAskedLocation(true);
    }
  }, [loading, hasAskedLocation]);

  const fetchData = async () => {
    try {
      if (!energyData) setLoading(true);
      setError(null);
      const energyRes = await axios.get(`${BACKEND_URL}/energy?lat=${location.lat}&lon=${location.lon}`);
      setEnergyData(energyRes.data);

      const { irradiance, windSpeed, temperature } = energyRes.data.current;
      const forecastRes = await axios.post(`${BACKEND_URL}/forecast`, { irradiance, windSpeed, temperature });
      setForecastData(forecastRes.data);
    } catch (err) {
      console.error(err);
      setError('Failed to sync telemetry. Check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, refreshRate);
    return () => clearInterval(interval);
  }, [location, refreshRate]);

  const fetchGPSLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          name: "GPS Local Node",
          lat: parseFloat(position.coords.latitude.toFixed(4)),
          lon: parseFloat(position.coords.longitude.toFixed(4))
        });
      },
      () => {
        setError("Unable to retrieve your location. Check permissions.");
        setLoading(false);
      }
    );
  };

  if (!energyData && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060606]">
        <NetworkBackground />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="relative">
            <Zap size={56} className="text-[#E63946]" />
            <motion.div 
              animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }} 
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 rounded-full"
              style={{ boxShadow: '0 0 40px rgba(230, 57, 70, 0.5)' }}
            />
          </div>
          <div className="text-white text-lg font-exo font-bold tracking-widest uppercase">
            Initializing Nexus Grid...
          </div>
          <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#E63946] rounded-full"
              animate={{ width: ['0%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  const getChartData = () => {
    if (!energyData) return [];
    return energyData.history.map(item => ({
      time: item.time,
      value: viewMode === 'solar' ? parseFloat(item.solar) :
             viewMode === 'wind' ? parseFloat(item.wind) :
             viewMode === 'ocean' ? parseFloat(item.ocean) :
             viewMode === 'nuclear' ? parseFloat(item.nuclear) :
             parseFloat(item.total)
    }));
  };

  const safeNum = (v) => { const n = Number(v); return isNaN(n) ? 0 : n; };

  const energyCards = [
    {
      key: 'solar', icon: Sun, title: 'Solar Array', subtitle: 'Photovoltaic Grid',
      value: safeNum(energyData?.current?.solarOutputKw), max: 100,
      weather: `${safeNum(energyData?.current?.irradiance).toFixed(0)} W/m²`,
      weatherLabel: 'Irradiance',
      gradient: 'from-[#1a0000] to-[#0a0a0a]',
      borderHover: 'hover:border-[#E63946]',
    },
    {
      key: 'wind', icon: Wind, title: 'Wind Kinetic', subtitle: 'Turbine Array',
      value: safeNum(energyData?.current?.windOutputKw), max: 150,
      weather: `${safeNum(energyData?.current?.windSpeed).toFixed(1)} m/s`,
      weatherLabel: 'Wind Speed',
      gradient: 'from-[#0a0a0a] to-[#1a0000]',
      borderHover: 'hover:border-[#E63946]',
    },
    {
      key: 'ocean', icon: Droplets, title: 'Ocean Tidal', subtitle: 'Wave Converter',
      value: safeNum(energyData?.current?.oceanOutputKw), max: 80,
      weather: `${safeNum(energyData?.current?.pressure).toFixed(0)} hPa`,
      weatherLabel: 'Pressure',
      gradient: 'from-[#0a0a0a] to-[#0d0005]',
      borderHover: 'hover:border-[#E63946]',
    },
    {
      key: 'nuclear', icon: Atom, title: 'Nuclear Core', subtitle: 'Fission Reactor',
      value: safeNum(energyData?.current?.nuclearOutputKw), max: 500,
      weather: `${safeNum(energyData?.current?.temperature).toFixed(1)}°C`,
      weatherLabel: 'Core Temp',
      gradient: 'from-[#150000] to-[#0a0a0a]',
      borderHover: 'hover:border-[#E63946]',
    },
  ];

  const totalOutput = energyCards.reduce((s, c) => s + c.value, 0);

  return (
    <div className="min-h-screen relative overflow-x-hidden text-white bg-[#060606] selection:bg-[#E63946] selection:text-white">
      <NetworkBackground />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} refreshRate={refreshRate} setRefreshRate={setRefreshRate} units={units} setUnits={setUnits} />
      <EnergyInfoModal isOpen={!!activeModal} onClose={() => setActiveModal(null)} type={activeModal} />
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocationName={location.name}
        onSelectLocation={(name, lat, lon) => setLocation({ name, lat, lon })}
        onLocateMe={fetchGPSLocation}
      />

      <div className="p-4 md:p-6 max-w-[1440px] mx-auto space-y-5 relative z-10">

        {/* ── NAV BAR ── */}
        <motion.header
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="rounded-2xl p-4 flex flex-col xl:flex-row justify-between items-center gap-4 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(230,57,70,0.05), rgba(0,0,0,0.6))',
            border: '1px solid rgba(230,57,70,0.15)',
            boxShadow: '0 0 40px rgba(230,57,70,0.05), 0 4px 20px rgba(0,0,0,0.4)'
          }}
        >
          <div className="flex items-center gap-4">
            <div className="relative p-2.5 rounded-xl" style={{ background: 'rgba(230,57,70,0.12)', border: '1px solid rgba(230,57,70,0.3)' }}>
              <Zap size={24} className="text-[#E63946] relative z-10" />
              <motion.div
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-xl"
                style={{ boxShadow: '0 0 20px rgba(230,57,70,0.4)' }}
              />
            </div>
            <div>
              <h1 className="text-2xl font-exo font-bold tracking-wider">
                NEXUS<span className="text-[#E63946]" style={{ textShadow: '0 0 10px rgba(230,57,70,0.5)' }}>GRID</span>
              </h1>
              <p className="text-[10px] text-gray-500 tracking-[0.2em] uppercase">Renewable Energy Monitoring</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Total output badge */}
            <div className="px-4 py-2 rounded-lg flex items-center gap-2" style={{ background: 'rgba(230,57,70,0.08)', border: '1px solid rgba(230,57,70,0.2)' }}>
              <Gauge size={14} className="text-[#E63946]" />
              <span className="text-xs text-gray-400 uppercase tracking-widest">Net Output</span>
              <span className="text-sm font-exo font-bold text-white">{totalOutput.toFixed(1)} kW</span>
            </div>

            {/* Location Button */}
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="group flex items-center gap-3 px-5 py-2.5 rounded-xl font-bold transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #E63946, #c0392b)',
                boxShadow: '0 0 20px rgba(230,57,70,0.3), 0 4px 15px rgba(0,0,0,0.3)',
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 35px rgba(230,57,70,0.5), 0 4px 15px rgba(0,0,0,0.3)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 20px rgba(230,57,70,0.3), 0 4px 15px rgba(0,0,0,0.3)'}
            >
              <MapPin size={16} className="text-white" />
              <div className="flex flex-col text-left">
                <span className="text-[9px] uppercase text-white/60 tracking-widest leading-none">Location Node</span>
                <span className="text-sm text-white">{location.name}</span>
              </div>
            </button>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-3 rounded-xl transition-all duration-300 border border-gray-800 hover:border-[#E63946] group"
              style={{ background: 'rgba(255,255,255,0.03)' }}
            >
              <Settings size={18} className="text-gray-400 group-hover:text-[#E63946] group-hover:rotate-90 transition-all duration-500" />
            </button>
          </div>
        </motion.header>

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl flex items-center gap-3" style={{ background: 'rgba(230,57,70,0.1)', border: '1px solid rgba(230,57,70,0.3)' }}>
            <AlertTriangle size={18} className="text-[#E63946]" /> <span className="text-sm text-gray-300">{error}</span>
          </motion.div>
        )}

        {/* ── MAIN GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

          {/* LEFT: Energy Cards */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-4">
              {energyCards.map((card, i) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.key}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ scale: 1.03, y: -4 }}
                    onClick={() => setActiveModal(card.key)}
                    className={`relative overflow-hidden rounded-2xl p-5 cursor-pointer transition-all duration-300 bg-gradient-to-b ${card.gradient} ${card.borderHover} group`}
                    style={{
                      border: '1px solid rgba(230,57,70,0.12)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 30px rgba(230,57,70,0.2), 0 8px 30px rgba(0,0,0,0.5)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.4)'}
                  >
                    {/* Background icon */}
                    <Icon size={80} className="absolute -top-2 -right-2 text-[#E63946] opacity-[0.04] group-hover:opacity-[0.08] transition-all duration-700 group-hover:rotate-12" />

                    {/* Header */}
                    <div className="flex items-center gap-2 mb-1">
                      <div className="p-1.5 rounded-lg" style={{ background: 'rgba(230,57,70,0.1)' }}>
                        <Icon size={14} className="text-[#E63946]" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-xs tracking-widest uppercase leading-none">{card.title}</h3>
                        <span className="text-[9px] text-gray-600 uppercase tracking-widest">{card.subtitle}</span>
                      </div>
                    </div>

                    {/* Main value */}
                    <div className="mt-3 mb-1">
                      <span className="text-3xl font-exo font-bold text-white" style={{ textShadow: '0 0 15px rgba(230,57,70,0.2)' }}>
                        {card.value.toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">kW</span>
                    </div>

                    {/* Weather data row */}
                    <div className="flex items-center gap-1.5 mb-1">
                      <Thermometer size={10} className="text-gray-600" />
                      <span className="text-[10px] text-gray-500">{card.weatherLabel}:</span>
                      <span className="text-[10px] text-gray-300 font-bold">{card.weather}</span>
                    </div>

                    {/* Live meter */}
                    <LiveMeter value={card.value} max={card.max} showStats={true} />

                    {/* CTA */}
                    <div className="mt-3 pt-2 border-t border-gray-800/50">
                      <span className="text-[10px] text-[#E63946] font-bold uppercase tracking-widest group-hover:tracking-[0.25em] transition-all duration-300">
                        View Mechanism →
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Graph + Stats */}
          <div className="lg:col-span-7 space-y-5 flex flex-col">

            {/* Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex-grow flex flex-col rounded-2xl p-6 relative"
              style={{
                background: 'linear-gradient(180deg, rgba(230,57,70,0.04), rgba(0,0,0,0.5))',
                border: '1px solid rgba(230,57,70,0.12)',
                boxShadow: '0 4px 30px rgba(0,0,0,0.3)'
              }}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
                <div>
                  <h2 className="text-lg font-exo font-bold flex items-center gap-2 text-white">
                    <Activity size={18} className="text-[#E63946]" /> Telemetry Output
                  </h2>
                  <p className="text-[10px] text-gray-500 tracking-widest uppercase mt-0.5">Real-time generation curve</p>
                </div>
                <div className="flex gap-0.5 rounded-xl p-1" style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(230,57,70,0.1)' }}>
                  {[
                    { key: 'combined', label: 'NET' },
                    { key: 'solar', label: 'SOL' },
                    { key: 'wind', label: 'WND' },
                    { key: 'ocean', label: 'OCN' },
                    { key: 'nuclear', label: 'NKR' },
                  ].map(btn => (
                    <button
                      key={btn.key}
                      onClick={() => setViewMode(btn.key)}
                      className={`px-3 py-1.5 text-[10px] rounded-lg transition-all font-bold tracking-widest uppercase ${
                        viewMode === btn.key
                          ? 'bg-[#E63946] text-white shadow-[0_0_15px_rgba(230,57,70,0.4)]'
                          : 'text-gray-500 hover:text-white'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-grow w-full min-h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={getChartData()}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#E63946" stopOpacity={0.5} />
                        <stop offset="95%" stopColor="#E63946" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" stroke="#333" fontSize={9} tickLine={false} axisLine={false} />
                    <YAxis stroke="#333" fontSize={9} tickLine={false} axisLine={false} width={35} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#111', border: '1px solid #E63946', borderRadius: '8px', boxShadow: '0 0 20px rgba(230,57,70,0.3)' }}
                      itemStyle={{ color: '#E63946', fontWeight: 'bold', fontSize: 12 }}
                      labelStyle={{ color: '#888', fontSize: 10 }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#E63946" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" animationDuration={500} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Bottom stats row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* Forecast */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="rounded-2xl p-5 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(230,57,70,0.08), rgba(0,0,0,0.5))',
                  border: '1px solid rgba(230,57,70,0.15)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp size={14} className="text-[#E63946]" />
                  <h3 className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">12H Forecast</h3>
                </div>
                <div className="text-4xl font-exo font-bold text-white" style={{ textShadow: '0 0 20px rgba(230,57,70,0.2)' }}>
                  {safeNum(forecastData?.predictedEnergy).toFixed(1)}
                  <span className="text-xs font-normal text-gray-500 ml-1">kW</span>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-800/50 flex justify-between text-xs">
                  <span className="text-gray-500 uppercase tracking-widest text-[10px]">Trend</span>
                  <span className={`font-bold uppercase tracking-widest text-[10px] ${forecastData?.trend === 'increasing' ? 'text-white' : 'text-[#E63946]'}`}>
                    {forecastData?.trend || 'N/A'}
                  </span>
                </div>
              </motion.div>

              {/* Carbon */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="rounded-2xl p-5"
                style={{
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Leaf size={14} className="text-[#E63946]" />
                  <h3 className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Carbon Offset</h3>
                </div>
                <div className="text-3xl font-bold text-white">
                  {energyData?.current?.carbonSavingsKg || '0'}
                  <span className="text-xs text-[#E63946] ml-1">kg CO₂</span>
                </div>
                <p className="mt-2 text-[10px] text-gray-500 leading-relaxed">Equivalent environmental savings from clean energy generation.</p>
              </motion.div>

              {/* Insight */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="rounded-2xl p-5 flex flex-col justify-between"
                style={{
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Activity size={14} className="text-[#E63946]" />
                  <h3 className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">AI Insight</h3>
                </div>
                <p className="text-sm text-gray-300 italic leading-relaxed">"{energyData?.insight || 'Analyzing patterns...'}"</p>
                <div className="mt-2 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#E63946] animate-pulse" />
                  <span className="text-[9px] text-gray-600 uppercase tracking-widest">Live Analysis</span>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
