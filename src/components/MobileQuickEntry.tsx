import React, { useState, useEffect } from 'react';
import {
  Building2,
  MapPin,
  Plane,
  Layers,
  CheckCircle2,
  Check,
  X,
  PlusCircle,
  ChevronRight,
  ChevronLeft,
  Trash2,
  Edit2,
  Plus
} from 'lucide-react';
import { CompanhiaAerea, MovimentacaoAeronave, DesembarqueHibrido } from '../types';
import { AirlineLogo } from './AirlineLogo';
import { getAircraftModels, addAircraftModel, deleteAircraftModel, editAircraftModel } from '../services/aircraftModelService';

interface MobileQuickEntryProps {
  companhias: CompanhiaAerea[];
  onSaveRecord: (record: Omit<MovimentacaoAeronave, 'id_registro'>) => void;
  onClose?: () => void;
}

const POSICOES_PRINCIPAIS = Array.from({ length: 23 }, (_, i) => String(i + 1).padStart(2, '0'));
const POSICOES_REMOTAS = Array.from({ length: 15 }, (_, i) => `A${String(i + 1).padStart(2, '0')}`);

export const MobileQuickEntry: React.FC<MobileQuickEntryProps> = ({
  companhias,
  onSaveRecord,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedCompanhiaId, setSelectedCompanhiaId] = useState<number | string>(
    companhias[0]?.id_companhia || 1
  );
  const [posicaoPatio, setPosicaoPatio] = useState<string>('01');
  const [grupoPosicao, setGrupoPosicao] = useState<'principal' | 'remota'>('principal');
  const [matricula, setMatricula] = useState<string>('');
  const [selectedModelo, setSelectedModelo] = useState<string>('');
  const [modelos, setModelos] = useState<string[]>(() => getAircraftModels());
  const [desembarqueHibrido, setDesembarqueHibrido] = useState<DesembarqueHibrido>('Não');
  const [registeredModal, setRegisteredModal] = useState<{
    matricula: string;
    companhia: string;
    posicao: string;
    horario: string;
    hibrido: string;
    modelo?: string;
  } | null>(null);

  // Sync models list if it changes in service
  useEffect(() => {
    setModelos(getAircraftModels());
  }, []);

  // Quick prefix helper
  const handleAddPrefix = (prefix: string) => {
    if (!matricula.startsWith(prefix)) {
      setMatricula(prefix);
    }
  };

  const handleSelectCompany = (id: number | string) => {
    setSelectedCompanhiaId(id);
    setTimeout(() => setCurrentStep(2), 150);
  };

  const handleSelectPosition = (pos: string) => {
    setPosicaoPatio(pos);
    setTimeout(() => setCurrentStep(3), 150);
  };

  const handleSelectModelo = (mod: string) => {
    setSelectedModelo(mod);
    setTimeout(() => setCurrentStep(5), 150);
  };

  const handleAddNewModel = () => {
    const newModel = window.prompt("Digite o nome do novo modelo (ex: Boeing 747):");
    if (newModel && newModel.trim()) {
      const updated = addAircraftModel(newModel.trim());
      setModelos(updated);
      setSelectedModelo(newModel.trim());
    }
  };

  const handleDeleteModel = (e: React.MouseEvent, mod: string) => {
    e.stopPropagation();
    if (window.confirm(`Deseja realmente excluir o modelo "${mod}" da lista?`)) {
      const updated = deleteAircraftModel(mod);
      setModelos(updated);
      if (selectedModelo === mod) setSelectedModelo('');
    }
  };

  const handleEditModel = (e: React.MouseEvent, mod: string) => {
    e.stopPropagation();
    const newName = window.prompt(`Editar modelo "${mod}" para:`, mod);
    if (newName && newName.trim() && newName !== mod) {
      const updated = editAircraftModel(mod, newName.trim());
      setModelos(updated);
      if (selectedModelo === mod) setSelectedModelo(newName.trim());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanMatricula = matricula.trim().toUpperCase();
    if (!cleanMatricula) {
      setCurrentStep(3);
      alert('Por favor, informe a matrícula da aeronave.');
      return;
    }

    const company =
      companhias.find((c) => String(c.id_companhia) === String(selectedCompanhiaId)) ||
      companhias[0];

    const now = new Date();
    const autoDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const autoTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    onSaveRecord({
      matricula: cleanMatricula,
      id_companhia: company.id_companhia,
      nome_companhia: company.nome_companhia,
      desembarque_hibrido: desembarqueHibrido,
      posicao_patio: posicaoPatio,
      data_cadastro: autoDate,
      horario_cadastro: autoTime,
      tipo_aeronave: selectedModelo || 'Aeronave Comercial',
      status_edicao: 'Auditado',
    });

    setRegisteredModal({
      matricula: cleanMatricula,
      companhia: company.nome_companhia,
      posicao: posicaoPatio,
      horario: autoTime,
      hibrido: desembarqueHibrido,
      modelo: selectedModelo
    });

    setMatricula('');
    setSelectedModelo('');
    setCurrentStep(1);
  };

  const handleRegisterAnother = () => {
    setRegisteredModal(null);
    setCurrentStep(1);
  };

  const handleCloseAndGoHome = () => {
    setRegisteredModal(null);
    if (onClose) onClose();
  };

  const selectedCompany =
    companhias.find((c) => String(c.id_companhia) === String(selectedCompanhiaId)) || companhias[0];

  return (
    <div className="flex-1 flex flex-col bg-slate-50 animate-in fade-in duration-150 w-full h-full overflow-hidden box-border">
      {/* Post-Registration Choice Modal */}
      {registeredModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl p-4 sm:p-6 max-w-md w-full shadow-2xl border-2 border-emerald-500 space-y-3 sm:space-y-4 animate-in zoom-in-95 duration-150 overflow-y-auto max-h-[95vh]">
            <div className="text-center space-y-1 sm:space-y-2">
              <div className="w-12 h-14 sm:w-14 sm:h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8 sm:w-9 sm:h-9" />
              </div>
              <h3 className="text-base sm:text-xl font-black text-slate-900 leading-tight">
                Pouso Cadastrado com Sucesso!
              </h3>
            </div>

            <div className="bg-slate-50 rounded-2xl p-3 sm:p-4 border border-slate-200 space-y-2 font-mono text-[10px] sm:text-xs">
              <div className="flex justify-between items-center border-b border-slate-200/80 pb-2">
                <span className="text-slate-500 font-sans font-bold">Matrícula:</span>
                <span className="font-black text-sky-950 bg-amber-300 px-2 py-0.5 rounded-lg text-sm">
                  {registeredModal.matricula}
                </span>
              </div>
              {registeredModal.modelo && (
                <div className="flex justify-between items-center border-b border-slate-200/80 pb-2">
                  <span className="text-slate-500 font-sans font-bold">Equipamento:</span>
                  <span className="font-black text-sky-800">{registeredModal.modelo}</span>
                </div>
              )}
              <div className="flex justify-between items-center border-b border-slate-200/80 pb-2">
                <span className="text-slate-500 font-sans font-bold">Empresa:</span>
                <span className="font-extrabold text-slate-900 font-sans text-xs truncate ml-2">
                  {registeredModal.companhia}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200/80 pb-2">
                <span className="text-slate-500 font-sans font-bold">Posição:</span>
                <span className="font-extrabold text-sky-950">BOX {registeredModal.posicao}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-sans font-bold">Híbrido:</span>
                <span className={`font-black px-2 py-0.5 rounded-full ${
                  registeredModal.hibrido === 'Sim' ? 'bg-amber-100 text-amber-900' : 'bg-sky-100 text-sky-900'
                }`}>
                  {registeredModal.hibrido}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button onClick={handleRegisterAnother} className="w-full py-3 bg-sky-900 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all">
                <PlusCircle className="w-4 h-4 text-amber-300" />
                Novo Pouso
              </button>
              <button onClick={handleCloseAndGoHome} className="w-full py-3 bg-slate-200 text-slate-800 font-black text-xs rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all">
                <X className="w-4 h-4 text-rose-600" />
                Início
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1 pb-24">
        {/* STEP 1: EMPRESA */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-sky-900 text-white flex items-center justify-center font-black text-sm">1</div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase">Empresa Aérea</h4>
                  <p className="text-[10px] sm:text-xs text-slate-500">Toque na logo da operadora</p>
                </div>
              </div>
              <Building2 className="w-5 h-5 text-sky-800" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {companhias.map((comp) => (
                <button key={comp.id_companhia} type="button" onClick={() => handleSelectCompany(comp.id_companhia)} className={`relative p-4 rounded-3xl border-2 flex items-center justify-center transition-all active:scale-95 ${String(comp.id_companhia) === String(selectedCompanhiaId) ? 'border-sky-600 bg-white ring-4 ring-sky-100' : 'border-white bg-white shadow-xs'}`}>
                  {String(comp.id_companhia) === String(selectedCompanhiaId) && <div className="absolute -top-2 -right-2 bg-sky-600 text-white rounded-full p-1"><Check className="w-3 h-3 stroke-[3]" /></div>}
                  <AirlineLogo icao={comp.icao} nome_companhia={comp.nome_companhia} size="md" />
                </button>
              ))}
            </div>
            <button type="button" onClick={() => setCurrentStep(2)} className="w-full py-4 bg-sky-900 text-white font-black text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2 uppercase tracking-widest">
              Avançar <ChevronRight className="w-5 h-5 text-amber-300" />
            </button>
          </div>
        )}

        {/* STEP 2: POSIÇÃO */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border-2 border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-sky-900 text-white flex items-center justify-center font-black text-sm">2</div>
                <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase">Posição no Pátio</h4>
              </div>
              <span className="text-sm font-black text-sky-950 bg-amber-300 px-3 py-1 rounded-xl">BOX {posicaoPatio}</span>
            </div>
            <div className="flex rounded-2xl bg-slate-200/50 p-1.5 text-xs font-black border border-slate-200">
              <button type="button" onClick={() => setGrupoPosicao('principal')} className={`flex-1 py-2.5 rounded-xl transition-all ${grupoPosicao === 'principal' ? 'bg-sky-900 text-white shadow-md' : 'text-slate-600'}`}>Pontes (01-23)</button>
              <button type="button" onClick={() => setGrupoPosicao('remota')} className={`flex-1 py-2.5 rounded-xl transition-all ${grupoPosicao === 'remota' ? 'bg-sky-900 text-white shadow-md' : 'text-slate-600'}`}>Remotas (A01-A15)</button>
            </div>
            <div className="flex flex-wrap gap-2 p-3 bg-white rounded-3xl border-2 border-slate-50 max-h-[350px] overflow-y-auto shadow-inner">
              {(grupoPosicao === 'principal' ? POSICOES_PRINCIPAIS : POSICOES_REMOTAS).map((pos) => (
                <button key={pos} type="button" onClick={() => handleSelectPosition(pos)} className={`px-4 py-2.5 rounded-xl text-sm font-mono font-black transition-all min-w-[54px] ${pos === posicaoPatio ? 'bg-sky-700 text-amber-300 shadow-md ring-4 ring-sky-100' : 'bg-slate-50 text-slate-800 border border-slate-200'}`}>{pos}</button>
              ))}
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setCurrentStep(1)} className="flex-1 py-4 bg-white border-2 border-slate-200 text-slate-700 font-black text-xs rounded-2xl flex items-center justify-center gap-1 uppercase tracking-widest"><ChevronLeft className="w-4 h-4" /> Voltar</button>
              <button type="button" onClick={() => setCurrentStep(3)} className="flex-1 py-4 bg-sky-900 text-white font-black text-xs rounded-2xl shadow-lg flex items-center justify-center gap-1.5 uppercase tracking-widest">Próximo <ChevronRight className="w-4 h-4 text-amber-300" /></button>
            </div>
          </div>
        )}

        {/* STEP 3: MATRÍCULA */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border-2 border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-sky-900 text-white flex items-center justify-center font-black text-sm">3</div>
                <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase">Matrícula da Aeronave</h4>
              </div>
              <Plane className="w-5 h-5 text-sky-800" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {['PR-', 'PS-', 'PT-', 'PP-'].map((pref) => (
                <button key={pref} type="button" onClick={() => handleAddPrefix(pref)} className="px-4 py-2 bg-sky-100 text-sky-950 font-black font-mono text-sm rounded-xl border border-sky-300 shadow-xs">+{pref}</button>
              ))}
            </div>
            <input type="text" required autoFocus autoCapitalize="characters" placeholder="MATRÍCULA..." value={matricula} onChange={(e) => setMatricula(e.target.value.toUpperCase())} className="w-full px-6 py-5 border-2 border-slate-200 focus:border-sky-600 rounded-3xl text-2xl font-mono font-black text-sky-950 bg-white shadow-sm tracking-[0.2em] focus:outline-none focus:ring-8 focus:ring-sky-50" />
            <div className="flex gap-3">
              <button type="button" onClick={() => setCurrentStep(2)} className="flex-1 py-4 bg-white border-2 border-slate-200 text-slate-700 font-black text-xs rounded-2xl flex items-center justify-center gap-1 uppercase tracking-widest"><ChevronLeft className="w-4 h-4" /> Voltar</button>
              <button type="button" onClick={() => { if(matricula.trim()) setCurrentStep(4); else alert('Informe a matrícula'); }} className="flex-1 py-4 bg-sky-900 text-white font-black text-xs rounded-2xl shadow-lg flex items-center justify-center gap-1.5 uppercase tracking-widest">Próximo <ChevronRight className="w-4 h-4 text-amber-300" /></button>
            </div>
          </div>
        )}

        {/* STEP 4: MODELO / EQUIPAMENTO (NEW) */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-sky-900 text-white flex items-center justify-center font-black text-sm">4</div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase">Equipamento (Opcional)</h4>
                  <p className="text-[10px] sm:text-xs text-slate-500">Escolha o modelo da aeronave</p>
                </div>
              </div>
              <PlusCircle className="w-5 h-5 text-sky-800" />
            </div>

            <div className="flex flex-wrap gap-2 p-3 bg-white rounded-3xl border-2 border-slate-50 max-h-[350px] overflow-y-auto shadow-inner">
              {modelos.map((mod) => (
                <div key={mod} className="relative group">
                  <button type="button" onClick={() => handleSelectModelo(mod)} className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${selectedModelo === mod ? 'bg-sky-700 text-amber-300 shadow-md ring-4 ring-sky-100' : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-white'}`}>
                    {mod}
                  </button>
                  <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button type="button" onClick={(e) => handleEditModel(e, mod)} className="p-1 bg-amber-400 text-white rounded-full shadow-sm"><Edit2 className="w-2.5 h-2.5" /></button>
                    <button type="button" onClick={(e) => handleDeleteModel(e, mod)} className="p-1 bg-rose-500 text-white rounded-full shadow-sm"><Trash2 className="w-2.5 h-2.5" /></button>
                  </div>
                </div>
              ))}
              <button type="button" onClick={handleAddNewModel} className="px-4 py-2.5 rounded-xl text-xs font-black border-2 border-dashed border-sky-300 text-sky-600 flex items-center gap-2 hover:bg-sky-50 transition-all">
                <Plus className="w-4 h-4" /> Adicionar Novo
              </button>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setCurrentStep(3)} className="flex-1 py-4 bg-white border-2 border-slate-200 text-slate-700 font-black text-xs rounded-2xl flex items-center justify-center gap-1 uppercase tracking-widest"><ChevronLeft className="w-4 h-4" /> Voltar</button>
              <button type="button" onClick={() => setCurrentStep(5)} className="flex-1 py-4 bg-sky-900 text-white font-black text-xs rounded-2xl shadow-lg flex items-center justify-center gap-1.5 uppercase tracking-widest">Pular / Próximo <ChevronRight className="w-4 h-4 text-amber-300" /></button>
            </div>
          </div>
        )}

        {/* STEP 5: DESEMBARQUE HÍBRIDO */}
        {currentStep === 5 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border-2 border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-sky-900 text-white flex items-center justify-center font-black text-sm">5</div>
                <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase">Desembarque Híbrido</h4>
              </div>
              <Layers className="w-5 h-5 text-sky-800" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setDesembarqueHibrido('Sim')} className={`py-6 rounded-3xl border-2 font-black text-sm flex flex-col items-center gap-2 transition-all ${desembarqueHibrido === 'Sim' ? 'bg-amber-500 border-amber-600 text-white shadow-lg ring-4 ring-amber-100' : 'bg-white border-slate-200 text-slate-400'}`}>
                <CheckCircle2 className="w-6 h-6" /> SIM (Híbrido)
              </button>
              <button type="button" onClick={() => setDesembarqueHibrido('Não')} className={`py-6 rounded-3xl border-2 font-black text-sm flex flex-col items-center gap-2 transition-all ${desembarqueHibrido === 'Não' ? 'bg-sky-800 border-sky-900 text-white shadow-lg ring-4 ring-sky-100' : 'bg-white border-slate-200 text-slate-400'}`}>
                <CheckCircle2 className="w-6 h-6" /> NÃO (Padrão)
              </button>
            </div>
            <div className="bg-white p-5 rounded-3xl border-2 border-slate-100 space-y-2 text-xs sm:text-sm font-mono shadow-inner">
              <div className="flex justify-between border-b border-slate-50 pb-2 mb-2"><span className="text-slate-400 font-black uppercase">Resumo</span><span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">Pronto</span></div>
              <div className="flex justify-between"><span>Empresa:</span><span className="font-black text-slate-900 uppercase">{selectedCompany.nome_companhia}</span></div>
              <div className="flex justify-between"><span>Posição:</span><span className="font-black text-sky-950 bg-amber-300 px-3 py-0.5 rounded-lg">BOX {posicaoPatio}</span></div>
              <div className="flex justify-between"><span>Matrícula:</span><span className="font-black text-sky-950 bg-sky-100 px-3 py-0.5 rounded-lg">{matricula}</span></div>
              {selectedModelo && <div className="flex justify-between"><span>Modelo:</span><span className="font-black text-sky-800">{selectedModelo}</span></div>}
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setCurrentStep(4)} className="flex-1 py-4 bg-white border-2 border-slate-200 text-slate-700 font-black text-xs rounded-2xl flex items-center justify-center gap-1 uppercase tracking-widest"><ChevronLeft className="w-4 h-4" /> Voltar</button>
              <button type="submit" className="flex-[2] py-5 bg-emerald-600 text-white font-black text-base rounded-2xl shadow-xl flex items-center justify-center gap-3 uppercase tracking-widest">Finalizar Registro</button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
