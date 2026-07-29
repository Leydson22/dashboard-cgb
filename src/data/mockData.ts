import { CompanhiaAerea, MovimentacaoAeronave } from '../types';

export const LISTA_COMPANHIAS: CompanhiaAerea[] = [
  { id_companhia: 1, nome_companhia: 'Azul', icao: 'AZU', iata: 'AD' },
  { id_companhia: 2, nome_companhia: 'LATAM', icao: 'TAM', iata: 'LA' },
  { id_companhia: 3, nome_companhia: 'GOL', icao: 'GLO', iata: 'G3' },
  { id_companhia: 4, nome_companhia: 'Azul Conecta', icao: 'ACN', iata: 'C2' },
  { id_companhia: 5, nome_companhia: 'Mercado Livre (Meli)', icao: 'MELI', iata: 'ML' },
  { id_companhia: 6, nome_companhia: 'Voepass', icao: 'PTB', iata: '2Z' },
  { id_companhia: 7, nome_companhia: 'Total', icao: 'TTL', iata: 'L1' },
  { id_companhia: 8, nome_companhia: 'Modern Logistics', icao: 'MWM', iata: 'WD' },
  { id_companhia: 9, nome_companhia: 'Sideral', icao: 'SID', iata: '0S' },
  { id_companhia: 10, nome_companhia: 'Outros', icao: 'OUT', iata: 'XX' },
];

export const MOCK_MOVIMENTACOES: MovimentacaoAeronave[] = [
  {
    id_registro: 'REG-20260722-001',
    matricula: 'PR-YQD',
    id_companhia: 1,
    nome_companhia: 'Azul',
    desembarque_hibrido: 'Não',
    posicao_patio: '03',
    horario_cadastro: '15:42:01',
    data_cadastro: '2026-07-22',
    tipo_aeronave: 'Airbus A320neo',
    status_edicao: 'Auditado'
  },
  {
    id_registro: 'REG-20260722-002',
    matricula: 'PS-AEU',
    id_companhia: 1,
    nome_companhia: 'Azul',
    desembarque_hibrido: 'Sim',
    posicao_patio: 'A02',
    horario_cadastro: '15:38:15',
    data_cadastro: '2026-07-22',
    tipo_aeronave: 'Embraer E195-E2',
    status_edicao: 'Pendente'
  },
  {
    id_registro: 'REG-20260722-003',
    matricula: 'PT-MSL',
    id_companhia: 8,
    nome_companhia: 'Modern Logistics',
    desembarque_hibrido: 'Não',
    posicao_patio: '12',
    horario_cadastro: '15:30:44',
    data_cadastro: '2026-07-22',
    tipo_aeronave: 'Boeing 737-800BCF',
    status_edicao: 'Auditado'
  },
  {
    id_registro: 'REG-20260722-004',
    matricula: 'PR-XTD',
    id_companhia: 2,
    nome_companhia: 'LATAM',
    desembarque_hibrido: 'Não',
    posicao_patio: '05',
    horario_cadastro: '15:22:10',
    data_cadastro: '2026-07-22',
    tipo_aeronave: 'Airbus A321-200',
    status_edicao: 'Auditado'
  },
  {
    id_registro: 'REG-20260722-005',
    matricula: 'PR-GGV',
    id_companhia: 3,
    nome_companhia: 'GOL',
    desembarque_hibrido: 'Sim',
    posicao_patio: 'A05',
    horario_cadastro: '15:15:30',
    data_cadastro: '2026-07-22',
    tipo_aeronave: 'Boeing 737 MAX 8',
    status_edicao: 'Auditado'
  },
  {
    id_registro: 'REG-20260722-006',
    matricula: 'PP-PTB',
    id_companhia: 6,
    nome_companhia: 'Voepass',
    desembarque_hibrido: 'Sim',
    posicao_patio: 'A08',
    horario_cadastro: '14:50:12',
    data_cadastro: '2026-07-22',
    tipo_aeronave: 'ATR 72-600',
    status_edicao: 'Auditado'
  },
  {
    id_registro: 'REG-20260722-007',
    matricula: 'PR-SID',
    id_companhia: 9,
    nome_companhia: 'Sideral',
    desembarque_hibrido: 'Não',
    posicao_patio: '18',
    horario_cadastro: '14:10:05',
    data_cadastro: '2026-07-22',
    tipo_aeronave: 'Boeing 737-400F',
    status_edicao: 'Auditado'
  },
  {
    id_registro: 'REG-20260722-008',
    matricula: 'PS-AZB',
    id_companhia: 1,
    nome_companhia: 'Azul',
    desembarque_hibrido: 'Sim',
    posicao_patio: 'A01',
    horario_cadastro: '13:45:00',
    data_cadastro: '2026-07-22',
    tipo_aeronave: 'Airbus A320neo',
    status_edicao: 'Auditado'
  },
  {
    id_registro: 'REG-20260721-001',
    matricula: 'PR-XTE',
    id_companhia: 2,
    nome_companhia: 'LATAM',
    desembarque_hibrido: 'Não',
    horario_cadastro: '21:15:00',
    data_cadastro: '2026-07-21',
    tipo_aeronave: 'Airbus A320-200',
    status_edicao: 'Auditado'
  },
  {
    id_registro: 'REG-20260721-002',
    matricula: 'PR-GGU',
    id_companhia: 3,
    nome_companhia: 'GOL',
    desembarque_hibrido: 'Sim',
    horario_cadastro: '20:40:22',
    data_cadastro: '2026-07-21',
    tipo_aeronave: 'Boeing 737-800',
    status_edicao: 'Auditado'
  },
  {
    id_registro: 'REG-20260721-003',
    matricula: 'PS-AEC',
    id_companhia: 1,
    nome_companhia: 'Azul',
    desembarque_hibrido: 'Sim',
    horario_cadastro: '18:10:00',
    data_cadastro: '2026-07-21',
    tipo_aeronave: 'Embraer E195-E2',
    status_edicao: 'Auditado'
  },
  {
    id_registro: 'REG-20260721-004',
    matricula: 'PR-TTL',
    id_companhia: 7,
    nome_companhia: 'Total',
    desembarque_hibrido: 'Não',
    horario_cadastro: '16:05:12',
    data_cadastro: '2026-07-21',
    tipo_aeronave: 'ATR 42-500',
    status_edicao: 'Auditado'
  },
  {
    id_registro: 'REG-20260720-001',
    matricula: 'PR-YQA',
    id_companhia: 1,
    nome_companhia: 'Azul',
    desembarque_hibrido: 'Não',
    horario_cadastro: '19:30:10',
    data_cadastro: '2026-07-20',
    tipo_aeronave: 'Airbus A320neo',
    status_edicao: 'Auditado'
  },
  {
    id_registro: 'REG-20260720-002',
    matricula: 'PR-XTA',
    id_companhia: 2,
    nome_companhia: 'LATAM',
    desembarque_hibrido: 'Sim',
    horario_cadastro: '17:20:45',
    data_cadastro: '2026-07-20',
    tipo_aeronave: 'Airbus A320-200',
    status_edicao: 'Auditado'
  },
  {
    id_registro: 'REG-20260720-003',
    matricula: 'PR-GGT',
    id_companhia: 3,
    nome_companhia: 'GOL',
    desembarque_hibrido: 'Não',
    horario_cadastro: '12:10:00',
    data_cadastro: '2026-07-20',
    tipo_aeronave: 'Boeing 737-800',
    status_edicao: 'Auditado'
  },
  {
    id_registro: 'REG-20260719-001',
    matricula: 'PS-AED',
    id_companhia: 1,
    nome_companhia: 'Azul',
    desembarque_hibrido: 'Sim',
    horario_cadastro: '14:22:11',
    data_cadastro: '2026-07-19',
    tipo_aeronave: 'Embraer E195-E2',
    status_edicao: 'Auditado'
  },
  {
    id_registro: 'REG-20260719-002',
    matricula: 'PT-MWM',
    id_companhia: 8,
    nome_companhia: 'Modern Logistics',
    desembarque_hibrido: 'Não',
    horario_cadastro: '11:15:00',
    data_cadastro: '2026-07-19',
    tipo_aeronave: 'Boeing 737-400F',
    status_edicao: 'Auditado'
  },
  {
    id_registro: 'REG-20260718-001',
    matricula: 'PR-YQB',
    id_companhia: 1,
    nome_companhia: 'Azul',
    desembarque_hibrido: 'Sim',
    horario_cadastro: '18:40:00',
    data_cadastro: '2026-07-18',
    tipo_aeronave: 'Airbus A320neo',
    status_edicao: 'Auditado'
  },
  {
    id_registro: 'REG-20260718-002',
    matricula: 'PR-XTB',
    id_companhia: 2,
    nome_companhia: 'LATAM',
    desembarque_hibrido: 'Não',
    horario_cadastro: '13:00:15',
    data_cadastro: '2026-07-18',
    tipo_aeronave: 'Airbus A321',
    status_edicao: 'Auditado'
  }
];
