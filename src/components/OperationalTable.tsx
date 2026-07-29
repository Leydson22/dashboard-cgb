import React, { useState, useMemo } from 'react';
import { FlightRecord } from '../types';
import { ArrowUpDown, ArrowUp, ArrowDown, Trash2, Edit2, Info, ChevronLeft, ChevronRight, FileSpreadsheet, RefreshCw, Download } from 'lucide-react';

interface OperationalTableProps {
  records?: FlightRecord[];
  movimentacoes?: FlightRecord[];
  onDeleteRecord: (record: FlightRecord) => void;
  onEditRecord: (record: FlightRecord) => void;
  onToggleHibrido?: (id: string) => void;
  onOpenExport?: (data: FlightRecord[], filters?: { dataInicio: string; dataFim: string }, autoPrint?: 'OPERATIONAL' | 'MANAGEMENT') => void;
}

type SortField = 'data_horario' | 'matricula' | 'nome_companhia' | 'desembarque_hibrido';
type SortOrder = 'asc' | 'desc';

export const OperationalTable: React.FC<OperationalTableProps> = ({
  records,
  movimentacoes,
  onDeleteRecord,
  onEditRecord,
  onToggleHibrido,
  onOpenExport,
}) => {
  const [sortField, setSortField] = useState<SortField>('data_horario');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [selectedRecordNotes, setSelectedRecordNotes] = useState<FlightRecord | null>(null);

  // Safe dataset fallback
  const dataset = useMemo(() => {
    return Array.isArray(movimentacoes) ? movimentacoes : Array.isArray(records) ? records : [];
  }, [movimentacoes, records]);

  // Sorting logic
  const sortedRecords = useMemo(() => {
    return [...dataset].sort((a, b) => {
      let comparison = 0;

      if (sortField === 'data_horario') {
        const dateTimeA = `${a.data_cadastro || ''} ${a.horario_cadastro || ''}`;
        const dateTimeB = `${b.data_cadastro || ''} ${b.horario_cadastro || ''}`;
        comparison = dateTimeA.localeCompare(dateTimeB);
      } else if (sortField === 'matricula') {
        comparison = (a.matricula || '').localeCompare(b.matricula || '');
      } else if (sortField === 'nome_companhia') {
        comparison = (a.nome_companhia || '').localeCompare(b.nome_companhia || '');
      } else if (sortField === 'desembarque_hibrido') {
        comparison = (a.desembarque_hibrido || '').localeCompare(b.desembarque_hibrido || '');
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }, [dataset, sortField, sortOrder]);

  // Handle Sort Toggle
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(sortedRecords.length / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const paginatedRecords = sortedRecords.slice(startIndex, startIndex + pageSize);

  // Helper for date display DD/MM/AAAA
  const formatDateBR = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col">
      {/* Header Bar of Table */}
      <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-sky-800" />
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
            Tabela Operacional Administrativa (Pousos em CGB)
          </h3>
          {onOpenExport && (
            <button
              onClick={() => onOpenExport(sortedRecords, undefined, 'MANAGEMENT')}
              className="ml-2 p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-md border border-emerald-200 transition-colors flex items-center gap-1.5 text-[10px] font-bold"
              title="Exportar Dados desta Tabela"
            >
              <Download className="w-3 h-3" />
              <span>PDF/CSV</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-slate-500 font-medium">
            Ordenação: <strong className="text-sky-900 font-bold">Data/Hora (DESC - Pousos Recentes)</strong>
          </span>

          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-md px-2 py-0.5">
            <span className="text-slate-400 font-medium">Por página:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-transparent font-bold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto -mx-0.5">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-slate-100/70 border-b border-slate-200 text-[10px] text-slate-500 uppercase tracking-wider select-none">
              <th
                onClick={() => handleSort('data_horario')}
                className="px-5 py-3 font-extrabold cursor-pointer hover:bg-slate-200/60 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Data do Pouso</span>
                  {sortField === 'data_horario' ? (
                    sortOrder === 'desc' ? <ArrowDown className="w-3 h-3 text-sky-800" /> : <ArrowUp className="w-3 h-3 text-sky-800" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  )}
                </div>
              </th>

              <th
                onClick={() => handleSort('data_horario')}
                className="px-5 py-3 font-extrabold cursor-pointer hover:bg-slate-200/60 transition-colors"
              >
                Horário (HH:MM:SS)
              </th>

              <th
                onClick={() => handleSort('matricula')}
                className="px-5 py-3 font-extrabold text-sky-900 cursor-pointer hover:bg-slate-200/60 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Matrícula</span>
                  {sortField === 'matricula' ? (
                    sortOrder === 'desc' ? <ArrowDown className="w-3 h-3 text-sky-800" /> : <ArrowUp className="w-3 h-3 text-sky-800" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  )}
                </div>
              </th>

              <th
                onClick={() => handleSort('nome_companhia')}
                className="px-5 py-3 font-extrabold cursor-pointer hover:bg-slate-200/60 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Companhia Aérea</span>
                  {sortField === 'nome_companhia' ? (
                    sortOrder === 'desc' ? <ArrowDown className="w-3 h-3 text-sky-800" /> : <ArrowUp className="w-3 h-3 text-sky-800" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  )}
                </div>
              </th>

              <th className="px-5 py-3 font-extrabold text-center">
                <span>Posição no Pátio</span>
              </th>

              <th
                onClick={() => handleSort('desembarque_hibrido')}
                className="px-5 py-3 font-extrabold text-center cursor-pointer hover:bg-slate-200/60 transition-colors"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Desembarque Híbrido</span>
                  {sortField === 'desembarque_hibrido' ? (
                    sortOrder === 'desc' ? <ArrowDown className="w-3 h-3 text-sky-800" /> : <ArrowUp className="w-3 h-3 text-sky-800" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  )}
                </div>
              </th>

              <th className="px-5 py-3 font-extrabold text-right">Ações / Pátio</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {paginatedRecords.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-slate-400 italic">
                  Nenhum registro localizado para os filtros informados.
                </td>
              </tr>
            ) : (
              paginatedRecords.map((record) => {
                const isHybrid = record.desembarque_hibrido === 'Sim';

                return (
                  <tr
                    key={record.id_registro}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="px-5 py-3 font-semibold text-slate-800">
                      {formatDateBR(record.data_cadastro)}
                    </td>

                    <td className="px-5 py-3 font-mono text-slate-600">
                      {record.horario_cadastro}
                    </td>

                    <td className="px-5 py-3 font-mono font-bold text-sky-950 bg-sky-50/30">
                      <span className="inline-block px-2 py-0.5 rounded border border-sky-200/60 bg-sky-50 text-sky-900 font-bold">
                        {record.matricula}
                      </span>
                    </td>

                    <td className="px-5 py-3 font-medium text-slate-800">
                      {record.nome_companhia}
                    </td>

                    <td className="px-5 py-3 text-center">
                      <span className="font-mono font-black text-sky-950 bg-amber-300 px-3 py-1 rounded-md text-xs border border-amber-400 shadow-2xs inline-block min-w-[40px]">
                        {record.posicao_patio || '—'}
                      </span>
                    </td>

                    <td className="px-5 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => onToggleHibrido && onToggleHibrido(record.id_registro)}
                        disabled={!onToggleHibrido}
                        title={onToggleHibrido ? "Clique para alternar status (Sim/Não)" : ""}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold border transition-all ${
                          onToggleHibrido ? 'cursor-pointer hover:scale-105 active:scale-95' : 'cursor-default'
                        } ${
                          isHybrid
                            ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                            : 'bg-sky-100 text-sky-900 border-sky-300 hover:bg-sky-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isHybrid ? 'bg-amber-600' : 'bg-sky-600'
                          }`}
                        />
                        <span>{record.desembarque_hibrido.toUpperCase()}</span>
                        {onToggleHibrido && <RefreshCw className="w-2.5 h-2.5 text-slate-400 opacity-60 group-hover:opacity-100" />}
                      </button>
                    </td>

                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {(record.observacoes || record.tipo_aeronave) && (
                          <button
                            onClick={() => setSelectedRecordNotes(record)}
                            className="p-1 text-slate-400 hover:text-sky-700 hover:bg-sky-50 rounded transition-colors"
                            title={`Observação: ${record.observacoes || record.tipo_aeronave}`}
                          >
                            <Info className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => onEditRecord(record)}
                          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                          title="Editar Registro"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onDeleteRecord(record)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                          title="Excluir Registro"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Controls / Pagination */}
      <footer className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex flex-col sm:flex-row justify-between items-center gap-3">
        <span className="text-[11px] text-slate-500 font-medium">
          Mostrando <strong className="text-slate-800">{paginatedRecords.length}</strong> de{' '}
          <strong className="text-slate-800">{sortedRecords.length}</strong> movimentações filtradas
        </span>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500 mr-2">
            Página <strong>{validCurrentPage}</strong> de <strong>{totalPages}</strong>
          </span>

          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={validCurrentPage === 1}
            className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
            title="Página Anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={validCurrentPage === totalPages}
            className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
            title="Próxima Página"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </footer>

      {/* Observation Notes Modal */}
      {selectedRecordNotes && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 border border-slate-200 shadow-xl">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-bold text-sky-900 text-sm flex items-center gap-2">
                <Info className="w-4 h-4 text-sky-700" />
                Ficha de Pátio — {selectedRecordNotes.matricula}
              </h4>
              <button
                onClick={() => setSelectedRecordNotes(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed font-mono">
              <p><strong>Companhia:</strong> {selectedRecordNotes.nome_companhia}</p>
              {selectedRecordNotes.tipo_aeronave && <p><strong>Equipamento:</strong> {selectedRecordNotes.tipo_aeronave}</p>}
              <p><strong>Desembarque:</strong> {selectedRecordNotes.desembarque_hibrido === 'Sim' ? 'Híbrido (Misto)' : 'Padrão (Ponte)'}</p>
              <p><strong>Observações:</strong> {selectedRecordNotes.observacoes || 'Sem observações adicionais.'}</p>
            </div>
            <div className="mt-4 text-right">
              <button
                onClick={() => setSelectedRecordNotes(null)}
                className="bg-sky-800 text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
