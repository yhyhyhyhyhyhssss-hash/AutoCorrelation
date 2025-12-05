import { SignalType, DataPoint, CorrelationPoint } from '../types';

const N_RANGE = 20; // Plot from -20 to 20

// Signal Generator Functions
const getSignalValue = (n: number, type: SignalType): number => {
  switch (type) {
    case SignalType.RECTANGULAR:
      // Rect from -3 to 3
      return (Math.abs(n) <= 3) ? 1 : 0;
    case SignalType.TRIANGULAR:
      // Triangle from -5 to 5
      if (Math.abs(n) > 5) return 0;
      return 1 - (Math.abs(n) / 5);
    case SignalType.GAUSSIAN:
      // Gaussian curve
      return Math.exp(-(n * n) / 10);
    case SignalType.DOUBLE_PULSE:
      // Two pulses simulating an echo or code
      // Pulse 1 centered at -4, width 3
      // Pulse 2 centered at +4, width 3
      return (Math.abs(n + 4) <= 1 || Math.abs(n - 4) <= 1) ? 1 : 0;
    case SignalType.SINE_PULSE:
      // Windowed Sine Wave to show periodicity
      if (Math.abs(n) > 8) return 0;
      return Math.cos(n * Math.PI / 4);
    case SignalType.PULSE_TRAIN:
      // Periodic rectangular pulses
      // Period 8, Width 3
      // Use modulo arithmetic that handles negative numbers correctly
      const period = 8;
      const wrappedN = ((n % period) + period) % period;
      return wrappedN < 3 ? 1 : 0;
    default:
      return 0;
  }
};

export const generateData = (m: number, signalType: SignalType): { 
  signalData: DataPoint[], 
  correlationData: CorrelationPoint[],
  currentR: number 
} => {
  const signalData: DataPoint[] = [];
  const correlationData: CorrelationPoint[] = [];

  // 1. Generate Signal Data for the current view (Visualizing overlap)
  for (let n = -N_RANGE; n <= N_RANGE; n++) {
    const val_x = getSignalValue(n, signalType);
    const val_x_shifted = getSignalValue(n - m, signalType); // x(n-m)
    
    signalData.push({
      n,
      x_n: val_x,
      x_n_m: val_x_shifted,
      product: val_x * val_x_shifted
    });
  }

  // 2. Calculate Full Autocorrelation Curve (Pre-calculated for the bottom graph)
  // We calculate R(k) for k in a reasonable range to show the full shape
  let currentR = 0;

  for (let k = -N_RANGE; k <= N_RANGE; k++) {
    let sum = 0;
    // Inner summation for R(k)
    // Theoretically sum from -inf to inf, but our signals are finite or limited to view
    for (let i = -N_RANGE * 2; i <= N_RANGE * 2; i++) { 
       const val1 = getSignalValue(i, signalType);
       const val2 = getSignalValue(i - k, signalType);
       sum += val1 * val2;
    }
    
    correlationData.push({
      m: k,
      R_m: parseFloat(sum.toFixed(4)) // avoid floating point artifacts
    });

    if (k === m) {
      currentR = sum;
    }
  }

  return { signalData, correlationData, currentR };
};