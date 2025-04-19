import { Counter, Histogram } from 'prom-client';

export const RoomsCreatedCounterProvider = {
  provide: 'PROM_METRIC_ROOMS_CREATED_TOTAL',
  useFactory: () =>
    new Counter({
      name: 'rooms_created_total',
      help: 'Total de salas criadas',
    }),
};

export const PlayersJoinedCounterProvider = {
  provide: 'PROM_METRIC_PLAYERS_JOINED_TOTAL',
  useFactory: () =>
    new Counter({
      name: 'players_joined_total',
      help: 'Total de jogadores que se juntaram à sala',
    }),
};

export const MessagesSentCounterProvider = {
  provide: 'PROM_METRIC_MESSAGES_SENT_TOTAL',
  useFactory: () =>
    new Counter({
      name: 'messages_sent_total',
      help: 'Total de mensagens enviadas',
    }),
};

export const RoundsStartedCounterProvider = {
  provide: 'PROM_METRIC_ROUNDS_STARTED_TOTAL',
  useFactory: () =>
    new Counter({
      name: 'rounds_started_total',
      help: 'Total de rodadas iniciadas',
    }),
};

export const RoundsEndedCounterProvider = {
  provide: 'PROM_METRIC_ROUNDS_ENDED_TOTAL',
  useFactory: () =>
    new Counter({
      name: 'rounds_ended_total',
      help: 'Total de rodadas encerradas',
    }),
};

export const GameDurationHistogramProvider = {
  provide: 'PROM_METRIC_GAME_DURATION_SECONDS',
  useFactory: () =>
    new Histogram({
      name: 'game_duration_seconds',
      help: 'Duração das partidas em segundos',
      buckets: [5, 10, 20, 30, 60],
    }),
};

