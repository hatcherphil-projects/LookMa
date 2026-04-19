export type Screen = 'home' | 'seat' | 'camera' | 'preview';

export interface Team {
  id: number;
  name: string;
  league: string;
  color: string;
}

export interface SeatInfo {
  section: string;
  row: string;
  seat: string;
}

export type CaptureType = 'photo' | 'video';

export interface CaptureData {
  type: CaptureType;
  url: string;
  blob?: Blob;
}
