import React, { useState, useEffect } from 'react';
import {
  Building2, MapPin, Plane, Layers, CheckCircle2, Check, X,
  PlusCircle, ChevronRight, ChevronLeft, Trash2, Edit2, Plus,
  Hash, Briefcase
} from 'lucide-react';
import { CompanhiaAerea, MovimentacaoAeronave, DesembarqueHibrido } from '../types';
import { AirlineLogo } from './AirlineLogo';
import { getAircraftModels, addAircraftModel, deleteAircraftModel, editAircraftModel } from '../services/aircraftModelService';
import { getPositions, addPosition, deletePosition, editPosition } from '../services/positionService';
import { getAirlines, addAirline, deleteAirline, editAirline } from '../services/airlineService';
import { getQuickPrefixes, addQuickPrefix, deleteQuickPrefix, editQuickPrefix } from '../services/quickRegistrationService';

interface MobileQuickEntryProps {
  companhias: CompanhiaAerea[];
  onSaveRecord: (record: Omit<MovimentacaoAeronave, 'id_registro'>) => void;
  onClose?: () => void;
}

export const MobileQuickEntry: React.FC<MobileQuickEntryProps> = ({
  companhias: initialCompanhias,
  onSaveRecord,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [companhias, setCompanhias] = useState<CompanhiaAerea[]>(() => getAirlines());
  const [selectedCompanhiaId, setSelectedCompanhiaId] = useState<number | string>(
    companhias[0]?.id_companhia || ''
  );

  const [posicaoPatio, setPosicaoPatio] = useState<string>('01');
  const [grupoPosicao, setGrupoPosicao] = useState<'principal' | 'remota'>('principal');
  const [positions, setPositions] = useState(() => getPositions());

  const [matricula, setMatricula] = useState<string>('');
  const [prefixes, setPrefixes] = useState<string[]>(() => getQuickPrefixes());

  const [selectedModelo, setSelectedModelo] = useState<string>('');
  const [modelos, setModelos] = useState<string[]>(() => getAircraftModels());

  const [managementMode, setManagementMode] = useState<'select' | 'edit' | 'delete'>('select');
  const [desembarqueHibrido, setDesembarqueHibrido] = useState<DesembarqueHibrido>('Não');

  const [registeredModal, setRegisteredModal] = useState<{
    matricula: string;
    companhia: string;
    posicao: string;
    horario: string;
    hibrido: string;
    modelo?: string;
  } | null>(null);

  // Management Handlers
  const handleSelectCompany = (id: number | string) => {
    if (managementMode === 'edit') {
      const comp = companhias.find(c => String(c.id_companhia) === String(id));
      if (!comp) return;
      const newName = window.prompt(`Editar nome da empresa:`, comp.nome_companhia);
      const newIcao = window.prompt(`Editar ICAO (3 letras):`, comp.icao);
      if (newName && newName.trim() && newIcao && newIcao.trim()) {
        const updated = editAirline(id, newName.trim(), newIcao.trim());
        setCompanhias(updated);
      }
      setManagementMode('select');
    } else if (managementMode === 'delete') {
      if (window.confirm(`Excluir empresa selecionada?`)) {
        const updated = deleteAirline(id);
        setCompanhias(updated);
      }
      setManagementMode('select');
    } else {
      setSelectedCompanhiaId(id);
      setTimeout(() => setCurrentStep(2), 150);
    }
  };

  const handleAddCompany = () => {
    const name = window.prompt("Nome da Empresa:");
    const icao = window.prompt("Código ICAO (Ex: AZU, TAM):");
    if (name && name.trim() && icao && icao.trim()) {
      const updated = addAirline(name.trim(), icao.trim());
      setCompanhias(updated);
      setManagementMode('select');
    }
  };

  const handleSelectPosition = (pos: string) => {
    if (managementMode === 'edit') {
      const newPos = window.prompt(`Editar posição "${pos}" para:`, pos);
      if (newPos && newPos.trim() && newPos !== pos) {
        editPosition(pos, newPos.trim(), grupoPosicao);
        setPositions(getPositions());
      }
      setManagementMode('select');
    } else if (managementMode === 'delete') {
      if (window.confirm(`Excluir posição "${pos}"?`)) {
        deletePosition(pos, grupoPosicao);
        setPositions(getPositions());
      }
      setManagementMode('select');
    } else {
      setPosicaoPatio(pos);
      setTimeout(() => setCurrentStep(3), 150);
    }
  };

  const handleAddPosition = () => {
    const newPos = window.prompt("Nova Posição (Ex: 24 ou A16):");
    if (newPos && newPos.trim()) {
      addPosition(newPos.trim(), grupoPosicao);
      setPositions(getPositions());
      setManagementMode('select');
    }
  };

  const handleSelectPrefix = (pref: string) => {
    if (managementMode === 'edit') {
      const newPref = window.prompt(`Editar prefixo "${pref}" para:`, pref);
      if (newPref && newPref.trim() && newPref !== pref) {
        const updated = editQuickPrefix(pref, newPref.trim());
        setPrefixes(updated);
      }
      setManagementMode('select');
    } else if (managementMode === 'delete') {
      if (window.confirm(`Excluir prefixo "${pref}"?`)) {
        const updated = deleteQuickPrefix(pref);
        setPrefixes(updated);
      }
      setManagementMode('select');
    } else {
      setMatricula(pref);
    }
  };

  const handleAddPrefix = () => {
    const newPref = window.prompt("Novo Prefixo (Ex: VH-, N):");
    if (newPref && newPref.trim()) {
      const updated = addQuickPrefix(newPref.trim());
      setPrefixes(updated);
      setManagementMode('select');
    }
  };

  const handleSelectModelo = (mod: string) => {
    if (managementMode === 'edit') {
      const newName = window.prompt(`Editar modelo:`, mod);
      if (newName && newName.trim() && newName !== mod) {
        const updated = editAircraftModel(mod, newName.trim());
        setModelos(updated);
      }
      setManagementMode('select');
    } else if (managementMode === 'delete') {
      if (window.confirm(`Excluir modelo "${mod}"?`)) {
        const updated = deleteAircraftModel(mod);
        setModelos(updated);
      }
      setManagementMode('select');
    } else {
      setSelectedModelo(mod);
      setTimeout(() => setCurrentStep(5), 150);
    }
  };

  const handleAddModel = () => {
    const name = window.prompt("Nome do Equipamento:");
    if (name && name.trim()) {
      const updated = addAircraftModel(name.trim());
      setModelos(updated);
      setManagementMode('select');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMatricula = matricula.trim().toUpperCase();
    if (!cleanMatricula) { alert('Informe a matrícula'); return; }
    const company = companhias.find(c => String(c.id_companhia) === String(selectedCompanhiaId)) || companhias[0];
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
    setMatricula(''); setSelectedModelo(''); setCurrentStep(1);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 w-full h-full overflow-hidden box-border">
      {registeredModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[2000] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-6 w-full max-w-[340px] shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto"><CheckCircle2 className="w-9 h-9" /></div>
              <h3 className="text-xl font-black text-slate-900 uppercase">Sucesso!</h3>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs font-mono">
               <div className="flex justify-between border-b pb-2"><span className="text-slate-400">Matrícula:</span><span className="font-black text-sky-950 bg-amber-300 px-2 rounded-lg">{registeredModal.matricula}</span></div>
               <div className="flex justify-between border-b pb-2"><span className="text-slate-400">Empresa:</span><span className="font-black truncate ml-2">{registeredModal.companhia}</span></div>
               <div className="flex justify-between"><span className="text-slate-400">Posição:</span><span className="font-black">BOX {registeredModal.posicao}</span></div>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <button onClick={() => {setRegisteredModal(null); setCurrentStep(1);}} className="w-full py-4 bg-sky-900 text-white font-black text-sm rounded-2xl shadow-lg">NOVO POUSO</button>
              <button onClick={onClose} className="w-full py-3.5 bg-slate-100 text-slate-500 font-black text-xs rounded-2xl uppercase">Início</button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1 pb-24">
        {/* STEP Header Helper */}
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-xs sticky top-0 z-50">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-sky-900 text-white flex items-center justify-center font-black text-sm">{currentStep}</div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase">
                  {currentStep === 1 ? 'Empresa Aérea' : currentStep === 2 ? 'Posição no Pátio' : currentStep === 3 ? 'Matrícula' : currentStep === 4 ? 'Equipamento' : 'Desembarque'}
                </h4>
              </div>
           </div>

           <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200 shadow-inner">
              <button type="button" onClick={() => {
                if(currentStep === 1) handleAddCompany();
                else if(currentStep === 2) handleAddPosition();
                else if(currentStep === 3) handleAddPrefix();
                else if(currentStep === 4) handleAddModel();
              }} className="p-2 bg-white text-emerald-600 rounded-lg shadow-xs border border-slate-200"><Plus className="w-4 h-4 stroke-[3]" /></button>
              <button type="button" onClick={() => setManagementMode(prev => prev === 'edit' ? 'select' : 'edit')} className={`p-2 rounded-lg transition-all ${managementMode === 'edit' ? 'bg-amber-500 text-white' : 'bg-white text-amber-600 border border-slate-200'}`}><Edit2 className="w-4 h-4" /></button>
              <button type="button" onClick={() => setManagementMode(prev => prev === 'delete' ? 'select' : 'delete')} className={`p-2 rounded-lg transition-all ${managementMode === 'delete' ? 'bg-rose-600 text-white' : 'bg-white text-rose-600 border border-slate-200'}`}><Trash2 className="w-4 h-4" /></button>
           </div>
        </div>

        {managementMode !== 'select' && (
          <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-center animate-pulse shadow-sm border-2 ${managementMode === 'edit' ? 'bg-amber-50 text-amber-800 border-amber-300' : 'bg-rose-50 text-rose-800 border-rose-300'}`}>
            {managementMode === 'edit' ? '✏️ Modo Edição Ativo' : '🗑️ Modo Exclusão Ativo'}
          </div>
        )}

        {/* STEP 1: EMPRESA */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {companhias.map((comp) => (
                <button key={comp.id_companhia} type="button" onClick={() => handleSelectCompany(comp.id_companhia)} className={`relative p-5 rounded-3xl border-2 flex items-center justify-center transition-all active:scale-95 ${
                  managementMode === 'edit' ? 'border-amber-400 bg-amber-50' :
                  managementMode === 'delete' ? 'border-rose-400 bg-rose-50' :
                  String(comp.id_companhia) === String(selectedCompanhiaId) ? 'border-sky-600 bg-white ring-4 ring-sky-100 shadow-md' : 'border-white bg-white shadow-xs'
                }`}>
                  <AirlineLogo icao={comp.icao} nome_companhia={comp.nome_companhia} size="md" />
                </button>
              ))}
            </div>
            <button type="button" onClick={() => {setManagementMode('select'); setCurrentStep(2);}} className="w-full py-4 bg-sky-900 text-white font-black text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2 uppercase tracking-widest">Avançar <ChevronRight className="w-5 h-5 text-amber-300" /></button>
          </div>
        )}

        {/* STEP 2: POSIÇÃO */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex rounded-2xl bg-slate-200/50 p-1.5 text-xs font-black border border-slate-200">
              <button type="button" onClick={() => setGrupoPosicao('principal')} className={`flex-1 py-2.5 rounded-xl transition-all ${grupoPosicao === 'principal' ? 'bg-sky-900 text-white shadow-md' : 'text-slate-600'}`}>Pontes (01-23)</button>
              <button type="button" onClick={() => setGrupoPosicao('remota')} className={`flex-1 py-2.5 rounded-xl transition-all ${grupoPosicao === 'remota' ? 'bg-sky-900 text-white shadow-md' : 'text-slate-600'}`}>Remotas (A01-A15)</button>
            </div>
            <div className="grid grid-cols-4 xs:grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2.5 p-4 bg-white rounded-3xl border-2 border-slate-50 max-h-[350px] overflow-y-auto shadow-inner place-items-center">
              {(grupoPosicao === 'principal' ? positions.principais : positions.remotas).map((pos) => (
                <button
                  key={pos}
                  type="button"
                  onClick={() => handleSelectPosition(pos)}
                  className={`flex items-center justify-center h-12 w-full max-w-[64px] rounded-xl text-sm font-mono font-black transition-all border-2 ${
                    managementMode === 'edit' ? 'border-amber-400 bg-amber-50 animate-pulse' :
                    managementMode === 'delete' ? 'border-rose-400 bg-rose-50 animate-pulse' :
                    pos === posicaoPatio ? 'bg-sky-700 border-sky-700 text-amber-300 shadow-md ring-4 ring-sky-100' :
                    'bg-slate-50 border-slate-200 text-slate-800 hover:border-sky-300'
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => { setManagementMode('select'); setCurrentStep(1); }} className="flex-1 py-4 bg-white border-2 border-slate-200 text-slate-700 font-black text-xs rounded-2xl flex items-center justify-center gap-1 uppercase tracking-widest"><ChevronLeft className="w-4 h-4" /> Voltar</button>
              <button type="button" onClick={() => { setManagementMode('select'); setCurrentStep(3); }} className="flex-1 py-4 bg-sky-900 text-white font-black text-xs rounded-2xl shadow-lg flex items-center justify-center gap-1.5 uppercase tracking-widest">Próximo <ChevronRight className="w-4 h-4 text-amber-300" /></button>
            </div>
          </div>
        )}

        {/* STEP 3: MATRÍCULA */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex gap-2 flex-wrap bg-white p-3 rounded-2xl border-2 border-slate-100">
              {prefixes.map((pref) => (
                <button key={pref} type="button" onClick={() => handleSelectPrefix(pref)} className={`px-4 py-2 font-black font-mono text-sm rounded-xl border-2 transition-all ${
                  managementMode === 'edit' ? 'bg-amber-50 border-amber-300 text-amber-900' :
                  managementMode === 'delete' ? 'bg-rose-50 border-rose-300 text-rose-900' :
                  'bg-sky-50 text-sky-950 border-sky-200 shadow-xs'
                }`}>+{pref}</button>
              ))}
            </div>
            <input type="text" required autoFocus autoCapitalize="characters" placeholder="MATRÍCULA..." value={matricula} onChange={(e) => setMatricula(e.target.value.toUpperCase())} className="w-full px-6 py-5 border-2 border-slate-200 focus:border-sky-600 rounded-3xl text-2xl font-mono font-black text-sky-950 bg-white shadow-sm tracking-[0.2em] focus:outline-none focus:ring-8 focus:ring-sky-50" />
            <div className="flex gap-3">
              <button type="button" onClick={() => {setManagementMode('select'); setCurrentStep(2);}} className="flex-1 py-4 bg-white border-2 border-slate-200 text-slate-700 font-black text-xs rounded-2xl flex items-center justify-center gap-1 uppercase tracking-widest"><ChevronLeft className="w-4 h-4" /> Voltar</button>
              <button type="button" onClick={() => { setManagementMode('select'); if(matricula.trim()) setCurrentStep(4); else alert('Informe a matrícula'); }} className="flex-1 py-4 bg-sky-900 text-white font-black text-xs rounded-2xl shadow-lg flex items-center justify-center gap-1.5 uppercase tracking-widest">Próximo <ChevronRight className="w-4 h-4 text-amber-300" /></button>
            </div>
          </div>
        )}

        {/* STEP 4: MODELO / EQUIPAMENTO */}
        {currentStep === 4 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="grid grid-cols-2 gap-3 p-1 max-h-[420px] overflow-y-auto scrollbar-none">
              {modelos.map((mod) => (
                <button key={mod} type="button" onClick={() => handleSelectModelo(mod)} className={`px-4 py-5 rounded-[20px] text-xs sm:text-sm font-black transition-all flex items-center justify-center text-center shadow-sm border-2 leading-tight ${
                    managementMode === 'edit' ? 'border-amber-400 bg-amber-50 text-amber-900' :
                    managementMode === 'delete' ? 'border-rose-400 bg-rose-50 text-rose-900' :
                    selectedModelo === mod ? 'border-sky-600 bg-sky-800 text-white shadow-lg ring-4 ring-sky-100' : 'bg-white text-slate-700 border-slate-100 hover:border-sky-200'
                  }`}>{mod}</button>
              ))}
            </div>
            <div className="flex gap-4 pt-2">
              <button type="button" onClick={() => { setManagementMode('select'); setCurrentStep(3); }} className="flex-1 py-4.5 bg-white border-2 border-slate-200 text-slate-700 font-black text-xs rounded-2xl flex items-center justify-center gap-1 uppercase tracking-widest active:bg-slate-50 transition-colors">VOLTAR</button>
              <button type="button" onClick={() => { setManagementMode('select'); setCurrentStep(5); }} className="flex-[1.5] py-4.5 bg-sky-900 text-white font-black text-xs rounded-2xl shadow-xl flex items-center justify-center gap-2 uppercase tracking-widest active:bg-sky-950 transition-all">Próximo <ChevronRight className="w-5 h-5 text-amber-400" /></button>
            </div>
          </div>
        )}

        {/* STEP 5: DESEMBARQUE HÍBRIDO */}
        {currentStep === 5 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setDesembarqueHibrido('Sim')} className={`py-6 rounded-3xl border-2 font-black text-sm flex flex-col items-center gap-2 transition-all ${desembarqueHibrido === 'Sim' ? 'bg-amber-500 border-amber-600 text-white shadow-lg ring-4 ring-amber-100' : 'bg-white border-slate-200 text-slate-400'}`}>
                <CheckCircle2 className="w-6 h-6" /> SIM (Híbrido)
              </button>
              <button type="button" onClick={() => setDesembarqueHibrido('Não')} className={`py-6 rounded-3xl border-2 font-black text-sm flex flex-col items-center gap-2 transition-all ${desembarqueHibrido === 'Não' ? 'bg-sky-800 border-sky-900 text-white shadow-lg ring-4 ring-sky-100' : 'bg-white border-slate-200 text-slate-400'}`}>
                <CheckCircle2 className="w-6 h-6" /> NÃO (Padrão)
              </button>
            </div>
            <div className="bg-white p-5 rounded-3xl border-2 border-slate-100 space-y-2 text-xs sm:text-sm font-mono shadow-inner uppercase font-black">
              <div className="flex justify-between"><span>Empresa:</span><span className="text-sky-900">{(companhias.find(c => String(c.id_companhia) === String(selectedCompanhiaId)) || companhias[0]).nome_companhia}</span></div>
              <div className="flex justify-between"><span>Posição:</span><span className="bg-amber-300 px-2 rounded-lg text-sky-950">BOX {posicaoPatio}</span></div>
              <div className="flex justify-between"><span>Matrícula:</span><span className="text-sky-900">{matricula}</span></div>
              {selectedModelo && <div className="flex justify-between"><span>Modelo:</span><span className="text-sky-800">{selectedModelo}</span></div>}
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => {setManagementMode('select'); setCurrentStep(4);}} className="flex-1 py-4 bg-white border-2 border-slate-200 text-slate-700 font-black text-xs rounded-2xl flex items-center justify-center gap-1 uppercase tracking-widest"><ChevronLeft className="w-4 h-4" /> Voltar</button>
              <button type="submit" className="flex-[2] py-5 bg-emerald-600 text-white font-black text-base rounded-2xl shadow-xl flex items-center justify-center gap-3 uppercase tracking-widest">Finalizar Registro</button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
