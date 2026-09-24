import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Zap, Wind, Sun, AlertTriangle, Activity, Droplets, Atom, 
  MapPin, Thermometer, Gauge, TrendingUp, Leaf, BatteryCharging, 
  Layers, CheckCircle2, AlertOctagon, TrendingDown, Building2,
  ChevronRight, ShieldCheck, Cpu, ArrowUpRight, ArrowDownRight, Compass
} from 'lucide-react';
import NetworkBackground from './components/NetworkBackground';
import Navbar from './components/Navbar';
import SettingsModal from './components/SettingsModal';
import EnergyInfoModal from './components/EnergyInfoModal';
import LocationModal from './components/LocationModal';
import RegionalGridModal from './components/RegionalGridModal';
import LiveMeter from './components/LiveMeter';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');

const tabVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.35, ease: 'easeOut' } })
};

function App() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'stations' | 'balance' | 'analytics' | 'storage'
  const [location, setLocation] = useState({ name: 'Chennai, Tamil Nadu', lat: 13.0827, lon: 80.2707 });
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
  const [stationFilter, setStationFilter] = useState('all');

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

  const safeNum = (v) => {
    const n = Number(v);
    return isNaN(n) ? 0 : n;
  };

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
      gradient: 'from-[#1c0808] to-[#0a0a0a]',
      accentColor: '#fbbf24',
      badgeClass: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
    },
    {
      key: 'wind', icon: Wind, title: 'Wind Kinetic', subtitle: 'Turbine Array',
      value: safeNum(energyData?.current?.windOutputKw), max: 150,
      weather: formatSpeed(energyData?.current?.windSpeed),
      weatherLabel: 'Wind Speed',
      extra: `Pressure: ${safeNum(energyData?.current?.pressure).toFixed(0)} hPa`,
      gradient: 'from-[#08151c] to-[#0a0a0a]',
      accentColor: '#22d3ee',
      badgeClass: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
    },
    {
      key: 'ocean', icon: Droplets, title: 'Ocean Tidal', subtitle: 'Wave Converter',
      value: safeNum(energyData?.current?.oceanOutputKw), max: 80,
      weather: `${safeNum(energyData?.current?.pressure).toFixed(0)} hPa`,
      weatherLabel: 'Pressure',
      extra: `Humidity: ${safeNum(energyData?.current?.humidity)}%`,
      gradient: 'from-[#080d1c] to-[#0a0a0a]',
      accentColor: '#60a5fa',
      badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/30'
    },
    {
      key: 'nuclear', icon: Atom, title: 'Nuclear Core', subtitle: 'Fission Baseload',
      value: safeNum(energyData?.current?.nuclearOutputKw), max: 250,
      weather: formatTemp(energyData?.current?.temperature),
      weatherLabel: 'Ambient Temp',
      extra: 'Baseload: 98.4%',
      gradient: 'from-[#1c0808] to-[#0a0a0a]',
      accentColor: '#f87171',
      badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/30'
    },
  ], [energyData?.current, units]);

  const totalOutput = useMemo(() => {
    return energyCards.reduce((s, c) => s + c.value, 0);
  }, [energyCards]);

  const regionalPlants = energyData?.regionalInfrastructure?.plants || [];
  const availableCities = energyData?.availableCities || [];
  const stateTitle = energyData?.stateName || 'State Grid';

  const powerNeeded = safeNum(energyData?.current?.powerNeededKw || 280);
  const powerProducing = safeNum(energyData?.current?.powerProducingKw || totalOutput);
  const gridBalance = safeNum(energyData?.current?.gridBalanceKw || (powerProducing - powerNeeded));
  const isSurplus = gridBalance >= 0;
  const coveragePercent = safeNum(energyData?.current?.coveragePercent || 100);

  const filteredPlants = stationFilter === 'all' 
    ? regionalPlants 
    : regionalPlants.filter(p => p.type === stationFilter);

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
            Initializing Nexus Grid Platform...
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
    <div className="min-h-screen relative overflow-x-hidden text-white bg-[#060606] selection:bg-[#E63946] selection:text-white pb-16">
      <NetworkBackground />
      
      {/* ── APPLE-STYLE FLOATING GLASSMORPHIC NAVBAR ── */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        locationName={location.name}
        totalOutput={totalOutput}
        isRefreshing={isRefreshing}
        onRefresh={() => fetchData(true)}
        onOpenLocation={() => setIsLocationModalOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        gridStatus={isSurplus ? 'SURPLUS' : 'DEFICIT'}
      />

      {/* ── MODALS ── */}
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

      {/* ── MAIN CONTENT CONTAINER ── */}
      <main className="p-3 sm:p-6 max-w-[1440px] mx-auto relative z-10 mt-2 space-y-6">

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-2xl flex items-center gap-3 bg-[#E63946]/15 border border-[#E63946]/40">
            <AlertTriangle size={18} className="text-[#E63946]" /> 
            <span className="text-sm text-gray-200">{error}</span>
          </motion.div>
        )}

        {/* ── TAB 1: EXECUTIVE OVERVIEW ── */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" variants={tabVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
              
              {/* Hero Banner: Net Demand vs Supply & Status Bar */}
              <div 
                className="rounded-3xl p-6 md:p-8 border border-white/10 backdrop-blur-xl relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(25, 10, 10, 0.8), rgba(10, 10, 10, 0.9))',
                  boxShadow: '0 8px 40px rgba(0, 0, 0, 0.6)'
                }}
              >
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-6 border-b border-white/10">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-[#E63946]/15 text-[#E63946] border border-[#E63946]/30">
                        {stateTitle} Smart Grid
                      </span>
                      <span className="text-xs text-gray-400 font-mono">
                        Node: {location.name}
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-4xl font-exo font-bold text-white tracking-tight">
                      Grid Telemetry & Generation Overview
                    </h2>
                  </div>

                  {/* Surplus / Deficit High-Impact Pill */}
                  <div className={`px-5 py-3 rounded-2xl border flex items-center gap-3.5 backdrop-blur-md ${
                    isSurplus 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.15)]'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-300 shadow-[0_0_25px_rgba(244,63,94,0.15)]'
                  }`}>
                    {isSurplus ? (
                      <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                        <CheckCircle2 size={24} className="animate-pulse" />
                      </div>
                    ) : (
                      <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
                        <AlertOctagon size={24} className="animate-pulse" />
                      </div>
                    )}
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest block text-gray-400">
                        Grid Balance Margin
                      </span>
                      <span className="text-lg md:text-xl font-exo font-bold">
                        {isSurplus ? `+${gridBalance.toFixed(1)} kW SURPLUS` : `${gridBalance.toFixed(1)} kW DEFICIT`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3 Executive Stat Tiles */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                  {/* Power Needed */}
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Power Needed (Demand)</span>
                      <TrendingDown size={14} className="text-amber-400" />
                    </div>
                    <div className="text-2xl md:text-3xl font-exo font-bold text-white">
                      {powerNeeded.toFixed(1)}
                      <span className="text-xs text-gray-400 font-normal ml-1">kW</span>
                    </div>
                    <div className="text-[10px] text-gray-500 mt-1">
                      Baseline requirement & commercial load
                    </div>
                  </div>

                  {/* Power Producing */}
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-[#E63946]/30">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] text-[#E63946] uppercase tracking-widest font-bold">Power Producing (Supply)</span>
                      <Zap size={14} className="text-[#E63946]" />
                    </div>
                    <div className="text-2xl md:text-3xl font-exo font-bold text-[#E63946]">
                      {powerProducing.toFixed(1)}
                      <span className="text-xs text-gray-300 font-normal ml-1">kW</span>
                    </div>
                    <div className="text-[10px] text-gray-500 mt-1">
                      Live multi-source energy generation
                    </div>
                  </div>

                  {/* Demand Coverage */}
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Demand Coverage</span>
                      <Activity size={14} className="text-emerald-400" />
                    </div>
                    <div className="text-2xl md:text-3xl font-exo font-bold text-white">
                      {coveragePercent}%
                      <span className="text-xs text-emerald-400 font-normal ml-1">covered</span>
                    </div>
                    <div className="text-[10px] text-gray-500 mt-1">
                      {coveragePercent >= 100 ? '100% Demand satisfied with net export' : 'Substation buffering with battery banks'}
                    </div>
                  </div>
                </div>

                {/* Balance Progress Strip */}
                <div className="mt-5">
                  <div className="w-full h-2.5 bg-black/80 rounded-full overflow-hidden border border-white/10">
                    <div 
                      className={`h-full rounded-full transition-all duration-700 ${
                        isSurplus 
                          ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-[#E63946]'
                          : 'bg-gradient-to-r from-rose-600 to-amber-500'
                      }`}
                      style={{ width: `${Math.min(100, (powerProducing / (powerNeeded || 1)) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* In-State City Switcher */}
                {availableCities.length > 1 && (
                  <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2">
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold flex items-center gap-1.5 mr-1">
                      <Building2 size={13} className="text-[#E63946]" /> Switch District in {stateTitle}:
                    </span>
                    {availableCities.map((c) => {
                      const isCurrent = location.name.toLowerCase().includes(c.name.toLowerCase());
                      return (
                        <button
                          key={c.name}
                          onClick={() => setLocation({ name: `${c.name}, ${stateTitle}`, lat: c.lat, lon: c.lon })}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                            isCurrent
                              ? 'bg-[#E63946] text-white border-[#E63946] shadow-[0_0_12px_rgba(230,57,70,0.4)]'
                              : 'bg-black/50 text-gray-400 border-white/10 hover:border-[#E63946]/50 hover:text-white'
                          }`}
                        >
                          {c.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 4 Multi-Source Generation Cards Grid */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <Zap size={16} className="text-[#E63946]" />
                    <h3 className="text-sm font-exo font-bold text-white uppercase tracking-wider">
                      Energy Generation Assets
                    </h3>
                  </div>
                  <span className="text-xs text-gray-400">Click any asset for mechanism breakdown</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                        className={`relative overflow-hidden rounded-3xl p-5 cursor-pointer transition-all duration-300 bg-gradient-to-b ${card.gradient} border border-white/10 hover:border-[#E63946]/60 group`}
                        style={{ boxShadow: '0 4px 25px rgba(0,0,0,0.5)' }}
                      >
                        <Icon size={80} className="absolute -top-2 -right-2 text-white/[0.03] group-hover:text-[#E63946]/[0.08] transition-all duration-500 group-hover:rotate-12 pointer-events-none" />

                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-white">
                              <Icon size={16} style={{ color: card.accentColor }} />
                            </div>
                            <div>
                              <h4 className="text-white font-bold text-xs tracking-wider uppercase leading-none">{card.title}</h4>
                              <span className="text-[9px] text-gray-500 uppercase tracking-widest">{card.subtitle}</span>
                            </div>
                          </div>
                          <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${card.badgeClass}`}>
                            {((card.value / (totalOutput || 1)) * 100).toFixed(0)}%
                          </span>
                        </div>

                        <div className="mt-3 mb-1">
                          <span className="text-3xl font-exo font-bold text-white">
                            {card.value.toFixed(2)}
                          </span>
                          <span className="text-xs text-gray-400 ml-1">kW</span>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                          <div className="flex items-center gap-1">
                            <Thermometer size={10} className="text-[#E63946]" />
                            <span>{card.weatherLabel}:</span>
                            <strong className="text-white">{card.weather}</strong>
                          </div>
                          <span className="text-gray-500">{card.extra}</span>
                        </div>

                        <LiveMeter value={card.value} max={card.max} showStats={true} />

                        <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs">
                          <span className="text-[10px] text-[#E63946] font-bold uppercase tracking-wider group-hover:tracking-widest transition-all">
                            Technical Specs →
                          </span>
                          <ArrowUpRight size={14} className="text-gray-500 group-hover:text-[#E63946] transition-colors" />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Nav Row to Deep Dive Views */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Power Stations Card */}
                <div 
                  onClick={() => setActiveTab('stations')}
                  className="p-5 rounded-3xl border border-white/10 hover:border-[#E63946]/50 bg-black/60 hover:bg-white/[0.02] cursor-pointer transition-all group flex justify-between items-center"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-[#E63946]/15 border border-[#E63946]/30 text-[#E63946]">
                      <Layers size={20} />
                    </div>
                    <div>
                      <h4 className="font-exo font-bold text-sm text-white group-hover:text-[#E63946] transition-colors">
                        Supply Power Stations
                      </h4>
                      <p className="text-[10px] text-gray-400">{regionalPlants.length} Regional Stations Identified</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-500 group-hover:translate-x-1 transition-transform" />
                </div>

                {/* Telemetry & AI Forecast Card */}
                <div 
                  onClick={() => setActiveTab('analytics')}
                  className="p-5 rounded-3xl border border-white/10 hover:border-[#E63946]/50 bg-black/60 hover:bg-white/[0.02] cursor-pointer transition-all group flex justify-between items-center"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                      <Activity size={20} />
                    </div>
                    <div>
                      <h4 className="font-exo font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">
                        12H AI Forecast & Curve
                      </h4>
                      <p className="text-[10px] text-gray-400">{safeNum(forecastData?.predictedEnergy).toFixed(1)} kW Trend Projection</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-500 group-hover:translate-x-1 transition-transform" />
                </div>

                {/* Battery Storage Card */}
                <div 
                  onClick={() => setActiveTab('storage')}
                  className="p-5 rounded-3xl border border-white/10 hover:border-[#E63946]/50 bg-black/60 hover:bg-white/[0.02] cursor-pointer transition-all group flex justify-between items-center"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
                      <BatteryCharging size={20} />
                    </div>
                    <div>
                      <h4 className="font-exo font-bold text-sm text-white group-hover:text-cyan-400 transition-colors">
                        BESS Storage System
                      </h4>
                      <p className="text-[10px] text-gray-400">{energyData?.current?.battery?.socPercent || '78'}% SoC • 500 kWh</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

            </motion.div>
          )}

          {/* ── TAB 2: POWER STATIONS INFRASTRUCTURE ── */}
          {activeTab === 'stations' && (
            <motion.div key="stations" variants={tabVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
              
              <div className="rounded-3xl p-6 md:p-8 border border-white/10 bg-gradient-to-br from-black/80 to-zinc-950/90 backdrop-blur-xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/10">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Layers size={16} className="text-[#E63946]" />
                      <span className="text-[10px] text-[#E63946] font-bold tracking-[0.25em] uppercase">
                        Regional Generation Assets
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-exo font-bold text-white">
                      Power Stations Supplying <span className="text-[#E63946]">{location.name}</span>
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">
                      Grid Sector: {energyData?.regionalInfrastructure?.regionName || stateTitle}
                    </p>
                  </div>

                  {/* Filter tabs */}
                  <div className="flex flex-wrap gap-1.5 p-1 rounded-2xl bg-white/[0.03] border border-white/10">
                    {[
                      { id: 'all', label: 'All Stations' },
                      { id: 'nuclear', label: 'Nuclear' },
                      { id: 'solar', label: 'Solar' },
                      { id: 'wind', label: 'Wind' },
                      { id: 'ocean', label: 'Ocean/Hydro' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setStationFilter(tab.id)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          stationFilter === tab.id
                            ? 'bg-[#E63946] text-white shadow-[0_0_15px_rgba(230,57,70,0.4)]'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stations List Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                  {filteredPlants.map((plant) => {
                    const Icon = plant.type === 'nuclear' ? Atom : plant.type === 'solar' ? Sun : plant.type === 'wind' ? Wind : Droplets;
                    return (
                      <div
                        key={plant.id}
                        className="rounded-2xl p-5 border border-white/10 bg-white/[0.02] hover:border-[#E63946]/50 transition-all group relative overflow-hidden"
                      >
                        <Icon size={90} className="absolute -right-3 -bottom-3 text-white/[0.02] group-hover:text-[#E63946]/[0.06] transition-colors pointer-events-none" />

                        <div className="flex justify-between items-start gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-[#E63946]/10 border border-[#E63946]/25 text-[#E63946]">
                              <Icon size={20} />
                            </div>
                            <div>
                              <h4 className="text-white font-exo font-bold text-base group-hover:text-[#E63946] transition-colors">
                                {plant.name}
                              </h4>
                              <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                                <MapPin size={12} className="text-[#E63946]" />
                                <span>{plant.location}</span>
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-300">
                            {plant.type}
                          </span>
                        </div>

                        <p className="text-xs text-gray-300/90 leading-relaxed mb-4">
                          {plant.description}
                        </p>

                        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10 text-xs">
                          <div>
                            <span className="text-[9px] text-gray-500 uppercase tracking-widest block">Rated Capacity</span>
                            <span className="text-sm font-exo font-bold text-white">{plant.capacityMw} MW</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-500 uppercase tracking-widest block">Live Output</span>
                            <span className="text-sm font-exo font-bold text-[#E63946]">{plant.currentOutputKw} kW</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-500 uppercase tracking-widest block">Grid Share</span>
                            <span className="text-sm font-exo font-bold text-emerald-400">{plant.outputSharePercent}%</span>
                          </div>
                        </div>

                        <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-400">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-gray-300 font-mono">{plant.status}</span>
                          </div>
                          <span className="font-mono text-gray-500 truncate max-w-[180px]">{plant.technology}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </motion.div>
          )}

          {/* ── TAB 3: DEMAND & GRID BALANCE ── */}
          {activeTab === 'balance' && (
            <motion.div key="balance" variants={tabVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
              
              <div className="rounded-3xl p-6 md:p-8 border border-white/10 bg-gradient-to-br from-black/80 to-zinc-950/90 backdrop-blur-xl space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/10">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Gauge size={16} className="text-[#E63946]" />
                      <span className="text-[10px] text-[#E63946] font-bold tracking-[0.25em] uppercase">
                        Load Balancing & Dispatch Telemetry
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-exo font-bold text-white">
                      Demand vs Generation in <span className="text-[#E63946]">{location.name}</span>
                    </h2>
                  </div>

                  <div className={`px-4 py-2 rounded-2xl border text-xs font-bold font-mono ${
                    isSurplus ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  }`}>
                    {isSurplus ? 'STATUS: STABLE TRANSMISSION EXPORT' : 'STATUS: SUBSTATION LOAD BUFFERING'}
                  </div>
                </div>

                {/* Detailed 4 Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-bold">Required Demand</span>
                    <span className="text-3xl font-exo font-bold text-white mt-1 block">{powerNeeded.toFixed(1)} kW</span>
                    <span className="text-[10px] text-gray-500 mt-1 block">Diurnal consumption target</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-[#E63946]/30">
                    <span className="text-[10px] text-[#E63946] uppercase tracking-widest block font-bold">Active Generation</span>
                    <span className="text-3xl font-exo font-bold text-[#E63946] mt-1 block">{powerProducing.toFixed(1)} kW</span>
                    <span className="text-[10px] text-gray-500 mt-1 block">Live aggregated supply</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-bold">Net Balance Margin</span>
                    <span className={`text-3xl font-exo font-bold mt-1 block ${isSurplus ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isSurplus ? `+${gridBalance.toFixed(1)}` : gridBalance.toFixed(1)} kW
                    </span>
                    <span className="text-[10px] text-gray-500 mt-1 block">{isSurplus ? 'Direct BESS storage flow' : 'Battery draw active'}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-bold">Load Coverage Ratio</span>
                    <span className="text-3xl font-exo font-bold text-white mt-1 block">{coveragePercent}%</span>
                    <span className="text-[10px] text-emerald-400 mt-1 block">Grid frequency synchronized</span>
                  </div>
                </div>

                {/* State Wide Cities Grid Switcher */}
                <div className="pt-4 border-t border-white/10">
                  <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3">
                    All District Nodes in {stateTitle} Grid:
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                    {availableCities.map((c) => {
                      const isCurrent = location.name.toLowerCase().includes(c.name.toLowerCase());
                      return (
                        <button
                          key={c.name}
                          onClick={() => setLocation({ name: `${c.name}, ${stateTitle}`, lat: c.lat, lon: c.lon })}
                          className={`p-3 rounded-2xl text-left border transition-all ${
                            isCurrent
                              ? 'bg-[#E63946] text-white border-[#E63946] shadow-[0_0_15px_rgba(230,57,70,0.4)]'
                              : 'bg-white/[0.02] border-white/5 hover:border-[#E63946]/50 text-gray-300 hover:text-white'
                          }`}
                        >
                          <div className="font-exo font-bold text-xs">{c.name}</div>
                          <div className="text-[9px] text-gray-400 mt-0.5">{c.tag || 'District Node'}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {/* ── TAB 4: TELEMETRY & AI FORECAST ── */}
          {activeTab === 'analytics' && (
            <motion.div key="analytics" variants={tabVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
              
              <div className="rounded-3xl p-6 md:p-8 border border-white/10 bg-gradient-to-br from-black/80 to-zinc-950/90 backdrop-blur-xl space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Activity size={16} className="text-[#E63946]" />
                      <span className="text-[10px] text-[#E63946] font-bold tracking-[0.25em] uppercase">
                        Real-Time Generation Analytics
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-exo font-bold text-white">
                      12-Hour Telemetry Curve & AI Forecast
                    </h2>
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex gap-1 rounded-2xl p-1 bg-white/[0.03] border border-white/10">
                    {[
                      { key: 'combined', label: 'NET OUTPUT' },
                      { key: 'solar', label: 'SOLAR' },
                      { key: 'wind', label: 'WIND' },
                      { key: 'ocean', label: 'OCEAN' },
                      { key: 'nuclear', label: 'NUCLEAR' },
                    ].map(btn => (
                      <button
                        key={btn.key}
                        onClick={() => setViewMode(btn.key)}
                        className={`px-3 py-1.5 text-[10px] rounded-xl transition-all font-bold tracking-wider uppercase ${
                          viewMode === btn.key
                            ? 'bg-[#E63946] text-white shadow-[0_0_12px_rgba(230,57,70,0.4)]'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Main Graph */}
                <div className="w-full h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="curveGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#E63946" stopOpacity={0.5} />
                          <stop offset="95%" stopColor="#E63946" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="time" stroke="#555" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#555" fontSize={10} tickLine={false} axisLine={false} width={40} />
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: 'rgba(12,12,12,0.95)', 
                          border: '1px solid #E63946', 
                          borderRadius: '12px', 
                          boxShadow: '0 0 25px rgba(230,57,70,0.3)',
                          padding: '10px 14px'
                        }}
                        itemStyle={{ color: '#E63946', fontWeight: 'bold', fontSize: 13 }}
                        labelStyle={{ color: '#888', fontSize: 11, marginBottom: 2 }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#E63946" 
                        strokeWidth={3} 
                        fillOpacity={1} 
                        fill="url(#curveGlow)" 
                        isAnimationActive={!hasAnimatedChart}
                        onAnimationEnd={() => setHasAnimatedChart(true)}
                        dot={false} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* 3 AI Analytics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp size={16} className="text-[#E63946]" />
                      <h4 className="text-xs uppercase font-bold text-gray-300 tracking-wider">12H Predictive Peak</h4>
                    </div>
                    <div className="text-3xl font-exo font-bold text-white">
                      {safeNum(forecastData?.predictedEnergy).toFixed(1)} <span className="text-xs text-gray-400">kW</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 mt-1 block">Trend: {forecastData?.trend || 'STABLE'}</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Leaf size={16} className="text-emerald-400" />
                      <h4 className="text-xs uppercase font-bold text-gray-300 tracking-wider">Avoided Emissions</h4>
                    </div>
                    <div className="text-3xl font-exo font-bold text-white">
                      {energyData?.current?.carbonSavingsKg || '0'} <span className="text-xs text-emerald-400">kg CO₂e</span>
                    </div>
                    <span className="text-[10px] text-gray-500 mt-1 block">
                      Offsetting {(safeNum(energyData?.current?.carbonSavingsKg) * 0.04).toFixed(1)} trees/day
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Cpu size={16} className="text-[#E63946]" />
                      <h4 className="text-xs uppercase font-bold text-gray-300 tracking-wider">AI Grid Diagnosis</h4>
                    </div>
                    <p className="text-xs text-gray-300 italic leading-relaxed">
                      "{energyData?.insight || 'Grid telemetry synchronized.'}"
                    </p>
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {/* ── TAB 5: BESS STORAGE ── */}
          {activeTab === 'storage' && (
            <motion.div key="storage" variants={tabVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
              
              <div className="rounded-3xl p-6 md:p-8 border border-white/10 bg-gradient-to-br from-black/80 to-zinc-950/90 backdrop-blur-xl space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/10">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <BatteryCharging size={16} className="text-cyan-400" />
                      <span className="text-[10px] text-cyan-400 font-bold tracking-[0.25em] uppercase">
                        Battery Energy Storage System (BESS)
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-exo font-bold text-white">
                      Utility-Scale LFP Storage Unit
                    </h2>
                  </div>

                  <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    STATUS: {energyData?.current?.battery?.status || 'CHARGING'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-bold">State of Charge (SoC)</span>
                    <span className="text-4xl font-exo font-bold text-white mt-2 block">{energyData?.current?.battery?.socPercent || '78.5'}%</span>
                    <span className="text-[10px] text-cyan-400 mt-1 block">Optimal reserve threshold</span>
                  </div>
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-bold">Charge / Discharge Flow</span>
                    <span className="text-4xl font-exo font-bold text-emerald-400 mt-2 block">{energyData?.current?.battery?.flowKw || '+14.2'} kW</span>
                    <span className="text-[10px] text-gray-500 mt-1 block">Active substation buffer</span>
                  </div>
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-bold">Total Storage Capacity</span>
                    <span className="text-4xl font-exo font-bold text-white mt-2 block">500 kWh</span>
                    <span className="text-[10px] text-gray-500 mt-1 block">Utility Lithium-Iron Array</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-2">
                    <span>Battery Level</span>
                    <span>{energyData?.current?.battery?.socPercent || 78}% Charged</span>
                  </div>
                  <div className="w-full h-4 bg-black/80 rounded-full overflow-hidden border border-white/10">
                    <div 
                      className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full transition-all duration-700"
                      style={{ width: `${energyData?.current?.battery?.socPercent || 78}%` }}
                    />
                  </div>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}

export default App;
