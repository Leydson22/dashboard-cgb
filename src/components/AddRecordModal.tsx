import React, { useState, useEffect } from 'react';
import { FlightRecord, AIRLINES } from '../types';
import { Plane, Plus, Save, X, Clock, Calendar, CheckCircle } from 'lucide-react';

interface AddRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveRecord: (record: FlightRecord) => void;
  editingRecord: FlightRecord | null;
}

export const AddRecordModal: React.FC<AddRecordModalProps> = ({
  isOpen,
  onClose,
  onSaveRecord,
  editingRecord,
}) => {
  const [matricula, setMatricula] = useState('');
  const [companyName, setCompanyName] = useState('Azul');
  const [hybrid, setHybrid] = useState<'Sim' | 'Não'>('Não');
  const [dataCadastro, setDataCadastro] = useState('');
  const [horarioCadastro, setHorarioCadastro] = useState('');
  const [observacoes, setObservacoes] = useState('');

  useEffect(() => {
    if (editingRecord) {
      setMatricula(editingRecord.matricula);
      setCompanyName(editingRecord.nome_companhia);
      setHybrid(editingRecord.desembarque_hibrido);
      setDataCadastro(editingRecord.data_cadastro);
      setHorarioCadastro(editingRecord.horario_cadastro);
      setObservacoes(editingRecord.observacoes || '');
    } else {
      // Default to current date and time
      const now = new Date();
      const isoDate = now.toISOString().split('T')[0];
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');

      setMatricula('');
      setCompanyName('Azul');
      setHybrid('Não');
      setDataCadastro(isoDate);
      setHorarioCadastro(`${hours}:${minutes}:${seconds}`);
      setObservacoes('');
    }
  }, [editingRecord, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!matricula.trim()) {
      alert('Por favor, informe a matrícula da aeronave.');
      return;
    }

    const matchedAirline = AIRLINES.find(
      (a) => a.name.toLowerCase() === companyName.toLowerCase()
    );

    const record: FlightRecord = {
      id_registro: editingRecord
        ? editingRecord.id_registro
        : `CGB-${Date.now()}`,
      matricula: matricula.trim().toUpperCase(),
      id_companhia: matchedAirline ? matchedAirline.id : 'OUT',
      nome_companhia: companyName,
      desembarque_hibrido: hybrid,
      data_cadastro: dataCadastro,
      horario_cadastro: horarioCadastro,
      observacoes: observacoes.trim() || undefined,
    };

    onSaveRecord(record);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-lg w-full overflow-hidden border border-slate-200 shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="bg-sky-900 text-white px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <Plane className="w-5 h-5 text-sky-300" />
            <div>
              <h3 className="font-bold text-sm tracking-tight">
                {editingRecord ? 'Editar Registro de Pouso' : 'Novo Pouso no CGB'}
              </h3>
              <p className="text-[10px] text-sky-200 uppercase font-mono">
                Aeroporto Internacional de Cuiabá (SBCY)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-sky-200 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Matrícula */}
            <div className="col-span-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Matrícula da Aeronave *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: PR-YQD"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600 uppercase"
              />
            </div>

            {/* Companhia */}
            <div className="col-span-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Companhia Aérea *
              </label>
              <select
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600"
              >
                {AIRLINES.map((air) => (
                  <option key={air.id} value={air.name}>
                    {air.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Desembarque Híbrido Radio Toggle */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Desembarque Híbrido Misto? *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setHybrid('Não')}
                className={`py-2 px-4 rounded-lg border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  hybrid === 'Não'
                    ? 'bg-sky-800 text-white border-sky-800 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>NÃO (Padrão)</span>
              </button>

              <button
                type="button"
                onClick={() => setHybrid('Sim')}
                className={`py-2 px-4 rounded-lg border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  hybrid === 'Sim'
                    ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>SIM (Híbrido)</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              * Marque 'Sim' em caso de desembarque com transporte por ônibus remotos ou posição especial de pátio.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Data Cadastro */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Data do Registro
              </label>
              <input
                type="date"
                required
                value={dataCadastro}
                onChange={(e) => setDataCadastro(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600"
              />
            </div>

            {/* Horario Cadastro */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Horário (HH:MM:SS)
              </label>
              <input
                type="text"
                required
                placeholder="15:42:01"
                value={horarioCadastro}
                onChange={(e) => setHorarioCadastro(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono font-medium border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600"
              />
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Observações do Pátio (Opcional)
            </label>
            <textarea
              rows={2}
              placeholder="Ex: Posição de pátio 03, reabastecimento pendente..."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600 resize-none"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-sky-800 hover:bg-sky-900 text-white rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Registro</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
