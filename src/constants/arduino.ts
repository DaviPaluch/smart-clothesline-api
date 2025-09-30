export const ARDUINO_CONSTANTS = {
  HUMIDITY_THRESHOLD: {
    HIGH: 80, // Umidade alta - fechar varal
    LOW: 40,  // Umidade baixa - abrir varal
  },
  RETRY_ATTEMPTS: 3,
  TIMEOUT: 5000, // 5 segundos
} as const;
