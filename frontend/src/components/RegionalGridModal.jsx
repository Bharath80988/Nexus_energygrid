import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Sun, Wind, Atom, Droplets, MapPin, Activity, ShieldCheck, Cpu } from 'lucide-react';

const iconMap = {
  nuclear: Atom,
  solar: Sun,
  wind: Wind,
  ocean: Droplets,
  hydro: Droplets,
};

const typeColors = {
  nuclear: { badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30', glow: 'shadow-[0_0_15px_rgba(245,158,11,0.2)]' },
  solar: { badge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30', glow: 'shadow-[0_0_15px_rgba(234,179,8,0.2)]' },
  wind: { badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30', glow: 'shadow-[0_0_15px_rgba(6,182,212,0.2)]' },
  ocean: { badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30', glow: 'shadow-[0_0_15px_rgba(59,130,246,0.2)]' },
};

const RegionalGridModal = ({ isOpen, onClose, regionalData, cityName, currentMetrics }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedPlant, setSelectedPlant] = useState(null);

  if (!isOpen) return null;

  const plants = regionalData?.plants || [];
  const filteredPlants = activeFilter === 'all' ? plants : plants.filter(p => p.type === activeFilter);
  const regionTitle = regionalData?.regionName || `${cityName} Clean Power Grid`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 md:p-6 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          onClick={e => e.stopPropagation()}
          initial={{ y: 30, scale: 0.95, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: 30, scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-full max-w-5xl rounded-2xl overflow-hidden relative"
          style={{
            background: 'linear-gradient(145deg, rgba(18,5,5,0.98), rgba(8,8,8,0.99))',
            border: '1px solid rgba(230, 57, 70, 0.3)',
            boxShadow: '0 0 60px rgba(230, 57, 70, 0.2), 0 20px 50px rgba(0,0,0,0.9)'
          }}
        >
          {/* Header Accent Bar */}
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#E63946] to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors bg-black/60 p-2 rounded-xl border border-gray-800 hover:border-[#E63946] z-20"
          >
            <X size={18} />
          </button>

          <div className="p-6 md:p-8 space-y-6">
            {/* Title Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Cpu size={16} className="text-[#E63946]" />
                  <span className="text-[10px] text-[#E63946] font-bold tracking-[0.3em] uppercase">Regional Infrastructure Matrix</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-exo font-bold text-white">
                  Power Stations Feeding <span className="text-[#E63946]">{cityName}</span>
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Assigned Grid: <span className="text-white font-medium">{regionTitle}</span>
                </p>
              </div>

              {/* Type Filter Buttons */}
              <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-black/60 border border-gray-800/80">
                {[
                  { id: 'all', label: 'All Plants' },
                  { id: 'nuclear', label: 'Nuclear', icon: Atom },
                  { id: 'solar', label: 'Solar', icon: Sun },
                  { id: 'wind', label: 'Wind', icon: Wind },
                  { id: 'ocean', label: 'Ocean/Hydro', icon: Droplets }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all ${
                      activeFilter === tab.id
                        ? 'bg-[#E63946] text-white shadow-[0_0_15px_rgba(230,57,70,0.4)]'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Plants Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[58vh] overflow-y-auto pr-1">
              {filteredPlants.map((plant) => {
                const Icon = iconMap[plant.type] || Zap;
                const colors = typeColors[plant.type] || typeColors.solar;

                return (
                  <motion.div
                    key={plant.id}
                    whileHover={{ scale: 1.01, y: -2 }}
                    className="rounded-xl p-5 relative overflow-hidden transition-all duration-300 border border-gray-800/80 hover:border-[#E63946]/50 bg-gradient-to-br from-black/80 to-zinc-950/80 group"
                    style={{
                      boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                    }}
                  >
                    {/* Background faint icon */}
                    <Icon size={90} className="absolute -right-3 -bottom-3 text-white/5 group-hover:text-[#E63946]/10 transition-colors pointer-events-none" />

                    <div className="flex justify-between items-start gap-3 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-[#E63946]/10 border border-[#E63946]/30 text-[#E63946]">
                          <Icon size={18} />
                        </div>
                        <div>
                          <h3 className="text-white font-exo font-bold text-base group-hover:text-[#E63946] transition-colors">
                            {plant.name}
                          </h3>
                          <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                            <MapPin size={12} className="text-[#E63946]" />
                            <span>{plant.location}</span>
                          </div>
                        </div>
                      </div>

                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${colors.badge}`}>
                        {plant.type}
                      </span>
                    </div>

                    <p className="text-xs text-gray-300/90 leading-relaxed mb-4">
                      {plant.description}
                    </p>

                    {/* Technical Specs Box */}
                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-800/60 text-xs">
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest block">Rated Capacity</span>
                        <span className="text-sm font-exo font-bold text-white">{plant.capacityMw} MW</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest block">Live Output</span>
                        <span className="text-sm font-exo font-bold text-[#E63946]">{plant.currentOutputKw} kW</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest block">Share</span>
                        <span className="text-sm font-exo font-bold text-emerald-400">{plant.outputSharePercent}%</span>
                      </div>
                    </div>

                    {/* Operational Status Footer */}
                    <div className="mt-3 flex items-center justify-between text-[10px] text-gray-400 pt-2 border-t border-gray-900">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-gray-300 font-mono">{plant.status}</span>
                      </div>
                      <span className="text-gray-500 font-mono text-[9px] truncate max-w-[180px]">{plant.technology}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom info banner */}
            <div className="p-3.5 rounded-xl bg-[#E63946]/5 border border-[#E63946]/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
              <div className="flex items-center gap-2 text-gray-300">
                <ShieldCheck size={16} className="text-[#E63946]" />
                <span>Interconnected grid synchronized with national frequency standards (50.00 Hz).</span>
              </div>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">
                Active Facilities: {plants.length} Units
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default React.memo(RegionalGridModal);
