import React from 'react';

interface AirlineLogoProps {
  icao?: string;
  nome_companhia?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AirlineLogo: React.FC<AirlineLogoProps> = ({
  icao = '',
  nome_companhia = '',
  className = '',
  size = 'md',
}) => {
  const code = (icao || nome_companhia).toUpperCase();

  // Size mapping
  const sizeClasses = {
    sm: 'h-6 text-[10px]',
    md: 'h-9 text-xs',
    lg: 'h-12 text-sm',
  };

  // Azul Conecta (Check before main Azul)
  if (code.includes('CONECTA') || code.includes('ACN')) {
    return (
      <div className={`flex items-center justify-center font-black rounded-lg px-2.5 py-1 bg-[#0284c7] text-white tracking-tight shadow-xs border border-sky-800 ${sizeClasses[size]} ${className}`}>
        <span className="text-amber-300 mr-0.5">✦</span>
        <span>Azul</span>
        <span className="text-sky-200 font-extrabold ml-1 text-[85%]">CONECTA</span>
      </div>
    );
  }

  // Azul Linhas Aéreas
  if (code.includes('AZU') || code.includes('AZUL')) {
    return (
      <div className={`flex items-center justify-center font-black rounded-lg px-2.5 py-1 bg-[#00529b] text-white tracking-wider shadow-xs border border-blue-900 ${sizeClasses[size]} ${className}`}>
        <span className="text-amber-400 mr-0.5">✦</span>
        <span>Azul</span>
      </div>
    );
  }

  // Mercado Livre / Meli Air
  if (code.includes('MELI') || code.includes('MERCADO') || code.includes('LIVRE')) {
    return (
      <div className={`flex items-center justify-center font-black rounded-lg px-2.5 py-1 bg-[#ffe600] text-[#2d3277] tracking-tight shadow-xs border border-yellow-500 ${sizeClasses[size]} ${className}`}>
        <span className="mr-1 text-sm">📦</span>
        <span>Meli Air</span>
      </div>
    );
  }

  // LATAM
  if (code.includes('TAM') || code.includes('LATAM')) {
    return (
      <div className={`flex items-center justify-center font-black rounded-lg px-2.5 py-1 bg-[#1b004c] text-[#ff0055] tracking-widest shadow-xs border border-purple-900 ${sizeClasses[size]} ${className}`}>
        <span className="text-white">LA</span>
        <span className="text-[#ff0055]">TAM</span>
      </div>
    );
  }

  // GOL
  if (code.includes('GLO') || code.includes('GOL')) {
    return (
      <div className={`flex items-center justify-center font-black rounded-lg px-2.5 py-1 bg-[#ff6600] text-white tracking-tighter italic shadow-xs border border-orange-700 ${sizeClasses[size]} ${className}`}>
        <span>GOL</span>
        <span className="text-amber-200 ml-0.5">✈</span>
      </div>
    );
  }

  // VOEPASS
  if (code.includes('PTB') || code.includes('VOEPASS') || code.includes('PASSAREDO')) {
    return (
      <div className={`flex items-center justify-center font-bold rounded-lg px-2.5 py-1 bg-[#00a3e0] text-white tracking-tight shadow-xs border border-cyan-700 ${sizeClasses[size]} ${className}`}>
        <span>VOE</span>
        <span className="text-cyan-200 font-extrabold">PASS</span>
      </div>
    );
  }

  // TOTAL
  if (code.includes('TTL') || code.includes('TOTAL')) {
    return (
      <div className={`flex items-center justify-center font-black rounded-lg px-2.5 py-1 bg-[#1e3a8a] text-amber-400 tracking-wider shadow-xs border border-blue-900 ${sizeClasses[size]} ${className}`}>
        <span>TOTAL</span>
      </div>
    );
  }

  // MODERN LOGISTICS
  if (code.includes('MWM') || code.includes('MODERN')) {
    return (
      <div className={`flex items-center justify-center font-extrabold rounded-lg px-2.5 py-1 bg-[#334155] text-slate-100 tracking-wide shadow-xs border border-slate-700 ${sizeClasses[size]} ${className}`}>
        <span className="text-sky-400 mr-1">■</span>
        <span>MODERN</span>
      </div>
    );
  }

  // SIDERAL
  if (code.includes('SID') || code.includes('SIDERAL')) {
    return (
      <div className={`flex items-center justify-center font-black rounded-lg px-2.5 py-1 bg-[#0284c7] text-white tracking-widest shadow-xs border border-sky-800 ${sizeClasses[size]} ${className}`}>
        <span>SIDERAL</span>
      </div>
    );
  }

  // FORÇAS ARMADAS BRASILEIRAS (FAB)
  if (code.includes('FAB') || code.includes('ARMADAS') || code.includes('FORÇAS')) {
    return (
      <div className={`flex items-center justify-center font-black rounded-lg px-2.5 py-1 bg-[#003366] text-[#fcd34d] tracking-tight shadow-xs border border-sky-950 ${sizeClasses[size]} ${className}`}>
        <span className="mr-1 text-sm">🎖️</span>
        <span>FAB</span>
      </div>
    );
  }

  // Outros / Av. Geral
  if (code.includes('OUT') || code.includes('GERAL') || code.includes('OUTROS')) {
    return (
      <div className={`flex items-center justify-center font-bold rounded-lg px-2.5 py-1 bg-slate-600 text-slate-100 tracking-wider shadow-xs border border-slate-700 ${sizeClasses[size]} ${className}`}>
        <span className="mr-1">🛩️</span>
        <span>OUTROS</span>
      </div>
    );
  }

  // Default fallback
  return (
    <div className={`flex items-center justify-center font-bold rounded-lg px-2.5 py-1 bg-slate-700 text-slate-100 tracking-wider shadow-xs border border-slate-800 ${sizeClasses[size]} ${className}`}>
      <span>{icao || nome_companhia.substring(0, 6).toUpperCase()}</span>
    </div>
  );
};
