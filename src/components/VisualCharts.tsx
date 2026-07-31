import React, { useMemo, useState } from 'react';
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
  PieChart,
  Pie,
  LineChart,
  Line,
} from 'recharts';
import { LayoutGrid, BarChart3, PieChart as PieChartIcon, Layers, List, TrendingUp } from 'lucide-react';
import { MovimentacaoAeronave } from '../types';

interface VisualChartsProps {
  movimentacoes: MovimentacaoAeronave[];
}

type ChartType = 'STACKED' | 'GROUPED' | 'PIE' | 'LINE';
type MarketChartType = 'LIST' | 'BAR' | 'PIE';

const AIRLINE_COLORS: Record<string, string> = {
  'Azul': '#0284c7',
  'LATAM': '#0f172a',
  'GOL': '#f97316',
  'Azul Conecta': '#0ea5e9',
  'Mercado Livre (Meli)': '#facc15',
  'Voepass': '#16a34a',
  'Total': '#312e81',
  'Modern Logistics': '#d97706',
  'Sideral': '#dc2626',
  'Outros': '#64748b'
};

export const VisualCharts: React.FC<VisualChartsProps> = ({ movimentacoes }) => {
  const [chartType, setChartType] = useState<ChartType>('STACKED');
  const [marketChartType, setMarketChartType] = useState<MarketChartType>('LIST');

  // 1. Prepare data for Bar Charts (data_cadastro x desembarque_hibrido)
  const chartDataByDate = useMemo(() => {
    const mapByDate: Record<string, { data: string; Hibrido_Sim: number; Hibrido_Nao: number; Total: number }> = {};

    movimentacoes.forEach((item) => {
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

    return Object.values(mapByDate).sort((a, b) => {
      const [dayA, monthA] = a.data.split('/');
      const [dayB, monthB] = b.data.split('/');
      return Number(monthA) - Number(monthB) || Number(dayA) - Number(dayB);
    });
  }, [movimentacoes]);

  // 1.1 Prepare data for Pie Chart (Total Hibrido vs Padrão)
  const pieData = useMemo(() => {
    let sim = 0;
    let nao = 0;
    movimentacoes.forEach(m => {
      if (m.desembarque_hibrido === 'Sim') sim++;
      else nao++;
    });
    return [
      { name: 'Híbrido (Sim)', value: sim, color: '#f59e0b' },
      { name: 'Padrão (Não)', value: nao, color: '#0369a1' }
    ].filter(item => item.value > 0);
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
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [movimentacoes]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chart 1: Volumetria por Data e Tipo de Desembarque */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-3">
            <div className="space-y-1">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
                Performance e Híbridos
              </h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                {chartType === 'PIE' ? 'Distribuição Total do Período' : chartType === 'LINE' ? 'Tendência de Operações Totais' : 'Análise temporal de picos de desembarque'}
              </p>
            </div>

            {/* Chart Type Selector */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setChartType('LINE')}
                className={`p-1.5 rounded-lg transition-all ${chartType === 'LINE' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                title="Performance Temporal"
              >
                <TrendingUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => setChartType('STACKED')}
                className={`p-1.5 rounded-lg transition-all ${chartType === 'STACKED' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                title="Colunas Empilhadas"
              >
                <Layers className="w-4 h-4" />
              </button>
              <button
                onClick={() => setChartType('GROUPED')}
                className={`p-1.5 rounded-lg transition-all ${chartType === 'GROUPED' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                title="Colunas Lado a Lado"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setChartType('PIE')}
                className={`p-1.5 rounded-lg transition-all ${chartType === 'PIE' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                title="Gráfico de Pizza"
              >
                <PieChartIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="h-64 w-full">
            {movimentacoes.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'PIE' ? (
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                ) : chartType === 'LINE' ? (
                  <LineChart data={chartDataByDate} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                      dataKey="data"
                      tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }}
                      axisLine={{ stroke: '#f1f5f9' }}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: '#94a3b8' }}
                      axisLine={{ stroke: '#f1f5f9' }}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderColor: '#f1f5f9',
                        borderRadius: '12px',
                        fontSize: '11px',
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                      }}
                    />
                    <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: '15px', fontSize: '10px', fontWeight: 'bold' }} />
                    <Line type="monotone" dataKey="Total" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4, fill: '#0ea5e9' }} activeDot={{ r: 6 }} name="Total de Pousos" />
                    <Line type="monotone" dataKey="Hibrido_Sim" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" name="Híbridos" />
                  </LineChart>
                ) : (
                  <BarChart data={chartDataByDate} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                      dataKey="data"
                      tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }}
                      axisLine={{ stroke: '#f1f5f9' }}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: '#94a3b8' }}
                      axisLine={{ stroke: '#f1f5f9' }}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderColor: '#f1f5f9',
                        borderRadius: '12px',
                        fontSize: '11px',
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                      }}
                      cursor={{ fill: '#f8fafc' }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      wrapperStyle={{ paddingTop: '15px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                      formatter={(value) => value === 'Hibrido_Sim' ? 'Híbrido' : 'Padrão'}
                    />
                    <Bar
                      dataKey="Hibrido_Nao"
                      stackId={chartType === 'STACKED' ? "a" : undefined}
                      fill="#0369a1"
                      radius={chartType === 'STACKED' ? [0,0,0,0] : [4,4,0,0]}
                      name="Hibrido_Nao"
                    />
                    <Bar
                      dataKey="Hibrido_Sim"
                      stackId={chartType === 'STACKED' ? "a" : undefined}
                      fill="#f59e0b"
                      radius={[4,4,0,0]}
                      name="Hibrido_Sim"
                    />
                  </BarChart>
                )}
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
          <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-3">
            <div className="space-y-1">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
                Market Share Operacional
              </h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                Ranking de pousos por operadora no CGB
              </p>
            </div>

            {/* Market Chart Type Selector */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setMarketChartType('LIST')}
                className={`p-1.5 rounded-lg transition-all ${marketChartType === 'LIST' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                title="Lista de Performance"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMarketChartType('BAR')}
                className={`p-1.5 rounded-lg transition-all ${marketChartType === 'BAR' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                title="Gráfico de Barras"
              >
                <BarChart3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMarketChartType('PIE')}
                className={`p-1.5 rounded-lg transition-all ${marketChartType === 'PIE' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                title="Gráfico de Pizza"
              >
                <PieChartIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="h-64 w-full">
            {chartDataByAirline.length > 0 ? (
              <>
                {marketChartType === 'PIE' ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartDataByAirline}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={85}
                        paddingAngle={2}
                        dataKey="count"
                        nameKey="nome"
                        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                      >
                        {chartDataByAirline.map((entry, index) => (
                          <Cell key={`cell-market-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                        formatter={(value: number) => [`${value} Pousos`, 'Total']}
                      />
                      <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: '10px', fontSize: '10px', fontWeight: 'bold' }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : marketChartType === 'BAR' ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartDataByAirline} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis
                        dataKey="nome"
                        tick={{ fontSize: 9, fill: '#64748b', fontWeight: 'bold' }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        axisLine={{ stroke: '#f1f5f9' }}
                      />
                      <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={{ stroke: '#f1f5f9' }} />
                      <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                      />
                      <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '10px', fontSize: '10px', fontWeight: 'bold' }} />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Pousos">
                        {chartDataByAirline.map((entry, index) => (
                          <Cell key={`cell-bar-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="space-y-4 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                    {chartDataByAirline.map((item) => (
                      <div key={item.nome} className="group">
                        <div className="flex justify-between items-center text-xs mb-1.5">
                          <span className="font-black text-slate-700 flex items-center gap-2 uppercase text-[10px]">
                            <span
                              className="w-2.5 h-2.5 rounded-full inline-block shrink-0 shadow-sm"
                              style={{ backgroundColor: item.color }}
                            ></span>
                            {item.nome}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 text-[10px] font-bold">{item.count} OPS</span>
                            <span className="font-black text-sky-950 w-12 text-right">{item.percentual}%</span>
                          </div>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/50">
                          <div
                            className="h-full rounded-full transition-all duration-700 ease-out"
                            style={{
                              width: `${item.percentual}%`,
                              backgroundColor: item.color,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
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
