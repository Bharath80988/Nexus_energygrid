import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, LayoutDashboard, Layers, Gauge, Activity, BatteryCharging, 
  MapPin, RefreshCw, Settings, ShieldCheck 
} from 'lucide-react';

const NAV_TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'stations', label: 'Power Stations', icon: Layers },
  { id: 'balance', label: 'Grid Balance', icon: Gauge },
  { id: 'analytics', label: 'Telemetry & AI', icon: Activity },
  { id: 'storage', label: 'BESS Storage', icon: BatteryCharging },
];

const Navbar = ({ 
  activeTab, 
  setActiveTab, 
  locationName, 
  totalOutput, 
  isRefreshing, 
  onRefresh, 
  onOpenLocation, 
  onOpenSettings,
  gridStatus 
}) => {
  return (
    <header className="sticky top-3 z-40 px-2 sm:px-4 max-w-[1440px] mx-auto">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="rounded-2xl sm:rounded-full px-4 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
        style={{
          background: 'linear-gradient(135deg, rgba(20, 10, 10, 0.75), rgba(10, 10, 10, 0.85))',
        }}
      >
        {/* Left: Brand / Logo */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="relative p-2 rounded-xl bg-[#E63946]/15 border border-[#E63946]/30 text-[#E63946]">
              <Zap size={18} className="relative z-10" />
              <div className="absolute inset-0 rounded-xl bg-[#E63946]/20 blur-[6px]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-exo font-bold text-base md:text-lg tracking-wider text-white">
                  NEXUS<span className="text-[#E63946]">GRID</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  50.0 Hz
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={onOpenLocation}
              className="px-3 py-1.5 rounded-xl bg-[#E63946] text-white text-xs font-bold flex items-center gap-1.5 shadow-[0_0_12px_rgba(230,57,70,0.4)]"
            >
              <MapPin size={12} />
              <span className="truncate max-w-[80px]">{locationName}</span>
            </button>
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-xl border border-white/10 text-gray-400 hover:text-white bg-white/5"
            >
              <Settings size={14} />
            </button>
          </div>
        </div>

        {/* Center: Apple-style Segmented Navigation Pills */}
        <nav className="flex items-center gap-1 p-1 rounded-xl sm:rounded-full bg-black/50 border border-white/5 overflow-x-auto max-w-full scrollbar-none">
          {NAV_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-3.5 py-1.5 rounded-lg sm:rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap ${
                  isActive 
                    ? 'text-white' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.03]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabBadge"
                    className="absolute inset-0 rounded-lg sm:rounded-full bg-gradient-to-r from-[#E63946] to-[#c0392b] shadow-[0_0_16px_rgba(230,57,70,0.5)] z-0"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <Icon size={13} className="relative z-10" />
                <span className="relative z-10 tracking-wide">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Desktop Action Controls */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Net Output Quick Badge */}
          <div className="px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 flex items-center gap-2 text-xs">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Output</span>
            <span className="font-exo font-bold text-white">{totalOutput.toFixed(1)} kW</span>
          </div>

          {/* Location Selector */}
          <button
            onClick={onOpenLocation}
            className="group flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#E63946] to-[#b71c1c] text-white text-xs font-bold transition-all shadow-[0_0_15px_rgba(230,57,70,0.35)] hover:shadow-[0_0_25px_rgba(230,57,70,0.6)]"
          >
            <MapPin size={13} className="group-hover:animate-bounce" />
            <span className="truncate max-w-[130px]">{locationName}</span>
          </button>

          {/* Refresh button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-full border border-white/10 hover:border-[#E63946] bg-white/[0.03] hover:bg-white/[0.08] text-gray-400 hover:text-white transition-colors"
            title="Sync telemetry"
          >
            <RefreshCw size={14} className={isRefreshing ? "animate-spin text-[#E63946]" : ""} />
          </button>

          {/* Settings button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-full border border-white/10 hover:border-[#E63946] bg-white/[0.03] hover:bg-white/[0.08] text-gray-400 hover:text-white transition-colors group"
            title="Settings"
          >
            <Settings size={14} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>
      </motion.div>
    </header>
  );
};

export default React.memo(Navbar);
