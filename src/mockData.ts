import { FlightRecord } from './types';

export const INITIAL_FLIGHT_RECORDS: FlightRecord[] = [
  // 22/07/2026 (Hoje)
  {
    id_registro: 'CGB-20260722-001',
    matricula: 'PR-YQD',
    id_companhia: 'AZU',
    nome_companhia: 'Azul',
    desembarque_hibrido: 'Não',
    horario_cadastro: '15:42:01',
    data_cadastro: '2026-07-22',
    observacoes: 'Pátio Principal - Posição 03',
  },
  {
    id_registro: 'CGB-20260722-002',
    matricula: 'PS-AEU',
    id_companhia: 'AZU',
    nome_companhia: 'Azul',
    desembarque_hibrido: 'Sim',
    horario_cadastro: '15:38:15',
    data_cadastro: '2026-07-22',
    observacoes: 'Posição remota - Desembarque misto por ônibus',
  },
  {
    id_registro: 'CGB-20260722-003',
    matricula: 'PT-MSL',
    id_companhia: 'MOD',
    nome_companhia: 'Modern Logistics',
    desembarque_hibrido: 'Não',
    horario_cadastro: '15:30:44',
    data_cadastro: '2026-07-22',
    observacoes: 'Terminal de Carga (TECA)',
  },
  {
    id_registro: 'CGB-20260722-004',
    matricula: 'PR-XTD',
    id_companhia: 'TAM',
    nome_companhia: 'Latam',
    desembarque_hibrido: 'Não',
    horario_cadastro: '15:22:10',
    data_cadastro: '2026-07-22',
    observacoes: 'Finger 02',
  },
  {
    id_registro: 'CGB-20260722-005',
    matricula: 'PR-GGV',
    id_companhia: 'GLO',
    nome_companhia: 'Gol',
    desembarque_hibrido: 'Sim',
    horario_cadastro: '15:15:30',
    data_cadastro: '2026-07-22',
    observacoes: 'Aeronave em posição de reabastecimento',
  },
  {
    id_registro: 'CGB-20260722-006',
    matricula: 'PP-PTA',
    id_companhia: 'VOE',
    nome_companhia: 'Voepass',
    desembarque_hibrido: 'Sim',
    horario_cadastro: '14:50:12',
    data_cadastro: '2026-07-22',
    observacoes: 'Voo regional Rondonópolis-CGB',
  },
  {
    id_registro: 'CGB-20260722-007',
    matricula: 'PR-SID',
    id_companhia: 'SID',
    nome_companhia: 'Sideral',
    desembarque_hibrido: 'Não',
    horario_cadastro: '14:10:05',
    data_cadastro: '2026-07-22',
    observacoes: 'Cargueiro noturno/tarde',
  },
  {
    id_registro: 'CGB-20260722-008',
    matricula: 'PR-TTL',
    id_companhia: 'TTL',
    nome_companhia: 'Total',
    desembarque_hibrido: 'Não',
    horario_cadastro: '13:45:20',
    data_cadastro: '2026-07-22',
  },
  {
    id_registro: 'CGB-20260722-009',
    matricula: 'PS-AZA',
    id_companhia: 'AZU',
    nome_companhia: 'Azul',
    desembarque_hibrido: 'Não',
    horario_cadastro: '12:30:11',
    data_cadastro: '2026-07-22',
  },
  {
    id_registro: 'CGB-20260722-010',
    matricula: 'PR-TYB',
    id_companhia: 'TAM',
    nome_companhia: 'Latam',
    desembarque_hibrido: 'Sim',
    horario_cadastro: '11:15:00',
    data_cadastro: '2026-07-22',
  },

  // 21/07/2026
  {
    id_registro: 'CGB-20260721-001',
    matricula: 'PR-GOH',
    id_companhia: 'GLO',
    nome_companhia: 'Gol',
    desembarque_hibrido: 'Não',
    horario_cadastro: '22:10:00',
    data_cadastro: '2026-07-21',
  },
  {
    id_registro: 'CGB-20260721-002',
    matricula: 'PS-AZC',
    id_companhia: 'AZU',
    nome_companhia: 'Azul',
    desembarque_hibrido: 'Sim',
    horario_cadastro: '20:45:30',
    data_cadastro: '2026-07-21',
  },
  {
    id_registro: 'CGB-20260721-003',
    matricula: 'PR-MYA',
    id_companhia: 'TAM',
    nome_companhia: 'Latam',
    desembarque_hibrido: 'Não',
    horario_cadastro: '19:15:22',
    data_cadastro: '2026-07-21',
  },
  {
    id_registro: 'CGB-20260721-004',
    matricula: 'PP-PTB',
    id_companhia: 'VOE',
    nome_companhia: 'Voepass',
    desembarque_hibrido: 'Sim',
    horario_cadastro: '18:02:10',
    data_cadastro: '2026-07-21',
  },
  {
    id_registro: 'CGB-20260721-005',
    matricula: 'PR-YQE',
    id_companhia: 'AZU',
    nome_companhia: 'Azul',
    desembarque_hibrido: 'Não',
    horario_cadastro: '16:50:40',
    data_cadastro: '2026-07-21',
  },
  {
    id_registro: 'CGB-20260721-006',
    matricula: 'PT-MSM',
    id_companhia: 'MOD',
    nome_companhia: 'Modern Logistics',
    desembarque_hibrido: 'Não',
    horario_cadastro: '14:20:00',
    data_cadastro: '2026-07-21',
  },

  // 20/07/2026
  {
    id_registro: 'CGB-20260720-001',
    matricula: 'PR-XTE',
    id_companhia: 'TAM',
    nome_companhia: 'Latam',
    desembarque_hibrido: 'Não',
    horario_cadastro: '21:30:15',
    data_cadastro: '2026-07-20',
  },
  {
    id_registro: 'CGB-20260720-002',
    matricula: 'PS-AZD',
    id_companhia: 'AZU',
    nome_companhia: 'Azul',
    desembarque_hibrido: 'Sim',
    horario_cadastro: '18:10:00',
    data_cadastro: '2026-07-20',
  },
  {
    id_registro: 'CGB-20260720-003',
    matricula: 'PR-GGI',
    id_companhia: 'GLO',
    nome_companhia: 'Gol',
    desembarque_hibrido: 'Sim',
    horario_cadastro: '16:05:45',
    data_cadastro: '2026-07-20',
  },
  {
    id_registro: 'CGB-20260720-004',
    matricula: 'PR-SIE',
    id_companhia: 'SID',
    nome_companhia: 'Sideral',
    desembarque_hibrido: 'Não',
    horario_cadastro: '11:20:30',
    data_cadastro: '2026-07-20',
  },

  // 19/07/2026
  {
    id_registro: 'CGB-20260719-001',
    matricula: 'PS-AEE',
    id_companhia: 'AZU',
    nome_companhia: 'Azul',
    desembarque_hibrido: 'Não',
    horario_cadastro: '20:12:00',
    data_cadastro: '2026-07-19',
  },
  {
    id_registro: 'CGB-20260719-002',
    matricula: 'PR-MYB',
    id_companhia: 'TAM',
    nome_companhia: 'Latam',
    desembarque_hibrido: 'Sim',
    horario_cadastro: '17:40:10',
    data_cadastro: '2026-07-19',
  },
  {
    id_registro: 'CGB-20260719-003',
    matricula: 'PP-PTC',
    id_companhia: 'VOE',
    nome_companhia: 'Voepass',
    desembarque_hibrido: 'Sim',
    horario_cadastro: '15:10:05',
    data_cadastro: '2026-07-19',
  },
  {
    id_registro: 'CGB-20260719-004',
    matricula: 'PR-GGJ',
    id_companhia: 'GLO',
    nome_companhia: 'Gol',
    desembarque_hibrido: 'Não',
    horario_cadastro: '12:00:00',
    data_cadastro: '2026-07-19',
  },

  // 18/07/2026
  {
    id_registro: 'CGB-20260718-001',
    matricula: 'PR-YQF',
    id_companhia: 'AZU',
    nome_companhia: 'Azul',
    desembarque_hibrido: 'Sim',
    horario_cadastro: '19:30:00',
    data_cadastro: '2026-07-18',
  },
  {
    id_registro: 'CGB-20260718-002',
    matricula: 'PR-TTM',
    id_companhia: 'TTL',
    nome_companhia: 'Total',
    desembarque_hibrido: 'Não',
    horario_cadastro: '14:22:15',
    data_cadastro: '2026-07-18',
  },
  {
    id_registro: 'CGB-20260718-003',
    matricula: 'PR-XTF',
    id_companhia: 'TAM',
    nome_companhia: 'Latam',
    desembarque_hibrido: 'Não',
    horario_cadastro: '10:15:40',
    data_cadastro: '2026-07-18',
  },

  // 17/07/2026
  {
    id_registro: 'CGB-20260717-001',
    matricula: 'PS-AEF',
    id_companhia: 'AZU',
    nome_companhia: 'Azul',
    desembarque_hibrido: 'Não',
    horario_cadastro: '21:00:10',
    data_cadastro: '2026-07-17',
  },
  {
    id_registro: 'CGB-20260717-002',
    matricula: 'PR-GGK',
    id_companhia: 'GLO',
    nome_companhia: 'Gol',
    desembarque_hibrido: 'Sim',
    horario_cadastro: '18:35:00',
    data_cadastro: '2026-07-17',
  },
  {
    id_registro: 'CGB-20260717-003',
    matricula: 'PT-MSN',
    id_companhia: 'MOD',
    nome_companhia: 'Modern Logistics',
    desembarque_hibrido: 'Não',
    horario_cadastro: '13:05:50',
    data_cadastro: '2026-07-17',
  }
];

const LOCAL_STORAGE_KEY = 'cgb_airport_dashboard_records_v1';

export function getStoredRecords(): FlightRecord[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load records from localStorage', e);
  }
  return INITIAL_FLIGHT_RECORDS;
}

export function saveRecordsToStorage(records: FlightRecord[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.error('Failed to save records to localStorage', e);
  }
}

export function resetRecordsToInitial(): FlightRecord[] {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  return INITIAL_FLIGHT_RECORDS;
}
