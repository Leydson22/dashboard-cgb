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
import { checkAndRunAutoBackup } from './services/dataManagementService';

import { LISTA_COMPANHIAS, MOCK_MOVIMENTACOES } from './data/mockData';
import { MovimentacaoAeronave, FiltrosDashboard, StatSummary, AuditLog } from './types';
import { getAuditLogs, addAuditLog, clearAuditLogs } from './services/auditLogService';
import { Smartphone, ListOrdered, BarChart3, ChevronRight, Plane, Download, LogOut, ShieldCheck } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';

const STORAGE_KEY = 'cgb_movimentacoes_data_v1';

type ActiveScreen = 'home' | 'cadastro' | 'pousos' | 'relatorios' | 'exportar' | 'seguranca';

export default function App() {
  // Navigation Screen State: Default initial landing screen is 'home'
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('home');

  // State for automatic report trigger (from Landings screen)
  const [autoReportMode, setAutoReportMode] = useState<'OPERATIONAL' | 'MANAGEMENT' | 'SHIFTHANDOVER' | 'AIRLINE' | null>(null);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => getAuditLogs());

  // Filters State
  const [filtros, setFiltros] = useState<FiltrosDashboard>({
    nome_companhia: 'TODAS',
    desembarque_hibrido: 'TODOS',
    dataInicio: '',
    dataFim: '',
    buscaMatricula: '',
  });

  // Load initial flight data from localStorage or mockData
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoAeronave[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (err) {
      console.error('Erro ao ler localStorage', err);
    }
    return MOCK_MOVIMENTACOES;
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(movimentacoes));
    } catch (err) {
      console.error('Erro ao salvar no localStorage', err);
    }
  }, [movimentacoes]);

  // Handle auto-backup check on start
  useEffect(() => {
    const runCheck = async () => {
      const savedConfig = localStorage.getItem('cgb_backup_config');
      const config = savedConfig ? JSON.parse(savedConfig) : { autoEnabled: true, frequency: 'WEEKLY' };
      await checkAndRunAutoBackup(config);
    };
    runCheck();
  }, []);

  // Logic: Computed values must come before states that depend on them

  // Filter Logic for Administrative Reports
  const movimentacoesFiltradas = useMemo(() => {
    return movimentacoes.filter((item) => {
      if (
        filtros.nome_companhia !== 'TODAS' &&
        item.nome_companhia.toLowerCase() !== filtros.nome_companhia.toLowerCase()
      ) {
        return false;
      }

      if (
        filtros.desembarque_hibrido !== 'TODOS' &&
        item.desembarque_hibrido !== filtros.desembarque_hibrido
      ) {
        return false;
      }

      if (
        filtros.buscaMatricula.trim() !== '' &&
        !item.matricula.toUpperCase().includes(filtros.buscaMatricula.trim().toUpperCase()) &&
        !(item.tipo_aeronave || '').toUpperCase().includes(filtros.buscaMatricula.trim().toUpperCase())
      ) {
        return false;
      }

      if (filtros.dataInicio && item.data_cadastro < filtros.dataInicio) {
        return false;
      }
      if (filtros.dataFim && item.data_cadastro > filtros.dataFim) {
        return false;
      }

      return true;
    });
  }, [movimentacoes, filtros]);

  // Default Sorting: Descending by date and time
  const movimentacoesOrdenadas = useMemo(() => {
    return [...movimentacoesFiltradas].sort((a, b) => {
      const dateTimeA = `${a.data_cadastro}T${a.horario_cadastro}`;
      const dateTimeB = `${b.data_cadastro}T${b.horario_cadastro}`;
      return dateTimeB.localeCompare(dateTimeA);
    });
  }, [movimentacoesFiltradas]);

  // KPI Calculations
  const stats: StatSummary = useMemo(() => {
    const totalMovimentacoes = movimentacoesOrdenadas.length;
    const totalHibrido = movimentacoesOrdenadas.filter((item) => item.desembarque_hibrido === 'Sim').length;
    const taxaHibrido = totalMovimentacoes > 0 ? (totalHibrido / totalMovimentacoes) * 100 : 0;

    const countsByCompany: Record<string, number> = {};
    movimentacoesOrdenadas.forEach((item) => {
      countsByCompany[item.nome_companhia] = (countsByCompany[item.nome_companhia] || 0) + 1;
    });

    let topCompany = 'Sem registros';
    let topCount = 0;

    Object.entries(countsByCompany).forEach(([company, count]) => {
      if (count > topCount) {
        topCount = count;
        topCompany = company;
      }
    });

    const topPercent = totalMovimentacoes > 0 ? (topCount / totalMovimentacoes) * 100 : 0;

    return {
      totalMovimentacoes,
      totalHibrido,
      taxaHibrido,
      topCompanhia: {
        nome: topCompany,
        total: topCount,
        percentual: topPercent,
      },
    };
  }, [movimentacoesOrdenadas]);

  // Modal States
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MovimentacaoAeronave | null>(null);
  const [deletingRecord, setDeletingRecord] = useState<MovimentacaoAeronave | null>(null);
  const [reportMode, setReportMode] = useState<'OPERATIONAL' | 'MANAGEMENT' | 'SHIFTHANDOVER' | 'AIRLINE'>('OPERATIONAL');

  // Dados contextuais para exportação (herdados de filtros de outras telas)
  const [exportContext, setExportContext] = useState<{
    data: MovimentacaoAeronave[];
    filters: { dataInicio: string; dataFim: string };
  }>({
    data: [],
    filters: { dataInicio: '', dataFim: '' }
  });

  // Dados finais que serão impressos no PDF
  const [printData, setPrintData] = useState<{
    data: MovimentacaoAeronave[];
    stats: StatSummary;
    period: string;
  }>({
    data: [],
    stats: stats,
    period: ''
  });

  const [selectedAirline, setSelectedAirline] = useState<string>('');

  const handleOpenExport = (data?: MovimentacaoAeronave[], filters?: { dataInicio: string; dataFim: string }, autoPrint?: 'OPERATIONAL' | 'MANAGEMENT' | 'SHIFTHANDOVER' | 'AIRLINE') => {
    const targetData = data || movimentacoesOrdenadas;
    const initialF = filters || { dataInicio: filtros.dataInicio, dataFim: filtros.dataFim };

    setExportContext({
      data: targetData,
      filters: initialF
    });

    // Reset print data for the new screen
    setPrintData({ data: targetData, stats: stats, period: '' });

    // Set auto trigger if needed
    if (autoPrint) {
      setAutoReportMode(autoPrint);
    } else {
      setAutoReportMode(null);
    }

    // Navegar para a nova tela de exportação
    setActiveScreen('exportar');
  };

  // Handlers
  const handleRefreshLogs = () => {
    setAuditLogs(getAuditLogs());
  };

  const handleClearLogs = () => {
    clearAuditLogs();
    setAuditLogs([]);
    addAuditLog({
      tipo: 'MANUTENCAO',
      nivel: 'AVISO',
      origem: 'AREA_ADM',
      usuarioDispositivo: 'Painel ADM',
      descricao: 'Histórico de logs de auditoria limpo pelo operador',
      detalhes: 'Base de dados de logs reinicializada.'
    });
    setAuditLogs(getAuditLogs());
  };

  // Add or Edit Record
  const handleSaveRecord = (
    recordData: Omit<MovimentacaoAeronave, 'id_registro'>,
    editId?: string
  ) => {
    const origemLog = activeScreen === 'cadastro' ? 'PATIO_MOBILE' : 'AREA_ADM';
    const dispositivo = activeScreen === 'cadastro' ? 'Celular / Pátio CGB' : 'Painel ADM';

    if (editId) {
      setMovimentacoes((prev) =>
        prev.map((item) =>
          item.id_registro === editId
            ? { ...item, ...recordData }
            : item
        )
      );

      // Audit Log for Edit
      addAuditLog({
        tipo: 'EDICAO',
        nivel: 'INFO',
        origem: origemLog,
        usuarioDispositivo: dispositivo,
        descricao: `Edição de dados do pouso`,
        detalhes: `Companhia: ${recordData.nome_companhia} • Desembarque Híbrido: ${recordData.desembarque_hibrido}`,
        matriculaAeronave: recordData.matricula,
      });
    } else {
      const now = new Date();
      const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
      const newId = `REG-${dateStr}-${String(Math.floor(Math.random() * 900) + 100)}`;
      const newRecord: MovimentacaoAeronave = {
        id_registro: newId,
        ...recordData,
      };
      setMovimentacoes((prev) => [newRecord, ...prev]);

      // Audit Log for Creation
      addAuditLog({
        tipo: 'CRIACAO',
        nivel: 'INFO',
        origem: origemLog,
        usuarioDispositivo: dispositivo,
        descricao: `Lançamento de pouso em CGB registrado`,
        detalhes: `Companhia: ${recordData.nome_companhia} • Desembarque Híbrido: ${recordData.desembarque_hibrido} • ID: ${newId}`,
        matriculaAeronave: recordData.matricula,
      });
    }

    setAuditLogs(getAuditLogs());
  };

  // Request Delete Record (Opens Modal)
  const handleRequestDelete = (record: MovimentacaoAeronave) => {
    setDeletingRecord(record);
  };

  // Confirm Delete Action
  const handleConfirmDelete = (id_registro: string) => {
    const target = movimentacoes.find((m) => m.id_registro === id_registro);
    setMovimentacoes((prev) => prev.filter((item) => item.id_registro !== id_registro));

    if (target) {
      addAuditLog({
        tipo: 'EXCLUSAO',
        nivel: 'AVISO',
        origem: activeScreen === 'cadastro' ? 'PATIO_MOBILE' : 'AREA_ADM',
        usuarioDispositivo: 'Operador / Auditoria',
        descricao: `Registro de pouso excluído após confirmação`,
        detalhes: `Companhia: ${target.nome_companhia} • Data/Hora: ${target.data_cadastro} ${target.horario_cadastro}`,
        matriculaAeronave: target.matricula,
      });
      setAuditLogs(getAuditLogs());
    }
  };

  // Toggle Hybrid Status
  const handleToggleHibrido = (id_registro: string) => {
    const target = movimentacoes.find((item) => item.id_registro === id_registro);
    if (!target) return;

    const nextStatus = target.desembarque_hibrido === 'Sim' ? 'Não' : 'Sim';
    const confirmChange = window.confirm(
      `Confirma a alteração do desembarque híbrido da aeronave ${target.matricula} para "${nextStatus}"?`
    );
    if (!confirmChange) return;

    setMovimentacoes((prev) =>
      prev.map((item) => {
        if (item.id_registro === id_registro) {
          return { ...item, desembarque_hibrido: nextStatus };
        }
        return item;
      })
    );

    addAuditLog({
      tipo: 'STATUS_HIBRIDO',
      nivel: 'INFO',
      origem: activeScreen === 'cadastro' ? 'PATIO_MOBILE' : 'AREA_ADM',
      usuarioDispositivo: 'Operador CGB',
      descricao: `Status de desembarque híbrido alterado para ${nextStatus}`,
      detalhes: `ID: ${id_registro}`,
      matriculaAeronave: target.matricula,
    });
    setAuditLogs(getAuditLogs());
  };

  // Open Edit Modal
  const handleOpenEdit = (record: MovimentacaoAeronave) => {
    setEditingRecord(record);
    setIsNewModalOpen(true);
  };

  const handleRefreshData = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setMovimentacoes(JSON.parse(saved));
      } catch (err) {
        console.error('Erro ao recarregar dados', err);
        setMovimentacoes([]);
      }
    } else {
      // Se não há dados salvos (após limpeza), deixa a lista vazia em vez de restaurar o mock
      setMovimentacoes([]);
    }

    // Recarrega logs e volta para a Home
    setAuditLogs(getAuditLogs());
    setActiveScreen('home');
  };

  // Handler to exit the app with confirmation
  const handleExitApp = async () => {
    const confirmExit = window.confirm("Deseja realmente sair do aplicativo?");
    if (confirmExit) {
      CapacitorApp.exitApp();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-sky-200 overflow-x-hidden">
      {/* Templates de Impressão (PDF) - Ficam invisíveis na tela, mas disponíveis para print/captura */}
      {/* LOCALIZADO NO TOPO PARA EVITAR ESPAÇOS EM BRANCO NA IMPRESSÃO */}
      <div id="report-container" className="absolute top-0 left-0 w-full opacity-0 pointer-events-none print:opacity-100 print:relative printable-content">
        {reportMode === 'OPERATIONAL' ? (
          <DailyOperationalReport
            movimentacoes={printData.data}
            stats={printData.stats}
            periodo={printData.period}
            title="Relatório Geral de Movimentações"
          />
        ) : reportMode === 'MANAGEMENT' ? (
          <ManagementReport
            movimentacoes={printData.data}
            stats={printData.stats}
            periodo={printData.period}
            title="Relatório Gerencial de Performance"
          />
        ) : reportMode === 'AIRLINE' ? (
          <AirlineSpecificReport
            movimentacoes={printData.data}
            stats={printData.stats}
            periodo={printData.period}
            airlineName={selectedAirline}
            title="Relatório Operacional por Empresa"
          />
        ) : (
          <ShiftHandoverReport
            movimentacoes={printData.data}
            stats={printData.stats}
            periodo={printData.period}
            title="Relatório de Passagem de Turno"
          />
        )}
      </div>

      {/* Top Navigation */}
      <Header
        activeScreen={activeScreen}
        onNavigate={(screen) => setActiveScreen(screen)}
      />

      {/* Main Container */}
      <main className={`flex-1 flex flex-col max-w-full w-full mx-auto overflow-x-hidden ${(activeScreen === 'exportar' || activeScreen === 'cadastro') ? 'p-0' : 'p-2 sm:p-6 space-y-6'}`}>
        {/* TELA INICIAL (3 OPÇÕES PRINCIPAIS DE MÓDULO) */}
        {activeScreen === 'home' && (
          <div className="flex-1 flex flex-col items-center justify-center my-auto py-8">
            <div className="max-w-md w-full space-y-5 text-center">
              <div>
                <div className="w-16 h-16 bg-sky-950 text-amber-300 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg border-2 border-sky-800">
                  <Plane className="w-8 h-8" />
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-sky-950 tracking-tight">
                  Selecione o Módulo
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Aeroporto Internacional de Cuiabá (CGB)
                </p>
              </div>

              {/* 3 Main Action Choice Buttons */}
              <div className="grid grid-cols-1 gap-3.5">
                {/* Option 1: Pátio */}
                <button
                  onClick={() => setActiveScreen('cadastro')}
                  className="group p-4 bg-white hover:bg-sky-50 rounded-2xl border-2 border-sky-600/30 hover:border-sky-600 shadow-md hover:shadow-xl transition-all cursor-pointer flex items-center justify-between gap-4 text-left active:scale-98"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 bg-sky-800 text-amber-300 rounded-xl group-hover:scale-110 transition-transform shrink-0 shadow-sm">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="font-extrabold text-sky-950 text-base sm:text-lg whitespace-nowrap">
                        Pátio
                      </h2>
                      <p className="text-xs text-slate-500 font-medium whitespace-nowrap">
                        Lançamento rápido no pátio CGB
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-sky-600 group-hover:translate-x-1 transition-transform shrink-0" />
                </button>

                {/* Option 2: Pousos */}
                <button
                  onClick={() => setActiveScreen('pousos')}
                  className="group p-4 bg-white hover:bg-amber-50 rounded-2xl border-2 border-amber-500/30 hover:border-amber-500 shadow-md hover:shadow-xl transition-all cursor-pointer flex items-center justify-between gap-4 text-left active:scale-98"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 bg-amber-400 text-sky-950 rounded-xl group-hover:scale-110 transition-transform shrink-0 shadow-sm">
                      <ListOrdered className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="font-extrabold text-slate-900 text-base sm:text-lg whitespace-nowrap">
                        Pousos
                      </h2>
                      <p className="text-xs text-slate-500 font-medium whitespace-nowrap">
                        Consulta e edição de pousos
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-amber-600 group-hover:translate-x-1 transition-transform shrink-0" />
                </button>

                {/* Option 3: Relatórios (PDF/CSV) */}
                <button
                  onClick={() => handleOpenExport()}
                  className="group p-4 bg-white hover:bg-emerald-50 rounded-2xl border-2 border-emerald-500/30 hover:border-emerald-500 shadow-md hover:shadow-xl transition-all cursor-pointer flex items-center justify-between gap-4 text-left active:scale-98"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 bg-emerald-700 text-emerald-100 rounded-xl group-hover:scale-110 transition-transform shrink-0 shadow-sm">
                      <Download className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="font-extrabold text-slate-900 text-base sm:text-lg whitespace-nowrap">
                        Relatórios
                      </h2>
                      <p className="text-xs text-slate-500 font-medium whitespace-nowrap">
                        PDFs profissionais e planilhas
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-emerald-600 group-hover:translate-x-1 transition-transform shrink-0" />
                </button>

                {/* Option 4: Segurança & Backup */}
                <button
                  onClick={() => setActiveScreen('seguranca')}
                  className="group p-4 bg-white hover:bg-sky-50 rounded-2xl border-2 border-sky-500/30 hover:border-sky-500 shadow-md hover:shadow-xl transition-all cursor-pointer flex items-center justify-between gap-4 text-left active:scale-98"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 bg-sky-700 text-white rounded-xl group-hover:scale-110 transition-transform shrink-0 shadow-sm">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="font-extrabold text-slate-900 text-base sm:text-lg whitespace-nowrap">
                        Segurança & Backup
                      </h2>
                      <p className="text-xs text-slate-500 font-medium whitespace-nowrap">
                        Salvar e restaurar dados locais
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-sky-600 group-hover:translate-x-1 transition-transform shrink-0" />
                </button>

                {/* Option 5: Sair do App (Apenas Native) */}
                {Capacitor.isNativePlatform() && (
                  <button
                    onClick={handleExitApp}
                    className="group p-4 bg-white hover:bg-rose-50 rounded-2xl border-2 border-rose-500/30 hover:border-rose-500 shadow-md hover:shadow-xl transition-all cursor-pointer flex items-center justify-between gap-4 text-left active:scale-98"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="p-3 bg-rose-700 text-rose-100 rounded-xl group-hover:scale-110 transition-transform shrink-0 shadow-sm">
                        <LogOut className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="font-extrabold text-slate-900 text-base sm:text-lg whitespace-nowrap">
                          Sair
                        </h2>
                        <p className="text-xs text-slate-500 font-medium whitespace-nowrap">
                          Fechar aplicativo com segurança
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-rose-600 group-hover:translate-x-1 transition-transform shrink-0" />
                  </button>
                )}

                {/* Option 5: Administração (Sempre por último) */}
                <button
                  onClick={() => setActiveScreen('relatorios')}
                  className="group p-4 bg-white hover:bg-slate-100 rounded-2xl border-2 border-slate-300 hover:border-slate-400 shadow-md hover:shadow-xl transition-all cursor-pointer flex items-center justify-between gap-4 text-left active:scale-98"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 bg-slate-800 text-sky-300 rounded-xl group-hover:scale-110 transition-transform shrink-0 shadow-sm">
                      <BarChart3 className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="font-extrabold text-slate-900 text-base sm:text-lg whitespace-nowrap">
                        Administração
                      </h2>
                      <p className="text-xs text-slate-500 font-medium whitespace-nowrap">
                        Relatórios, BI e auditoria
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:translate-x-1 transition-transform shrink-0" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TELA DE CADASTRO NO PÁTIO */}
        {activeScreen === 'cadastro' && (
          <MobileQuickEntry
            companhias={LISTA_COMPANHIAS}
            onSaveRecord={handleSaveRecord}
            onClose={() => setActiveScreen('home')}
          />
        )}

        {/* TELA DEDICADA: ÚLTIMOS POUSOS REGISTRADOS */}
        {activeScreen === 'pousos' && (
          <RecentLandingsScreen
            movimentacoes={movimentacoes}
            onEditRecord={handleOpenEdit}
            onToggleHibrido={handleToggleHibrido}
            onNavigateToCadastro={() => setActiveScreen('cadastro')}
            onClose={() => setActiveScreen('home')}
            onOpenExport={(data, filters, auto) => handleOpenExport(data, filters, auto)}
          />
        )}

        {/* TELA DE RELATÓRIOS ADMINISTRATIVOS & BANCO DE LOGS */}
        {activeScreen === 'relatorios' && (
          <div className="space-y-6">
            {/* Quick Filters */}
            <QuickFilters
              filtros={filtros}
              setFiltros={setFiltros}
              companhias={LISTA_COMPANHIAS}
              totalFiltrados={movimentacoesOrdenadas.length}
              totalGeral={movimentacoes.length}
            />

            {/* KPI Scorecards */}
            <KPIScorecards stats={stats} />

            {/* Visual Charts */}
            <VisualCharts movimentacoes={movimentacoesOrdenadas} />

            {/* Operational Data Table */}
            <OperationalTable
              movimentacoes={movimentacoesOrdenadas}
              onEditRecord={handleOpenEdit}
              onDeleteRecord={handleRequestDelete}
              onToggleHibrido={handleToggleHibrido}
              onOpenExport={(data, filters, auto) => handleOpenExport(data, filters, auto)}
            />

            {/* System Log Database & Maintenance Viewer */}
            <SystemLogViewer
              logs={auditLogs}
            />
          </div>
        )}

        {/* TELA DE EXPORTAÇÃO (ANTIGO MODAL) */}
        {activeScreen === 'exportar' && (
          <ExportModal
            isOpen={true}
            onClose={() => setActiveScreen('home')}
            movimentacoes={exportContext.data}
            stats={stats}
            onPreparePrint={(data, stats, mode, period, airline) => {
              setPrintData({ data, stats, period });
              setReportMode(mode);
              if (airline) setSelectedAirline(airline);
            }}
            initialFilters={exportContext.filters}
            companhias={LISTA_COMPANHIAS}
            autoTriggerMode={autoReportMode}
          />
        )}

        {/* TELA DE SEGURANÇA E BACKUP (NEW) */}
        {activeScreen === 'seguranca' && (
          <DataManagementPanel onDataRestored={handleRefreshData} />
        )}
      </main>

      {/* Modals */}
      <NewRegistrationModal
        isOpen={isNewModalOpen}
        onClose={() => {
          setIsNewModalOpen(false);
          setEditingRecord(null);
        }}
        onSave={handleSaveRecord}
        companhias={LISTA_COMPANHIAS}
        editingRecord={editingRecord}
      />

      <ConfirmDeleteModal
        isOpen={deletingRecord !== null}
        record={deletingRecord}
        onClose={() => setDeletingRecord(null)}
        onConfirm={handleConfirmDelete}
      />

      <DocumentationModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />
    </div>
  );
}
