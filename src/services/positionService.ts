const STORAGE_KEYS = {
  PRINCIPAIS: 'cgb_positions_principais_v1',
  REMOTAS: 'cgb_positions_remotas_v1'
};

const DEFAULT_PRINCIPAIS = Array.from({ length: 23 }, (_, i) => String(i + 1).padStart(2, '0'));
const DEFAULT_REMOTAS = Array.from({ length: 15 }, (_, i) => `A${String(i + 1).padStart(2, '0')}`);

export const getPositions = () => {
  try {
    const p = localStorage.getItem(STORAGE_KEYS.PRINCIPAIS);
    const r = localStorage.getItem(STORAGE_KEYS.REMOTAS);

    return {
      principais: p ? JSON.parse(p) : DEFAULT_PRINCIPAIS,
      remotas: r ? JSON.parse(r) : DEFAULT_REMOTAS
    };
  } catch (err) {
    return { principais: DEFAULT_PRINCIPAIS, remotas: DEFAULT_REMOTAS };
  }
};

export const savePositions = (principais: string[], remotas: string[]) => {
  localStorage.setItem(STORAGE_KEYS.PRINCIPAIS, JSON.stringify(principais));
  localStorage.setItem(STORAGE_KEYS.REMOTAS, JSON.stringify(remotas));
};

export const addPosition = (pos: string, type: 'principal' | 'remota') => {
  const { principais, remotas } = getPositions();
  if (type === 'principal') {
    if (!principais.includes(pos)) savePositions([...principais, pos].sort(), remotas);
  } else {
    if (!remotas.includes(pos)) savePositions(principais, [...remotas, pos].sort());
  }
};

export const deletePosition = (pos: string, type: 'principal' | 'remota') => {
  const { principais, remotas } = getPositions();
  if (type === 'principal') {
    savePositions(principais.filter(p => p !== pos), remotas);
  } else {
    savePositions(principais, remotas.filter(p => p !== pos));
  }
};

export const editPosition = (oldPos: string, newPos: string, type: 'principal' | 'remota') => {
  const { principais, remotas } = getPositions();
  if (type === 'principal') {
    savePositions(principais.map(p => p === oldPos ? newPos : p).sort(), remotas);
  } else {
    savePositions(principais, remotas.map(p => p === oldPos ? newPos : p).sort());
  }
};
