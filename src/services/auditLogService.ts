import { AuditLog } from '../types';

const AUDIT_LOG_KEY = 'cgb_audit_logs_v1';

// Initial default logs so the log database has history on first run
const INITIAL_LOGS: AuditLog[] = [
  {
    id: 'LOG-1001',
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    dataHora: '22/07/2026 08:30:00',
    tipo: 'MANUTENCAO',
    nivel: 'INFO',
    origem: 'SISTEMA',
    usuarioDispositivo: 'Servidor / Banco Local CGB',
    descricao: 'Inicialização da base de logs do sistema de operações CGB',
    detalhes: 'Banco de dados de auditoria verificado e sincronizado com sucesso.'
  },
  {
    id: 'LOG-1002',
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    dataHora: '22/07/2026 10:15:22',
    tipo: 'CRIACAO',
    nivel: 'INFO',
    origem: 'PATIO_MOBILE',
    usuarioDispositivo: 'Dispositivo Pátio (Galaxy S8)',
    descricao: 'Lançamento de pouso em pátio registrado',
    detalhes: 'Empresa: LATAM Airlines • Desembarque Híbrido: Não',
    matriculaAeronave: 'PR-TYB'
  },
  {
    id: 'LOG-1003',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    dataHora: '22/07/2026 14:02:11',
    tipo: 'STATUS_HIBRIDO',
    nivel: 'AVISO',
    origem: 'AREA_ADM',
    usuarioDispositivo: 'Painel ADM / Auditoria',
    descricao: 'Status de desembarque híbrido alterado',
    detalhes: 'Matrícula PR-YQD alterada para Híbrido: SIM',
    matriculaAeronave: 'PR-YQD'
  }
];

export const getAuditLogs = (): AuditLog[] => {
  try {
    const saved = localStorage.getItem(AUDIT_LOG_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error('Erro ao carregar logs de auditoria:', err);
  }
  return INITIAL_LOGS;
};

export const addAuditLog = (
  entry: Omit<AuditLog, 'id' | 'timestamp' | 'dataHora'>
): AuditLog => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

  const newLog: AuditLog = {
    id: `LOG-${Date.now().toString().slice(-6)}`,
    timestamp: now.toISOString(),
    dataHora: formattedDate,
    ...entry,
  };

  try {
    const currentLogs = getAuditLogs();
    const updated = [newLog, ...currentLogs];
    localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Erro ao salvar log de auditoria:', err);
  }

  return newLog;
};

export const clearAuditLogs = (): void => {
  try {
    localStorage.removeItem(AUDIT_LOG_KEY);
  } catch (err) {
    console.error('Erro ao limpar logs:', err);
  }
};
