import React from 'react';
import { Plane, Percent, Award, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { StatSummary } from '../types';

interface KPIScorecardsProps {
  stats: StatSummary;
}

export const KPIScorecards: React.FC<KPIScorecardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
      {/* KPI 1: Total de Movimentações */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
        <div>
          <div className="flex justify-between items-center mb-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total de Movimentações
            </p>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
              <Plane className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2.5 mt-2">
            <span className="text-3xl font-black text-sky-950 tracking-tight">
              {stats.totalMovimentacoes.toLocaleString('pt-BR')}
            </span>
            <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <ArrowUpRight className="w-3 h-3 mr-0.5" />
              Operacional
            </span>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-[11px] text-slate-500 font-medium mb-1">
            <span>Pousos Registrados</span>
            <span>{stats.totalMovimentacoes} aeronaves</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-sky-700 h-full rounded-full transition-all duration-500"
              style={{ width: stats.totalMovimentacoes > 0 ? '100%' : '0%' }}
            ></div>
          </div>
        </div>
      </div>

      {/* KPI 2: Taxa de Desembarque Híbrido (Campo Calculado) */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
        <div>
          <div className="flex justify-between items-center mb-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Taxa de Desembarque Híbrido
            </p>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2.5 mt-2">
            <span className="text-3xl font-black text-sky-950 tracking-tight">
              {stats.taxaHibrido.toFixed(1)}%
            </span>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {stats.totalHibrido} de {stats.totalMovimentacoes}
            </span>
          </div>
        </div>
        <div className="mt-3">
          <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            Meta do Pátio CGB: manter índice otimizado de pontes x remoto
          </p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1.5">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(stats.taxaHibrido, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* KPI 3: Companhia com Maior Volume */}
      <div className="bg-sky-50/40 p-5 rounded-xl border border-sky-300 shadow-xs flex flex-col justify-between hover:border-sky-400 transition-all">
        <div>
          <div className="flex justify-between items-center mb-1">
            <p className="text-xs font-bold text-sky-800 uppercase tracking-wider">
              Companhia Líder (Market Share)
            </p>
            <div className="w-8 h-8 rounded-lg bg-sky-700 text-white flex items-center justify-center shadow-xs">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl sm:text-3xl font-black text-sky-950 tracking-tight truncate">
              {stats.topCompanhia.nome}
            </span>
          </div>
          <p className="text-xs font-bold text-sky-800 mt-1">
            {stats.topCompanhia.total} operações ({stats.topCompanhia.percentual.toFixed(1)}% do total)
          </p>
        </div>
        <div className="mt-3 pt-2 border-t border-sky-200/60">
          <p className="text-[11px] text-slate-600 italic">
            Líder em ocupações e pousos no Aeroporto de Cuiabá no período
          </p>
        </div>
      </div>
    </div>
  );
};
