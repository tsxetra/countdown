export enum AppPhase {
  COUNTDOWN = 'COUNTDOWN',       // Normal HH:MM:SS
  FINAL_MINUTE = 'FINAL_MINUTE', // Large SS
  ZERO_HOLD = 'ZERO_HOLD',       // The "0" stays for a moment
  ZOOM_TRANSITION = 'ZOOM_TRANSITION', // The "0" zooms into screen
  CELEBRATION = 'CELEBRATION'    // Happy New Year text
}

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
}