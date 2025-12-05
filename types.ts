export enum SignalType {
  RECTANGULAR = 'RECTANGULAR',
  TRIANGULAR = 'TRIANGULAR',
  GAUSSIAN = 'GAUSSIAN',
  DOUBLE_PULSE = 'DOUBLE_PULSE',
  SINE_PULSE = 'SINE_PULSE',
  PULSE_TRAIN = 'PULSE_TRAIN',
}

export interface DataPoint {
  n: number;
  x_n: number;         // Original signal
  x_n_m: number;       // Shifted signal
  product: number;     // x(n) * x(n-m)
}

export interface CorrelationPoint {
  m: number;
  R_m: number;         // Resulting correlation value
}