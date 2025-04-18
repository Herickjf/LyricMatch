// src/monitoring/monitoring.module.ts
import { Injectable, Module, OnModuleInit } from '@nestjs/common';
import {
  PrometheusModule,
  makeCounterProvider,
  makeGaugeProvider,
  makeHistogramProvider,
  InjectMetric,
} from '@willsoto/nestjs-prometheus';
import { Gauge, Counter, Histogram } from 'prom-client';
import * as os from 'os';

@Injectable()
export class MonitoringService implements OnModuleInit {
  constructor(
    @InjectMetric('process_cpu_percent') private cpuGauge: Gauge<string>,
    @InjectMetric('process_memory_rss_bytes') private memGauge: Gauge<string>,
  ) {}

  onModuleInit() {
    // Atualiza CPU e memória a cada 5s
    setInterval(() => {
      // a prom-client já coleta cpu sys+user em segundos; para percentual você pode
      // dividir pela janela de tempo. Abaixo é um exemplo simplificado:
      const usage = process.cpuUsage();
      const cpuSeconds = (usage.user + usage.system) / 1e6; // em ms → s
      this.cpuGauge.set(cpuSeconds * 100); // *100 só pra ilustrar como percentagem

      this.memGauge.set(process.memoryUsage().rss);
    }, 5_000);
  }
}

@Module({
  imports: [
    // habilita /metrics + defaultMetrics (CPU, memória, event‑loop, etc)
    PrometheusModule.register({
      path: '/metrics',
      defaultMetrics: { enabled: true },
    }),
    // Métricas custom:
  ],
  providers: [
    MonitoringService,
    makeGaugeProvider({
      name: 'process_cpu_percent',
      help: 'Percentual de CPU usado pelo processo',
    }),
    makeGaugeProvider({
      name: 'process_memory_rss_bytes',
      help: 'Memória residente (RSS) em bytes',
    }),
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
      name: 'ws_messages_total',
      help: 'Total de mensagens WebSocket enviadas',
      labelNames: ['event'],
    }),
    makeCounterProvider({
      name: 'network_receive_bytes_total',
      help: 'Total de bytes recebidos (socket)',
    }),
    makeCounterProvider({
      name: 'network_transmit_bytes_total',
      help: 'Total de bytes transmitidos (socket)',
    }),
    makeGaugeProvider({
      name: 'tcp_packets_lost_ratio',
      help: 'Taxa de pacotes TCP perdidos (%)',
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
    // … aqui você reexporta se quiser usar em outros módulos
  ],
  exports: [MonitoringService],
})
export class MonitoringModule {}
