import { CompanhiaAerea } from '../types';

const STORAGE_KEY = 'cgb_airlines_v1';

const DEFAULT_AIRLINES: CompanhiaAerea[] = [
  { id_companhia: 1, nome_companhia: 'Azul', icao: 'AZU', iata: 'AD' },
  { id_companhia: 2, nome_companhia: 'LATAM', icao: 'TAM', iata: 'LA' },
  { id_companhia: 3, nome_companhia: 'GOL', icao: 'GLO', iata: 'G3' },
  { id_companhia: 4, nome_companhia: 'Azul Conecta', icao: 'ACN', iata: 'C2' },
  { id_companhia: 5, nome_companhia: 'Mercado Livre (Meli)', icao: 'MELI', iata: 'ML' },
  { id_companhia: 6, nome_companhia: 'Voepass', icao: 'PTB', iata: '2Z' },
  { id_companhia: 7, nome_companhia: 'Total', icao: 'TTL', iata: 'L1' },
  { id_companhia: 8, nome_companhia: 'Modern Logistics', icao: 'MWM', iata: 'WD' },
  { id_companhia: 9, nome_companhia: 'Sideral', icao: 'SID', iata: '0S' },
  { id_companhia: 11, nome_companhia: 'Forças Armadas Brasileiras', icao: 'FAB', iata: 'FB' },
  { id_companhia: 10, nome_companhia: 'Outros', icao: 'OUT', iata: 'XX' },
];

export const getAirlines = (): CompanhiaAerea[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (err) {}
  return DEFAULT_AIRLINES;
};

export const saveAirlines = (airlines: CompanhiaAerea[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(airlines));
};

export const addAirline = (nome: string, icao: string) => {
  const airlines = getAirlines();
  const newId = Date.now();
  const updated = [...airlines, { id_companhia: newId, nome_companhia: nome, icao: icao.toUpperCase(), iata: '' }];
  saveAirlines(updated);
  return updated;
};

export const deleteAirline = (id: number | string) => {
  const airlines = getAirlines();
  const updated = airlines.filter(a => String(a.id_companhia) !== String(id));
  saveAirlines(updated);
  return updated;
};

export const editAirline = (id: number | string, nome: string, icao: string) => {
  const airlines = getAirlines();
  const updated = airlines.map(a =>
    String(a.id_companhia) === String(id)
    ? { ...a, nome_companhia: nome, icao: icao.toUpperCase() }
    : a
  );
  saveAirlines(updated);
  return updated;
};
