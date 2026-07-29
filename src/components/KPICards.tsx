import React from 'react';
import { Plane, TrendingUp, AlertTriangle, Award, Activity, Percent } from 'lucide-react';
import { FlightRecord } from '../types';

interface KPICardsProps {
  records: FlightRecord[];
  totalAllRecordsCount: number;
}

export const KPICards: React.FC<KPICardsProps> = ({ records, totalAllRecordsCount }) => {
  const totalFiltered = records.length;

  // Hybrid disembarkation count & rate calculation:
  // COUNT_DISTINCT(CASE WHEN desembarque_hibrido = 'Sim' THEN id_registro ELSE NULL END) / COUNT_DISTINCT(id_registro)
  const hybridCount = records.filter((r) => r.desembarque_hibrido === 'Sim').length;
  const hybridRate = totalFiltered > 0 ? (hybridCount / totalFiltered) * 100 : 0;

  // Top Airline volume calculation
  const airlineCounts: Record<string, number> = {};
  records.forEach((r) => {
    airlineCounts[r.nome_companhia] = (airlineCounts[r.nome_companhia] || 0) + 1;
  });

  let topAirlineName = 'Nenhuma';
  let topAirlineCount = 0;
  Object.entries(airlineCounts).forEach(([name, count]) => {
    if (count > topAirlineCount) {
      topAirlineCount = count;
      topAirlineName = name;
    }
  });

  const topAirlineShare = totalFiltered > 0 ? ((topAirlineCount / totalFiltered) * 100).toFixed(1) : '0.0';

  // Standard landings count
  const standardCount = totalFiltered - hybridCount;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
      {/* KPI 1: Total de Movimentações */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total de Movimentações
            </p>
            <span className="p-1.5 bg-sky-50 text-sky-800 rounded-md">
              <Activity className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2.5 mt-1">
            <span className="text-3xl sm:text-4xl font-black text-sky-950 tracking-tight">
              {totalFiltered.toLocaleString('pt-BR')}
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {totalFiltered === totalAllRecordsCount ? '100% da base' : `${((totalFiltered / totalAllRecordsCount) * 100).toFixed(0)}% visível`}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Padrão: <strong className="text-slate-800 font-bold">{standardCount}</strong></span>
          <span className="text-slate-300">•</span>
          <span>Híbrido: <strong className="text-amber-600 font-bold">{hybridCount}</strong></span>
        </div>
      </div>

      {/* KPI 2: Taxa de Desembarque Híbrido */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Taxa de Desembarque Híbrido
            </p>
            <span className="p-1.5 bg-amber-50 text-amber-600 rounded-md">
              <Percent className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl sm:text-4xl font-black text-sky-950 tracking-tight">
              {hybridRate.toFixed(1)}%
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
              hybridRate > 25
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}>
              Calculado
            </span>
          </div>
        </div>

        <div className="mt-3">
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                hybridRate > 25 ? 'bg-amber-500' : 'bg-sky-600'
              }`}
              style={{ width: `${Math.min(hybridRate, 100)}%` }}
            />
          </div>
          <p className="text-[10px] font-medium text-slate-500 mt-2 flex items-center justify-between">
            <span>Fórmula: Desembarque Híbrido / Total Registros</span>
            <span className="font-semibold text-slate-600">Meta Pátio: &lt; 15%</span>
          </p>
        </div>
      </div>

      {/* KPI 3: Companhia com Maior Volume de Operações */}
      <div className="bg-sky-50/50 p-5 rounded-xl border border-sky-200 shadow-xs flex flex-col justify-between relative overflow-hidden">
        <div className="absolute -right-4 -bottom-4 opacity-10 text-sky-900 pointer-events-none">
          <Award className="w-28 h-28" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-bold text-sky-800 uppercase tracking-wider">
              Top Market Share Operacional
            </p>
            <span className="p-1.5 bg-sky-100 text-sky-800 rounded-md">
              <Award className="w-4 h-4" />
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-sky-950 tracking-tight">
              {topAirlineName}
            </span>
            <span className="text-sm font-extrabold text-sky-800 bg-sky-100/80 px-2.5 py-0.5 rounded-md border border-sky-200">
              {topAirlineShare}% do volume
            </span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-sky-200/60 flex items-center justify-between text-[11px]">
          <span className="text-sky-800 font-medium">
            Líder com <strong className="font-black text-sky-950">{topAirlineCount} pousos</strong> no período
          </span>
          <span className="text-[10px] text-sky-600 uppercase tracking-wider font-bold">Aeroporto CGB</span>
        </div>
      </div>
    </div>
  );
};
