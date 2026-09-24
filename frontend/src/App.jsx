import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Settings, Zap, Wind, Sun, AlertTriangle, Activity, Droplets, Atom, 
  MapPin, Thermometer, Gauge, TrendingUp, Leaf, Battery, BatteryCharging, 
  Layers, RefreshCw, ChevronRight, ShieldCheck, Compass, Radio
} from 'lucide-react';
import NetworkBackground from './components/NetworkBackground';
import SettingsModal from './components/SettingsModal';
import EnergyInfoModal from './components/EnergyInfoModal';
import LocationModal from './components/LocationModal';
import RegionalGridModal from './components/RegionalGridModal';
import LiveMeter from './components/LiveMeter';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' } })
};

function App() {
  const [location, setLocation] = useState({ name: 'Chennai', lat: 13.0827, lon: 80.2707 });
  const [energyData, setEnergyData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('combined');

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isRegionalModalOpen, setIsRegionalModalOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  const [refreshRate, setRefreshRate] = useState(5000);
  const [units, setUnits] = useState('metric');
  const [hasAnimatedChart, setHasAnimatedChart] = useState(false);

  const fetchData = useCallback(async (isManual = false) => {
    try {
      if (isManual) setIsRefreshing(true);
      if (!energyData && !isManual) setLoading(true);
      setError(null);

      const energyRes = await axios.get(
        `${BACKEND_URL}/energy?lat=${location.lat}&lon=${location.lon}&city=${encodeURIComponent(location.name)}`
      );
      setEnergyData(energyRes.data);

      const { irradiance, windSpeed, temperature } = energyRes.data.current;
      const forecastRes = await axios.post(`${BACKEND_URL}/forecast`, { irradiance, windSpeed, temperature });
      setForecastData(forecastRes.data);
    } catch (err) {
      console.error("Telemetry sync error:", err);
      setError('Telemetry link interrupted. Reconnecting with regional substation...');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [location, energyData]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(false), refreshRate);
    return () => clearInterval(interval);
  }, [fetchData, refreshRate]);

  // Safe number formatter
  const safeNum = (v) => {
    const n = Number(v);
    return isNaN(n) ? 0 : n;
  };

  // Unit conversion helpers
  const formatTemp = (celsius) => {
    const c = safeNum(celsius);
    if (units === 'imperial') return `${((c * 9) / 5 + 32).toFixed(1)}°F`;
    return `${c.toFixed(1)}°C`;
  };

  const formatSpeed = (kmh) => {
    const k = safeNum(kmh);
    if (units === 'imperial') return `${(k * 0.621371).toFixed(1)} mph`;
    return `${(k / 3.6).toFixed(1)} m/s`;
  };

  // Memoized Chart Dataset
  const chartData = useMemo(() => {
    if (!energyData?.history) return [];
    return energyData.history.map(item => ({
      time: item.time,
      value: viewMode === 'solar' ? parseFloat(item.solar) :
             viewMode === 'wind' ? parseFloat(item.wind) :
             viewMode === 'ocean' ? parseFloat(item.ocean) :
             viewMode === 'nuclear' ? parseFloat(item.nuclear) :
             parseFloat(item.total)
    }));
  }, [energyData?.history, viewMode]);

  const energyCards = useMemo(() => [
    {
      key: 'solar', icon: Sun, title: 'Solar Array', subtitle: 'Photovoltaic Grid',
      value: safeNum(energyData?.current?.solarOutputKw), max: 100,
      weather: `${safeNum(energyData?.current?.irradiance).toFixed(0)} W/m²`,
      weatherLabel: 'Irradiance',
      extra: `Cloud: ${safeNum(energyData?.current?.cloudCover)}%`,
      gradient: 'from-[#1a0505] to-[#0a0a0a]',
      borderHover: 'hover:border-[#E63946]',
    },
    {
      key: 'wind', icon: Wind, title: 'Wind Kinetic', subtitle: 'Turbine Array',
      value: safeNum(energyData?.current?.windOutputKw), max: 150,
      weather: formatSpeed(energyData?.current?.windSpeed),
      weatherLabel: 'Wind Speed',
      extra: `Pressure: ${safeNum(energyData?.current?.pressure).toFixed(0)} hPa`,
      gradient: 'from-[#0a0a0a] to-[#1a0505]',
      borderHover: 'hover:border-[#E63946]',
    },
    {
      key: 'ocean', icon: Droplets, title: 'Ocean Tidal', subtitle: 'Wave Converter',
      value: safeNum(energyData?.current?.oceanOutputKw), max: 80,
      weather: `${safeNum(energyData?.current?.pressure).toFixed(0)} hPa`,
      weatherLabel: 'Pressure',
      extra: `Humidity: ${safeNum(energyData?.current?.humidity)}%`,
      gradient: 'from-[#0a0a0a] to-[#0d0008]',
      borderHover: 'hover:border-[#E63946]',
    },
    {
      key: 'nuclear', icon: Atom, title: 'Nuclear Core', subtitle: 'Fission Baseload',
      value: safeNum(energyData?.current?.nuclearOutputKw), max: 250,
      weather: formatTemp(energyData?.current?.temperature),
      weatherLabel: 'Ambient Temp',
      extra: 'Baseload: 98.4%',
      gradient: 'from-[#150505] to-[#0a0a0a]',
      borderHover: 'hover:border-[#E63946]',
    },
  ], [energyData?.current, units]);

  const totalOutput = useMemo(() => {
    return energyCards.reduce((s, c) => s + c.value, 0);
  }, [energyCards]);

  const regionalPlants = energyData?.regionalInfrastructure?.plants || [];

  if (!energyData && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060606]">
        <NetworkBackground />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6 z-10"
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
            Initializing Nexus Grid Core...
          </div>
          <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#E63946] rounded-full"
              animate={{ width: ['0%', '100%'] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden text-white bg-[#060606] selection:bg-[#E63946] selection:text-white pb-12">
      <NetworkBackground />
      
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        refreshRate={refreshRate} 
        setRefreshRate={setRefreshRate} 
        units={units} 
        setUnits={setUnits} 
      />
      
      <EnergyInfoModal 
        isOpen={!!activeModal} 
        onClose={() => setActiveModal(null)} 
        type={activeModal} 
      />

      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocationName={location.name}
        onSelectLocation={(name, lat, lon) => setLocation({ name, lat, lon })}
      />

      <RegionalGridModal
        isOpen={isRegionalModalOpen}
        onClose={() => setIsRegionalModalOpen(false)}
        regionalData={energyData?.regionalInfrastructure}
        cityName={location.name}
        currentMetrics={energyData?.current}
      />

      <div className="p-3 md:p-6 max-w-[1440px] mx-auto space-y-5 relative z-10">

        {/* ── TOP HEADER / NAV BAR ── */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="rounded-2xl p-4 flex flex-col xl:flex-row justify-between items-center gap-4 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(230,57,70,0.08), rgba(0,0,0,0.7))',
            border: '1px solid rgba(230,57,70,0.2)',
            boxShadow: '0 0 40px rgba(230,57,70,0.05), 0 4px 20px rgba(0,0,0,0.5)'
          }}
        >
          <div className="flex items-center gap-3 md:gap-4">
            <div className="relative p-2.5 rounded-xl bg-[#E63946]/10 border border-[#E63946]/30">
              <Zap size={24} className="text-[#E63946] relative z-10" />
              <motion.div
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-xl"
                style={{ boxShadow: '0 0 20px rgba(230,57,70,0.4)' }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-exo font-bold tracking-wider">
                  NEXUS<span className="text-[#E63946]" style={{ textShadow: '0 0 10px rgba(230,57,70,0.6)' }}>GRID</span>
                </h1>
                <span className="px-2 py-0.5 text-[9px] rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
                  LIVE 50.0Hz
                </span>
              </div>
              <p className="text-[10px] text-gray-400 tracking-[0.2em] uppercase">Intelligent Energy & Power Plant Infrastructure</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 md:gap-3">
            {/* Total Net Output Badge */}
            <div className="px-4 py-2 rounded-xl flex items-center gap-2.5 bg-[#E63946]/10 border border-[#E63946]/30">
              <Gauge size={16} className="text-[#E63946]" />
              <div className="text-left">
                <span className="text-[9px] text-gray-400 uppercase tracking-widest block leading-none">Net Grid Output</span>
                <span className="text-sm font-exo font-bold text-white">{totalOutput.toFixed(1)} kW</span>
              </div>
            </div>

            {/* Quick Regional Plants Launcher */}
            <button
              onClick={() => setIsRegionalModalOpen(true)}
              className="group flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-800 hover:border-[#E63946] bg-black/50 hover:bg-[#E63946]/10 transition-all duration-300"
              title="Inspect power stations feeding this location"
            >
              <Layers size={16} className="text-[#E63946] group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <span className="text-[9px] text-gray-400 uppercase tracking-widest block leading-none">Supply Plants</span>
                <span className="text-xs font-bold text-white">{regionalPlants.length} Stations</span>
              </div>
            </button>

            {/* Location Selector Button */}
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="group flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-bold transition-all duration-300 bg-gradient-to-r from-[#E63946] to-[#c0392b] hover:shadow-[0_0_30px_rgba(230,57,70,0.6)]"
              style={{
                boxShadow: '0 0 20px rgba(230,57,70,0.3)',
              }}
            >
              <MapPin size={16} className="text-white group-hover:animate-bounce" />
              <div className="flex flex-col text-left">
                <span className="text-[9px] uppercase text-white/70 tracking-widest leading-none">Target Node</span>
                <span className="text-xs md:text-sm text-white truncate max-w-[140px]">{location.name}</span>
              </div>
            </button>

            {/* Manual Refresh Button */}
            <button
              onClick={() => fetchData(true)}
              disabled={isRefreshing}
              className="p-3 rounded-xl border border-gray-800 hover:border-[#E63946] bg-white/5 hover:bg-white/10 transition-all text-gray-400 hover:text-white"
              title="Sync Telemetry"
            >
              <RefreshCw size={16} className={isRefreshing ? "animate-spin text-[#E63946]" : ""} />
            </button>

            {/* Settings Button */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-3 rounded-xl transition-all duration-300 border border-gray-800 hover:border-[#E63946] bg-white/5 group"
              title="System Configuration"
            >
              <Settings size={16} className="text-gray-400 group-hover:text-[#E63946] group-hover:rotate-90 transition-all duration-500" />
            </button>
          </div>
        </motion.header>

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl flex items-center gap-3 bg-[#E63946]/15 border border-[#E63946]/40">
            <AlertTriangle size={18} className="text-[#E63946]" /> 
            <span className="text-sm text-gray-200">{error}</span>
          </motion.div>
        )}

        {/* ── REGIONAL POWER STATIONS STRIP (DIRECT USER FEATURE) ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-4 md:p-5 relative overflow-hidden border border-[#E63946]/20 bg-gradient-to-r from-zinc-950/90 via-black/90 to-zinc-950/90"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-3.5">
            <div className="flex items-center gap-2">
              <Layers size={18} className="text-[#E63946]" />
              <h2 className="text-sm md:text-base font-exo font-bold text-white uppercase tracking-wider">
                Power Stations Supplying <span className="text-[#E63946]">{location.name}</span>
              </h2>
              <span className="text-[10px] text-gray-400 hidden sm:inline">
                ({energyData?.regionalInfrastructure?.regionName || 'Regional Grid'})
              </span>
            </div>
            <button
              onClick={() => setIsRegionalModalOpen(true)}
              className="text-xs text-[#E63946] hover:text-white flex items-center gap-1 font-bold transition-colors group"
            >
              <span>View All Station Specs</span>
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {regionalPlants.map((plant) => {
              const Icon = plant.type === 'nuclear' ? Atom : plant.type === 'solar' ? Sun : plant.type === 'wind' ? Wind : Droplets;
              return (
                <div
                  key={plant.id}
                  onClick={() => setIsRegionalModalOpen(true)}
                  className="p-3.5 rounded-xl border border-gray-800/80 hover:border-[#E63946]/60 bg-black/60 hover:bg-[#E63946]/5 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <Icon size={14} className="text-[#E63946]" />
                      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                        {plant.type}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono font-bold">
                      {plant.outputSharePercent}% Share
                    </span>
                  </div>
                  <h3 className="text-xs font-exo font-bold text-white group-hover:text-[#E63946] transition-colors line-clamp-1">
                    {plant.name}
                  </h3>
                  <div className="text-[10px] text-gray-400 mt-0.5 truncate">
                    {plant.location}
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-800 flex justify-between text-[10px]">
                    <span className="text-gray-500">Capacity: {plant.capacityMw} MW</span>
                    <span className="text-white font-bold">{plant.currentOutputKw} kW</span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ── MAIN TELEMETRY GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

          {/* LEFT COLUMN: Energy Generation Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {energyCards.map((card, i) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.key}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ scale: 1.02, y: -3 }}
                    onClick={() => setActiveModal(card.key)}
                    className={`relative overflow-hidden rounded-2xl p-5 cursor-pointer transition-all duration-300 bg-gradient-to-b ${card.gradient} ${card.borderHover} group`}
                    style={{
                      border: '1px solid rgba(230,57,70,0.15)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                    }}
                  >
                    {/* Faint Background Icon */}
                    <Icon size={72} className="absolute -top-1 -right-1 text-[#E63946] opacity-[0.05] group-hover:opacity-[0.12] transition-all duration-500 group-hover:rotate-12" />

                    {/* Card Header */}
                    <div className="flex items-center gap-2 mb-1">
                      <div className="p-1.5 rounded-lg bg-[#E63946]/10 border border-[#E63946]/20">
                        <Icon size={14} className="text-[#E63946]" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-xs tracking-widest uppercase leading-none">{card.title}</h3>
                        <span className="text-[9px] text-gray-500 uppercase tracking-widest">{card.subtitle}</span>
                      </div>
                    </div>

                    {/* Main kW Output Value */}
                    <div className="mt-3 mb-1">
                      <span className="text-3xl font-exo font-bold text-white">
                        {card.value.toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-400 ml-1">kW</span>
                    </div>

                    {/* Weather & Secondary Stats */}
                    <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                      <div className="flex items-center gap-1">
                        <Thermometer size={10} className="text-[#E63946]" />
                        <span>{card.weatherLabel}:</span>
                        <strong className="text-white">{card.weather}</strong>
                      </div>
                      <span className="text-gray-500">{card.extra}</span>
                    </div>

                    {/* Live Meter Bar */}
                    <LiveMeter value={card.value} max={card.max} showStats={true} />

                    {/* CTA Link */}
                    <div className="mt-3 pt-2 border-t border-gray-800/60 flex items-center justify-between">
                      <span className="text-[10px] text-[#E63946] font-bold uppercase tracking-wider group-hover:tracking-widest transition-all">
                        Technical Specs →
                      </span>
                      <span className="text-[9px] text-gray-500 font-mono">
                        {((card.value / (totalOutput || 1)) * 100).toFixed(0)}% Net
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Battery Energy Storage System (BESS) Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-5 border border-gray-800/80 bg-gradient-to-br from-black/80 to-zinc-950/80"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    <BatteryCharging size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs font-exo font-bold text-white uppercase tracking-wider">
                      Grid Battery Storage (BESS)
                    </h3>
                    <span className="text-[9px] text-gray-500 uppercase tracking-widest">Utility Lithium-Iron Buffer</span>
                  </div>
                </div>
                <span className={`px-2 py-0.5 text-[9px] rounded-full font-mono font-bold border ${
                  energyData?.current?.battery?.status === 'CHARGING'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}>
                  {energyData?.current?.battery?.status || 'CHARGING'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-1 pb-3">
                <div className="p-2 rounded-xl bg-white/[0.02] border border-gray-800/50">
                  <span className="text-[9px] text-gray-500 uppercase tracking-widest block">State of Charge</span>
                  <span className="text-lg font-exo font-bold text-white">
                    {energyData?.current?.battery?.socPercent || '78.5'}%
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-white/[0.02] border border-gray-800/50">
                  <span className="text-[9px] text-gray-500 uppercase tracking-widest block">Net Flow</span>
                  <span className={`text-lg font-exo font-bold ${
                    Number(energyData?.current?.battery?.flowKw) >= 0 ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {energyData?.current?.battery?.flowKw || '+12.4'} kW
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-white/[0.02] border border-gray-800/50">
                  <span className="text-[9px] text-gray-500 uppercase tracking-widest block">Storage Cap</span>
                  <span className="text-lg font-exo font-bold text-white">
                    500 kWh
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-black/80 rounded-full overflow-hidden border border-gray-800">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
                  style={{ width: `${energyData?.current?.battery?.socPercent || 78}%` }}
                />
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Graph + Forecast + Environment Stats */}
          <div className="lg:col-span-7 space-y-5 flex flex-col">

            {/* Live Chart Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-grow flex flex-col rounded-2xl p-5 md:p-6 relative border border-[#E63946]/15 bg-gradient-to-b from-black/80 to-zinc-950/90"
              style={{
                boxShadow: '0 4px 30px rgba(0,0,0,0.4)'
              }}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
                <div>
                  <h2 className="text-base md:text-lg font-exo font-bold flex items-center gap-2 text-white">
                    <Activity size={18} className="text-[#E63946]" /> Real-Time Telemetry Curve
                  </h2>
                  <p className="text-[10px] text-gray-400 tracking-widest uppercase mt-0.5">
                    12-Hour continuous output log for {location.name}
                  </p>
                </div>

                {/* Filter Selector Tabs */}
                <div className="flex gap-1 rounded-xl p-1 bg-black/80 border border-gray-800">
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
                      className={`px-3 py-1 text-[10px] rounded-lg transition-all font-bold tracking-widest uppercase ${
                        viewMode === btn.key
                          ? 'bg-[#E63946] text-white shadow-[0_0_12px_rgba(230,57,70,0.5)]'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart Canvas */}
              <div className="flex-grow w-full min-h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#E63946" stopOpacity={0.45} />
                        <stop offset="95%" stopColor="#E63946" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" stroke="#444" fontSize={9} tickLine={false} axisLine={false} />
                    <YAxis stroke="#444" fontSize={9} tickLine={false} axisLine={false} width={35} />
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: 'rgba(10,10,10,0.95)', 
                        border: '1px solid #E63946', 
                        borderRadius: '8px', 
                        boxShadow: '0 0 20px rgba(230,57,70,0.3)',
                        padding: '8px 12px'
                      }}
                      itemStyle={{ color: '#E63946', fontWeight: 'bold', fontSize: 12 }}
                      labelStyle={{ color: '#888', fontSize: 10, marginBottom: 2 }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#E63946" 
                      strokeWidth={2.5} 
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                      isAnimationActive={!hasAnimatedChart}
                      onAnimationEnd={() => setHasAnimatedChart(true)}
                      dot={false} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Bottom 3 Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* 12H Predictive Forecast */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-2xl p-5 border border-[#E63946]/20 bg-gradient-to-br from-[#1a0505]/60 to-black/80"
              >
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={14} className="text-[#E63946]" />
                  <h3 className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">12H AI Forecast</h3>
                </div>
                <div className="text-3xl font-exo font-bold text-white">
                  {safeNum(forecastData?.predictedEnergy).toFixed(1)}
                  <span className="text-xs font-normal text-gray-400 ml-1">kW</span>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-800/60 flex justify-between text-xs">
                  <span className="text-gray-500 uppercase tracking-widest text-[9px]">Trend</span>
                  <span className={`font-bold uppercase tracking-widest text-[10px] ${
                    forecastData?.trend === 'increasing' ? 'text-emerald-400' : 'text-[#E63946]'
                  }`}>
                    {forecastData?.trend || 'STABLE'}
                  </span>
                </div>
              </motion.div>

              {/* Carbon Offset */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-2xl p-5 border border-gray-800/80 bg-black/60"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Leaf size={14} className="text-emerald-400" />
                  <h3 className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Carbon Offset</h3>
                </div>
                <div className="text-3xl font-bold text-white">
                  {energyData?.current?.carbonSavingsKg || '0'}
                  <span className="text-xs text-emerald-400 ml-1">kg CO₂</span>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-800/60 text-[10px] text-gray-400">
                  Equivalent to offsetting <strong>{(safeNum(energyData?.current?.carbonSavingsKg) * 0.04).toFixed(1)} trees</strong>/day
                </div>
              </motion.div>

              {/* AI Autonomous Insight */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="rounded-2xl p-5 border border-gray-800/80 bg-black/60 flex flex-col justify-between"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Activity size={14} className="text-[#E63946]" />
                  <h3 className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Grid AI Diagnosis</h3>
                </div>
                <p className="text-xs text-gray-300 italic leading-relaxed">
                  "{energyData?.insight || 'Grid telemetry operational.'}"
                </p>
                <div className="mt-2 pt-2 border-t border-gray-800/60 flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] text-gray-500 uppercase tracking-widest">Autonomous Balancer</span>
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
