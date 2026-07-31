import React, { useState, useEffect } from 'react';
import { X, Plane, Check, Save } from 'lucide-react';
import { MovimentacaoAeronave, CompanhiaAerea, DesembarqueHibrido } from '../types';
import { AirlineLogo } from './AirlineLogo';

interface NewRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: Omit<MovimentacaoAeronave, 'id_registro'>, editId?: string) => void;
  companhias: CompanhiaAerea[];
  editingRecord: MovimentacaoAeronave | null;
}

const POSICOES_PRINCIPAIS = Array.from({ length: 23 }, (_, i) => String(i + 1).padStart(2, '0'));
const POSICOES_REMOTAS = Array.from({ length: 15 }, (_, i) => `A${String(i + 1).padStart(2, '0')}`);

export const NewRegistrationModal: React.FC<NewRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  companhias,
  editingRecord,
}) => {
  const [matricula, setMatricula] = useState('');
  const [idCompanhia, setIdCompanhia] = useState<number | string>(companhias[0]?.id_companhia || 1);
  const [posicaoPatio, setPosicaoPatio] = useState<string>('01');
  const [grupoPosicao, setGrupoPosicao] = useState<'principal' | 'remota'>('principal');
  const [desembarqueHibrido, setDesembarqueHibrido] = useState<DesembarqueHibrido>('Não');
  const [tipoAeronave, setTipoAeronave] = useState('');
  const [confirmingSave, setConfirmingSave] = useState(false);

  useEffect(() => {
    if (editingRecord) {
      setMatricula(editingRecord.matricula);
      setIdCompanhia(editingRecord.id_companhia);
      setPosicaoPatio(editingRecord.posicao_patio || '01');
      if (editingRecord.posicao_patio?.startsWith('A')) {
        setGrupoPosicao('remota');
      } else {
        setGrupoPosicao('principal');
      }
      setDesembarqueHibrido(editingRecord.desembarque_hibrido);
      setTipoAeronave(editingRecord.tipo_aeronave || '');
    } else {
      setMatricula('');
      setIdCompanhia(companhias[0]?.id_companhia || 1);
      setPosicaoPatio('01');
      setGrupoPosicao('principal');
      setDesembarqueHibrido('Não');
      setTipoAeronave('');
    }
    setConfirmingSave(false);
  }, [editingRecord, isOpen, companhias]);

  if (!isOpen) return null;

  const selectedCompany =
    companhias.find((c) => String(c.id_companhia) === String(idCompanhia)) || companhias[0];

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matricula.trim()) {
      alert('Por favor, informe a matrícula da aeronave.');
      return;
    }
    // Always request confirmation before saving alterations
    setConfirmingSave(true);
  };

  const handleFinalConfirmSave = () => {
    // AUTOMATIC timestamping in background (no manual date/time input fields shown)
    const now = new Date();
    const autoDate = editingRecord?.data_cadastro ||
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const autoTime = editingRecord?.horario_cadastro ||
      `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    onSave(
      {
        matricula: matricula.trim().toUpperCase(),
        id_companhia: selectedCompany.id_companhia,
        nome_companhia: selectedCompany.nome_companhia,
        posicao_patio: posicaoPatio,
        desembarque_hibrido: desembarqueHibrido,
        data_cadastro: autoDate,
        horario_cadastro: autoTime,
        tipo_aeronave: tipoAeronave || 'Aeronave Comercial',
        status_edicao: 'Auditado',
      },
      editingRecord?.id_registro
    );

    setConfirmingSave(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-0 m-0 w-screen h-screen left-0 top-0 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative bg-white rounded-[32px] border border-slate-300 shadow-2xl w-[92%] max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col mx-auto">
        {/* Save Confirmation Dialog Overlay */}
        {confirmingSave && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-30 flex items-center justify-center p-4 w-full h-full left-0 top-0">
            <div className="bg-white rounded-[32px] p-8 w-[90%] max-w-[340px] border-2 border-sky-600 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200 mx-auto">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 bg-sky-100 text-sky-800 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Save className="w-6 h-6" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Confirmar Alterações?
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Verifique os dados antes de gravar a alteração no sistema CGB:
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans font-bold">Matrícula:</span>
                  <span className="font-extrabold text-sky-950 bg-amber-300 px-2 py-0.5 rounded">
                    {matricula.trim().toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans font-bold">Companhia:</span>
                  <span className="font-extrabold text-slate-800 font-sans">
                    {selectedCompany.nome_companhia}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans font-bold">Posição Pátio:</span>
                  <span className="font-extrabold text-sky-950 bg-sky-100 px-2 py-0.5 rounded font-mono">
                    Posição {posicaoPatio}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans font-bold">Desembarque Híbrido:</span>
                  <span className={`font-black ${desembarqueHibrido === 'Sim' ? 'text-amber-700' : 'text-sky-800'}`}>
                    {desembarqueHibrido}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleFinalConfirmSave}
                  className="py-4 px-4 bg-sky-700 hover:bg-sky-800 text-white font-black text-sm rounded-2xl shadow-lg transition-all cursor-pointer text-center active:scale-95 uppercase tracking-widest"
                >
                  Confirmar e Salvar
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingSave(false)}
                  className="py-3.5 px-4 bg-slate-100 text-slate-500 font-black text-xs rounded-2xl border border-slate-200 transition-all cursor-pointer text-center active:bg-slate-200"
                >
                  Voltar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header AppSheet look */}
        <div className="bg-sky-800 text-white p-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-900 rounded-lg">
              <Plane className="w-5 h-5 text-sky-200" />
            </div>
            <div>
              <h2 className="font-bold text-sm sm:text-base tracking-tight">
                {editingRecord ? 'Editar Registro de Pouso' : 'Novo Pouso — Fiscal de Pátio CGB'}
              </h2>
              <p className="text-[11px] text-sky-200 uppercase font-semibold">
                Cadastro Rápido Celular • AppSheet CGB
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-sky-700 text-sky-200 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleInitialSubmit} className="p-4 sm:p-5 space-y-4 overflow-y-auto">
          {/* Company Selection by Logo */}
          <div>
            <label className="block text-xs font-black text-slate-800 uppercase mb-2">
              Companhia Aérea (Selecione pelo Logo) *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {companhias.map((comp) => {
                const isSelected = String(comp.id_companhia) === String(idCompanhia);
                return (
                  <button
                    key={comp.id_companhia}
                    type="button"
                    onClick={() => setIdCompanhia(comp.id_companhia)}
                    className={`relative p-2 rounded-xl border-2 text-left flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-sky-600 bg-sky-50 shadow-sm ring-2 ring-sky-300'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-1 right-1 bg-sky-600 text-white rounded-full p-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                    <AirlineLogo icao={comp.icao} nome_companhia={comp.nome_companhia} size="sm" className="w-full" />
                    <span className="text-[10px] font-extrabold text-slate-800 text-center truncate w-full">
                      {comp.nome_companhia}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Posição no Pátio */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-black text-slate-800 uppercase">
                Posição no Pátio CGB *
              </label>
              <span className="text-xs font-black text-sky-950 bg-amber-300 px-2.5 py-0.5 rounded-md font-mono shadow-2xs">
                Posição {posicaoPatio}
              </span>
            </div>

            <div className="space-y-1.5">
              {/* Group tabs */}
              <div className="flex rounded-lg bg-slate-100 p-0.5 text-xs font-extrabold border border-slate-200">
                <button
                  type="button"
                  onClick={() => setGrupoPosicao('principal')}
                  className={`flex-1 py-1 rounded-md transition-all cursor-pointer ${
                    grupoPosicao === 'principal'
                      ? 'bg-sky-800 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Pontes / Principais (01 a 23)
                </button>
                <button
                  type="button"
                  onClick={() => setGrupoPosicao('remota')}
                  className={`flex-1 py-1 rounded-md transition-all cursor-pointer ${
                    grupoPosicao === 'remota'
                      ? 'bg-sky-800 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Remotas / Auxiliares (A01 a A15)
                </button>
              </div>

              {/* Position selector buttons */}
              <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                {(grupoPosicao === 'principal' ? POSICOES_PRINCIPAIS : POSICOES_REMOTAS).map((pos) => {
                  const isSelected = pos === posicaoPatio;
                  return (
                    <button
                      key={pos}
                      type="button"
                      onClick={() => setPosicaoPatio(pos)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-black transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-sky-700 text-amber-300 shadow-xs ring-2 ring-sky-300 scale-105'
                          : 'bg-white hover:bg-slate-200 text-slate-800 border border-slate-200'
                      }`}
                    >
                      {pos}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Matrícula */}
          <div>
            <label className="block text-xs font-black text-slate-800 uppercase mb-1">
              Matrícula da Aeronave *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: PR-YQD, PS-AEU, PT-MSL"
              value={matricula}
              onChange={(e) => setMatricula(e.target.value.toUpperCase())}
              className="w-full px-3 py-2.5 border-2 border-slate-300 rounded-xl text-base font-mono font-black text-sky-950 focus:border-sky-600 focus:ring-2 focus:ring-sky-200 focus:outline-hidden uppercase tracking-widest bg-white"
            />
          </div>

          {/* Desembarque Híbrido */}
          <div>
            <label className="block text-xs font-black text-slate-800 uppercase mb-1.5">
              Desembarque Híbrido? *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDesembarqueHibrido('Sim')}
                className={`p-3 rounded-xl border-2 font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  desembarqueHibrido === 'Sim'
                    ? 'bg-amber-500 border-amber-600 text-white shadow-xs ring-2 ring-amber-300'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Check className={`w-4 h-4 ${desembarqueHibrido === 'Sim' ? 'opacity-100' : 'opacity-0'}`} />
                SIM (Híbrido)
              </button>

              <button
                type="button"
                onClick={() => setDesembarqueHibrido('Não')}
                className={`p-3 rounded-xl border-2 font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  desembarqueHibrido === 'Não'
                    ? 'bg-sky-700 border-sky-800 text-white shadow-xs ring-2 ring-sky-300'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Check className={`w-4 h-4 ${desembarqueHibrido === 'Não' ? 'opacity-100' : 'opacity-0'}`} />
                NÃO (Padrão)
              </button>
            </div>
          </div>

          {/* Tipo de Aeronave (Opcional) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Modelo/Equipamento (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ex: Airbus A320neo, Embraer E195, B737-800"
              value={tipoAeronave}
              onChange={(e) => setTipoAeronave(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
            />
          </div>

          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[10px] text-slate-500 italic">
            ⚡ Data e Horário são gravados de forma automática pelo sistema no ato do envio.
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-sky-700 hover:bg-sky-800 text-white text-xs font-black rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Ficha</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
