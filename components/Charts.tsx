import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, ReferenceLine, ReferenceDot
} from 'recharts';
import { DataPoint, CorrelationPoint } from '../types';

interface Props {
  signalData: DataPoint[];
  correlationData: CorrelationPoint[];
  currentLag: number;
}

const ChartContainer: React.FC<{ title: string, subtitle: string, color?: string, children: React.ReactNode }> = ({ title, subtitle, color = "bg-slate-800", children }) => (
  <div className="bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-700/50 shadow-sm flex flex-col h-[220px] overflow-hidden group hover:border-slate-600 transition-colors">
    <div className="px-4 py-2 border-b border-slate-800/50 flex justify-between items-center bg-slate-950/30">
      <div className="flex items-center gap-2">
        <div className={`w-1.5 h-1.5 rounded-full ${color}`}></div>
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">{title}</h3>
      </div>
      <span className="text-[10px] font-mono text-slate-500 hidden sm:inline-block">{subtitle}</span>
    </div>
    <div className="flex-1 min-h-0 p-2">
      {children}
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/90 backdrop-blur border border-slate-600 p-2 rounded shadow-xl text-[10px]">
        <p className="font-mono text-slate-400 mb-1 border-b border-slate-700 pb-1">Index: {label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 my-0.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
            <span className="text-slate-200">{entry.name}:</span>
            <span className="font-mono text-white font-bold">{entry.value.toFixed(3)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const Charts: React.FC<Props> = ({ signalData, correlationData, currentLag }) => {
  return (
    <div className="flex flex-col gap-4 h-full">
      
      {/* 1. Signal View */}
      <ChartContainer 
        title="输入信号 / Input Signals" 
        subtitle="静止 x(n) [蓝] 与 移动 x(n-m) [黄] 对比"
        color="bg-blue-500"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={signalData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="n" stroke="#475569" tick={{fontSize: 9, fill: '#64748b'}} tickCount={10} axisLine={false} tickLine={false} />
            <YAxis stroke="#475569" tick={{fontSize: 9, fill: '#64748b'}} domain={[-0.5, 1.5]} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#334155', strokeWidth: 1 }} />
            <ReferenceLine x={0} stroke="#334155" />
            
            <Line 
              type="monotone" 
              dataKey="x_n" 
              name="x(n)" 
              stroke="#0ea5e9" 
              strokeWidth={2} 
              dot={false}
              isAnimationActive={false}
            />
            <Line 
              type="step" 
              dataKey="x_n_m" 
              name="x(n-m)" 
              stroke="#f59e0b" 
              strokeWidth={2} 
              strokeDasharray="4 2"
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* 2. Product View */}
      <ChartContainer 
        title="瞬时乘积 / Instantaneous Product" 
        subtitle="重叠部分面积即为当前相关值的贡献"
        color="bg-emerald-500"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={signalData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="colorProduct" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="n" stroke="#475569" tick={{fontSize: 9, fill: '#64748b'}} axisLine={false} tickLine={false} />
            <YAxis stroke="#475569" tick={{fontSize: 9, fill: '#64748b'}} domain={[-0.5, 1.5]} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#334155', strokeWidth: 1 }} />
            <ReferenceLine x={0} stroke="#334155" />
            
            <Area 
              type="monotone" 
              dataKey="product" 
              name="乘积 (Product)" 
              stroke="#10b981" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorProduct)" 
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* 3. Resulting Autocorrelation */}
      <ChartContainer 
        title="自相关函数 / Autocorrelation R(m)" 
        subtitle="不同时移 m 下的总能量 (相似度)"
        color="bg-violet-500"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={correlationData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="m" 
              stroke="#475569" 
              tick={{fontSize: 9, fill: '#64748b'}} 
              axisLine={false} 
              tickLine={false}
            />
            <YAxis stroke="#475569" tick={{fontSize: 9, fill: '#64748b'}} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#334155', strokeWidth: 1 }} />
            <ReferenceLine x={0} stroke="#334155" />
            
            <Line 
              type="monotone" 
              dataKey="R_m" 
              name="R(m)" 
              stroke="#8b5cf6" 
              strokeWidth={3} 
              dot={{ r: 0 }}
              activeDot={{ r: 4, strokeWidth: 0 }}
              isAnimationActive={false}
            />
            
            <ReferenceDot 
              x={currentLag} 
              y={correlationData.find(d => d.m === currentLag)?.R_m || 0} 
              r={5} 
              fill="#fff" 
              stroke="#8b5cf6"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

    </div>
  );
};

export default Charts;