import React from 'react';
import { SignalType } from '../types';

interface SelectorProps {
  signalType: SignalType;
  setSignalType: (t: SignalType) => void;
  lag: number;
  setLag: (l: number) => void;
  isPlaying: boolean;
  setIsPlaying: (p: boolean) => void;
}

interface InfoProps {
  signalType: SignalType;
}

// Helper to render case-specific visuals
const CaseVisual = ({ type }: { type: SignalType }) => {
  switch (type) {
    case SignalType.DOUBLE_PULSE: // Radar
      return (
        <svg viewBox="0 0 300 150" className="w-full h-full">
          {/* Background Grid */}
          <defs>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1e293b" strokeWidth="0.5"/>
            </pattern>
            <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L9,3 z" fill="#475569" />
            </marker>
          </defs>
          <rect width="300" height="150" fill="url(#grid)" />

          {/* Ground */}
          <path d="M0 130 H300" stroke="#334155" strokeWidth="2" />
          
          {/* Radar Station */}
          <path d="M30 130 L40 100 L50 130 Z" fill="#475569" />
          <path d="M25 100 Q40 115 55 100" fill="none" stroke="#94a3b8" strokeWidth="3" />
          <line x1="40" y1="105" x2="40" y2="90" stroke="#94a3b8" strokeWidth="2" />

          {/* Target (Plane) */}
          <g transform="translate(220, 40)">
             <path d="M0 10 L20 0 L25 10 L10 15 Z" fill="#ef4444" opacity="0.8"/>
             <text x="0" y="-10" fill="#ef4444" fontSize="10" fontWeight="bold">TARGET</text>
          </g>

          {/* Waves */}
          <circle cx="40" cy="90" r="20" stroke="#38bdf8" strokeWidth="2" fill="none" opacity="0.8" className="animate-ping" style={{animationDuration: '3s'}} />
          <circle cx="40" cy="90" r="50" stroke="#38bdf8" strokeWidth="1" fill="none" opacity="0.4" className="animate-ping" style={{animationDuration: '3s', animationDelay: '1s'}} />
          
          {/* Measurement Dimension */}
          <line x1="40" y1="140" x2="230" y2="140" stroke="#64748b" strokeWidth="1" markerEnd="url(#arrow)" />
          <text x="135" y="145" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">DELAY = 2 × Dist / c</text>
        </svg>
      );

    case SignalType.RECTANGULAR: // Matched Filter
      return (
        <svg viewBox="0 0 300 150" className="w-full h-full">
           {/* Noisy Input */}
           <path d="M10 75 L20 60 L30 75 L40 50 L50 75 L60 80 L70 75" fill="none" stroke="#64748b" strokeWidth="1" opacity="0.5"/>
           <rect x="25" y="60" width="30" height="30" fill="#38bdf8" fillOpacity="0.2" stroke="#38bdf8" strokeWidth="2" />
           <text x="40" y="45" textAnchor="middle" fill="#38bdf8" fontSize="10">Pulse + Noise</text>

           {/* Arrow */}
           <path d="M80 75 H100" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)" />

           {/* Filter Box */}
           <rect x="100" y="40" width="80" height="70" rx="4" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" />
           <text x="140" y="70" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">h(t)</text>
           <text x="140" y="85" textAnchor="middle" fill="#94a3b8" fontSize="9">Matched Filter</text>

           {/* Arrow */}
           <path d="M180 75 H200" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)" />

           {/* Output Triangle */}
           <path d="M210 90 L240 30 L270 90" fill="none" stroke="#a78bfa" strokeWidth="2" />
           <circle cx="240" cy="30" r="3" fill="#a78bfa" />
           <text x="240" y="20" textAnchor="middle" fill="#a78bfa" fontSize="10">Max SNR @ t=T</text>
           <line x1="240" y1="30" x2="240" y2="100" stroke="#a78bfa" strokeDasharray="3 3" strokeWidth="1" />
        </svg>
      );

    case SignalType.PULSE_TRAIN: // Clock Recovery
      return (
        <svg viewBox="0 0 300 150" className="w-full h-full">
          {/* Data Stream */}
          <text x="10" y="30" fill="#94a3b8" fontSize="10">Incoming Data (Jittery)</text>
          <path d="M10 50 H40 V30 H70 V50 H90 V30 H120 V50 H160 V30 H190 V50 H240 V30 H260 V50" 
                fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
          
          {/* Alignment Lines */}
          <line x1="40" y1="50" x2="40" y2="110" stroke="#475569" strokeDasharray="2 2" />
          <line x1="70" y1="50" x2="70" y2="110" stroke="#475569" strokeDasharray="2 2" />
          <line x1="120" y1="50" x2="120" y2="110" stroke="#475569" strokeDasharray="2 2" />
          <line x1="190" y1="50" x2="190" y2="110" stroke="#475569" strokeDasharray="2 2" />

          {/* Recovered Clock */}
          <text x="10" y="90" fill="#f59e0b" fontSize="10">Recovered Clock</text>
          <path d="M10 110 H25 V100 H55 V110 H85 V100 H115 V110 H145 V100 H175 V110 H205 V100 H235 V110" 
                fill="none" stroke="#f59e0b" strokeWidth="2" />
          
          <text x="250" y="105" fill="#f59e0b" fontSize="12" fontWeight="bold">SYNC</text>
        </svg>
      );

    case SignalType.SINE_PULSE: // Pitch Detection
        return (
          <svg viewBox="0 0 300 150" className="w-full h-full">
             {/* Speech Waveform (Quasi-periodic) */}
             <text x="10" y="25" fill="#94a3b8" fontSize="10">Speech Signal (Time Domain)</text>
             <path d="M10 75 Q30 25 50 75 T90 75 T130 75 T170 75 T210 75" 
                   fill="none" stroke="#38bdf8" strokeWidth="2" />
             
             {/* Fundamental Period Markers */}
             <line x1="50" y1="35" x2="50" y2="115" stroke="#f43f5e" strokeWidth="1" strokeDasharray="4 2" />
             <line x1="90" y1="35" x2="90" y2="115" stroke="#f43f5e" strokeWidth="1" strokeDasharray="4 2" />
             <line x1="130" y1="35" x2="130" y2="115" stroke="#f43f5e" strokeWidth="1" strokeDasharray="4 2" />

             {/* Dimension Line */}
             <path d="M50 100 H90" stroke="#f43f5e" strokeWidth="1" markerEnd="url(#arrow)" markerStart="url(#arrow)" />
             <text x="70" y="115" textAnchor="middle" fill="#f43f5e" fontSize="12" fontWeight="bold">T₀</text>
             <text x="70" y="130" textAnchor="middle" fill="#f43f5e" fontSize="10">Pitch Period</text>

             <text x="220" y="75" fill="#94a3b8" fontSize="10" width="50">R(m) Peaks at T₀</text>
          </svg>
        );

    case SignalType.GAUSSIAN: // Fiber Optic
        return (
          <svg viewBox="0 0 300 150" className="w-full h-full">
            {/* Fiber Cable */}
            <defs>
               <linearGradient id="fiberGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#334155" />
                  <stop offset="50%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#334155" />
               </linearGradient>
            </defs>
            <rect x="10" y="50" width="280" height="50" fill="url(#fiberGrad)" rx="5" />
            <line x1="10" y1="75" x2="290" y2="75" stroke="#475569" strokeDasharray="5 5" strokeWidth="1" />

            {/* Light Pulses */}
            <path d="M40 75 Q60 35 80 75" fill="none" stroke="#10b981" strokeWidth="3" className="translate-x-0" />
            <path d="M40 75 Q60 35 80 75" fill="#10b981" fillOpacity="0.3" stroke="none" />
            
            <g className="animate-[moveRight_3s_linear_infinite]">
               <path d="M40 75 Q60 35 80 75" fill="none" stroke="#34d399" strokeWidth="3" />
               <path d="M40 75 Q60 35 80 75" fill="#34d399" fillOpacity="0.5" stroke="none" />
            </g>

            <text x="150" y="40" textAnchor="middle" fill="#10b981" fontSize="12" fontWeight="bold">Fiber Optic Transmission</text>
            <text x="150" y="120" textAnchor="middle" fill="#94a3b8" fontSize="10">Minimum Time-Bandwidth Product</text>
            
            <style>{`
              @keyframes moveRight {
                0% { transform: translateX(0px); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translateX(200px); opacity: 0; }
              }
            `}</style>
          </svg>
        );

    case SignalType.TRIANGULAR: // Smoothing
        return (
            <svg viewBox="0 0 300 150" className="w-full h-full">
                {/* Noisy Signal */}
                <path d="M10 100 L30 40 L40 90 L50 20 L70 80 L90 50 L110 110 L130 60 L150 100 L170 40 L200 80 L230 50 L260 90" 
                    fill="none" stroke="#475569" strokeWidth="1" opacity="0.5" />
                <text x="30" y="30" fill="#64748b" fontSize="10">Noisy Input</text>

                {/* Smoothed Result (Spline-like) */}
                <path d="M10 80 Q70 20 130 70 T260 60" 
                    fill="none" stroke="#818cf8" strokeWidth="4" strokeLinecap="round" />
                <text x="180" y="40" fill="#818cf8" fontSize="12" fontWeight="bold">Smoothed Output</text>
                
                <circle cx="130" cy="70" r="4" fill="#fff" />
                <text x="130" y="90" textAnchor="middle" fill="#94a3b8" fontSize="10">Correlation suppresses noise</text>
            </svg>
        );

    default:
      return (
        <svg viewBox="0 0 300 150" className="w-full h-full flex items-center justify-center">
            <rect x="90" y="55" width="120" height="40" rx="4" fill="#1e293b" stroke="#334155" />
            <text x="150" y="80" textAnchor="middle" fill="#64748b" fontSize="12">Signal Model</text>
        </svg>
      );
  }
};

const getSignalInfo = (type: SignalType) => {
  switch (type) {
    case SignalType.RECTANGULAR:
      return {
        title: "数字脉冲与最佳接收",
        subtitle: "Digital Pulse & Matched Filter",
        concept: "匹配滤波器 (Matched Filter)",
        explanation: "在数字通信中，为了在噪声中最大化检测概率，接收端使用与发送信号波形‘匹配’的滤波器。矩形脉冲的自相关是三角形，峰值时刻代表最佳采样点，此时信噪比(SNR)最大。",
        application: "基带数字传输 / Baseband Transmission"
      };
    case SignalType.TRIANGULAR:
      return {
        title: "信号平滑与样条插值",
        subtitle: "Smoothing & Spline Interpolation",
        concept: "平滑效应 (Smoothing Effect)",
        explanation: "自相关本质上是一种积分运算，具有低通滤波特性。矩形的自相关是三角波，三角波的自相关是更平滑的样条曲线。这种特性常用于去除信号中的高频随机噪声。",
        application: "图像去噪 / Image Denoising"
      };
    case SignalType.GAUSSIAN:
      return {
        title: "高斯波包与光通信",
        subtitle: "Gaussian Wave Packet",
        concept: "形状不变性 (Shape Invariance)",
        explanation: "高斯函数的自相关仍是高斯函数。因其具有最小的时间-带宽积(Uncertainty Principle)，在经过线性系统后能保持波形的基本形状，适合长距离光纤传输。",
        application: "光纤通信 / Optical Fiber"
      };
    case SignalType.DOUBLE_PULSE:
      return {
        title: "雷达回波测距",
        subtitle: "Radar & Sonar Ranging",
        concept: "飞行时间 (Time of Flight)",
        explanation: "雷达发射双脉冲或编码信号，接收端计算自相关。R(m) 中的副峰位置直接对应目标回波的延迟时间。自相关能有效从背景噪声中提取出微弱的回波信号。",
        application: "雷达与声纳 / Radar & Sonar"
      };
    case SignalType.SINE_PULSE:
      return {
        title: "语音基音检测",
        subtitle: "Pitch Detection Algorithm",
        concept: "短时自相关 (Short-time Autocorrelation)",
        explanation: "R(m) 的第二个显著峰值位置对应信号的基频周期 T0。这在语音处理中用于提取说话人的音高（Pitch），即使信号波形复杂，周期性在自相关域依然清晰可见。",
        application: "语音编码 (如 GSM) / Speech Coding"
      };
    case SignalType.PULSE_TRAIN:
      return {
        title: "时钟同步与恢复",
        subtitle: "Clock Synchronization",
        concept: "周期性估计 (Periodicity Estimation)",
        explanation: "对周期脉冲串进行自相关，其结果 R(m) 也是周期的，且峰值位置精确对应周期 T 的整数倍。接收机利用这一特性锁定发送端的时钟频率，实现数据同步。",
        application: "时钟恢复电路 (CDR)"
      };
    default:
      return { title: "", subtitle: "", concept: "", explanation: "", application: "" };
  }
};

export const SignalSelector: React.FC<SelectorProps> = ({ 
  signalType, 
  setSignalType, 
  lag, 
  setLag, 
  isPlaying, 
  setIsPlaying 
}) => {
  return (
    <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-slate-700/50 shadow-lg mb-6 flex flex-col gap-4">
      {/* 1. Tabs for Signal Types */}
      <div>
         <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block px-1">1. 选择信号模型 / Select Model</label>
         <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {Object.values(SignalType).map((type) => (
            <button
              key={type}
              onClick={() => setSignalType(type)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 border whitespace-nowrap ${
                signalType === type 
                  ? 'bg-primary-600 border-primary-500 text-white shadow-lg shadow-primary-900/30' 
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 hover:border-slate-500'
              }`}
            >
              {type === SignalType.RECTANGULAR ? '矩形脉冲' :
               type === SignalType.TRIANGULAR ? '三角脉冲' :
               type === SignalType.GAUSSIAN ? '高斯脉冲' :
               type === SignalType.DOUBLE_PULSE ? '双脉冲回波' :
               type === SignalType.SINE_PULSE ? '正弦短波' : '周期脉冲串'}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Slider Control */}
      <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800 flex flex-col sm:flex-row items-center gap-4">
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all border ${
                isPlaying 
                ? 'bg-amber-500/10 text-amber-500 border-amber-500/50 hover:bg-amber-500/20' 
                : 'bg-primary-500/10 text-primary-400 border-primary-500/50 hover:bg-primary-500/20'
            }`}
            >
            {isPlaying ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
            ) : (
                <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            )}
            </button>
            <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-slate-500">Animation</span>
                <span className="text-xs font-medium text-slate-300">{isPlaying ? 'Running...' : 'Paused'}</span>
            </div>
        </div>

        <div className="h-8 w-px bg-slate-800 hidden sm:block"></div>

        <div className="flex-1 w-full flex flex-col justify-center">
            <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-slate-400">时移 Lag (m)</span>
                <span className="font-mono text-accent-400 font-bold text-sm bg-accent-400/10 px-2 rounded">{lag}</span>
            </div>
            <input
            type="range"
            min="-15"
            max="15"
            step="1"
            value={lag}
            onChange={(e) => {
                setLag(parseInt(e.target.value));
                setIsPlaying(false);
            }}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-500 hover:accent-primary-400"
            />
            <div className="flex justify-between text-[10px] text-slate-600 mt-1 font-mono">
                <span>-15</span>
                <span>0</span>
                <span>+15</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export const CaseInfoCard: React.FC<InfoProps> = ({ signalType }) => {
    const info = getSignalInfo(signalType);

    return (
        <div className="bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-700/50 shadow-lg overflow-hidden flex flex-col h-full">
            <div className="relative h-40 bg-slate-950 flex items-center justify-center border-b border-slate-800 overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-900 via-slate-950 to-slate-950"></div>
                <div className="relative z-10 w-full h-full p-2">
                    <CaseVisual type={signalType} />
                </div>
                <div className="absolute bottom-2 right-2 text-[9px] font-mono text-slate-600 bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-800 z-20">
                    FIG 1.{Object.values(SignalType).indexOf(signalType) + 1}
                </div>
            </div>

            <div className="p-5 flex-1 flex flex-col gap-4">
                <div>
                    <h3 className="text-lg font-bold text-white leading-tight mb-1">{info.title}</h3>
                    <p className="text-xs font-serif italic text-slate-400">{info.subtitle}</p>
                </div>

                <div className="flex-1">
                    <div className="flex items-start gap-2 mb-3">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0 shadow-[0_0_8px_rgba(14,165,233,0.6)]"></div>
                        <div>
                            <span className="text-xs font-bold text-primary-200 block mb-0.5">Key Concept: {info.concept}</span>
                        </div>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed pl-3.5 border-l border-slate-700/50">
                        {info.explanation}
                    </p>
                </div>

                <div className="pt-3 border-t border-slate-800">
                    <div className="flex items-center justify-between">
                         <span className="text-[10px] font-bold text-slate-500 uppercase">Application</span>
                         <span className="text-xs font-mono text-accent-300 bg-accent-500/10 border border-accent-500/20 px-2 py-0.5 rounded-full">
                            {info.application}
                         </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
