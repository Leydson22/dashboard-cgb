import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { QuickFilters } from './components/QuickFilters';
import { KPIScorecards } from './components/KPIScorecards';
import { VisualCharts } from './components/VisualCharts';
import { OperationalTable } from './components/OperationalTable';
import { MobileQuickEntry } from './components/MobileQuickEntry';
import { RecentLandingsScreen } from './components/RecentLandingsScreen';
import { NewRegistrationModal } from './components/NewRegistrationModal';
import { DocumentationModal } from './components/DocumentationModal';
import { ExportModal } from './components/ExportModal';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal';
import { SystemLogViewer } from './components/SystemLogViewer';
import { DataManagementPanel } from './components/DataManagementPanel';
import { DailyOperationalReport, ManagementReport, ShiftHandoverReport, AirlineSpecificReport } from './components/ReportTemplates';
import { checkAndRunAutoBackup, saveInternalSnapshot } from './services/dataManagementService';
import { getAirlines } from './services/airlineService';
import { MOCK_MOVIMENTACOES } from './data/mockData';
import { MovimentacaoAeronave, FiltrosDashboard, StatSummary, AuditLog, CompanhiaAerea } from './types';
import { getAuditLogs, addAuditLog, clearAuditLogs } from './services/auditLogService';
import { Smartphone, ListOrdered, BarChart3, ChevronRight, Plane, Download, LogOut, ShieldCheck } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';

const STORAGE_KEY = 'cgb_movimentacoes_data_v1';
type ActiveScreen = 'home' | 'cadastro' | 'pousos' | 'relatorios' | 'exportar' | 'seguranca';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('home');
  const [autoReportMode, setAutoReportMode] = useState<'OPERATIONAL' | 'MANAGEMENT' | 'SHIFTHANDOVER' | 'AIRLINE' | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => getAuditLogs());
  const [companhias, setCompanhias] = useState<CompanhiaAerea[]>(() => getAirlines());
  const [filtros, setFiltros] = useState<FiltrosDashboard>({ nome_companhia: 'TODAS', desembarque_hibrido: 'TODOS', dataInicio: '', dataFim: '', buscaMatricula: '' });

  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoAeronave[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (err) {}
    return MOCK_MOVIMENTACOES;
  });

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(movimentacoes)); }, [movimentacoes]);

  useEffect(() => {
    const run = async () => {
      const saved = localStorage.getItem('cgb_backup_config');
      const config = saved ? JSON.parse(saved) : { autoEnabled: true, frequency: 'WEEKLY' };
      await checkAndRunAutoBackup(config);
    };
    run();
  }, []);

  useEffect(() => {
    if (activeScreen === 'cadastro' || activeScreen === 'relatorios') {
      setCompanhias(getAirlines());
    }
  }, [activeScreen]);

  const movimentacoesOrdenadas = useMemo(() => {
    const filtradas = movimentacoes.filter((item) => {
      if (filtros.nome_companhia === 'SOMENTE_AIRLINES') {
        const nonAirlines = ['outros', 'forças armadas brasileiras'];
        if (nonAirlines.includes(item.nome_companhia.toLowerCase())) return false;
      } else if (filtros.nome_companhia !== 'TODAS' && item.nome_companhia.toLowerCase() !== filtros.nome_companhia.toLowerCase()) {
        return false;
      }

      if (filtros.desembarque_hibrido !== 'TODOS' && item.desembarque_hibrido !== filtros.desembarque_hibrido) return false;
      if (filtros.buscaMatricula.trim() && !item.matricula.toUpperCase().includes(filtros.buscaMatricula.toUpperCase())) return false;
      if (filtros.dataInicio && item.data_cadastro < filtros.dataInicio) return false;
      if (filtros.dataFim && item.data_cadastro > filtros.dataFim) return false;
      return true;
    });
    return [...filtradas].sort((a, b) => `${b.data_cadastro}T${b.horario_cadastro}`.localeCompare(`${a.data_cadastro}T${a.horario_cadastro}`));
  }, [movimentacoes, filtros]);

  const stats: StatSummary = useMemo(() => {
    const total = movimentacoesOrdenadas.length;
    const hibrido = movimentacoesOrdenadas.filter(i => i.desembarque_hibrido === 'Sim').length;
    const counts: any = {};
    movimentacoesOrdenadas.forEach(i => { counts[i.nome_companhia] = (counts[i.nome_companhia] || 0) + 1; });
    let top = 'N/A'; let topC = 0;
    Object.entries(counts).forEach(([n, c]: any) => { if (c > topC) { topC = c; top = n; } });
    return { totalMovimentacoes: total, totalHibrido: hibrido, taxaHibrido: total > 0 ? (hibrido/total)*100 : 0, topCompanhia: { nome: top, total: topC, percentual: total > 0 ? (topC/total)*100 : 0 } };
  }, [movimentacoesOrdenadas]);

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MovimentacaoAeronave | null>(null);
  const [deletingRecord, setDeletingRecord] = useState<MovimentacaoAeronave | null>(null);
  const [reportMode, setReportMode] = useState<'OPERATIONAL' | 'MANAGEMENT' | 'SHIFTHANDOVER' | 'AIRLINE'>('OPERATIONAL');
  const [exportContext, setExportContext] = useState<any>({ data: [], filters: { dataInicio: '', dataFim: '' } });
  const [printData, setPrintData] = useState<any>({ data: [], stats: { totalMovimentacoes: 0, totalHibrido: 0, taxaHibrido: 0, topCompanhia: { nome: '', total: 0, percentual: 0 } }, period: '' });
  const [selectedAirline, setSelectedAirline] = useState('');

  const handleOpenExport = (data?: any, filters?: any, auto?: any) => {
    const d = data || movimentacoesOrdenadas;
    setExportContext({ data: d, filters: filters || { dataInicio: filtros.dataInicio, dataFim: filtros.dataFim } });
    setPrintData({ data: d, stats: stats, period: '' });
    setAutoReportMode(auto || null);
    setActiveScreen('exportar');
  };

  const handleSaveRecord = (data: any, id?: string) => {
    if (id) setMovimentacoes(prev => prev.map(i => i.id_registro === id ? { ...i, ...data } : i));
    else setMovimentacoes(prev => [{ id_registro: `REG-${Date.now()}`, ...data }, ...prev]);
    setAuditLogs(getAuditLogs());
  };

  const handleToggleHibrido = (id_registro: string) => {
    const target = movimentacoes.find((item) => item.id_registro === id_registro);
    if (!target) return;
    const nextStatus = target.desembarque_hibrido === 'Sim' ? 'Não' : 'Sim';
    if (!window.confirm(`Mudar híbrido da aeronave ${target.matricula} para "${nextStatus}"?`)) return;
    setMovimentacoes((prev) => prev.map((item) => item.id_registro === id_registro ? { ...item, desembarque_hibrido: nextStatus } : item));
    addAuditLog({
      tipo: 'STATUS_HIBRIDO',
      nivel: 'INFO',
      origem: 'AREA_ADM',
      usuarioDispositivo: 'Painel ADM',
      descricao: `Status híbrido alterado para ${nextStatus}`,
      matriculaAeronave: target.matricula
    });
    setAuditLogs(getAuditLogs());
  };

  const handleRefreshData = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    setMovimentacoes(saved ? JSON.parse(saved) : []);
    setAuditLogs(getAuditLogs());
    setCompanhias(getAirlines());
    setActiveScreen('home');
  };

  const handleExitApp = async () => {
    if (window.confirm("Sair?")) {
      if (window.confirm("Deseja realizar um ponto de restauração antes de fechar?")) {
        await saveInternalSnapshot(`Backup Preventivo ${new Date().toLocaleString()}`);
      }
      CapacitorApp.exitApp();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 selection:bg-sky-200 overflow-x-hidden">
      <div id="report-container" className="absolute top-0 left-0 w-full opacity-0 pointer-events-none print:opacity-100 print:relative printable-content">
        {reportMode === 'OPERATIONAL' ? <DailyOperationalReport movimentacoes={printData.data} stats={printData.stats} periodo={printData.period} title="Relatório Geral" /> :
         reportMode === 'MANAGEMENT' ? <ManagementReport movimentacoes={printData.data} stats={printData.stats} periodo={printData.period} title="Relatório BI" /> :
         reportMode === 'AIRLINE' ? <AirlineSpecificReport movimentacoes={printData.data} stats={printData.stats} periodo={printData.period} airlineName={selectedAirline} title="Relatório Empresa" /> :
         <ShiftHandoverReport movimentacoes={printData.data} stats={printData.stats} periodo={printData.period} title="Passagem Turno" />}
      </div>

      <Header activeScreen={activeScreen} onNavigate={setActiveScreen} />

      <main className={`flex-1 flex flex-col max-w-full w-full mx-auto overflow-x-hidden ${(activeScreen === 'exportar' || activeScreen === 'cadastro') ? 'p-0' : 'p-2 sm:p-6 space-y-6'}`}>
        {activeScreen === 'home' && (
          <div className="flex-1 flex flex-col items-center justify-center my-auto py-8 relative">
            <div className="absolute top-4 right-4 z-50">
              <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest opacity-70">v1.1.2</span>
            </div>
            <div className="max-w-md w-full space-y-5 text-center px-4 text-nowrap">
              <div className="w-16 h-16 bg-sky-950 text-amber-300 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg border-2 border-sky-800"><Plane className="w-8 h-8" /></div>
              <h1 className="text-xl sm:text-2xl font-black text-sky-950 tracking-tight uppercase">Módulo Operacional</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Aeroporto de Cuiabá (CGB)</p>
              <div className="grid grid-cols-1 gap-3">
                <button onClick={() => setActiveScreen('cadastro')} className="group p-4 bg-white hover:bg-sky-50 rounded-2xl border-2 border-sky-100 hover:border-sky-600 shadow-sm transition-all flex items-center justify-between active:scale-98">
                  <div className="flex items-center gap-3.5"><div className="p-3 bg-sky-800 text-white rounded-xl shadow-md"><Smartphone className="w-6 h-6" /></div><div className="text-left"><h2 className="font-black text-sky-950 text-base uppercase">Pátio</h2><p className="text-[10px] text-slate-400 font-bold uppercase">Lançamento de Pouso</p></div></div>
                  <ChevronRight className="w-5 h-5 text-sky-300 group-hover:translate-x-1" />
                </button>
                <button onClick={() => setActiveScreen('pousos')} className="group p-4 bg-white hover:bg-amber-50 rounded-2xl border-2 border-amber-100 hover:border-amber-500 shadow-sm transition-all flex items-center justify-between active:scale-98">
                  <div className="flex items-center gap-3.5"><div className="p-3 bg-amber-400 text-sky-950 rounded-xl shadow-md"><ListOrdered className="w-6 h-6" /></div><div className="text-left"><h2 className="font-black text-slate-900 text-base uppercase">Pousos</h2><p className="text-[10px] text-slate-400 font-bold uppercase">Consulta e Edição</p></div></div>
                  <ChevronRight className="w-5 h-5 text-amber-300 group-hover:translate-x-1" />
                </button>
                <button onClick={() => setActiveScreen('seguranca')} className="group p-4 bg-white hover:bg-sky-50 rounded-2xl border-2 border-sky-100 hover:border-sky-600 shadow-sm transition-all flex items-center justify-between active:scale-98">
                  <div className="flex items-center gap-3.5"><div className="p-3 bg-sky-700 text-white rounded-xl shadow-md"><ShieldCheck className="w-6 h-6" /></div><div className="text-left"><h2 className="font-black text-slate-900 text-base uppercase">Segurança</h2><p className="text-[10px] text-slate-400 font-bold uppercase">Backup e Restauração</p></div></div>
                  <ChevronRight className="w-5 h-5 text-sky-300 group-hover:translate-x-1" />
                </button>
                <button onClick={() => setActiveScreen('relatorios')} className="group p-4 bg-white hover:bg-slate-50 rounded-2xl border-2 border-slate-100 hover:border-slate-400 shadow-sm transition-all flex items-center justify-between active:scale-98">
                  <div className="flex items-center gap-3.5"><div className="p-3 bg-slate-800 text-white rounded-xl shadow-md"><BarChart3 className="w-6 h-6" /></div><div className="text-left"><h2 className="font-black text-slate-900 text-base uppercase">Administração</h2><p className="text-[10px] text-slate-400 font-bold uppercase">BI e Auditoria</p></div></div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1" />
                </button>
                {Capacitor.isNativePlatform() && (
                  <button onClick={handleExitApp} className="group p-4 bg-white hover:bg-rose-50 rounded-2xl border-2 border-rose-100 hover:border-rose-600 shadow-sm transition-all flex items-center justify-between active:scale-98">
                    <div className="flex items-center gap-3.5"><div className="p-3 bg-rose-600 text-white rounded-xl shadow-md"><LogOut className="w-6 h-6" /></div><div className="text-left"><h2 className="font-black text-slate-900 text-base uppercase leading-none">Sair</h2><p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Fechar com segurança</p></div></div>
                    <ChevronRight className="w-5 h-5 text-rose-300 group-hover:translate-x-1" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {activeScreen === 'cadastro' && <MobileQuickEntry companhias={companhias} onSaveRecord={handleSaveRecord} onClose={() => setActiveScreen('home')} />}
        {activeScreen === 'pousos' && <RecentLandingsScreen movimentacoes={movimentacoes} onEditRecord={(r) => { setEditingRecord(r); setIsNewModalOpen(true); }} onToggleHibrido={handleToggleHibrido} onNavigateToCadastro={() => setActiveScreen('cadastro')} onClose={() => setActiveScreen('home')} onOpenExport={handleOpenExport} />}
        {activeScreen === 'relatorios' && (
          <div className="space-y-6">
            <QuickFilters filtros={filtros} setFiltros={setFiltros} companhias={companhias} totalFiltrados={movimentacoesOrdenadas.length} totalGeral={movimentacoes.length} />
            <KPIScorecards stats={stats} />
            <VisualCharts movimentacoes={movimentacoesOrdenadas} />
            <OperationalTable movimentacoes={movimentacoesOrdenadas} onEditRecord={(r) => { setEditingRecord(r); setIsNewModalOpen(true); }} onDeleteRecord={setDeletingRecord} onToggleHibrido={handleToggleHibrido} onOpenExport={handleOpenExport} />
            <SystemLogViewer logs={auditLogs} />
          </div>
        )}
        {activeScreen === 'exportar' && <ExportModal isOpen={true} onClose={() => setActiveScreen('home')} movimentacoes={exportContext.data} stats={stats} onPreparePrint={(data, stats, mode, period, airline) => { setPrintData({ data, stats, period }); setReportMode(mode); if (airline) setSelectedAirline(airline); }} initialFilters={exportContext.filters} companhias={companhias} autoTriggerMode={autoReportMode} />}
        {activeScreen === 'seguranca' && <DataManagementPanel onDataRestored={handleRefreshData} />}
      </main>

      <NewRegistrationModal isOpen={isNewModalOpen} onClose={() => { setIsNewModalOpen(false); setEditingRecord(null); }} onSave={handleSaveRecord} companhias={companhias} editingRecord={editingRecord} />
      <ConfirmDeleteModal isOpen={deletingRecord !== null} record={deletingRecord} onClose={() => setDeletingRecord(null)} onConfirm={(id) => { const t = movimentacoes.find(m => m.id_registro === id); setMovimentacoes(prev => prev.filter(i => i.id_registro !== id)); if(t) addAuditLog({ tipo: 'EXCLUSAO', nivel: 'AVISO', origem: 'AREA_ADM', usuarioDispositivo: 'ADM', descricao: `Exclusão`, matriculaAeronave: t.matricula }); setAuditLogs(getAuditLogs()); }} />
      <DocumentationModal isOpen={false} onClose={() => {}} />
    </div>
  );
}
