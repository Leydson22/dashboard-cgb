import React from 'react';
import { AlertTriangle, Trash2, X, Plane, Calendar, Clock, ShieldAlert } from 'lucide-react';
import { FlightRecord } from '../types';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  record: FlightRecord | null;
  onClose: () => void;
  onConfirm: (recordId: string) => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  record,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !record) return null;

  const formatDateBR = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-0 m-0 z-[2000] animate-in fade-in duration-200 w-screen h-screen left-0 top-0">
      <div
        className="bg-white rounded-[32px] max-w-[340px] w-[90%] border-2 border-rose-100 shadow-2xl overflow-hidden transform transition-all mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="bg-rose-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-700 rounded-xl text-rose-100 shrink-0">
              <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base tracking-tight text-white leading-tight">
                Confirmar Exclusão de Pouso
              </h3>
              <p className="text-[11px] text-rose-100">
                Ação irreversível com log de auditoria
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-rose-200 hover:text-white p-1 rounded-lg hover:bg-rose-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-4">
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            Tem certeza de que deseja remover permanentemente o registro de pouso abaixo da base do Aeroporto de Cuiabá (CGB)?
          </p>

          {/* Record Summary Box */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">
                Aeronave / Matrícula
              </span>
              <span className="font-mono font-black text-sm text-sky-950 bg-sky-100 text-sky-900 px-2.5 py-0.5 rounded border border-sky-300">
                {record.matricula}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Companhia</span>
                <span className="font-extrabold text-slate-800">{record.nome_companhia}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Híbrido</span>
                <span className={`font-extrabold ${record.desembarque_hibrido === 'Sim' ? 'text-amber-700' : 'text-sky-800'}`}>
                  {record.desembarque_hibrido === 'Sim' ? 'SIM (Híbrido)' : 'NÃO (Padrão)'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                {formatDateBR(record.data_cadastro)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                {record.horario_cadastro}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px]">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Esta ação será registrada no <strong>Log de Auditoria e Manutenção</strong> com data, hora e identificação do operador.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                onConfirm(record.id_registro);
                onClose();
              }}
              className="py-4 px-4 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-black text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 uppercase tracking-widest"
            >
              <Trash2 className="w-5 h-5" />
              <span>Confirmar Exclusão</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-3.5 px-4 bg-slate-100 text-slate-500 font-black text-xs rounded-2xl border border-slate-200 transition-colors cursor-pointer active:bg-slate-200"
            >
              Manter Registro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
