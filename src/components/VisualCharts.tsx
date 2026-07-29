import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts';
import { MovimentacaoAeronave } from '../types';

interface VisualChartsProps {
  movimentacoes: MovimentacaoAeronave[];
}

const AIRLINE_COLORS: Record<string, string> = {
  'Azul Linhas Aéreas': '#0284c7', // Sky 600
  'Latam Airlines Brasil': '#0f172a', // Slate 900
  'Gol Linhas Aéreas': '#f97316', // Orange 500
  'Voepass Linhas Aéreas': '#16a34a', // Green 600
  'Total Linhas Aéreas': '#6366f1', // Indigo 500
  'Modern Logistics': '#d97706', // Amber 600
  'Sideral Linhas Aéreas': '#dc2626', // Red 600
};

export const VisualCharts: React.FC<VisualChartsProps> = ({ movimentacoes }) => {
  // 1. Prepare data for Stacked Bar Chart (data_cadastro x desembarque_hibrido)
  const chartDataByDate = useMemo(() => {
    const mapByDate: Record<string, { data: string; Hibrido_Sim: number; Hibrido_Nao: number; Total: number }> = {};

    movimentacoes.forEach((item) => {
      // Format YYYY-MM-DD to DD/MM
      const dateParts = item.data_cadastro.split('-');
      const formattedDate = dateParts.length === 3 ? `${dateParts[2]}/${dateParts[1]}` : item.data_cadastro;

      if (!mapByDate[formattedDate]) {
        mapByDate[formattedDate] = {
          data: formattedDate,
          Hibrido_Sim: 0,
          Hibrido_Nao: 0,
          Total: 0,
        };
      }

      if (item.desembarque_hibrido === 'Sim') {
        mapByDate[formattedDate].Hibrido_Sim += 1;
      } else {
        mapByDate[formattedDate].Hibrido_Nao += 1;
      }
      mapByDate[formattedDate].Total += 1;
    });

    // Sort dates ascending
    return Object.values(mapByDate).sort((a, b) => {
      const [dayA, monthA] = a.data.split('/');
      const [dayB, monthB] = b.data.split('/');
      return Number(monthA) - Number(monthB) || Number(dayA) - Number(dayB);
    });
  }, [movimentacoes]);

  // 2. Prepare data for Market Share per Airline
  const chartDataByAirline = useMemo(() => {
    const mapAirline: Record<string, number> = {};
    const total = movimentacoes.length || 1;

    movimentacoes.forEach((item) => {
      mapAirline[item.nome_companhia] = (mapAirline[item.nome_companhia] || 0) + 1;
    });

    return Object.entries(mapAirline)
      .map(([nome, count]) => ({
        nome,
        count,
        percentual: parseFloat(((count / total) * 100).toFixed(1)),
        color: AIRLINE_COLORS[nome] || '#0369a1',
      }))
      .sort((a, b) => b.count - a.count);
  }, [movimentacoes]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chart 1: Volumetria por Data e Tipo de Desembarque (Empilhado) */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Volumetria por Data e Desembarque Híbrido
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Análise de picos de desembarques mistos/híbridos no pátio do CGB
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200">
              Colunas Empilhadas
            </span>
          </div>

          <div className="h-64 w-full">
            {chartDataByDate.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartDataByDate} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="data"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={{ stroke: '#cbd5e1' }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#cbd5e1',
                      borderRadius: '8px',
                      fontSize: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    }}
                    formatter={(value: number, name: string) => [
                      `${value} voo(s)`,
                      name === 'Hibrido_Sim' ? 'Desembarque Híbrido (Sim)' : 'Desembarque Padrão (Não)',
                    ]}
                  />
                  <Legend
                    verticalAlign="bottom"
                    wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }}
                    formatter={(value) =>
                      value === 'Hibrido_Sim' ? 'Desembarque Híbrido (Sim)' : 'Desembarque Padrão (Não)'
                    }
                  />
                  <Bar dataKey="Hibrido_Nao" stackId="a" fill="#0369a1" radius={[0, 0, 0, 0]} name="Hibrido_Nao" />
                  <Bar dataKey="Hibrido_Sim" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Hibrido_Sim" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400 italic">
                Nenhuma movimentação para o filtro selecionado
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chart 2: Market Share por Companhia Aérea */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Market Share de Posições por Companhia
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Distribuição de pousos e posições ocupadas pelas operadoras no CGB
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
              Ranking %
            </span>
          </div>

          <div className="space-y-3.5 max-h-64 overflow-y-auto pr-1">
            {chartDataByAirline.length > 0 ? (
              chartDataByAirline.map((item) => (
                <div key={item.nome} className="group">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-bold text-slate-700 flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                        style={{ backgroundColor: item.color }}
                      ></span>
                      {item.nome}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 text-[11px] font-semibold">{item.count} ops</span>
                      <span className="font-extrabold text-sky-950 w-12 text-right">{item.percentual}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${item.percentual}%`,
                        backgroundColor: item.color,
                      }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-xs text-slate-400 italic">
                Nenhum dado de companhia disponível
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
