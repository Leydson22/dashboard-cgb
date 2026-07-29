import React from 'react';
import { Filter, Search, Calendar, X, Check } from 'lucide-react';
import { FiltrosDashboard, CompanhiaAerea } from '../types';

interface QuickFiltersProps {
  filtros: FiltrosDashboard;
  setFiltros: React.Dispatch<React.SetStateAction<FiltrosDashboard>>;
  companhias: CompanhiaAerea[];
  totalFiltrados: number;
  totalGeral: number;
}

export const QuickFilters: React.FC<QuickFiltersProps> = ({
  filtros,
  setFiltros,
  companhias,
  totalFiltrados,
  totalGeral,
}) => {
  const isFiltered =
    filtros.nome_companhia !== 'TODAS' ||
    filtros.desembarque_hibrido !== 'TODOS' ||
    filtros.buscaMatricula.trim() !== '' ||
    filtros.dataInicio !== '' ||
    filtros.dataFim !== '';

  const handleClearFilters = () => {
    setFiltros({
      nome_companhia: 'TODAS',
      desembarque_hibrido: 'TODOS',
      dataInicio: '',
      dataFim: '',
      buscaMatricula: '',
    });
  };

  return (
    <nav className="bg-white border-b border-slate-200 px-3 sm:px-6 py-3 flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between text-xs overflow-hidden w-full max-w-full">
      <div className="flex flex-col xs:flex-row flex-wrap items-stretch xs:items-center gap-3 w-full sm:w-auto">
        <div className="hidden sm:flex items-center gap-1.5 text-slate-500 font-bold uppercase text-[10px] tracking-wider pr-1 border-r border-slate-200">
          <Filter className="w-3.5 h-3.5 text-sky-700" />
          <span>Filtros:</span>
        </div>

        {/* Companhia Filter */}
        <div className="relative flex-1 xs:flex-none min-w-0">
          <select
            value={filtros.nome_companhia}
            onChange={(e) => setFiltros({ ...filtros, nome_companhia: e.target.value })}
            className={`w-full px-3 py-2 rounded-lg border text-[11px] font-bold focus:outline-hidden focus:ring-2 focus:ring-sky-500 cursor-pointer transition-colors truncate ${
              filtros.nome_companhia !== 'TODAS'
                ? 'bg-sky-100 border-sky-300 text-sky-900'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <option value="TODAS">Empresa: Todas</option>
            {companhias.map((c) => (
              <option key={c.id_companhia} value={c.nome_companhia}>
                {c.nome_companhia}
              </option>
            ))}
          </select>
        </div>

        {/* Desembarque Híbrido Filter Buttons */}
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 w-full xs:w-auto overflow-x-auto scrollbar-none">
          <button
            onClick={() => setFiltros({ ...filtros, desembarque_hibrido: 'TODOS' })}
            className={`flex-1 xs:flex-none px-2 py-1.5 rounded-md text-[10px] font-black transition-all ${
              filtros.desembarque_hibrido === 'TODOS'
                ? 'bg-white text-slate-800 shadow-xs'
                : 'text-slate-500'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFiltros({ ...filtros, desembarque_hibrido: 'Sim' })}
            className={`flex-1 xs:flex-none px-2 py-1.5 rounded-md text-[10px] font-black transition-all ${
              filtros.desembarque_hibrido === 'Sim'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600'
            }`}
          >
            Híbrido
          </button>
          <button
            onClick={() => setFiltros({ ...filtros, desembarque_hibrido: 'Não' })}
            className={`flex-1 xs:flex-none px-2 py-1.5 rounded-md text-[10px] font-black transition-all ${
              filtros.desembarque_hibrido === 'Não'
                ? 'bg-sky-700 text-white shadow-xs'
                : 'text-slate-600'
            }`}
          >
            Padrão
          </button>
        </div>

        {/* Busca por Matrícula ou Equipamento */}
        <div className="relative flex items-center flex-1 sm:flex-none min-w-0">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5" />
          <input
            type="text"
            placeholder="Matrícula..."
            value={filtros.buscaMatricula}
            onChange={(e) => setFiltros({ ...filtros, buscaMatricula: e.target.value.toUpperCase() })}
            className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 text-[11px] font-mono font-bold focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-white"
          />
        </div>

        {/* Date Filters */}
        <div className="flex items-center gap-1 w-full xs:w-auto">
          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0 hidden xs:inline" />
          <input
            type="date"
            value={filtros.dataInicio}
            onChange={(e) => setFiltros({ ...filtros, dataInicio: e.target.value })}
            className="flex-1 py-1.5 px-2 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-700 bg-white min-w-0"
          />
          <span className="text-slate-400 text-[10px] font-black">/</span>
          <input
            type="date"
            value={filtros.dataFim}
            onChange={(e) => setFiltros({ ...filtros, dataFim: e.target.value })}
            className="flex-1 py-1.5 px-2 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-700 bg-white min-w-0"
          />
        </div>

        {isFiltered && (
          <button
            onClick={handleClearFilters}
            className="px-3 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg text-[10px] font-black flex items-center justify-center gap-1 uppercase w-full xs:w-auto"
          >
            <X className="w-3.5 h-3.5" />
            Limpar
          </button>
        )}
      </div>

      <div className="text-[10px] text-slate-500 font-bold flex items-center justify-center sm:justify-end gap-1 mt-1 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100 shrink-0">
        <span className="font-black text-sky-900">{totalFiltrados}</span> /{' '}
        <span className="font-bold text-slate-700">{totalGeral}</span> REGISTROS
      </div>
    </nav>
  );
};
