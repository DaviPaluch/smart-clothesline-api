export interface ArduinoCommand {
  action: 'OPEN' | 'CLOSE';
  clotheslineId: string;
  timestamp: string;
}

export interface ArduinoResponse {
  success: boolean;
  message: string;
  humidity?: number;
  timestamp: string;
}

export interface ArduinoEvent {
  clotheslineId: string;
  actionType: 'OPEN' | 'CLOSE';
  humidity: number;
  timestamp: string;
}