import React from 'react';
import { FileText, X, CheckCircle, Code, Server, Info } from 'lucide-react';

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocsModal: React.FC<DocsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[85vh] flex flex-col border border-slate-200 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-sky-950 text-white px-6 py-4 flex justify-between items-center border-b border-sky-800">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-sky-300" />
            <div>
              <h3 className="font-bold text-sm tracking-tight">
                Documentação do Dashboard & Versionamento
              </h3>
              <p className="text-[10px] text-sky-300 font-mono">
                DOCUMENTACAO_E_VERSIONAMENTO.md • v1.0.0 (CGB - SBCY)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-sky-300 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700 leading-relaxed">
          <div className="bg-sky-50 border border-sky-200 p-4 rounded-lg flex items-start gap-3">
            <Info className="w-5 h-5 text-sky-800 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-extrabold text-sky-950 text-xs mb-1">
                Integração com Google Sheets & AppSheet
              </h4>
              <p className="text-sky-900 text-[11px]">
                O sistema lê e processa a estrutura de dados composta por{' '}
                <code className="bg-sky-100 font-mono px-1 rounded">matricula</code>,{' '}
                <code className="bg-sky-100 font-mono px-1 rounded">nome_companhia</code>,{' '}
                <code className="bg-sky-100 font-mono px-1 rounded">desembarque_hibrido</code>,{' '}
                <code className="bg-sky-100 font-mono px-1 rounded">horario_cadastro</code> e{' '}
                <code className="bg-sky-100 font-mono px-1 rounded">data_cadastro</code>.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Code className="w-4 h-4 text-sky-800" />
              1. Fórmulas de Campos Calculados
            </h4>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono text-[11px] space-y-2 text-slate-800">
              <p>
                <strong>Taxa de Desembarque Híbrido:</strong>
                <br />
                <span className="text-sky-800">
                  COUNT_DISTINCT(CASE WHEN desembarque_hibrido = 'Sim' THEN id_registro ELSE NULL END) / COUNT_DISTINCT(id_registro)
                </span>
              </p>
              <p>
                <strong>Total de Movimentações:</strong>
                <br />
                <span className="text-sky-800">COUNT_DISTINCT(id_registro)</span>
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Server className="w-4 h-4 text-sky-800" />
              2. Regras e Diretrizes de Pátio
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>
                <strong>Ordenação Padrão:</strong> Decrescente (DESC) baseada em Data + Horário de Cadastro para priorizar os pousos mais recentes no topo.
              </li>
              <li>
                <strong>Identificação de Picos:</strong> Gráfico empilhado temporal para identificação rápida de dias com alto volume de operações de desembarque misto/híbrido.
              </li>
              <li>
                <strong>Design Responsivo:</strong> Desenvolvido com Tailwind CSS para uso fluido em computadores de central e tablets de fiscais de pátio.
              </li>
            </ul>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-500">
            <span>Versão v1.0.0 • Liberada em 22/07/2026</span>
            <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Status: Ativo e Homologado
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold bg-sky-900 hover:bg-sky-950 text-white rounded-lg transition-colors"
          >
            Fechar Documentação
          </button>
        </div>
      </div>
    </div>
  );
};
