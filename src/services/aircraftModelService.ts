const STORAGE_KEY = 'cgb_aircraft_models_v1';

const DEFAULT_MODELS = [
  'Airbus A319',
  'Airbus A320',
  'Airbus A320neo',
  'Airbus A321',
  'Airbus A321neo',
  'Boeing 737-700',
  'Boeing 737-800',
  'Boeing 737 MAX 8',
  'Embraer E190',
  'Embraer E195',
  'Embraer E195-E2',
  'ATR 42-500',
  'ATR 72-600',
  'Cessna Grand Caravan',
  'Boeing 727-200F (Cargo)',
  'Boeing 737-400F (Cargo)'
];

export const getAircraftModels = (): string[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Erro ao ler modelos de aeronave', err);
  }
  return DEFAULT_MODELS;
};

export const saveAircraftModels = (models: string[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(models));
  } catch (err) {
    console.error('Erro ao salvar modelos de aeronave', err);
  }
};

export const addAircraftModel = (model: string) => {
  const models = getAircraftModels();
  if (!models.includes(model)) {
    const updated = [...models, model].sort();
    saveAircraftModels(updated);
    return updated;
  }
  return models;
};

export const deleteAircraftModel = (model: string) => {
  const models = getAircraftModels();
  const updated = models.filter(m => m !== model);
  saveAircraftModels(updated);
  return updated;
};

export const editAircraftModel = (oldModel: string, newModel: string) => {
  const models = getAircraftModels();
  const updated = models.map(m => m === oldModel ? newModel : m).sort();
  saveAircraftModels(updated);
  return updated;
};
