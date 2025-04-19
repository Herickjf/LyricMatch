// src/monitoring/monitoring.module.ts
import { Module, Injectable, OnModuleInit } from '@nestjs/common';
import {
  PrometheusModule,
  makeCounterProvider,
  makeGaugeProvider,
  makeHistogramProvider,
  InjectMetric,
} from '@willsoto/nestjs-prometheus';
import { Gauge, Counter, Histogram } from 'prom-client';

@Injectable()
export class MonitoringService implements OnModuleInit {
  constructor(
    @InjectMetric('process_cpu_percent') private cpuGauge: Gauge<string>,
    @InjectMetric('process_memory_rss_bytes') private memGauge: Gauge<string>,
  ) {}

  onModuleInit() {
    setInterval(() => {
      const u = process.cpuUsage();
      this.cpuGauge.set(((u.user + u.system) / 1e6) * 100);
      this.memGauge.set(process.memoryUsage().rss);
    }, 5_000);
  }
}

// --- define todos os providers em constantes para poder exportar ===
export const RoomsCreatedProvider = makeCounterProvider({
  name: 'rooms_created_total',
  help: 'Total de salas criadas',
});

export const PlayersJoinedProvider = makeCounterProvider({
  name: 'players_joined_total',
  help: 'Total de jogadores que se juntaram à sala',
});

export const MessagesSentProvider = makeCounterProvider({
  name: 'messages_sent_total',
  help: 'Total de mensagens enviadas',
});

export const RoundsStartedProvider = makeCounterProvider({
  name: 'rounds_started_total',
  help: 'Total de rodadas iniciadas',
});

export const RoundsEndedProvider = makeCounterProvider({
  name: 'rounds_ended_total',
  help: 'Total de rodadas encerradas',
});

export const GameDurationProvider = makeHistogramProvider({
  name: 'game_duration_seconds',
  help: 'Duração das partidas em segundos',
  buckets: [5, 10, 20, 30, 60],
});

// Constantes para as métricas de rede
export const NetworkReceiveBytesProvider = makeCounterProvider({
  name: 'network_receive_bytes_total',
  help: 'Bytes recebidos',
});

export const WsConnCounterProvider = makeCounterProvider({
  name: 'ws_connections_total',
  help: 'Total de conexões WS',
});

export const WsMessagesCounterProvider = makeCounterProvider({
  name: 'ws_messages_total',
  help: 'Total de msgs WS',
});

export const NetworkTransmitBytesProvider = makeCounterProvider({
  name: 'network_transmit_bytes_total',
  help: 'Bytes transmitidos',
});

export const TcpPacketsLostRatioProvider = makeGaugeProvider({
  name: 'tcp_packets_lost_ratio',
  help: 'Taxa de perda TCP (%)',
});

export const TcpRttProvider = makeHistogramProvider({
  name: 'tcp_rtt_seconds',
  help: 'RTT TCP em segundos',
  buckets: [0.001, 0.01, 0.1, 1],
});

export const TcpJitterProvider = makeHistogramProvider({
  name: 'tcp_jitter_seconds',
  help: 'Jitter TCP em segundos',
  buckets: [0.0001, 0.001, 0.01, 0.1],
});

export const HttpReqCounterProvider = makeCounterProvider({
  name: 'http_requests_total',
  help: 'Total de requisições HTTP recebidas',
  labelNames: ['method', 'route', 'status'],
});

export const HttpReqDurationHistProvider = makeHistogramProvider({
  name: 'http_request_duration_seconds',
  help: 'Duração das requisições HTTP em segundos',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.005, 0.01, 0.05, 0.1, 0.5, 1, 5],
});

// … e mais para HTTP, WS, rede, etc.

@Module({
  imports: [
    PrometheusModule.register({
      path: '/metrics',
      defaultMetrics: { enabled: true },
    }),
  ],
  providers: [
    MonitoringService,
    // métrica de sistema
    makeGaugeProvider({
      name: 'process_cpu_percent',
      help: 'Percentual de CPU usado pelo processo',
    }),
    makeGaugeProvider({
      name: 'process_memory_rss_bytes',
      help: 'Memória residente (RSS) em bytes',
    }),
    // métricas de jogo
    RoomsCreatedProvider,
    PlayersJoinedProvider,
    MessagesSentProvider,
    RoundsStartedProvider,
    RoundsEndedProvider,
    GameDurationProvider,
    // métricas HTTP, WS, rede…
    WsConnCounterProvider,
    WsMessagesCounterProvider,

    HttpReqCounterProvider,
    HttpReqDurationHistProvider,

    makeCounterProvider({
      name: 'http_requests_total',
      help: 'Total de requisições HTTP recebidas',
      labelNames: ['method', 'route', 'status'],
    }),
    makeHistogramProvider({
      name: 'http_request_duration_seconds',
      help: 'Duração das requisições HTTP em segundos',
      labelNames: ['method', 'route', 'status'],
      buckets: [0.005, 0.01, 0.05, 0.1, 0.5, 1, 5],
    }),
    makeCounterProvider({
      name: 'ws_connections_total',
      help: 'Total de conexões WS',
    }),
    makeCounterProvider({
      name: 'ws_messages_total',
      help: 'Total de msgs WS',
    }),
    makeCounterProvider({
      name: 'network_receive_bytes_total',
      help: 'Bytes recebidos',
    }),
    makeCounterProvider({
      name: 'network_transmit_bytes_total',
      help: 'Bytes transmitidos',
    }),
    makeGaugeProvider({
      name: 'tcp_packets_lost_ratio',
      help: 'Taxa de perda TCP (%)',
    }),
    makeHistogramProvider({
      name: 'tcp_rtt_seconds',
      help: 'RTT TCP em segundos',
      buckets: [0.001, 0.01, 0.1, 1],
    }),
    makeHistogramProvider({
      name: 'tcp_jitter_seconds',
      help: 'Jitter TCP em segundos',
      buckets: [0.0001, 0.001, 0.01, 0.1],
    }),
  ],
  exports: [
    MonitoringService,
    // exporta **as mesmas constantes** usadas em providers
    RoomsCreatedProvider,
    PlayersJoinedProvider,
    MessagesSentProvider,
    RoundsStartedProvider,
    RoundsEndedProvider,
    GameDurationProvider,
    // e quaisquer outros make*Provider que você precise injetar em GameModule

    // — WS
    WsConnCounterProvider,
    WsMessagesCounterProvider,

    // — rede
    // (note que estes não têm constant, mas você pode criar constantes para eles também)
    NetworkReceiveBytesProvider,
    NetworkTransmitBytesProvider,
    TcpPacketsLostRatioProvider,
    TcpRttProvider,
    TcpJitterProvider,
    // e quaisquer outros make*Provider que você precise injetar em GameModule

    HttpReqCounterProvider,
    HttpReqDurationHistProvider,
  ],
})
export class MonitoringModule {}
