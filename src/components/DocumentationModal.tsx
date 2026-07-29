import React from 'react';
import { X, FileText, Database, Layers, BarChart2, CheckCircle, Download } from 'lucide-react';

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentationModal: React.FC<DocumentationModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl border border-slate-300 shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex justify-between items-center border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-700 rounded-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-tight text-white">
                DOCUMENTACAO_CGB.md — Manual de Engenharia de BI & AppSheet
              </h2>
              <p className="text-[11px] text-slate-400">
                Especificação do Banco de Dados, AppSheet Low-Code e Looker Studio (CGB)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body with formatted Markdown view */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 font-sans leading-relaxed">
          {/* Intro Box */}
          <div className="bg-sky-50 border border-sky-200 rounded-lg p-4">
            <h3 className="font-bold text-sky-950 text-sm mb-1 flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-700" />
              Arquitetura Híbrida Low-Code (CGB)
            </h3>
            <p className="text-slate-600 text-xs">
              O ecossistema foi estruturado para operabilidade em celular de fiscais de pátio via **Google AppSheet** integrado com **Google Sheets** e **Google Looker Studio**, com script SQL pronto para migração para **PostgreSQL / Cloud SQL**.
            </p>
          </div>

          {/* Section 1: SQL Schema */}
          <section className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 text-sky-900 border-b border-slate-200 pb-1">
              <Database className="w-4 h-4 text-sky-700" />
              1. Esquema do Banco de Dados (SQLite & Google Sheets)
            </h4>
            <div className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-[11px] overflow-x-auto space-y-1">
              <p className="text-emerald-400">-- Tabela tb_companhias</p>
              <p>CREATE TABLE tb_companhias (</p>
              <p className="pl-4">id_companhia INTEGER PRIMARY KEY AUTOINCREMENT,</p>
              <p className="pl-4">nome_companhia TEXT NOT NULL,</p>
              <p className="pl-4">icao VARCHAR(3) UNIQUE NOT NULL,</p>
              <p className="pl-4">iata VARCHAR(2) UNIQUE NOT NULL</p>
              <p>);</p>
              <p className="text-emerald-400 pt-2">-- Tabela tb_movimentacoes</p>
              <p>CREATE TABLE tb_movimentacoes (</p>
              <p className="pl-4">id_registro INTEGER PRIMARY KEY AUTOINCREMENT,</p>
              <p className="pl-4 text-amber-300">matricula VARCHAR(7) NOT NULL,</p>
              <p className="pl-4">id_companhia INTEGER,</p>
              <p className="pl-4 text-amber-300">desembarque_hibrido TEXT CHECK(desembarque_hibrido IN (&apos;Sim&apos;, &apos;Não&apos;)),</p>
              <p className="pl-4">horario_cadastro DATETIME DEFAULT (datetime(&apos;now&apos;, &apos;localtime&apos;)),</p>
              <p className="pl-4">data_cadastro DATE DEFAULT (date(&apos;now&apos;, &apos;localtime&apos;))</p>
              <p>);</p>
            </div>
          </section>

          {/* Section 2: Looker Studio Metrics */}
          <section className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 text-sky-900 border-b border-slate-200 pb-1">
              <BarChart2 className="w-4 h-4 text-sky-700" />
              2. Fórmulas de Campos Calculados no Looker Studio
            </h4>
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg space-y-2">
              <div>
                <span className="font-bold text-slate-800">Métrica 1: Taxa de Desembarque Híbrido (%)</span>
                <pre className="bg-slate-900 text-emerald-400 p-2 rounded text-[11px] mt-1 font-mono">
                  COUNT_DISTINCT(CASE WHEN desembarque_hibrido = &apos;Sim&apos; THEN id_registro ELSE NULL END) / COUNT_DISTINCT(id_registro)
                </pre>
              </div>
              <div>
                <span className="font-bold text-slate-800">Métrica 2: Total de Movimentações</span>
                <pre className="bg-slate-900 text-emerald-400 p-2 rounded text-[11px] mt-1 font-mono">
                  COUNT(id_registro)
                </pre>
              </div>
            </div>
          </section>

          {/* Section 3: AppSheet Columns Config */}
          <section className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 text-sky-900 border-b border-slate-200 pb-1">
              <CheckCircle className="w-4 h-4 text-sky-700" />
              3. Mapeamento de Colunas no AppSheet
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
              <li><strong className="text-slate-800">id_registro:</strong> Type Key, Initial Value = <code className="bg-slate-100 px-1 py-0.5 rounded text-sky-800">UNIQUEID()</code></li>
              <li><strong className="text-slate-800">matricula:</strong> Type Text, Editable = TRUE</li>
              <li><strong className="text-slate-800">id_companhia:</strong> Type Ref, Referenciando tb_companhias</li>
              <li><strong className="text-slate-800">desembarque_hibrido:</strong> Type Enum (&apos;Sim&apos;, &apos;Não&apos;), Display as Buttons</li>
              <li><strong className="text-slate-800">horario_cadastro:</strong> Type Time, Initial Value = <code className="bg-slate-100 px-1 py-0.5 rounded text-sky-800">TIMENOW()</code></li>
              <li><strong className="text-slate-800">data_cadastro:</strong> Type Date, Initial Value = <code className="bg-slate-100 px-1 py-0.5 rounded text-sky-800">TODAY()</code></li>
            </ul>
          </section>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex justify-between items-center">
          <span className="text-[11px] text-slate-500 italic">
            Arquivo <code className="font-mono text-slate-700 font-bold">DOCUMENTACAO_CGB.md</code> salvo no repositório.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-sky-800 hover:bg-sky-900 text-white font-bold text-xs rounded-lg transition-colors"
          >
            Fechar Manual
          </button>
        </div>
      </div>
    </div>
  );
};
