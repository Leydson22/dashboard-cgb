import React, { useState } from 'react';
import { AuditLog } from '../types';
import { Database, Search, ShieldCheck, AlertOctagon, Info, AlertTriangle, Trash2, Download, RefreshCw, Smartphone, Monitor } from 'lucide-react';

interface SystemLogViewerProps {
  logs: AuditLog[];
  onClearLogs: () => void;
  onRefreshLogs: () => void;
}

export const SystemLogViewer: React.FC<SystemLogViewerProps> = ({
  logs,
  onClearLogs,
  onRefreshLogs,
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredLogs = logs.filter((log) => {
    if (filterType !== 'ALL' && log.tipo !== filterType) {
      return false;
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchDesc = log.descricao.toLowerCase().includes(term);
      const matchMatricula = log.matriculaAeronave?.toLowerCase().includes(term);
      const matchUser = log.usuarioDispositivo.toLowerCase().includes(term);
      const matchDetails = log.detalhes?.toLowerCase().includes(term);
      return matchDesc || matchMatricula || matchUser || matchDetails;
    }
    return true;
  });

  const getBadgeColor = (tipo: AuditLog['tipo']) => {
    switch (tipo) {
      case 'CRIACAO':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'EDICAO':
        return 'bg-sky-100 text-sky-900 border-sky-300';
      case 'EXCLUSAO':
        return 'bg-rose-100 text-rose-900 border-rose-300';
      case 'STATUS_HIBRIDO':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'ERRO':
        return 'bg-red-200 text-red-950 border-red-400 font-extrabold';
      case 'MANUTENCAO':
        return 'bg-slate-200 text-slate-800 border-slate-400';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const getOrigemIcon = (origem: AuditLog['origem']) => {
    switch (origem) {
      case 'PATIO_MOBILE':
        return <Smartphone className="w-3.5 h-3.5 text-sky-700" />;
      case 'AREA_ADM':
        return <Monitor className="w-3.5 h-3.5 text-slate-700" />;
      default:
        return <Database className="w-3.5 h-3.5 text-amber-600" />;
    }
  };

  const handleExportLogsCSV = () => {
    const headers = ['ID Log', 'Data/Hora', 'Tipo', 'Nível', 'Origem', 'Dispositivo/Operador', 'Descrição', 'Detalhes', 'Matrícula'];
    const rows = filteredLogs.map((log) => [
      log.id,
      log.dataHora,
      log.tipo,
      log.nivel,
      log.origem,
      `"${log.usuarioDispositivo}"`,
      `"${log.descricao}"`,
      `"${log.detalhes || ''}"`,
      log.matriculaAeronave || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `logs_auditoria_cgb_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-0">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-400 text-sky-950 rounded-xl shrink-0 font-black">
            <Database className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
              <span>Banco de Logs, Auditoria e Manutenção</span>
              <span className="bg-amber-400 text-sky-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                {logs.length} Registros
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Rastreabilidade total das ações no pátio, edições, exclusões e eventos de sistema
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={onRefreshLogs}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Atualizar Logs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden xs:inline">Atualizar</span>
          </button>

          <button
            onClick={handleExportLogsCSV}
            className="px-3 py-1.5 bg-sky-800 hover:bg-sky-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
            title="Exportar CSV de Logs"
          >
            <Download className="w-3.5 h-3.5 text-sky-200" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Tem certeza de que deseja limpar o histórico de logs de auditoria do sistema?')) {
                onClearLogs();
              }
            }}
            className="px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-200 text-xs font-bold rounded-xl border border-rose-800 flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Limpar Logs"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden xs:inline">Limpar</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3.5 sm:p-4 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por descrição, matrícula ou operador..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none text-xs">
          {[
            { id: 'ALL', label: 'Todos' },
            { id: 'CRIACAO', label: 'Criações' },
            { id: 'EDICAO', label: 'Edições' },
            { id: 'EXCLUSAO', label: 'Exclusões' },
            { id: 'STATUS_HIBRIDO', label: 'Híbridos' },
            { id: 'MANUTENCAO', label: 'Manutenção' },
            { id: 'ERRO', label: 'Erros' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterType(cat.id)}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition-all shrink-0 cursor-pointer ${
                filterType === cat.id
                  ? 'bg-sky-900 text-white shadow-2xs'
                  : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto max-h-96 overflow-y-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100/90 text-[10px] text-slate-500 uppercase tracking-wider sticky top-0 bg-slate-100 z-10 border-b border-slate-200">
              <th className="px-4 py-2.5 font-extrabold">Data / Hora</th>
              <th className="px-4 py-2.5 font-extrabold">Tipo Evento</th>
              <th className="px-4 py-2.5 font-extrabold">Origem / Operador</th>
              <th className="px-4 py-2.5 font-extrabold">Descrição</th>
              <th className="px-4 py-2.5 font-extrabold">Detalhes Adicionais</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400 italic">
                  Nenhum registro de log encontrado para os critérios selecionados.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/90 transition-colors">
                  <td className="px-4 py-2.5 whitespace-nowrap text-[11px] font-bold text-slate-800">
                    {log.dataHora}
                  </td>

                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${getBadgeColor(log.tipo)}`}>
                      {log.tipo}
                    </span>
                  </td>

                  <td className="px-4 py-2.5 text-[11px] text-slate-600">
                    <div className="flex items-center gap-1.5">
                      {getOrigemIcon(log.origem)}
                      <span className="truncate max-w-[150px] font-sans">{log.usuarioDispositivo}</span>
                    </div>
                  </td>

                  <td className="px-4 py-2.5 font-sans font-bold text-slate-800">
                    {log.matriculaAeronave && (
                      <span className="font-mono bg-sky-100 text-sky-950 px-1.5 py-0.5 rounded mr-1.5 text-[10px]">
                        {log.matriculaAeronave}
                      </span>
                    )}
                    {log.descricao}
                  </td>

                  <td className="px-4 py-2.5 text-[11px] text-slate-500 font-sans max-w-xs truncate" title={log.detalhes}>
                    {log.detalhes || '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
