import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('Iniciando aplicação Dashboard CGB...');

// Captura erros globais para ajudar no debug
window.onerror = function(message, source, lineno, colno, error) {
  console.error('ERRO GLOBAL CAPTURADO:', message, 'em', source, 'linha:', lineno);
  return false;
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Elemento #root não encontrado no DOM!');
} else {
  try {
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
    console.log('React Render disparado com sucesso.');
  } catch (error) {
    console.error('Erro fatal ao renderizar aplicação React:', error);
  }
}
